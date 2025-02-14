import {useState} from "react";
import {Typography} from "@mui/material";
import InputText from "../../component/InputText.js";

export default function CreateInquiryForm() {

    const [formData, setFormData] = useState({
        replayEmail: "",
        questionType: "",
        title: "",
        content: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <Typography variant="h3" gutterBottom sx={{color: 'black'}}>
                1:1 문의하기
            </Typography>
            <form>
                <InputText
                    id={"replayEmail"}
                    name={"replayEmail"}
                    value={formData.replayEmail}
                    label={"답변 받을 이메일 주소"}
                    event={e => handleChange(e)}
                    errorText={formData.replayEmail === "" ? "답변 받을 이메일 주소를 입력해주세요" : ""}
                    isError={formData.replayEmail === ""}
                />
            </form>
        </>
    );
};