import { Link } from "react-router-dom";
import { useState } from "react";
import "./App.css"

function Chat() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const project_data = await fetch("http://localhost:8000/api/query_sql?query=SELECT%20*%20FROM%20repositories", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const project_data_json = await project_data.json();
        const project_data_string = JSON.stringify(project_data_json, null, 2);
        try {
            const res = await fetch('http://127.0.0.1:8000/api/query/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'system', content: 'You are an AI assistant named Clanker. Tasked with answering questions about a human (Or potentially cyborg) known as @Wyatt B (Wyatt) for short. About his many projects and ideas. Here is the DB regarding his projects. The DB marks the 1st bool as project importance and the second is whether it is considered an expirement oh and please dont use markdown: ' + project_data_string},{ role: 'user', content: query }], model: 'moonshotai/Kimi-K2.7-Code' }),
            });
            const data = await res.json();
            setResponse(JSON.stringify(data.response, null, 2));
        } catch (err) {
            setResponse('Error: ' + (err instanceof Error ? err.message : String(err)));
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
            <h1>Chat with Clanker</h1>
            <p>Ask anything about Wyatt's projects.</p>
            <form className="form-section" onSubmit={handleSubmit}>
                <div className="form-row">
                    <input type="text" id="query" name="query" value={query} placeholder="Ask something..." onChange={e => setQuery(e.target.value)} />
                    <input type="submit" value="Send" />
                </div>
            </form>
            {response && <div className="response-box">{response}</div>}
        </>
    )
}

export default Chat
