import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserList, activate, deactivate } from "../../api/userApi.js";
import { Card, CardContent, Typography, Container, CircularProgress, Button } from "@mui/material";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserList();
        setUsers(response);
      } catch (error) {
        console.error("유저 목록을 가져오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleActivation = async (user) => {
    const confirmMessage = user.active
      ? "이 유저를 비활성화하시겠습니까?"
      : "이 유저를 활성화하시겠습니까?";

    if (!window.confirm(confirmMessage)) return;

    try {
      if (user.active) {
        await deactivate(user.id);
      } else {
        await activate(user.id);
      }
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, active: !u.active } : u
        )
      );
    } catch (error) {
      console.error("상태 변경에 실패했습니다:", error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 7, pb: 7 }}>
      <Typography variant="h4" sx={{ mb: 6 }}>
        회원 관리
      </Typography>
      {users.map((user) => (
        <Card key={user.email} sx={{ mb: 2, borderRadius: 4, padding: 2, width: "550px", maxWidth: 800 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
                {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
            </div>
            <Button
              variant="contained"
              color={user.active ? "error" : "success"}
              onClick={() => handleToggleActivation(user)}
              sx={{
                  minWidth: "auto",
                  padding: "4px 10px",
                  fontSize: "0.875rem",
                  display: "inline-block",
                  width: "fit-content",
                }}
            >
              {user.active ? "비활성화" : "활성화"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default UserList;