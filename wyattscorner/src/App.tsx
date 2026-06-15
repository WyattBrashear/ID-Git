import './App.css'


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
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#funnies">Funnies</a></li>
        <li><a href="#guestbook">Guestbook</a></li>
      </ul>
    </nav>
  </div>
  </div>
  )
}
function standard_head() {
  return(
    <head>
      <title>Wyatt's Corner</title>
    </head>
  )
}
function App() {
  async function responseHandler() {
    let response = await query_ai()
    document.getElementById('response').textContent = response.response
  }
  return (
    standard_head(),
    construct_navbar()
  )
}


export default App


