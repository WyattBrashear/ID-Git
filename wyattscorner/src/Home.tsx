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
      <div className='smallrounded'>
        <h1 style={{textAlign: "center"}}>About me (Shortened)</h1>
        <div style={{textAlign: "center"}}>
            <p>I am a 13 year old (primarily python) programmer with several years of experience.</p>
        </div>
        <div className='smallrounded' style={{textAlign: "center"}}>
            <h1>Proud member of <a href='https://hackclub.com'>Hack Club</a></h1>
            <p style={{textAlign: "center"}}>You can find me there as @Wyatt B!</p>
            <div style={{textAlign: "center"}}>
                <a href="https://hackclub.com">
                    <img src="https://assets.hackclub.com/icon-rounded.svg" alt="Hack Club" style={{display: "block", margin: "0 auto"}} />
                </a>
            </div>
            <p>I have participated in a few of thier events such as, <a href='https://game.hackclub.com'>Hack Club: The Game</a>, <a href='https://highseas.hackclub.com'>High Seas</a>, and <a href='https://stardance.hackclub.com'>Stardance</a></p>
        </div>
        <div className='smallrounded' style={{textAlign: "center"}}>
            <h1>Projects</h1>
            <p>My projects are a variety. Some include YOLO vision models, game playing AI systems, and servers for hosting files/file formats.</p>
        </div>
        <div className='smallrounded' style={{textAlign: "center"}}>
            <h1>Certifications</h1>
            <p>One of my addictions is collecting certifications like pokemon. I have recieved a jetson certification from taking a course with them, and I am currently working twoards 2 Ultralytics certifications.</p>
        </div>
      </div>
    </div>
  )
}
export default Home
