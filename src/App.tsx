import BallonGamePage from "@/pages/game";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<Navigate to={"/game"} />} />
        <Route path={"/game"} element={<BallonGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
