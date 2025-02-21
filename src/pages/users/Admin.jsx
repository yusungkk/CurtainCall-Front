import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../api/userApi.js";
import Info from "./Info";
import Update from "./Update";
import UserList from "./UserList";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Container
} from "@mui/material";

const MyPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("info");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        setUser(response);
      } catch (error) {
        console.error("사용자 정보 요청 중 오류 발생:", error);
        alert("사용자 정보를 가져오는데 실패했습니다.");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* 왼쪽 네비게이션 바 */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" }
        }}
      >
        <Box sx={{ textAlign: "center", p: 2 }}>
          <Typography variant="h6">관리자 페이지</Typography>
        </Box>
        <List>
          {[
            { key: "info", label: "관리자 정보" },
            { key: "update", label: "관리자 정보 수정" },
            { key: "manage", label: "회원 관리" }
          ].map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                selected={selectedMenu === item.key}
                onClick={() => handleMenuClick(item.key)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* 오른쪽 메인 컨텐츠 */}
      <Container component="main" sx={{ flexGrow: 1, p: 3 }}>
        {selectedMenu === "info" && <Info user={user} />}
        {selectedMenu === "update" && <Update user={user} />}
        {selectedMenu === "manage" && <UserList />}
      </Container>
    </Box>
  );
};

export default MyPage;