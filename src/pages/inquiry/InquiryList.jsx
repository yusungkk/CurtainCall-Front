import {useEffect, useState} from 'react';
import {
    List,
    Divider,
    Box,
    Typography,
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import {getInquiriesByUser} from "../../api/faqApi.js";
import InquiryListItem from "../../components/inquiry/InquiryListItem.js";

export default function InquiryList() {
    const [inquiryData, setInquiryData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInquiries = async () => {
            const data = await getInquiriesByUser(navigate);
            console.log(data);
            setInquiryData([...data.content]);
        };
        fetchInquiries();
    }, []);

    const handleInquiryBtn = (id) => {
        navigate(`/inquiries/${id}`)
    }

    return (
        <Box sx={{width: '100vw', maxWidth: 800, margin: '0 auto', mt: 5}}>
            <Typography variant="h4"
                        gutterBottom
                        color={"black"}
                        align={"left"}
                        mb={4}
                        sx={{fontFamily: "'Bareun_hipi', sans-serif",}}
            >
                내 문의내역
            </Typography>
            <Divider/>

            {inquiryData.length > 0 ? (
                <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {inquiryData.map(inquiry => (
                        <InquiryListItem
                            inquiry={inquiry}
                            onClick={() => handleInquiryBtn(inquiry.id)}
                        />
                    ))}
                </List>
            ) : (
                <Typography variant="h6"
                            gutterBottom
                            color={"gray"}
                            align={"left"} mt={4} mb={4}
                            sx={{fontFamily: "'Bareun_hipi', sans-serif",}}>
                    문의하신 내역이 없습니다.
                </Typography>
            )}
        </Box>
    );
}
