import {useEffect, useState} from "react";
import {createChatRoom} from "../../api/chatApi.js";
import {enterRoom, sendMessage} from "../../utils/webSocket.js";

export default function UserChatRoom() {

    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [roomId, setRoomId] = useState("");
    const [isConnected] = useState(() => {
        return localStorage.getItem("wsConnected") === "true";
    });

    useEffect(() => {
        if (!isConnected) {
            const initializeChat = async () => {
                const roomId = (await createChatRoom("user")).roomId;
                setRoomId(roomId);
                enterRoom(roomId, setMessages, setStompClient);
            };
            initializeChat();
        }
    }, []);

    const handleSendMessage = () => {
        if (!stompClient) {
            console.warn("STOMP 클라이언트가 아직 연결되지 않음");
            return;
        }
        if (message.trim() !== "") {
            const chatMessage = {roomId, sender: "user", content: message};
            sendMessage(stompClient, chatMessage, setMessage);
        }
    };


    return (
        <div
            style={{
                position: "fixed",
                bottom: "80px",
                right: "20px",
                width: "300px",
                height: "400px",
                backgroundColor: "white",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h2 style={{color: "black", textAlign: "center"}}>채팅방</h2>
            <div style={{flex: 1, overflowY: "scroll", padding: "5px", border: "1px solid gray"}}>
                {messages.map((msg, index) => (
                    <p key={index} style={{color: "black"}}>
                        <strong>{msg.sender}: </strong>{msg.content}
                    </p>
                ))}
            </div>
            <div style={{display: "flex", marginTop: "10px"}}>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{flex: 1, padding: "5px"}}
                />
                <button onClick={handleSendMessage} style={{marginLeft: "5px"}}>보내기</button>
            </div>
        </div>
    );
}
