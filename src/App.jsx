import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductRegistration from "./pages/products/ProductRegistration";
import ProductList from "./pages/products/productList";
import ProductDetail from "./pages/products/ProductDetail";
import ProductManagement from "./pages/products/ProductManagement.jsx";
import ProductEditForm from "./pages/products/ProductEditForm.jsx";
import BookingPage from "./pages/orders/BookingPage.jsx";
import FaqList from "./pages/inquiry/FaqList.jsx";
import FaqAddForm from "./pages/inquiry/FaqAddForm.jsx";
import FaqEditForm from "./pages/inquiry/FaqEditForm.jsx";
import Join from "./pages/users/Join.jsx";
import Login from "./pages/users/Login.jsx";
import MyPage from "./pages/users/MyPage.jsx";
import Admin from "./pages/users/Admin.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/products/new" element={<ProductRegistration />} />
        <Route path="/products" element={<ProductList />} />
        <Route
          path="/seat-selection/:productDetailId"
          element={<BookingPage />}
        />
        <Route path="/admin/products/:id/edit" element={<ProductEditForm />} />
        <Route path={"/faqs"} element={<FaqList />}></Route>
        <Route path={"/admin/faqs/new"} element={<FaqAddForm />}></Route>
        <Route path={"/admin/faqs/:id"} element={<FaqEditForm />}></Route>
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/products/:id" element={<ProductDetail />}></Route>
        <Route path="/" element={<h1>홈</h1>} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
