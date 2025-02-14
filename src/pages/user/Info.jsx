import { useNavigate } from "react-router-dom";

const Info = ({ user }) => {
  const navigate = useNavigate();

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <div>
      <h3>내 정보</h3>
      <p>이메일: {user.email}</p>
      <p>이름: {user.name}</p>
      <p>전화번호: {user.phone}</p>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default Info;