import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

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
      const response = await axios.post("/users/login", { email, password });

      if (response.status === 200) {
        const { role, token } = response.data;
        localStorage.setItem("jwt", token);

        if(role === "ADMIN") {
          alert("관리자로 로그인 성공.");
          navigate("/admin");
        } else {
          alert("로그인 성공!");
          navigate("/myPage");
        }
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      if (error.response && error.response.status === 401) {
        alert("잘못된 이메일이나 비밀번호입니다.");
      } else {
        alert("로그인 요청 중 오류가 발생했습니다.");
      }
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