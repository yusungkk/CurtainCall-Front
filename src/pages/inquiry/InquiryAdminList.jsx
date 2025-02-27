import {Box, Divider, FormControl, InputLabel, List, MenuItem, Pagination, Select, Typography} from "@mui/material";
import InputText from "/src/components/InputText";
import {useEffect, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import {getInquiriesByAdmin} from '/src/api/faqApi';
import {useNavigate} from "react-router-dom";
import InquiryListItem from "/src/components/inquiry/InquiryListItem.js";

export default function InquiryAdminList() {

    const [inquirySearchCond, setInquirySearchCond] = useState({
        title: "",
        status: "",
        questionType: ""
    });

    const [inquiryData, setInquiryData] = useState([]);
    const [offset, setOffset] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const searchStatus = [
        {name: "READY", value: "답변 전"},
        {name: "COMPLETE", value: "답변 완료"}
    ];

    const searchQuestionType = [
        {name: "USER", value: "회원"},
        {name: "TICKET", value: "티켓"},
        {name: "ETC", value: "기타"}
    ];

    const fetchInquiries = async () => {
        const data = await getInquiriesByAdmin(navigate, inquirySearchCond, offset - 1);
        setInquiryData([...data.content]);
        setOffset(data.number + 1);
        setTotalPages(data.totalPages);
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    useEffect(() => {
        fetchInquiries();
    }, [offset])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setInquirySearchCond(prevState => ({...prevState, [name]: value}));
    };

    const handleSubmit = async () => {
        console.log(inquirySearchCond);
        const data = await getInquiriesByAdmin(navigate, inquirySearchCond);
        setInquiryData([...data.content]);
    };

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    const handlePageChange = (e, value) => {
        setOffset(value);
    };

    const handleInquiryClick = (id) => {
        navigate(`/admin/inquiries/${id}`);
    };

    return (
        <Box sx={{maxWidth: "100%", mt: 5, ml: 2}}>
            <Typography variant="h4" gutterBottom color={"black"} align={"left"} mb={4}
                        sx={{fontFamily: "'Bareun_hipi', sans-serif",}}>
                작성된 문의 내역
            </Typography>
            <form onKeyUp={handleKeyUp}>
                <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                    <FormControl fullWidth margin={"normal"} sx={{flex: 1}}>
                        <InputLabel id="status-select-label">답변상태</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            name="status"
                            value={inquirySearchCond.status}
                            label="답변상태"
                            onChange={handleChange}
                        >
                            {searchStatus.map(status => (
                                <MenuItem key={status.name} value={status.name}>
                                    {status.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin={"normal"} sx={{flex: 1}}>
                        <InputLabel id="type-select-label">질문유형</InputLabel>
                        <Select
                            labelId="type-select-label"
                            id="type-select"
                            name="questionType"
                            value={inquirySearchCond.questionType}
                            label="질문유형"
                            onChange={handleChange}
                        >
                            {searchQuestionType.map(status => (
                                <MenuItem key={status.name} value={status.name}>
                                    {status.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <InputText
                        id="title"
                        name="title"
                        label="제목"
                        value={inquirySearchCond.title}
                        event={handleChange}
                    />

                    <SearchIcon
                        onClick={handleSubmit}
                        color={"disabled"}
                        fontSize={"large"}
                        sx={{
                            "&:hover": {
                                cursor: "pointer"
                            }
                        }}
                    />
                </Box>
            </form>
            <Divider/>
            {inquiryData.length > 0 ? (
                <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {inquiryData.map(inquiry => (
                        <InquiryListItem
                            onClick={() => handleInquiryClick(inquiry.id)}
                            inquiry={inquiry}
                        />
                    ))}
                </List>
            ) : (
                <Typography variant="h6" gutterBottom color={"gray"} align={"left"} mt={4} mb={4}
                            sx={{fontFamily: "'Bareun_hipi', sans-serif",}}>
                    작성된 문의내역이 없습니다.
                </Typography>
            )}
            <Pagination
                count={totalPages}
                page={offset}
                onChange={handlePageChange}
            />
        </Box>
    );
};
