import {Box, Button, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from '@mui/material/Grid2';
import CancelBtn from "./CancelBtn.jsx";
import SaveBtn from "./SaveBtn.jsx";

export default function CommonFaqForm({onSubmit, onClose,  formData, onChange, saveBtnName="저장"}) {

    const faqTypes = [
        {name: "TICKET", value: "티켓"},
        {name: "USER", value: "회원"},
        {name: "ETC", value: "기타"},
    ];

    return (
        <>
            <form onSubmit={onSubmit} style={{width: "100vw", maxWidth: "100%"}}>
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
                            {faqTypes.map((faq, index) => (
                                <MenuItem key={index} value={faq.name}>{faq.value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        id="question"
                        name="question"
                        label="질문"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        sx={{width: "70%"}}
                        value={formData.question}
                        onChange={onChange}
                        error={formData.question === ""}
                        helperText={formData.question === "" ? "질문을 입력해주세요" : ""}
                    />

                    <TextField
                        id="answer"
                        name="answer"
                        label="답변"
                        multiline
                        rows={15}
                        margin="normal"
                        fullWidth
                        sx={{width: "70%"}}
                        value={formData.answer}
                        onChange={onChange}
                        required
                        error={formData.answer === ""}
                        helperText={formData.answer === "" ? "답변을 입력해주세요" : ""}
                    />


                    <Grid container marginTop={'10px'} spacing={2}>
                        <Grid size={6}>
                            <SaveBtn btnType={"submit"} viewName={saveBtnName}/>
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