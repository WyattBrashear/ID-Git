import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home.tsx';
import ProjectsPage from './Projects.tsx';
import Guestbook from './Guestbook.tsx';
import FunniesPage from './Funnies.tsx';
import { Link } from "react-router-dom";
import About from './About.tsx';
import Chat from './Chat.tsx';


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
  </div>
  )
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/funnies" element={<FunniesPage />} />
        <Route path="/guestbook" element={<Guestbook />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App


