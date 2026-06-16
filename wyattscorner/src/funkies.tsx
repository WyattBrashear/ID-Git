import { Link } from "react-router-dom";

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
        <li><Link to="/chat">Chat</Link></li>
      </ul>
    </nav>
  </div>
  </div>
  )
}


export default construct_navbar()