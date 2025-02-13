import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/users/myPage');
        setUser(response.data);
      } catch (error) {
        console.error("사용자 정보 요청 중 오류 발생:", error);
        alert("사용자 정보를 가져오는데 실패했습니다.");
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('jwt');
          navigate('/');
        }
      }
    };

    const token = localStorage.getItem('jwt');
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/');
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleUpdate = () => {
    navigate("/update");
  };

  return (
    <div>
      <h2>내 정보</h2>
      {user ? (
        <div>
          <p>이메일: {user.email}</p>
          <p>이름: {user.name}</p>
          <p>전화번호: {user.phone}</p>
          <button onClick={handleUpdate}>수정</button>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default MyPage;