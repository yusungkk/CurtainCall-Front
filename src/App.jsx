import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductRegistration from "./pages/products/ProductRegistration";
import ProductList from "./pages/products/productList";
import ProductManagement from "./pages/products/ProductManagement";
import ProductEditForm from "./pages/products/ProductEditForm";
import ProductDetail from "./pages/products/ProductDetail";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<ProductRegistration />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/admin/products" element={<ProductManagement />} />
      <Route
        path="/admin/products/:id/edit"
        element={<ProductEditForm />}
      ></Route>
      <Route path="/products/:id" element={<ProductDetail />}></Route>
    </Routes>
  );
}

export default App;
