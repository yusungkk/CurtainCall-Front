import { useNavigate } from "react-router-dom";
import { logout } from "../../api/userApi.js";
import { Container, Box, Typography, Divider, Button } from "@mui/material";

const Info = ({ user }) => {
  const navigate = useNavigate();

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  const handleLogout = async () => {
    try {
      const response = await logout();
      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 요청 중 오류가 발생했습니다.");
      navigate("/");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          p: 8,
          bgcolor: "white",
          boxShadow: 2,
          borderRadius: 5,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="h4">
          내 정보
        </Typography>

        <Box sx={{ textAlign: "left", width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, mt: 8 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              이메일
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
              {user.email}
            </Typography>
          </Box>
          <Divider sx={{ mb: 4, bgcolor: "lightgray", width: "100%" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              이름
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
              {user.name}
            </Typography>
          </Box>
          <Divider sx={{ mb: 4, bgcolor: "lightgray" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              전화번호
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
              {user.phone}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2, bgcolor: "lightgray" }} />
        </Box>

        <Box>
          <Button
            onClick={() => {
              if (window.confirm("로그아웃 하시겠습니까?")) {
                handleLogout();
              }
            }}
            sx={{
              mt: 4,
              fontSize: "1rem",
              backgroundColor: "#800000",
              color: "white",
              padding: "10px 20px",
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#660000" },
            }}
          >
            로그아웃
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Info;