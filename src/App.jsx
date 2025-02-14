import './App.css'
import FaqList from "./pages/inquiry/FaqList.jsx";
import FaqAddForm from "./pages/inquiry/FaqAddForm.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FaqEditForm from "./pages/inquiry/FaqEditForm.jsx";

function App() {

    return (
        <>
            <BrowserRouter>
            <Routes>
                <Route path={"/faqs"} element={<FaqList/>}></Route>
                <Route path={"/admin/faqs/new"} element={<FaqAddForm/>}></Route>
                <Route path={"/admin/faqs/:id"} element={<FaqEditForm/>}></Route>
            </Routes>
            </BrowserRouter>

        </>
    )
}

export default App;
