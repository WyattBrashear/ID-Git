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
        <li><Link to="/chat">Chat</Link></li>
      </ul>
    </nav>
  </div>
  </div>
  )
}



function sign_guestbook() {

    return(
        construct_navbar(),
        <form action={"http://127.0.0.1:8000/api/guestbook/"} method="POST">
            <label htmlFor="name">Enter your name here:</label>
            <input type="text" id="name" name="name" />
            <label htmlFor="message">Enter your message here:</label>
            <input type="text" id="message" name="message" />
            <input type="submit" value="Submit" />
        </form>
    )
}

function Guestbook() {
    

    return (
        sign_guestbook()
    )
}

export default Guestbook
