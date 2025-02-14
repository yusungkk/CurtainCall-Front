import {useEffect, useState} from "react";
import {deleteFaq, getFaqs, getFaqsByType} from "../../api/faqApi.js";
import {
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Collapse, Tabs, Box, Tab,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditBtn from "../../component/EditBtn.tsx";
import CancelBtn from "../../component/CancelBtn.jsx";
import LoadMoreBtn from "../../component/LoadMoreBtn.jsx";
import {useNavigate} from "react-router-dom";
import Grid from "@mui/material/Grid2";
import QuizIcon from '@mui/icons-material/Quiz';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ChatIcon from '@mui/icons-material/Chat';
import FaqCard from "../../component/FaqCard.jsx";


function FaqList() {

    const defaultOffset = 0;
    const limit = 10;
    const faqTypes = [
        {name: "ALL", value: "전체"},
        {name: "TICKET", value: "티켓"},
        {name: "USER", value: "회원"},
        {name: "ETC", value: "기타"},
    ];

    const navigate = useNavigate();
    const [faqs, setFaqs] = useState([]);
    const [openFaqs, setOpenFaqs] = useState({});
    const [offset, setOffset] = useState(defaultOffset);
    const [tab, setTab] = useState(faqTypes[0].name);
    const [pageInfo, setPageInfo] = useState({
        totalPage: 0,
        totalElements: 0,
        size: 0
    });

    const fetchFaqs = async (offsetValue) => {
        let data;
        console.log(offset)
        switch (tab) {
            case 'ALL':
                data = await getFaqs(offsetValue, limit);
                break;
            case 'TICKET':
                data = await getFaqsByType("TICKET", offsetValue, limit);
                break;
            case 'USER':
                data = await getFaqsByType('USER', offsetValue, limit);
                break;
            case 'ETC':
                data = await getFaqsByType('ETC', offsetValue, limit);
                break;
        }
        return data;
    }

    const getData = async () => {
        setFaqs([]);
        let data = await fetchFaqs(defaultOffset);
        setFaqs([...data.content]);
        setOffset(0);
        setPageInfo({
            ...pageInfo,
            totalPage: data.page.totalPages,
            totalElements: data.page.totalElements,
            size: data.page.totalElements === 0 ? 0 : data.content.length
        });
    }

    useEffect(() => {
        const fetchFaqs = async () => {
            const data = await getFaqs(offset, 10);
            console.log(data);
            setFaqs([...data.content]);
            setOffset(prevState => prevState + 1);
            setPageInfo({
                ...pageInfo,
                totalPage: data.page.totalPages,
                totalElements: data.page.totalElements,
                size: data.page.totalElements === 0 ? 0 : data.content.length
            });
        };
        fetchFaqs();
    }, []);

    useEffect(() => {

        const changeFaqs = async() => {
             await getData()
        };
        changeFaqs();
    }, [tab])

    const handleToggle = (id) => {
        setOpenFaqs((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleChange = (evt, tab) => {
        setTab(tab);
    };

    const handleMoreBtn = async () => {
        const newOffset = offset + 1;
        setOffset(prevState => prevState + 1);

        const data = await fetchFaqs(newOffset);

        setFaqs(prevState => [...prevState, ...data.content]);
        setPageInfo({
            ...pageInfo,
            size: pageInfo.size + data.page.size > pageInfo.totalElements ? pageInfo.totalElements : pageInfo.size + data.page.size,
        });
    };

    const handleEditBtn = (e, id) => {
        e.stopPropagation();
        navigate(`/admin/faqs/${id}`);
    };

    const handleCancelBtn = async (e, id) => {
        e.stopPropagation();
        const responseStatus = await deleteFaq(id);

        if (responseStatus === 204) {
            await getData();
        }
    };

    return (
        <div style={{width: '100vw', maxWidth: '70%'}}>
            <Box sx={{
                mb: 2
            }}>
                <Typography variant="h4" sx={{
                    color: 'black',
                    textAlign: 'left',
                }}>자주 묻는 질문
                </Typography>
            </Box>
            <Box sx={{width: '100%'}}>
                <Tabs
                    value={tab}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                >
                    {faqTypes.map((f, index) =>
                        <Tab
                            key={index}
                            value={f.name}
                            label={f.value}
                            sx={{
                                '&.MuiTab-root:focus': {
                                    outline: 'none'
                                }
                            }}
                        />)}
                </Tabs>
            </Box>
            <List sx={{
                bgcolor: 'background.paper',
                color: 'black',
                textAlign: 'left',
            }}
            >
                {faqs.length === 0 &&
                    <h4 style={{color: 'gray'}}>일치하는 FAQ 내용이 없습니다.</h4>

                }
                {faqs.map((faq) => (
                    <div key={faq.id}>
                        <ListItemButton onClick={() => handleToggle(faq.id)}>
                            <ListItemText
                                primary={`❓ ${faq.question}`}
                            />
                            {openFaqs[faq.id] ? <ExpandLess/> : <ExpandMore/>}
                            <Grid container spacing={1}>
                                <Grid size={7}>
                                    <EditBtn onClick={e => handleEditBtn(e, faq.id)} viewName={"수정"}/>
                                </Grid>
                                <Grid size={5}>
                                    <CancelBtn onClick={e => handleCancelBtn(e, faq.id)} viewName={"삭제"}/>
                                </Grid>
                            </Grid>
                        </ListItemButton>
                        <Collapse in={openFaqs[faq.id]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{pl: 4}}>
                                <ListItemText
                                    primary={faq.answer}
                                />
                            </List>
                        </Collapse>
                    </div>
                ))}
            </List>
            <LoadMoreBtn
                onClick={handleMoreBtn}
                viewName={`더 보기(${pageInfo.size}/${pageInfo.totalElements})`}
                isDisabled={pageInfo.totalElements === 0 || pageInfo.size >= pageInfo.totalElements}
            />
            <Box sx={{
                mt: 5,
                textAlign: 'left',
            }}>
                <Typography variant="h4" sx={{
                    color: 'black',
                    mb: 2
                }}>다른 도움이 필요하신가요?</Typography>

                <div>
                    <FaqCard
                        icon={QuizIcon}
                        title="1:1 문의하기"
                        description="상담 내역을 남길 수 있습니다."
                    />
                    <FaqCard
                        icon={EditNoteIcon}
                        title="내 문의 내역 확인하기"
                        description="문의한 내용을 확인해 보세요."
                    />
                    <FaqCard
                        icon={ChatIcon}
                        title="채팅상담하기"
                        description="실시간으로 채팅으로 문의하여 보세요."
                    />
                </div>
            </Box>
        </div>
    );

}

export default FaqList;