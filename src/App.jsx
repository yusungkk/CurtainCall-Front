import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Join from "./pages/user/Join";
import Login from "./pages/user/Login";
import MyPage from "./pages/user/MyPage";
import Update from "./pages/user/Update";
import ProductRegistration from "./pages/ProductRegistration";
import ProductList from "./pages/ProductList";
import ProductManagement from "./pages/ProductManagement";
import ProductEditForm from "./pages/ProductEditForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>홈페이지</h1>} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/update" element={<Update />} />
        <Route path="/register" element={<ProductRegistration />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route
          path="/admin/products/:id/edit"
          element={<ProductEditForm />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;