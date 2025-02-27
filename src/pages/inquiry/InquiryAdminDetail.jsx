import {useEffect, useState} from "react";
import {createReplyByAdmin, getInquiryByAdmin} from "/src/api/faqApi.js"
import {useNavigate, useParams} from "react-router-dom";
import {Box, Chip, Divider, Typography} from "@mui/material";
import {CheckCircleOutline} from "@mui/icons-material";
import InputText from "/src/components/InputText.js";
import SaveBtn from "/src/components/SaveBtn.jsx";
import CancelBtn from "/src/components/CancelBtn.jsx";

export default function InquiryAdminDetail() {
    const [inquiryData, setInquiryData] = useState({});
    const [reply, setReply] = useState({
        content: ""
    });

    const [touched, setTouched] = useState({});
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        const fetchInquiry = async () => {
            const data = await getInquiryByAdmin(id);
            console.log(data);
            setInquiryData({...data});
        }
        fetchInquiry();
    }, []);

    const getTypeLabel = (type) => {
        switch (type) {
            case "TICKET":
                return "티켓";
            case "USER":
                return "유저";
            case "ETC":
                return "기타";
        }
    };

    const getStatusLabel = (status) => {
        return status === "READY" ? "답변 전" : "답변 완료";
    };

    const handleWriteReply = (e) => {
        const {name, value} = e.target;
        setReply(prevState => ({...prevState, [name]: value}));
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({...prev, [field]: true}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(reply);
        const data = await createReplyByAdmin(id, reply);
        if (data === 201) {
            navigate("/admin?menu=inquiry");
        }
    }

    return (
        <Box sx={{
            width: "100vw",
            maxWidth: "80%",
            textAlign: "left",
            marginTop: "3rem"
        }}>
            <Typography
                variant="h4"
                gutterBottom
                color={"black"}
                sx={{
                    fontFamily: "'Bareun_hipi', sans-serif",
                    textAlign: "center",}}
            >
                문의내역
            </Typography>
            <Chip
                label={getStatusLabel(inquiryData.status)}
                icon={<CheckCircleOutline/>}
                color={inquiryData.status === "READY" ? "error" : "success"}
                size={"small"}
                sx={{mb: 2}}/>
            <Typography
                variant="h4"
                color={"black"}
            >
                {inquiryData.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{fontFamily: "'Bareun_hipi', sans-serif",}}>
                {getTypeLabel(inquiryData.type)} · {inquiryData.createAt?.split("T")[0] || ""}
            </Typography>
            <Divider sx={{
                marginTop: "16px",
                marginBottom: "16px"
            }}/>
            <Box sx={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                marginBottom: "16px"
            }}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    sx={{mr: 2, fontFamily: "'Bareun_hipi', sans-serif",}}>
                    Q
                </Typography>

                <Box sx={{
                    border: "1px",
                    borderRadius: "10px",
                    padding: "10px",
                    backgroundColor: "#f9f9f9",
                    flexGrow: 1
                }}>
                    <Typography
                        variant="body1"
                        color="black"
                        sx={{fontFamily: "'Bareun_hipi', sans-serif",}}
                    >
                        {inquiryData.content}
                    </Typography>
                    <Typography
                        mt={2}
                        variant="body2"
                        color="gray"
                        sx={{fontFamily: "'Bareun_hipi', sans-serif",}}
                        whiteSpace={"pre-line"}
                    >
                        {inquiryData.createAt?.replace("T", " ").slice(0, 16) || ""}
                    </Typography>
                </Box>
            </Box>
            <Divider/>
            <form onSubmit={handleSubmit}>
                <Box sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                    marginTop: "16px"
                }}>
                    <Typography variant="h6" fontWeight="bold" color="success"
                                sx={{mr: 2, fontFamily: "'Bareun_hipi', sans-serif",}}>
                        A
                    </Typography>
                    <Box sx={{
                        border: "1px",
                        borderRadius: "10px",
                        padding: "10px",
                        backgroundColor: "rgb(246, 240, 253)",
                        flexGrow: 1
                    }}>
                        {inquiryData.reply === null ?
                            <InputText
                                id={"reply-content"}
                                name={"content"}
                                value={reply.content}
                                event={handleWriteReply}
                                rowNum={10}
                                label={"답변"}
                                width={"100%"}
                                onBlur={() => handleBlur("content")}
                                isError={touched.content && reply.content === ""}
                                errorText={touched.content && reply.content === "" ? "답변을 입력해주세요" : ""}
                            /> :
                            <Typography
                                color={"black"}
                                variant="body1"
                                whiteSpace={"pre-line"}
                            >
                                {inquiryData.reply}
                            </Typography>
                        }
                    </Box>
                </Box>
                {inquiryData.reply === null ? (
                    <Box sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: 2
                    }}>
                        <SaveBtn
                            btnType="submit"
                            viewName="저장"
                            isDisabled={reply.content === ""}
                        />
                        <CancelBtn
                            viewName={"취소"}
                            onClick={() => navigate("/admin/inquiries")}
                        />
                    </Box>
                ) : (
                    <Box sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: 2
                    }}>
                        <CancelBtn
                            viewName={"이전"}
                            onClick={() => navigate("/admin?menu=inquiry")}
                        />
                    </Box>
                )
                }
            </form>
        </Box>
    );
};