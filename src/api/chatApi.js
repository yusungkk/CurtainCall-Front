import {fetcher} from "/src/utils/fetcher.js";
import {
    CREATE_CHAT_ROOM_URL,
    FIND_MESSAGES_URL, FIND_ROOMS_BY_ACTIVE_URL,
    UPDATE_CHAT_ROOM_URL
} from "/src/utils/endpoint.js";

export const ROOM_ACTIVE = {
    withoutAdmin : "WITHOUT_ADMIN",
    withAdmin : "WITH_ADMIN",
    endRoom : "END"
}

export const createChatRoom = async () => {
    return await fetcher(CREATE_CHAT_ROOM_URL, {
        method: "POST",
    });
};

export const getRooms = async (active) => {
    return await fetcher(FIND_ROOMS_BY_ACTIVE_URL(active));
};

export const assignChatRoom = async (roomId) => {
    return await fetcher(UPDATE_CHAT_ROOM_URL(roomId, ROOM_ACTIVE.withAdmin), {
        method: "PATCH"
    });
};

export const endChatRoom = async (roomId) => {
    return await fetcher(UPDATE_CHAT_ROOM_URL(roomId, ROOM_ACTIVE.endRoom), {
        method: "PATCH"
    });
};

export const getMessagesByRoomId = async (roomId, offset, limit) => {
    return await fetcher(FIND_MESSAGES_URL(roomId, offset, limit));
};