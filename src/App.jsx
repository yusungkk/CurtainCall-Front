import { Routes, Route } from "react-router-dom";
import ProductRegistration from "./pages/ProductRegistration"; // 파일 경로 확인
import ProductManagement from "./pages/ProductManagement";
import ProductEditForm from "./pages/ProductEditForm";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<ProductRegistration />} />
      <Route path="/admin/products" element={<ProductManagement />} />
      <Route
        path="/admin/products/:id/edit"
        element={<ProductEditForm />}
      ></Route>
    </Routes>
  );
}

export default App;
