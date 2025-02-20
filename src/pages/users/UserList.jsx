import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserList } from "../../api/userApi.js";
import { Card, CardContent, Typography, Container, CircularProgress } from "@mui/material";

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

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 7 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        회원 관리
      </Typography>
      {users.map((user) => (
        <Card key={user.email} sx={{ mb: 2, borderRadius: 4, padding: 2, width: "550px", maxWidth: 800 }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default UserList;