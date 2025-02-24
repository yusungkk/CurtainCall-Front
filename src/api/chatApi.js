import {fetcher} from "/src/utils/fetcher.js";
import {
    ASSIGN_CHAT_ROOM_URL,
    CREATE_CHAT_ROOM_URL,
    FIND_MESSAGES_URL,
    FIND_ROOMS_WITHOUT_ADMIN_URL
} from "/src/utils/endpoint.js";

export const createChatRoom = async (userId) => {
    return await fetcher(CREATE_CHAT_ROOM_URL(userId), {
        method: "POST",
    });
};

export const getRooms = async (active) => {
    return await fetcher(FIND_ROOMS_WITHOUT_ADMIN_URL(active));
};

export const assignChatRoom = async (roomId) => {
    return await fetcher(ASSIGN_CHAT_ROOM_URL(roomId), {
        method: "PATCH"
    });
};

export const getMessagesByRoomId = async (roomId, offset, limit) => {
    return await fetcher(FIND_MESSAGES_URL(roomId, offset, limit));
};