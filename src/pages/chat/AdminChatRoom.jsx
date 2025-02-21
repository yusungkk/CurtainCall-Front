import { useState, useEffect } from "react";
import { Box, Tab, Tabs, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllChatRooms } from "../../api/chatApi";
import ChatRoomDetail from "../../components/chat/ChatRoomDetail"; // 선택한 채팅방의 채팅 내용을 보여줄 컴포넌트

export default function AdminChatRoom() {
    const [tabIndex, setTabIndex] = useState(0);
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const rooms = await getAllChatRooms();
                console.log(rooms);
                setChatRooms(rooms);
            } catch (error) {
                console.error("채팅방 목록을 불러오는 중 오류 발생:", error);
            }
        };
        fetchRooms();
    }, []);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    // 채팅 진행중: 상담사가 배정된 채팅방
    const activeRooms = chatRooms.filter((room) => room.agent !== null);
    // 채팅 대기중: 아직 상담사가 배정되지 않은 채팅방
    const waitingRooms = chatRooms.filter((room) => room.agent === null);

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
    };

    return (
        <Box
            sx={{
                width: "100vw",
                maxWidth: 1200,
                margin: "0 auto",
                mt: 5,
                display: "flex",
                gap: 2,
            }}
        >
            {/* 좌측 영역: 채팅방 목록 */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="h4" gutterBottom color="black">
                    채팅 관리
                </Typography>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="chat tabs">
                    <Tab label="채팅 진행중" />
                    <Tab label="채팅 대기중" />
                </Tabs>
                <Divider sx={{ my: 2 }} />
                {tabIndex === 0 ? (
                    activeRooms.length > 0 ? (
                        <List>
                            {activeRooms.map((room) => (
                                <ListItem
                                    key={room.roomId}
                                    button
                                    onClick={() => handleRoomClick(room)}
                                >
                                    <ListItemText
                                        primary={`사용자: ${room.user}`}
                                        secondary={`상담사: ${room.agent}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="gray">진행중인 채팅이 없습니다.</Typography>
                    )
                ) : waitingRooms.length > 0 ? (
                    <List>
                        {waitingRooms.map((room) => (
                            <ListItem
                                key={room.roomId}
                                button
                                onClick={() => handleRoomClick(room)}
                            >
                                <ListItemText
                                    primary={`사용자: ${room.user}`}
                                    secondary="대기중"
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography color="gray">대기중인 채팅이 없습니다.</Typography>
                )}
            </Box>

            {/* 우측 영역: 선택한 채팅방의 채팅 내역 */}
            <Box
                sx={{
                    flex: 2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 2,
                    minHeight: "400px",
                }}
            >
                {selectedRoom ? (
                    <ChatRoomDetail room={selectedRoom} />
                ) : (
                    <Typography variant="h6" color="gray">
                        채팅방을 선택해주세요.
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
