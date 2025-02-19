import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, getUserList } from "../../api/userApi.js";

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
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h2>전체 유저 목록</h2>
      <ul>
        {users.map((user) => (
          <li key={user.email}>
            <span>{user.name} ({user.email})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;