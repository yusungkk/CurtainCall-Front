import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "../../styles/users/Join.css";

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

  const checkEmailDuplicate = async (email) => {
    try {
      const response = await axios.get(`/users/check-email?email=${email}`);
      return response.data;
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      return true;
    }
  };

  const validateEmail = async (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setEmailError("올바른 이메일 형식을 입력해 주세요.");
      return false;
    }

    const isDuplicate = await checkEmailDuplicate(value);
    if (isDuplicate) {
      setEmailError("이미 사용 중인 이메일입니다.");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError("비밀번호는 영대소문자, 특수문자, 숫자를 포함한 8자 이상 16자 이하여야 합니다.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const validateName = (value) => {
    const nameRegex = /^[가-힣]*$/;
    if (!nameRegex.test(value)) {
      setNameError("이름은 한글만 입력 가능합니다.");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  const validatePhone = (value) => {
    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("'-' 없이 010으로 시작하는 11자리 전화번호를 입력해 주세요.");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };

  const handleRegister = async () => {
    if (!(await validateEmail(email)) ||
        !validatePassword(password) ||
        !validateConfirmPassword(confirmPassword) ||
        !validateName(name) ||
        !validatePhone(phone)) {
      return;
    }

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
    <div className="register-container">
      <div className="register-box">
        <h2>회원가입</h2>

        <input
          className="register-input"
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <input
          className="register-input"
          type="password"
          placeholder="비밀번호 (8~16자 영어 대소문자, 숫자, 특수문자)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
        />
        {passwordError && <p className="error-message">{passwordError}</p>}

        <input
          className="register-input"
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            validateConfirmPassword(e.target.value);
          }}
        />
        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}

        <input
          className="register-input"
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && <p className="error-message">{nameError}</p>}

        <input
          className="register-input"
          type="text"
          placeholder="휴대폰"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            validatePhone(e.target.value);
          }}
        />
        {phoneError && <p className="error-message">{phoneError}</p>}

        <button
          className="register-button"
          onClick={handleRegister}
          disabled={!!emailError}
        >
          가입완료
        </button>
      </div>
    </div>
  );
};

export default Register;