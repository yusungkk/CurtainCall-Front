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
            navigate('/faqs');
        }
    };

    const handleCancelBtn = () => {
        navigate("/faqs");
    };

    return (
        <>
            <Typography variant="h3" gutterBottom color={"black"}>
                FAQ 등록
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
