import {useToggle} from "./ToggleContext";
import SendIcon from '@mui/icons-material/Send';
import {useEffect, useRef, useState} from "react";
import {connectWebSocket, sendMessage, subscribeToRoom} from "/src/utils/webSocket.js";
import {assignChatRoom, getMessagesByRoomId, getRooms} from "/src/api/chatApi.js";
import {Box, Tab, Tabs} from "@mui/material";

function AdminChatWindow() {
    const {isToggled, setIsToggled} = useToggle();

    const tabs = [
        {name: "waiting", value: "대기중인 방"},
        {name: "joined", value: "내가 상담중인 방"},
        {name: "chatting", value: "현재 채팅"}
    ];

    const [stomp, setStomp] = useState();
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [subRoomIds, setSubRoomIds] = useState([]);

    const [activeTab, setActiveTab] = useState(tabs[0].name);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        pageNum: 0,
        totalPage: 0,
    })

    const [waitingRooms, setWaitingRooms] = useState([]);
    const [joinedRooms, setJoinedRooms] = useState([]);

    const containerRef = useRef(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const initializeChat = async () => {
            connectWebSocket(setStomp);
        };
        initializeChat();
    }, []);

    useEffect(() => {
        const fetchTab = async () => {
            switch (activeTab) {
                case 'waiting':
                    setWaitingRooms(await getRooms("WITHOUT_ADMIN"));
                    break;
                case  'joined':
                    setJoinedRooms(await getRooms("WITH_ADMIN"));
                    break;
                case 'chatting':
                    if (selectedRoomId === "") {
                        setActiveTab('joined');
                        return;
                    }
                    const data = await getMessagesByRoomId(selectedRoomId);
                    containerRef.current.scrollTop = containerRef.current.scrollHeight;
                    setMessages(data.content);
                    setPageInfo({
                        pageNum: data.number,
                        totalPage: data.totalPages,
                    })
                    break;
            }
        }
        setMessages([]);
        fetchTab();
    }, [activeTab]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleEnterRoom = async (roomId) => {

        if (subRoomIds.includes(roomId)) {
            setSelectedRoomId(roomId);
            setActiveTab("chatting");
            return;
        }

        const data = await assignChatRoom(roomId);

        if (data === 204) {
            subscribeToRoom(stomp, roomId, setMessages);
            setSelectedRoomId(roomId);
            setSubRoomIds(prevState => [...prevState, roomId]);
            setActiveTab("chatting");
        }
    };

    const handleSendMessage = () => {
        if (!stomp) {
            console.warn("STOMP가 연결되지 않음");
            connectWebSocket(setStomp);
        }

        if (message.trim() !== "") {
            const chatMessage = {roomId: selectedRoomId, sender: "user", content: message};
            sendMessage(stomp, chatMessage, setMessage);
        }
    };

    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
    };

    const handleScroll = async () => {

        if (!containerRef || isFetching) {
            return;
        }

        if (pageInfo.pageNum >= pageInfo.totalPage) {
            return;
        }

        if (containerRef.current.scrollTop === 0) {
            setIsFetching(true);
            console.log(pageInfo);
            const data = await getMessagesByRoomId(selectedRoomId, pageInfo.pageNum + 1);
            console.log(data);
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            setMessages(prevState => [...prevState, ...data.content]);
            setPageInfo({
                pageNum: data.number,
                totalPage: data.totalPages,
            })
            setIsFetching(false);
        }
    }

    return (
        <>
            {isToggled && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        width: "400px",
                        height: "600px",
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                        zIndex: "999"
                    }}
                >
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <h3 style={{margin: 0, color: "black"}}>채팅</h3>
                        <button
                            onClick={() => setIsToggled(false)}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "18px",
                                cursor: "pointer",
                            }}
                        >
                            ❌
                        </button>
                    </div>

                    <Box sx={{width: '100%', marginBottom: "1rem"}}>
                        <Tabs
                            value={activeTab}
                            onChange={(event, newValue) => setActiveTab(newValue)}
                            textColor="secondary"
                            indicatorColor="secondary"
                            aria-label="채팅 탭"
                        >

                            {tabs.map((t, index) => <Tab key={index} value={t.name} label={t.value}/>)}
                        </Tabs>
                    </Box>

                    <div
                        ref={containerRef}
                        onScroll={handleScroll}
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "10px"
                        }}>
                        {activeTab === "waiting" && (
                            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                {waitingRooms.map((room) => (
                                    <div
                                        key={room.roomId}
                                        onClick={() => handleEnterRoom(room.roomId)}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            backgroundColor: "#f5f5f5",
                                            cursor: "pointer",
                                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                                            transition: "background-color 0.3s",
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e0e0"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                                    >
                                        <span style={{fontSize: "14px", color: "#777"}}>{"새로운 채팅방입니다."}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "joined" && (
                            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                                {joinedRooms.map((room) => (
                                    <div
                                        key={room.roomId}
                                        onClick={() => handleEnterRoom(room.roomId)}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            padding: "12px",
                                            borderRadius: "10px",
                                            backgroundColor: "#f5f5f5",
                                            cursor: "pointer",
                                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                                            transition: "background-color 0.3s",
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e0e0"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                                    >
                                        <span style={{fontSize: "14px", color: "#777"}}>{"회원명 : "}
                                            <strong style={{fontSize: "16px", color: "black"}}>{room.user}</strong>
                                            </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "chatting" && messages.map((m, index) => <p key={index}>{m.content}</p>)}
                    </div>

                    {activeTab === "chatting" && (
                        <div style={{display: "flex", alignItems: "center", marginTop: "10px"}}>
                        <textarea
                            onChange={(e) => handleChangeMessage(e)}
                            placeholder="메시지를 입력하세요..."
                            style={{
                                fontSize: "1rem",
                                width: "85%",
                                padding: "1rem",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                outline: "none",
                                marginRight: "0.5rem",
                                resize: "none",
                                minHeight: "3rem",
                                maxHeight: "10rem",
                                overflowY: "auto"
                            }}
                            value={message}
                        />
                            <SendIcon
                                onClick={handleSendMessage}
                                color={"disabled"}
                                style={{
                                    cursor: "pointer",
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default AdminChatWindow;