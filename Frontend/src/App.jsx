import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import NewHome from './pages/NewHome';
import 
function App() {

  return (
    <>
      <Router>
        <Routes>
\          <Route path="/" element={<Home />} />
          <Route path="/newhome" element={<NewHome />} />
          {/* <Route path="/home" element={<Home />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App
