import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css"

function FunniesPage() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async function load() {
            try {
                const res = await fetch("http://localhost:8000/api/query_sql?query=SELECT%20*%20FROM%20repositories", {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                setProjects((data.results || []).filter(p => Number(p[4]) === 1));
            } catch (err) {
                setError(err.message);
            }
        })();
    }, []);

    return (
        <>
            <div className="rounded">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/funnies">Funnies</Link></li>
                        <li><Link to="/guestbook">Guestbook</Link></li>
                        <li><Link to="/chat">Chat</Link></li>
                    </ul>
                </nav>
            </div>
            <h1>Funnies</h1>
            {error && <p className="error-text">Error: {error}</p>}
            <div className="card-grid">
                {projects.map((project, i) => (
                    <div className="project-card" key={i}>
                        <h2>{project[1]}</h2>
                        <p>{project[2]}</p>
                        <a href={project[5]}>View on GitHub →</a>
                    </div>
                ))}
            </div>
        </>
    )
}

export default FunniesPage
