import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getInquiryByUser} from "/src/api/faqApi.js";
import {Box, Chip, Divider, Typography} from "@mui/material";
import {CheckCircleOutline} from "@mui/icons-material";
import CancelBtn from "../../components/CancelBtn.jsx";

export default function InquiryDetail() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [inquiryData, setInquiryData] = useState(null);

    useEffect(() => {
        const fetchInquiry = async () => {
            const data = await getInquiryByUser(id);
            console.log("data : fd", data);
            console.log("data : fd", data);
            setInquiryData(data);
        };
        fetchInquiry();
    }, []);

    const getStatusLabel = (status) => {
        return status === "READY" ? "답변 전" : "답변 완료";
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "TICKET":
                return "티켓";
            case "USER":
                return "회원";
            case "ETC":
                return "기타";
        }
    };

    if (!inquiryData) {
        return <Typography variant="h6" align="center" color={"black"}>로딩 중...</Typography>;
    }

    const handleCancelBtn = () => {
        navigate("/myPage?menu=inquiry");
    }

    return (
        <Box sx={{
            width: "100vw",
            maxWidth: "80%",
            textAlign: "left",
        }}>
            <Chip
                label={getStatusLabel(inquiryData.status)}
                icon={<CheckCircleOutline/>}
                color={inquiryData.status === "READY" ? "error" : "success"}
                size={"small"}
                sx={{mt: 2, mb: 2}}/>

            <Typography
                variant="h4"
                color={"black"}
                sx={{fontFamily: "'Bareun_hipi', sans-serif",}}
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

            <Typography
                variant="h6"
                color={"black"}
                sx={{fontFamily: "'Bareun_hipi', sans-serif",}}
            >
                문의내역
            </Typography>
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
                        sx={{
                            whiteSpace: "pre-line",
                            fontFamily: "'Bareun_hipi', sans-serif",}}
                    >
                        {inquiryData.content}
                    </Typography>
                    <Typography
                        mt={2}
                        variant="body2"
                        color="gray"
                        whiteSpace={"pre-line"}
                        sx={{fontFamily: "'Bareun_hipi', sans-serif",}}
                    >
                        {inquiryData.createAt.replace("T", " ").slice(0, 16)}
                    </Typography>
                </Box>
            </Box>
            <Divider/>
            <Box sx={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                marginTop: "16px"
            }}>
                <Typography variant="h6" fontWeight="bold" color="success" sx={{mr: 2}}>A</Typography>
                <Box sx={{
                    border: "1px",
                    borderRadius: "10px",
                    padding: "10px",
                    backgroundColor: "rgb(246, 240, 253)",
                    flexGrow: 1
                }}>
                    <Typography
                        color={"black"}
                        variant="body1"
                        whiteSpace={"pre-line"}
                        sx={{
                            whiteSpace: "pre-line",
                            fontFamily: "'Bareun_hipi', sans-serif",}}
                    >
                        {inquiryData.reply !== null ? inquiryData.reply :
                            "고객님, 안녕하세요.\n\n" +
                            "문의하신 내용은 아직 답변이 작성되지 않았습니다.\n\n" +
                            "빠른 도움을 드리지 못해 정말 죄송합니다."
                        }
                    </Typography>
                    <Typography
                        mt={2}
                        variant="body2"
                        color="text.secondary"
                        sx={{fontFamily: "'Bareun_hipi', sans-serif",}}>
                        {inquiryData.replyAt ? inquiryData.replyAt.replace("T", " ").slice(0, 16) : "답변 대기 중"}
                    </Typography>
                </Box>
            </Box>
            <div style={{display: "flex", justifyContent: "end", marginTop: "2rem"}}>
                <CancelBtn
                    viewName={"이전"}
                    onClick={handleCancelBtn}
                />
            </div>
        </Box>
    );
};
