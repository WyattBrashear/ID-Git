import './App.css'
import { Link } from "react-router-dom";
async function query_ai() {
  const response = await fetch('http://127.0.0.1:5000/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Can i eat AI??' }], model: 'moonshotai/Kimi-K2.7-Code' }),
  })
  return await response.json()
}

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
  <h1 className='text-4xl'>Hey im @Wyatt B!</h1>
  <p>Im make things.. <i>Sometimes</i></p>
  </div>
  )
}

function Home() {
    return (
        construct_navbar()
    
    )
}

export default Home