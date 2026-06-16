"""
GitHub Repository Scraper with AI Summarization

Scrapes all public repos from a GitHub user, summarizes each using Together.ai,
and stores results in a SQLite database. Skips repos with minimal/no READMEs.

Environment variables required:
  TOGETHER_API_KEY  – your Together.ai API key
  GITHUB_TOKEN      – (optional) GitHub personal access token for higher rate limits

Usage:
  python github-scraperAI.py                 # one-shot run
  python github-scraperAI.py --interval 3600 # repeat every hour
"""

import os
import re
import sys
import time
import json
import logging
import sqlite3
import argparse
import requests
from together import Together

# ─── Logging ─────────────────────────────────────────────────────────────────

LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "json_data")
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(os.path.join(LOG_DIR, "scraper.log")),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("github-scraper")

# ─── Configuration ───────────────────────────────────────────────────────────

GITHUB_USERNAME = "WyattBrashear"
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "json_data", "repos.db")
TOGETHER_MODEL = "moonshotai/Kimi-K2.7-Code"
MIN_README_LENGTH = 200  # ignore repos whose README is shorter than this
GITHUB_REQUEST_DELAY = 0.5  # seconds between GitHub API calls to avoid rate limits


# ─── GitHub helpers ──────────────────────────────────────────────────────────

def _github_headers():
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def fetch_repos(username: str) -> list[dict]:
    """Return all public repos for *username* via the GitHub REST API."""
    repos = []
    page = 1
    while True:
        url = f"https://api.github.com/users/{username}/repos"
        log.debug("Fetching repos page %d for '%s'", page, username)
        resp = requests.get(url, headers=_github_headers(),
                            params={"per_page": 100, "page": page, "type": "public"})
        log.debug("GitHub repos response: %d, %d bytes", resp.status_code, len(resp.content))
        resp.raise_for_status()
        batch = resp.json()
        if not batch:
            break
        repos.extend(batch)
        page += 1
    log.info("Fetched %d repos for '%s'", len(repos), username)
    return repos


def fetch_readme(owner: str, repo_name: str) -> str | None:
    """Fetch the decoded README content. Returns None on failure."""
    url = f"https://api.github.com/repos/{owner}/{repo_name}/readme"
    log.debug("Fetching README for '%s/%s'", owner, repo_name)
    time.sleep(GITHUB_REQUEST_DELAY)
    resp = requests.get(url, headers=_github_headers())
    if resp.status_code == 403:
        remaining = resp.headers.get("X-RateLimit-Remaining", "?")
        reset = resp.headers.get("X-RateLimit-Reset", "")
        if reset:
            wait = max(int(reset) - int(time.time()), 1)
            log.warning("GitHub rate limit hit (remaining=%s). Waiting %ds for reset ...", remaining, wait)
            time.sleep(wait + 1)
            resp = requests.get(url, headers=_github_headers())
        else:
            log.warning("README fetch failed for '%s/%s': HTTP 403 (rate limit?)", owner, repo_name)
            return None
    if resp.status_code != 200:
        log.warning("README fetch failed for '%s/%s': HTTP %d", owner, repo_name, resp.status_code)
        return None
    import base64
    data = resp.json()
    try:
        content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
        log.debug("README for '%s': %d chars", repo_name, len(content))
        return content
    except (KeyError, Exception) as exc:
        log.error("Failed to decode README for '%s/%s': %s", owner, repo_name, exc)
        return None


# ─── Together.ai summarisation ──────────────────────────────────────────────

