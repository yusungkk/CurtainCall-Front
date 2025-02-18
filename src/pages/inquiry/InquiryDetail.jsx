import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getInquiryByUser} from "../../api/faqApi.js";
import {Box, Chip, Divider, Typography} from "@mui/material";
import {CheckCircleOutline} from "@mui/icons-material";

export default function InquiryDetail() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [inquiryData, setInquiryData] = useState(null);

    useEffect(() => {
        const fetchInquiry = async () => {
            const data = await getInquiryByUser(navigate, id);
            console.log(data);
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
                return "유저";
            case "ETC":
                return "기타";
        }
    };

    if (!inquiryData) {
        return <Typography variant="h6" align="center" color={"black"}>로딩 중...</Typography>;
    }

    return (
        <Box sx={{
            width: "100vw",
            maxWidth: "80%",
            textAlign: "left",
        }}>
            <Typography
                variant="h4"
                gutterBottom
                color={"black"}
            >
                내 문의내역
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

            <Typography variant="body1" color="text.secondary">
                {getTypeLabel(inquiryData.type)} · {inquiryData.createAt?.split("T")[0] || ""}
            </Typography>

            <Divider sx={{
                marginTop: "16px",
                marginBottom: "16px"
            }}/>

            <Typography
                variant="h6"
                color={"black"}
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
                    sx={{mr: 2}}>
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
                    >
                        {inquiryData.content}
                    </Typography>
                    <Typography
                        mt={2}
                        variant="body2"
                        color="gray"
                        whiteSpace={"pre-line"}
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
                    >
                        {inquiryData.reply !== null ? inquiryData.reply:
                            "고객님, 안녕하세요.\n\n" +
                            "문의하신 내용은 아직 답변이 작성되지 않았습니다.\n\n" +
                            "빠른 도움을 드리지 못해 정말 죄송합니다."
                        }
                    </Typography>
                    <Typography
                        mt={2}
                        variant="body2" color="text.secondary">
                        {inquiryData.reply ? inquiryData.reply.createAt.replace("T", " ").slice(0, 16) : "답변 대기 중"}
                    </Typography>
                </Box>
            </Box>


        </Box>
    );
};
