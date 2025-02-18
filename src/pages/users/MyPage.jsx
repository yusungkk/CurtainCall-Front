import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDate } from "../../api/userApi.js";
import Info from "./Info";
import Update from "./Update";

const MyPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("info");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserDate(token);
        setUser(response);
      } catch (error) {
        console.error("사용자 정보 요청 중 오류 발생:", error);
        alert("사용자 정보를 가져오는데 실패했습니다.");
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('jwt');
        }
        navigate('/login');
      }
    };

    const token = localStorage.getItem('jwt');
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* 왼쪽 네비게이션 바 */}
      <nav style={{ width: "200px", padding: "20px", borderRight: "1px solid #ddd", height: "100%" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: selectedMenu === "info" ? "#f0f0f0" : "transparent"
            }}
            onClick={() => handleMenuClick("info")}
          >
            내 정보
          </li>
          <li
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor: selectedMenu === "update" ? "#f0f0f0" : "transparent"
            }}
            onClick={() => handleMenuClick("update")}
          >
            회원 정보 수정
          </li>
        </ul>
      </nav>

      {/* 오른쪽 화면 */}
      <div style={{ flex: 1, padding: "20px" }}>
        {selectedMenu === "info" && <Info user={user} />}
        {selectedMenu === "update" && <Update user={user} />}
      </div>
    </div>
  );
};

export default MyPage;