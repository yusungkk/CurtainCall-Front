import {useEffect, useState} from "react";
import {deleteFaq, getFaqs, getFaqsByType} from "/src/api/faqApi.js";
import {
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Collapse, Tabs, Box, Tab,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditBtn from "../../components/EditBtn.tsx";
import CancelBtn from "../../components/CancelBtn.jsx";
import LoadMoreBtn from "../../components/LoadMoreBtn.jsx";
import {useNavigate} from "react-router-dom";
import Grid from "@mui/material/Grid2";
import SaveBtn from "../../components/SaveBtn.jsx";


function FaqAdminList() {

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
            totalPage: data.totalPages,
            totalElements: data.totalElements,
            size: data.totalElements === 0 ? 0 : data.content.length
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
                totalPage: data.totalPages,
                totalElements: data.totalElements,
                size: data.totalElements === 0 ? 0 : data.content.length
            });
        };
        fetchFaqs();
    }, []);

    useEffect(() => {

        const changeFaqs = async () => {
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

        if (!confirm("정말로 삭제하실 건가요?")) {
            return;
        }

        const responseStatus = await deleteFaq(id);

        if (responseStatus === 204) {
            await getData();
        }
    };

    const handleAddBtn = () => {
        navigate(`/admin/faqs/new`);
    }

    return (
        <Box sx={{maxWidth: "100%", mt: 5, ml: 2}}>
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
                                fontFamily: "'Bareun_hipi', sans-serif",
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
                                sx={{
                                    fontFamily: "'Bareun_hipi', sans-serif",
                                    whiteSpace: "pre-line",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}

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
                                    sx={{
                                        wordBreak: "break-word",
                                        overflowY: "auto",
                                        maxWidth: "90%",
                                    }}
                                    primary={faq.answer}
                                />
                            </List>
                        </Collapse>
                    </div>
                ))}
            </List>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <LoadMoreBtn
                    onClick={handleMoreBtn}
                    viewName={`더 보기(${pageInfo.size}/${pageInfo.totalElements})`}
                    isDisabled={pageInfo.totalElements === 0 || pageInfo.size >= pageInfo.totalElements}
                />
                <EditBtn
                    onClick={handleAddBtn}
                    viewName={"FAQ 추가"}
                />
            </div>

        </Box>
    );

}

export default FaqAdminList;