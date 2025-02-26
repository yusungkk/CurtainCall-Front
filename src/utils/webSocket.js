import {WS_CHAT_PUB_URL, WS_CHAT_SUB_URL, WS_CONNECT_URL} from "/src/utils/endpoint.js";
import SockJS from "sockjs-client";
import Stomp from "stompjs";


export const enterRoom = (roomId, setRoomId, setMessages, setStomp) => {
    const socket = new SockJS(WS_CONNECT_URL);
    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
        console.log("WebSocket 연결됨: ", roomId);
        stomp.subscribe(WS_CHAT_SUB_URL(roomId), async (message) => {
            const parsedMessage = await JSON.parse(message.body);
            setMessages(prevState => [...prevState, parsedMessage]);
        });
        window.sessionStorage.setItem("roomId", roomId);
        setStomp(stomp);
        setRoomId(roomId);
    })
};

export const sendMessage = (stomp, chatMessage, setMessage) => {
    stomp.send(WS_CHAT_PUB_URL(chatMessage.roomId), {}, JSON.stringify(chatMessage));
    setMessage("");
};

export const connectWebSocket = (setStomp) => {
    const socket = new SockJS(WS_CONNECT_URL);
    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
        console.log("WebSocket 연결됨");
        setStomp(stomp);
    });
};

export const subscribeToRoom = (stomp, roomId, setMessages) => {
    if (!stomp) return;

    stomp.subscribe(WS_CHAT_SUB_URL(roomId), async (message) => {
        const parsedMessage = await JSON.parse(message.body);
        console.log(parsedMessage);
        setMessages(prevState => [...prevState, parsedMessage]);
    });
};

export const testConnectWebSocket = () => {
    return new Promise((resolve, reject) => {
        const socket = new SockJS(WS_CONNECT_URL);
        const stomp = Stomp.over(socket);

        stomp.connect({}, () => {
            console.log("WebSocket 연결됨");

            // WebSocket 연결 상태 저장
            window.sessionStorage.setItem("wsConnected", "true");

            // 상태 설정 후 resolve
            resolve(stomp);
        }, (error) => {
            console.error("WebSocket 연결 실패", error);
            reject(error);
        });
    });
};

export const disconnectWebSocket = (stomp, setStomp) => {
    if (stomp) {
        stomp.disconnect();
        setStomp(null);
    }
    window.sessionStorage.removeItem("toggleActive");
    window.sessionStorage.removeItem("wsConnected");
    window.sessionStorage.removeItem("roomId");
};
