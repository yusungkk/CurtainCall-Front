import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
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
import CreateInquiryForm from "./pages/inquiry/CreateInquiryForm.jsx";
import InquiryList from "./pages/inquiry/InquiryList.jsx";
import InquiryDetail from "./pages/inquiry/InquiryDetail.jsx";
import InquiryAdminList from "./pages/inquiry/InquiryAdminList.jsx";
import InquiryAdminDetail from "./pages/inquiry/InquiryAdminDetail.jsx";
import PaymentPage from "./pages/orders/PaymentPage.jsx";

import Admin from "./pages/users/Admin.jsx";
import CategoryManagement from "./components/category/CategoryManagement.jsx";
import NavigationBar from "./components/category/NavigationBar.jsx";
import SpecialProductManagement from "./components/specialProduct/SpecialProductManagement.jsx";
import {ToggleProvider} from "./components/chat/ToggleContext.jsx";
import GlobalToggleIcon from "./components/chat/GlobalToggleBtn.jsx";
import ChatWindow from "./components/chat/ChatWindow.jsx";
import {useToggleActive} from "./hooks/UseToggleActive.jsx";
import AdminChatWindow from "./components/chat/AdminChatWindow.jsx";
import UseUserRole from "./hooks/UseUserRole.jsx";

function App() {
    const [active, setActive] = useToggleActive();
    const [role] = UseUserRole();

    return (
        <BrowserRouter>
            <ToggleProvider>
                <NavigationBar/>
                {active && (
                    <>
                        <GlobalToggleIcon />
                        {role === "ADMIN" && <AdminChatWindow />}
                        {role === "USER" && <ChatWindow />}
                    </>
                )}

                <Routes>
                    <Route path="/admin/products/new" element={<ProductRegistration/>}/>
                    <Route path="/products" element={<ProductList/>}/>
                    <Route
                        path="/seat-selection/:productDetailId"
                        element={<BookingPage/>}
                    />
                    <Route path="/admin/products/:id/edit" element={<ProductEditForm/>}/>
                    <Route path={"/faqs"} element={<FaqList setActive={setActive}/>}></Route>
                    <Route path={"/admin/faqs/new"} element={<FaqAddForm/>}></Route>
                    <Route path={"/admin/faqs/:id"} element={<FaqEditForm/>}></Route>
                    <Route path={"/inquiries/new"} element={<CreateInquiryForm/>}/>
                    <Route path="/inquiries" element={<InquiryList/>}/>
                    <Route path="/admin/inquiries" element={<InquiryAdminList/>}/>
                    <Route path="/inquiries/:id" element={<InquiryDetail/>}/>
                    <Route path="/admin/inquiries/:id" element={<InquiryAdminDetail/>}/>
                    <Route path="/admin/products" element={<ProductManagement/>}/>
                    <Route path={"/admin/faqs/new"} element={<FaqAddForm/>}></Route>
                    <Route path={"/admin/faqs/:id"} element={<FaqEditForm/>}></Route>
                    <Route path={"/chat"} element={<FaqEditForm/>}></Route>
                    <Route path="/admin/products" element={<ProductManagement/>}/>
                    <Route path="/products/:id" element={<ProductDetail/>}></Route>
                    <Route path="/" element={<h1>홈</h1>}/>
                    <Route path="/join" element={<Join/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/myPage" element={<MyPage/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="/payment" element={<PaymentPage/>}/>
                    <Route path="/category" element={<CategoryManagement/>}/>
                    <Route path="/specialProduct" element={<SpecialProductManagement/>}/>
                </Routes>
            </ToggleProvider>
        </BrowserRouter>
    );
}

export default App;
