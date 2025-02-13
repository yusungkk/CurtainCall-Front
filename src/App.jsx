import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Join from "./pages/user/Join";
import Login from "./pages/user/Login";
import MyPage from "./pages/user/MyPage";
import Update from "./pages/user/Update";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>홈페이지</h1>} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/update" element={<Update />} />
      </Routes>
    </Router>
  );
}

export default App;