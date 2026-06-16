import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css"
function construct_navbar() {
  return(
  <div>
    <br></br>
  <div className="rounded">
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/funnies">Funnies</Link></li>
        <li><Link to="/guestbook">Guestbook</Link></li>
      </ul>
    </nav>
  </div>
  </div>
  )
}


function FunniesPage() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async function funkyseption() {
            try {
              const res = await fetch("http://localhost:8000/api/query_sql?query=SELECT%20*%20FROM%20repositories", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              });
              const data = await res.json();
              // keep only projects marked important (index 3 === 1)
              // and NOT marked as experiments (index 4 === 0)
              setProjects((data.results || []).filter(p => Number(p[4]) === 1));
              console.log("Data loaded:", data);
            } catch (err) {
              console.error("Fetch failed:", err);
              setError(err.message);
            }
        })();
    }, []);

    return (
        <><div>
            <br></br>
            <div className="rounded">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/funnies">Funnies</Link></li>
                        <li><Link to="/guestbook">Guestbook</Link></li>
                        
                    </ul>
                </nav>
            </div>
        </div>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        <div id="rounded">
            {projects.map((project, i) => (
                <div className="project" key={i} style={{ border: "1px solid black", padding: "10px", margin: "10px"}}>
                    <h2>{project[1]}</h2>
                    <p>{project[2]}</p>
                    <b><a href={project[5]}>View on GitHub</a></b>
                </div>
            ))}
        </div>
        <p></p></>
    )
}

export default FunniesPage
