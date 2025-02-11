import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch("/api/users/myPage", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => alert("사용자 정보를 가져오는데 실패했습니다."));
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

export default Profile;