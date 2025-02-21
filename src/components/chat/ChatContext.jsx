import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatHistories, setChatHistories] = useState({});

    return (
        <ChatContext.Provider value={{ chatHistories, setChatHistories }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
