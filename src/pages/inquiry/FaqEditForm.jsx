import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getFaq, updateFaq} from "/src/api/faqApi.js";
import {Typography} from "@mui/material";
import CommonFaqForm from "/src/components/inquiry/CommonFaqForm.jsx";

function FaqEditForm() {
    const {id} = useParams();
    const [formData, setFormData] = useState({
        id: 0,
        type: "",
        question: "",
        answer: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFaq = async () => {
            const data = await getFaq(id);
            setFormData(data);
        };
        fetchFaq();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
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

        const response = await updateFaq(formData, formData.id);
        if (response === 204) {
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
                onClose={handleCancelBtn}
                formData={formData}
                saveBtnName={"수정"}
            />
        </>
    )
}

export default FaqEditForm;
