import './App.css'
import { Link } from "react-router-dom";

function About() {
  return (
    <div>
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
      <div className="hero">
        <img className="profile-img" src="https://ca.slack-edge.com/E09V59WQY1E-U081PP0P9SB-cc8e85371b71-512" alt="Wyatt B" />
        <div className="hero-text">
          <h1>Hey im @Wyatt B!</h1>
          <p>I make things.. <i>Sometimes</i></p>
          <p>I've been doing this coding thing for about half of my life. I enjoy it. Unless its web development. Check out the projects page for more!</p>
          <h1>First off, Who am I?</h1>
          <h2>So a bit of background.</h2>
          <p>I am a 13-year old software dev with about 6-7 years of coding experience, 2-3 of those years are professional projects and recently I have been "Cooking" on several projects that include webdev. I am currently looking for commission projects/jobs because AI credits are cheap but, not that cheap.</p>
          <p>As shown in my profile picture, I have a dog who is my profile picture for most of my public facing interactions.</p>
          <h2>My Coding Stats</h2>
          <img src='https://github-readme-stats.hackclub.dev/api/wakatime?username=968&api_domain=hackatime.hackclub.com&theme=dark&custom_title=Hackatime+Stats&layout=compact&cache_seconds=0&langs_count=8'></img>
          <a href="https://heatmap.shymike.dev?id=968&timezone=America%2FNew_York&labels=true&standalone=true" title="Click to view detailed data for each day!">
            <picture>
                <source media="(prefers-color-scheme: dark)" srcset="https://heatmap.shymike.dev?id=968&timezone=America%2FNew_York&labels=true&theme=dark" />
           <img alt="Hackatime activity heatmap" src="https://heatmap.shymike.dev?id=968&timezone=America%2FNew_York&labels=true&theme=light" />
        </picture>
        <h2>Branding (Yes i'm serious)</h2>
        <p>My branding is usually signified by this symbol: <strong>[/|\]</strong>. If you see something with that symbol it probably was made by me.</p>
        </a>
          <h1>Contact</h1>
          <p>Email: <strong><a href='mailto:admin@wyattb.dev'>admin[at]wyattb.dev</a></strong></p>
        </div>
      </div>
    </div>
  )
}

export default About
