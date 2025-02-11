import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("jwt", token);
        navigate("/myPage");
      } else {
        alert("잘못된 이메일이나 비밀번호입니다.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default Login;