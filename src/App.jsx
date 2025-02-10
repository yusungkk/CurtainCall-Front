import { Routes, Route } from "react-router-dom";
import ProductRegistration from "./pages/ProductRegistration"; // 파일 경로 확인

function App() {
    return (
        <Routes>
            <Route path="/register" element={<ProductRegistration />} />
        </Routes>
    );
}

export default App;
