import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { enterRoom, sendMessage } from "../../utils/webSocket.js";
import {useChat} from "./ChatContext.jsx";

export default function ChatRoomDetail({ room }) {
    const { chatHistories, setChatHistories } = useChat();
    // 해당 방의 채팅 기록이 이미 있으면 불러오고, 없으면 빈 배열로 시작
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState("");

    // 방에 입장해서 메시지를 구독
    useEffect(() => {
        console.log(chatHistories);
        if (!chatHistories[room.roomId]) {
            enterRoom(room.roomId, setMessages, setStompClient);
        } else {
            setMessages(chatHistories[room.roomId])
        }
    }, [room.roomId]);

    // messages가 업데이트 될 때마다 전역 Context에도 저장
    useEffect(() => {
        setChatHistories((prev) => ({
            ...prev, // 기존 채팅 기록 유지
            [room.roomId]: [...messages], // 현재 채팅방의 메시지만 업데이트
        }));
    }, [messages, room.roomId, setChatHistories]);


    const handleSendMessage = () => {
        if (!stompClient) {
            console.warn("STOMP 클라이언트가 아직 연결되지 않음");
            return;
        }
        if (message.trim() !== "") {
            const chatMessage = { roomId: room.roomId, sender: room.user, content: message };
            sendMessage(stompClient, chatMessage, setMessage);
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom color="secondary">
                채팅방: {room.roomId}
            </Typography>
            <Box sx={{ border: "1px solid gray", p: 1, height: 300, overflowY: "scroll", mb: 2 }}>
                {messages.map((msg, idx) => (
                    <Typography key={idx} variant="body1" color="secondary">
                        <strong>{msg.sender}: </strong>{msg.content}
                    </Typography>
                ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ flex: 1, padding: "5px" }}
                />
                <Button variant="contained" onClick={handleSendMessage}>
                    전송
                </Button>
            </Box>
        </Box>
    );
}
