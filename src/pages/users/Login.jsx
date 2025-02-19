import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/userApi.js";
import "../../styles/users/Login.css";
import logo from "../../assets/img.png";

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
      const response = await login({ email, password });
      if (response == 401) {
        alert("잘못된 이메일이나 비밀번호입니다.");
      } else {
        const { role, token } = response;
        document.cookie = `jwt=${token}; path=/; max-age=43200; Secure;`;

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
      alert("로그인 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Curtaincall Logo" className="login-logo" />
        <input
          type="text"
          id="email"
          className="login-input"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          className="login-input"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>
        <p className="signup-prompt">
          회원이 아니신가요?{" "}
          <span className="signup-link" onClick={() => navigate("/join")}>
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;