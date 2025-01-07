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
        <Route path={"/activity"} element={<></>} />
      </Routes>
    </Router>
  );
}

export default App;
