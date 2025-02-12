import { useEffect, useState } from "react";

const MyPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const API_BASE_URL = "http://localhost:8080/api/users/myPage";

      try {
        const response = await fetch(API_BASE_URL, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("사용자 정보를 가져오는데 실패했습니다.");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("사용자 정보 요청 중 오류 발생:", error);
        alert("사용자 정보를 가져오는데 실패했습니다.");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>내 정보</h2>
      {user ? (
        <div>
          <p>이메일: {user.email}</p>
          <p>이름: {user.name}</p>
          <p>전화번호: {user.phone}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default MyPage;