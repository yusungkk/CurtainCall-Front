import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserData } from "../../api/userApi.js";
import Update from "./Update";
import OrderList from "/src/pages/users/OrderList";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import InquiryList from "../inquiry/InquiryList.jsx";

const MyPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initMenu = queryParams.get("menu") || "orders"; // 예매 성공 후 접근 시
  const [selectedMenu, setSelectedMenu] = useState(initMenu);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();

        if (response === 403) {
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
        const response = await fetch(`http://localhost:8080/api/v1/history`, {
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
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column", mt: 9 }}>
      {/* 상단 내비게이션 바 */}
      <AppBar position="sticky" sx={{ backgroundColor: "#800000", borderRadius: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            마이페이지
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {/* 왼쪽 내비게이션 바 */}
        <Box
          sx={{
            width: 240,
            height: "50vh",
            minHeight: "340px",
            top: 64,
            position: "sticky",
            borderRadius: 2,
            backgroundColor: "#f4f4f4",
            p: 2,
            boxShadow: 2,
          }}
        >
          <List>
            {[
                { key: "orders", label: "예매 내역" },
                { key: "update", label: "회원 정보 수정" },
                { key: "inquiry", label: "내가 문의한 내역" },
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
        </Box>

        {/* 오른쪽 메인 컨텐츠 */}
        <Container component="main" sx={{ flexGrow: 1, p: 3 }}>
          {selectedMenu === "update" && <Update user={user} />}
          {selectedMenu === "orders" && <OrderList user={user} orders={orders} updateOrders={updateOrders} />}
          {selectedMenu === "inquiry" && <InquiryList />}
        </Container>
      </Box>
    </Box>
  );
};

export default MyPage;