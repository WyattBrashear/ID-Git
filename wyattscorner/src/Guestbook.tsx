import { Link } from "react-router-dom";
import "./App.css"

function Guestbook() {
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
            <h1>Guestbook</h1>
            <p>Leave a message!</p>
            <form className="form-section" action="http://127.0.0.1:8000/api/guestbook/" method="POST">
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your name" />
                </div>
                <div>
                    <label htmlFor="message">Message</label>
                    <input type="text" id="message" name="message" placeholder="Say something..." />
                </div>
                <input type="submit" value="Sign Guestbook" />
            </form>
        </>
    )
}

export default Guestbook
