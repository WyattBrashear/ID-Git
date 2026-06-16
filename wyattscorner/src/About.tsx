import { Link } from "react-router-dom";

function About() {
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
  <h1 className='text-4xl'>Hey im @Wyatt B!</h1>
  <p>Im make things.. <i>Sometimes</i></p>
  <p>Ive been doing this coding thing for about half of my life. I enjoy it. Unless its webdevelopment. Check out the projects page for more!</p>
  </div>
  )
}

export default About