import {fetcher} from "../utils/fetcher.js";
import {CREATE_CHAT_ROOM_URL} from "../utils/endpoint.js";

export const createChatRoom = async (userId) => {
    return await fetcher(CREATE_CHAT_ROOM_URL(userId), {
        method: "POST",
    });
};

export const getAllChatRooms = async () => {
    return await fetcher("http://localhost:8080/api/v1/chat/rooms");
};