import { useNavigate } from "react-router-dom";
import { logout } from "../../api/userApi.js";

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
    <div>
      <h2>내 정보</h2>

      <p>이메일: {user.email}</p>
      <p>이름: {user.name}</p>
      <p>전화번호: {user.phone}</p>

      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default Info;