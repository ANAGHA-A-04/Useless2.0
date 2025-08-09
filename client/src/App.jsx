import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="app-wrapper"
      >
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </motion.div>
    </Router>
  );
}

export default App;
