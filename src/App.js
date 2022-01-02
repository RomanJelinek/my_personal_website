
import Game from "./components/Game"
import Homepage from "./homepage/Homepage"
import Navbar from "./navbar/Navbar"
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"

function App() {


  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/timeline" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
