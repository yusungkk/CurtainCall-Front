import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserData, getUserRole } from "../../api/userApi.js";
import Update from "./Update";
import UserList from "./UserList";
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
import CategoryManagement from "../../components/category/CategoryManagement.jsx";
import SpecialProductManagement from "../../components/specialProduct/SpecialProductManagement.jsx";
import FaqList from "../inquiry/FaqList.jsx";
import InquiryAdminList from "../inquiry/InquiryAdminList.jsx";
import ProductManagement from "/src/pages/products/ProductManagement.jsx";
import FaqAdminList from "../inquiry/FaqAdminList.jsx";

const MyPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initMenu = queryParams.get("menu") || "update"; // 예매 성공 후 접근 시
  const [selectedMenu, setSelectedMenu] = useState(initMenu);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserRole();
        if (data === 403) {
          alert("접근 권한이 없습니다.");
          navigate("/");
        } else if (data == false) {
          alert("접근 권한이 없습니다.");
          navigate("/");
        } else {
          const response = await getUserData();
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

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column", mt: 9 }}>
      {/* 상단 내비게이션 바 */}
      <AppBar position="sticky" sx={{ backgroundColor: "#800000", borderRadius: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            관리자 페이지
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
              { key: "update", label: "관리자 정보 수정" },
              { key: "manage", label: "회원 관리" },
              { key: "category", label: "카테고리 관리" },
              { key: "specialProduct", label: "특가상품 관리" },
              { key: "product", label: "상품 관리" },
              { key: "faq", label: "FAQ 관리" },
              { key: "inquiry", label: "문의 내역 보기" },
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
          {selectedMenu === "manage" && <UserList />}
          {selectedMenu === "category" && <CategoryManagement />}
          {selectedMenu === "product" && <ProductManagement />}
          {selectedMenu === "specialProduct" && <SpecialProductManagement />}
          {selectedMenu === "faq" && <FaqAdminList />}
          {selectedMenu === "inquiry" && <InquiryAdminList/>}
        </Container>
      </Box>
    </Box>
  );
};

export default MyPage;
