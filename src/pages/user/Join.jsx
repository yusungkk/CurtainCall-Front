import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();

  const validateInputs = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
    const nameRegex = /^[가-힣]*$/;
    const phoneRegex = /^010\d{8}$/;

    let isValid = true;

    // 이메일 검증
    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식을 입력해 주세요.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // 비밀번호 검증
    if (!passwordRegex.test(password)) {
      setPasswordError("영대소문자, 특수문자, 숫자를 포함한 8자 이상 16자 이하여야 합니다.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // 비밀번호 확인 검증
    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // 이름 검증
    if (!nameRegex.test(name)) {
      setNameError("이름은 한글만 입력 가능합니다.");
      isValid = false;
    } else {
      setNameError("");
    }

    // 전화번호 검증
    if (!phoneRegex.test(phone)) {
      setPhoneError("'-' 없이 010으로 시작하는 11자리 전화번호를 입력해 주세요.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post("/users", {
        email,
        password,
        name,
        phone,
      });

      if (response.status === 201) {
        alert("회원가입 성공!");
        navigate("/login");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      if (error.response && error.response.status === 400) {
        alert("이미 사용 중인 이메일입니다.");
      } else {
        alert("회원가입 요청 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <h2>회원가입</h2>

      <input
        type="text"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <p style={{ color: "red", fontSize: "12px" }}>{emailError}</p>}
      <br />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <p style={{ color: "red", fontSize: "12px" }}>{passwordError}</p>}
      <br />

      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {confirmPasswordError && <p style={{ color: "red", fontSize: "12px" }}>{confirmPasswordError}</p>}
      <br />

      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {nameError && <p style={{ color: "red", fontSize: "12px" }}>{nameError}</p>}
      <br />

      <input
        type="text"
        placeholder="전화번호"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {phoneError && <p style={{ color: "red", fontSize: "12px" }}>{phoneError}</p>}
      <br />

      <button onClick={handleRegister}>회원가입</button>
    </div>
  );
};

export default Register;