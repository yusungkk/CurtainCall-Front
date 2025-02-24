import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserData } from "../../api/userApi.js";
import Info from "./Info";
import Update from "./Update";
import OrderList from "/src/pages/users/OrderList";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";

const MyPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initMenu = queryParams.get("menu") || "info"; // 예매 성공 후 접근 시
  const [selectedMenu, setSelectedMenu] = useState(initMenu);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();

        if (!response) {
          alert("로그인이 필요합니다.");
          navigate("/login");
        } else {
          setUser(response);
        }
      } catch (error) {
        console.error("사용자 정보 요청 중 오류 발생:", error);
        alert("사용자 정보를 가져오는데 실패했습니다.");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (response.ok) {
          const data = await response.json();
          updateOrders(data);
        } else {
          throw new Error(await response.json());
        }
      } catch (error) {}
    };

    if (selectedMenu === "orders") {
      fetchOrderHistory();
    }
  }, [user, selectedMenu]);

  const updateOrders = (orders) => {
    setOrders(orders);
  };

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
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
        }}
      >
        <Box sx={{ textAlign: "center", p: 2 }}>
          <Typography variant="h6">마이페이지</Typography>
        </Box>
        <List>
          {[
            { key: "info", label: "내 정보" },
            { key: "update", label: "회원 정보 수정" },
            { key: "orders", label: "예매 내역" },
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
        {selectedMenu === "orders" && (
          <OrderList user={user} orders={orders} updateOrders={updateOrders} />
        )}
      </Container>
    </Box>
  );
};

export default MyPage;
