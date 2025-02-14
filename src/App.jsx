import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductRegistration from "./pages/products/ProductRegistration.jsx";
import ProductList from "./pages/products/ProductList.jsx";
import ProductManagement from "./pages/products/ProductManagement.jsx";
import ProductEditForm from "./pages/products/ProductEditForm.jsx";
import BookingPage from "./pages/orders/BookingPage.jsx";
import PaymentPage from "./pages/orders/PaymentPage"; // 결제 페이지 추가

function App() {
  return (
    <Routes>
      <Route path="/register" element={<ProductRegistration />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/admin/products" element={<ProductManagement />} />
      <Route path="/seat-selection/:productDetailId" element={<BookingPage />} />
      <Route
        path="/admin/products/:id/edit"
        element={<ProductEditForm />}
      ></Route>
        <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  );
}

export default App;
