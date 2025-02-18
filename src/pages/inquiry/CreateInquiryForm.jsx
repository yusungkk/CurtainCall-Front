import {useState} from "react";
import {Box, Typography} from "@mui/material";
import InputText from "../../components/InputText.js";
import SaveBtn from "../../components/SaveBtn.jsx";
import Grid from "@mui/material/Grid2";
import CancelBtn from "../../components/CancelBtn.jsx";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useNavigate} from "react-router-dom";
import {createInquiry} from "../../api/faqApi.js";

export default function CreateInquiryForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        replayEmail: "",
        questionType: "",
        title: "",
        content: ""
    });

    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    const questionTypes = [
        {name: "TICKET", value: "티켓"},
        {name: "USER", value: "회원"},
        {name: "ETC", value: "기타"},
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === "replayEmail") {
            if (!emailRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    replayEmail: "유효한 이메일 주소를 입력해 주세요"
                }));
            } else {
                setErrors((prev) => {
                    const { replayEmail, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    const handleCancelBtn = () => {
        navigate("/faqs");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (Object.values(formData).every(value => value !== "")) {
            if (await createInquiry(formData) === 201) {
                navigate("/faqs");
            }
        }
    }

    return (
        <>
            <Typography variant="h3" gutterBottom color={"black"}>
                1:1 문의하기
            </Typography>
            <form onSubmit={handleSubmit} style={{width: "100vw", maxWidth: "100%"}}>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <InputText
                        id={"replayEmail"}
                        name={"replayEmail"}
                        value={formData.replayEmail}
                        event={handleChange}
                        label={"답변 받을 이메일 주소"}
                        onBlur={() => handleBlur("replayEmail")}
                        isError={touched.replayEmail && (formData.replayEmail === "" || errors.replayEmail)}
                        errorText={touched.replayEmail && (formData.replayEmail === "" ? "답변 받을 이메일 주소를 입력해 주세요" : errors.replayEmail)}
                    />
                    <FormControl sx={{width: "70%", mb: 2, mt:2}}>
                        <InputLabel id="faq-type-label">문의 유형</InputLabel>
                        <Select
                            labelId="faq-type-label"
                            id="questionType"
                            name="questionType"
                            value={formData.questionType}
                            onChange={handleChange}
                            label="문의 유형"
                        >
                            {questionTypes.map((type, index) => (
                                <MenuItem key={index} value={type.name}>{type.value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <InputText
                        id={"title"}
                        name={"title"}
                        value={formData.title}
                        event={handleChange}
                        label={"질문"}
                        onBlur={() => handleBlur("title")}
                        isError={touched.title && formData.title === ""}
                        errorText={touched.title && formData.title === "" ? "제목을 입력해주세요" : ""}
                    />
                    <InputText
                        id={"content"}
                        name={"content"}
                        value={formData.content}
                        label={"답변"}
                        event={handleChange}
                        onBlur={() => handleBlur("content")}
                        isError={touched.content && formData.content === ""}
                        errorText={touched.content && formData.content === "" ? "내용을 입력해주세요" : ""}
                        rowNum={15}
                    />

                    <Grid container marginTop={'10px'} spacing={2}>
                        <Grid size={6}>
                            <SaveBtn
                                btnType={"submit"}
                                viewName={"문의"}
                                isDisabled={Object.values(formData).some(value => value === "")}
                            />
                        </Grid>
                        <Grid size={6}>
                            <CancelBtn onClick={handleCancelBtn} viewName={"취소"}/>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </>
    );
};