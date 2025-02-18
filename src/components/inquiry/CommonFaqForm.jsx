import {Box} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from '@mui/material/Grid2';
import CancelBtn from "../CancelBtn.jsx";
import SaveBtn from "../SaveBtn.jsx";
import InputText from "../InputText.tsx";
import {useState} from "react";

export default function CommonFaqForm({onSubmit, onClose,  formData, onChange, saveBtnName="저장"}) {

    const questionTypes = [
        {name: "TICKET", value: "티켓"},
        {name: "USER", value: "회원"},
        {name: "ETC", value: "기타"},
    ];

    const [touched, setTouched] = useState({});

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    return (
        <>
            <form onSubmit={onSubmit} style={{width: "100vw", maxWidth: "80%"}}>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <FormControl sx={{width: "70%", mb: 2}}>
                        <InputLabel id="faq-type-label">유형</InputLabel>
                        <Select
                            labelId="faq-type-label"
                            id="faq-type"
                            name="type"
                            value={formData.type}
                            label="유형"
                            onChange={onChange}
                        >
                            {questionTypes.map((faq, index) => (
                                <MenuItem key={index} value={faq.name}>{faq.value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <InputText
                        id={"question"}
                        name={"question"}
                        value={formData.question}
                        event={onChange}
                        onBlur={() => handleBlur("question")}
                        label="질문"
                        isError={touched.question && formData.question === ""}
                        errorText={touched.question && formData.question === "" ? "질문을 입력해주세요" : ""}
                    />
                    <InputText
                        id={"answer"}
                        name={"answer"}
                        value={formData.answer}
                        label="답변"
                        event={onChange}
                        onBlur={() => handleBlur("answer")}
                        isError={touched.answer && formData.answer === ""}
                        errorText={touched.answer && formData.answer === "" ? "답변을 입력해주세요" : ""}
                        rowNum={15}
                    />

                    <Grid container marginTop={'10px'} spacing={2}>
                        <Grid size={6}>
                            <SaveBtn
                                btnType={"submit"}
                                viewName={saveBtnName}
                                isDisabled={Object.values(formData).some(value => value === "")}
                            />
                        </Grid>
                        <Grid size={6}>
                            <CancelBtn onClick={onClose} viewName={"취소"}/>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </>
    );
};