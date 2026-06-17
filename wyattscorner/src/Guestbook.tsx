import { Link } from "react-router-dom";
import { useState } from "react";
import "./App.css"

function Guestbook() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await fetch('http://127.0.0.1:8000/api/guestbook/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message }),
            });
            setStatus('Thanks for signing the guestbook, ' + name + '!');
            setName('');
            setMessage('');
        } catch (err) {
            setStatus('Error: ' + (err instanceof Error ? err.message : String(err)));
        }
    }

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
            <form className="form-section" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="message">Message</label>
                    <input type="text" id="message" name="message" placeholder="Say something..." value={message} onChange={e => setMessage(e.target.value)} />
                </div>
                <input type="submit" value="Sign Guestbook" />
            </form>
            {status && <div className="response-box">{status}</div>}
        </>
    )
}

export default Guestbook
