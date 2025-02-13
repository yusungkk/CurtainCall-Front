import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductRegistration from "./pages/ProductRegistration";
import ProductList from "./pages/ProductList";
import ProductManagement from "./pages/ProductManagement";
import ProductEditForm from "./pages/ProductEditForm";

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
    </Routes>
  );
}

export default App;
