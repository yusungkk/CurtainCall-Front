import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../api/userApi.js";
import logo from "../../assets/img.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
        const { role } = response;
        const { from } = location.state || { from: "/myPage" };

        if (role === "ADMIN") {
          alert("관리자로 로그인 성공.");
          navigate("/admin");
          window.location.reload();
        } else {
          navigate(from, { replace: true });
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <img
          src={logo}
          alt="Curtaincall Logo"
          onClick={() => navigate("/")}
          style={styles.loginLogo}
        />
        <input
          type="text"
          id="email"
          style={styles.loginInput}
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          style={styles.loginInput}
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.loginButton} onClick={handleLogin}>
          로그인
        </button>
        <p style={styles.signupPrompt}>
          회원이 아니신가요?{" "}
          <span style={styles.signupLink} onClick={() => navigate("/join")}>
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 4rem)"
  },
  loginBox: {
    backgroundColor: "white",
    padding: "2.2rem 3rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "370px",
    textAlign: "center"
  },
  loginInput: {
    width: "95%",
    padding: "0.8rem",
    margin: "0.5rem 0",
    border: "1px solid #ccc",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none"
  },
  loginButton: {
    width: "95%",
    padding: "0.8rem",
    marginTop: "1rem",
    backgroundColor: "#800000",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontFamily: '"BMJUA", sans-serif',
    fontSize: "1.3rem",
    cursor: "pointer",
    transition: "background 0.3s"
  },
  loginButtonHover: {
    backgroundColor: "#660000"
  },
  loginLogo: {
    width: "260px",
    marginBottom: "1rem",
    cursor: "pointer"
  },
  signupPrompt: {
    marginTop: "14px",
    fontSize: "14px",
    color: "#888",
    textAlign: "center"
  },
  signupLink: {
    color: "#800000",
    textDecoration: "underline",
    cursor: "pointer"
  }
};

export default Login;