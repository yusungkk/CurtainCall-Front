import { useState } from "react";
import {createFaq} from "/src/api/faqApi.js";
import {useNavigate} from "react-router-dom";
import CommonFaqForm from "/src/components/inquiry/CommonFaqForm.jsx";
import {Typography} from "@mui/material";

function FaqAddForm() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: "",
        question: "",
        answer: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        if (formData.answer === "" || formData.question === "" || formData.type === "") {
            return;
        }

        const response = await createFaq(formData);
        if (response === 201) {
            navigate("/admin?menu=faq");
        }
    };

    const handleCancelBtn = () => {
        navigate("/admin?menu=faq");
    };

    return (
        <>
            <Typography variant="h3" gutterBottom sx={{
                color: 'black',
                marginTop: "3rem",
                textAlign: "center",
                fontFamily: "'Bareun_hipi', sans-serif",}}>
                FAQ 수정
            </Typography>
            <CommonFaqForm
                onSubmit={handleSubmit}
                onChange={handleChange}
                formData={formData}
                onClose={handleCancelBtn}
            />
        </>
    );
}

export default FaqAddForm;
