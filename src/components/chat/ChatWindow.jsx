import {useToggle} from "./ToggleContext";
import SendIcon from '@mui/icons-material/Send';
import {useEffect, useState} from "react";
import {
    connectWebSocket,
    disconnectWebSocket,
    enterRoom,
    sendMessage,
    subscribeToRoom,
    testConnectWebSocket
} from "/src/utils/webSocket.js";
import {createChatRoom, endChatRoom, getMessagesByRoomId} from "/src/api/chatApi.js";
import CancelBtn from "../CancelBtn.jsx";

function ChatWindow({setActive}) {
    const {isToggled, setIsToggled} = useToggle();

    const [stomp, setStomp] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [roomId, setRoomId] = useState(window.sessionStorage.getItem("roomId") || "");

    useEffect(() => {
        console.log(roomId);
        if (!stomp && roomId === "") {
            const initializeChat = async () => {
                const resRoomId = (await createChatRoom()).roomId;
                enterRoom(resRoomId, setRoomId, setMessages, setStomp);
            };

            initializeChat();
            return;
        }

        const fetchMessages = async () => {
            const data = await getMessagesByRoomId(roomId);
            console.log(data);
            setMessages(data.content);

            const stomp = await testConnectWebSocket();
            setStomp(stomp);
            subscribeToRoom(stomp, roomId, setMessages);
        };
        fetchMessages();
    }, []);

    const handleSendMessage = () => {

        console.log(roomId);
        if (!stomp) {
            console.warn("STOMP 클라이언트가 연결되지 않음");
            connectWebSocket(setStomp);
        }

        if (message.trim() !== "") {
            const chatMessage = {roomId, sender: "user", content: message};
            sendMessage(stomp, chatMessage, setMessage);
        }
    };

    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
    }

    const handleEndChat = () => {
        if (confirm("정말로 상담을 종료하실건가요?")) {
            disconnectWebSocket(stomp, setStomp);
            endChatRoom(roomId);
            setIsToggled(false);
            setActive(false);
        }
    };

    return (
        <>
            {isToggled &&
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
                    zIndex: "99999"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px"}}>
                    <div style={{ flex: 1 }}>
                        <CancelBtn
                            viewName={"상담종료"}
                            onClick={handleEndChat}
                        />
                    </div>
                    <h3 style={{ margin: 0, color: "black", flex: 2, textAlign: "center" }}>채팅</h3>
                    <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
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
                </div>

                <div style={{flex: 1, overflowY: "auto", borderBottom: "1px solid #ddd", paddingBottom: "10px"}}>
                    {messages.map((m, index) => <div
                        key={index}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: m.sender === "user" ? "flex-end" : "flex-start",
                            marginBottom: "10px"
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: m.sender === "user" ? "#DFA7B2" : "#F5E6E8",
                                color: "#000",
                                padding: "10px",
                                marginLeft: "5px",
                                marginRight: "5px",
                                borderRadius: "10px",
                                maxWidth: "70%",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                wordWrap: "break-word",
                                fontSize: "14px"
                            }}
                        >
                            {m.content}
                        </div>
                    </div>
                    )}
                </div>

                <div style={{display: "flex", alignItems: "center", marginTop: "10px"}}>
                    <input
                        onChange={(e) => handleChangeMessage(e)}
                        type="text"
                        placeholder="메시지를 입력하세요..."
                        style={{
                            fontSize: "1rem",
                            width: "85%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            outline: "none",
                            marginRight: "6px"
                        }}
                        value={message}
                    />
                    <SendIcon
                        onClick={handleSendMessage}
                        color={"disabled"} style={{
                        cursor: "pointer",
                    }}/>
                </div>
            </div>
            }
        </>
    );
}

export default ChatWindow;