def summarize_repo(repo_name: str, description: str | None, readme: str,
                   memory: list[dict] | None = None) -> dict:
    """
    Ask Together.ai to produce a JSON summary with keys:
      description  – ~3 sentence summary
      is_important – bool (complete project / file format / server system)
      is_experiment – bool (experimental / learning project)

    *memory* is a list of prior summary dicts (each with 'repo', 'description',
    'is_important', 'is_experiment') that gives the model persistent context
    across summarisations so it can make more consistent judgements.
    """
    api_key = "tgp_v1_4zaZQF8PlHMbXb4Y9BXUbWsG1mNsgVlsLvjXQMjQB0E"
    if not api_key:
        print("ERROR: TOGETHER_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    system_prompt = (
        "You are a concise technical summarizer. Given information about a GitHub "
        "repository, respond ONLY with a JSON object (no markdown fences) containing:\n"
        '  "description": a 2-3 sentence summary of what the project does,\n'
        '  "is_important": true if the project is a complete/significant piece of '
        "software (e.g. a server system, a file format, a full application), false otherwise,\n"
        '  "is_experiment": true if the project is experimental, a learning exercise, '
        "or a proof-of-concept, false otherwise.\n"
    )

    # Build persistent memory context from previous summaries
    memory_block = ""
    if memory:
        lines = []
        for m in memory:
            lines.append(
                f"- {m['repo']}: {m['description'][:120]}  "
                f"(important={m['is_important']}, experiment={m['is_experiment']})"
            )
        memory_block = (
            "\n\nHere are the repos you have already summarized in this session "
            "(use them for consistent classification):\n" + "\n".join(lines) + "\n"
        )

    user_prompt = (
        f"Repository: {repo_name}\n"
        f"GitHub description: {description or 'N/A'}\n"
        f"README (first 3000 chars):\n{readme[:3000]}\n"
        f"{memory_block}"
    )

    client = Together(api_key=api_key)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    max_attempts = 3
    last_error = None
    for attempt in range(1, max_attempts + 1):
        log.debug("Summarize '%s' attempt %d/%d", repo_name, attempt, max_attempts)
        response = client.chat.completions.create(
            model=TOGETHER_MODEL,
            messages=messages,
            temperature=0.3,
            max_tokens=512,
        )
        raw_content = response.choices[0].message.content.strip()
        log.debug("Raw AI response for '%s' (attempt %d): %s", repo_name, attempt, raw_content)
        content = _extract_json(raw_content)
        log.debug("Extracted JSON for '%s': %s", repo_name, content)
        try:
            result = json.loads(content)
            log.info("Successfully parsed summary for '%s'", repo_name)
            return result
        except json.JSONDecodeError as exc:
            last_error = exc
            log.warning("JSON parse failed for '%s' (attempt %d/%d): %s — raw: %s",
                        repo_name, attempt, max_attempts, exc, raw_content)
    log.error("All %d attempts to summarize '%s' failed. Last error: %s",
             max_attempts, repo_name, last_error)
    raise last_error


def _extract_json(text: str) -> str:
    """Best-effort extraction of a JSON object from model output."""
    # Strip markdown code fences
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    # Find the outermost { ... } block
    start = text.find("{")
    if start != -1:
        depth = 0
        for i, ch in enumerate(text[start:], start):
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return text[start:i + 1]
    return text.strip()


# ─── Database ────────────────────────────────────────────────────────────────

def init_db(db_path: str) -> sqlite3.Connection:
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS repositories (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            title         TEXT UNIQUE NOT NULL,
            description   TEXT,
            is_important  INTEGER DEFAULT 0,
            is_experiment INTEGER DEFAULT 0,
            link          TEXT,
            updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    return conn


def upsert_repo(conn: sqlite3.Connection, title: str, description: str,
                is_important: bool, is_experiment: bool, link: str):
    conn.execute("""
        INSERT INTO repositories (title, description, is_important, is_experiment, link, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(title) DO UPDATE SET
            description  = excluded.description,
            is_important = excluded.is_important,
            is_experiment= excluded.is_experiment,
            link         = excluded.link,
            updated_at   = CURRENT_TIMESTAMP
    """, (title, description, int(is_important), int(is_experiment), link))
    conn.commit()


# ─── Main pipeline ──────────────────────────────────────────────────────────

def run_once():
    log.info("Fetching repos for %s ...", GITHUB_USERNAME)
    repos = fetch_repos(GITHUB_USERNAME)
    log.info("Found %d public repositories.", len(repos))

    conn = init_db(DB_PATH)
    memory = []  # persistent memory: accumulates summaries across repos

    for repo in repos:
        time.sleep(1)
        if repo.get("fork", False):
            log.info("Skipping '%s' (fork)", repo["name"])
            continue

        name = repo["name"]
        link = repo["html_url"]
        gh_description = repo.get("description")

        readme = fetch_readme(GITHUB_USERNAME, name)
        if not readme or len(readme.strip()) < MIN_README_LENGTH:
            log.info("Skipping '%s' (README too short or missing)", name)
            continue

        log.info("Summarizing '%s' ...", name)
        try:
            summary = summarize_repo(name, gh_description, readme, memory=memory)
        except (json.JSONDecodeError, requests.RequestException, KeyError) as exc:
            log.error("Failed to summarize '%s': %s", name, exc, exc_info=True)
            continue

        # Append to persistent memory for subsequent summarisations
        memory.append({
            "repo": name,
            "description": summary.get("description", ""),
            "is_important": bool(summary.get("is_important", False)),
            "is_experiment": bool(summary.get("is_experiment", False)),
        })
        log.info("Memory now holds %d prior summaries", len(memory))

        upsert_repo(
            conn,
            title=name,
            description=summary.get("description", ""),
            is_important=bool(summary.get("is_important", False)),
            is_experiment=bool(summary.get("is_experiment", False)),
            link=link,
        )
        log.info("Saved '%s' to DB.", name)

    conn.close()
    log.info("Done.")


def main():
    parser = argparse.ArgumentParser(description="Scrape GitHub repos and summarize with AI")
    parser.add_argument("--interval", type=int, default=0,
                        help="Re-run every INTERVAL seconds (0 = one-shot)")
    args = parser.parse_args()

    if args.interval > 0:
        log.info("Running every %ds  (Ctrl-C to stop)", args.interval)
        while True:
            run_once()
            time.sleep(args.interval)
    else:
        run_once()


if __name__ == "__main__":
    main()
