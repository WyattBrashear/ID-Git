import './App.css'
import { Link } from "react-router-dom";

function Home() {
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
        </div>
      </div>
    </div>
  )
}

export default Home
