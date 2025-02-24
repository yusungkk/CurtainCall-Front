import {useToggle} from "./ToggleContext";
import SendIcon from '@mui/icons-material/Send';
import {useEffect, useState} from "react";
import {enterRoom, sendMessage} from "/src/utils/webSocket.js";
import {createChatRoom} from "/src/api/chatApi.js";

function ChatWindow() {
    const {isToggled, setIsToggled} = useToggle();

    const [stomp, setStomp] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [roomId, setRoomId] = useState(window.sessionStorage.getItem("roomId") || "");
    const [isConnected] = useState(() => window.sessionStorage.getItem("wsConnected") === "true");

    useEffect(() => {
        if (!isConnected) {
            const initializeChat = async () => {
                const roomId = (await createChatRoom("user")).roomId;
                setRoomId(roomId);
                enterRoom(roomId, setRoomId, setMessages, setStomp);
            };
            initializeChat();
        }
    }, []);

    useEffect(() => {
        console.log(messages);
    }, [messages])

    const handleSendMessage = () => {

        if (!stomp) {
            console.warn("STOMP 클라이언트가 연결되지 않음");

            if (isConnected && roomId !== "") {
                enterRoom(roomId, setRoomId, setMessages, setStomp);
            }
        }

        if (message.trim() !== "") {
            const chatMessage = {roomId, sender: "user", content: message};
            sendMessage(stomp, chatMessage, setMessage);
        }
    };

    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
    }

    return (
        <>
            {isToggled && <div
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

                <div style={{flex: 1, overflowY: "auto", borderBottom: "1px solid #ddd", paddingBottom: "10px"}}>
                    {messages.map((m, index) => <p key={index}>{m.content}</p> ) }
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
