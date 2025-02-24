import {WS_CHAT_PUB_URL, WS_CHAT_SUB_URL, WS_CONNECT_URL} from "./endpoint.js";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export const sendMessage = (stomp, chatMessage, setMessage) => {
    stomp.send(WS_CHAT_PUB_URL(chatMessage.roomId), {}, JSON.stringify(chatMessage));
    setMessage("");
};

export const enterRoom = (roomId, setMessages, setStomp) => {
    const socket = new SockJS(WS_CONNECT_URL);
    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
        console.log("WebSocket 연결됨: ", roomId);
        stomp.subscribe(WS_CHAT_SUB_URL(roomId), async (message) => {
            const parsedMessage = await JSON.parse(message.body);
            setMessages(prevState => [...prevState, parsedMessage]);
        });
        setStomp(stomp);
    })
};