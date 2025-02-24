import { useEffect, useState } from "react";
import { getUserList, activate, deactivate, searchUsers } from "../../api/userApi.js";
import {
  Container,
  CircularProgress,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = searchKeyword
          ? await searchUsers(searchKeyword, page - 1, 10)
          : await getUserList(page - 1, 10);
        setUsers(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("유저 목록을 가져오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchKeyword]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

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
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2, pb: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* 검색 창 */}
      <TextField
        placeholder="이름 또는 이메일로 검색"
        variant="outlined"
        fullWidth
        value={searchKeyword}
        onChange={handleSearchChange}
        sx={{ mb: 2, maxWidth: 800, margin: "0 auto" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* 유저 리스트 */}
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "0 auto", mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>이름</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>이메일</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                상태 변경
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} sx={{ borderBottom: "1px solid #e0e0e0" }}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color={user.active ? "error" : "success"}
                    onClick={() => handleToggleActivation(user)}
                    sx={{ minWidth: "80px" }}
                  >
                    {user.active ? "비활성화" : "활성화"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 페이지네이션 */}
      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
        sx={{ mt: 5, display: "flex", justifyContent: "center" }}
        color="primary"
      />
    </Container>
  );
};

export default UserList;