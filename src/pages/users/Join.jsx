import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEmailDuplicate, createUser } from "../../api/userApi.js";
import {
  Container, Box, TextField, Button, Typography
} from "@mui/material";
import logo from "../../assets/img.png";

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
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const validateName = (value) => {
    const nameRegex = /^[가-힣]*$/;
    if (!nameRegex.test(value)) {
      setNameError("이름은 한글만 입력 가능합니다.");
      return false;
    }
    setNameError("");
    return true;
  };

  const validatePhone = (value) => {
    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("'-' 없이 010으로 시작하는 11자리 전화번호를 입력해 주세요.");
      return false;
    }
    setPhoneError("");
    return true;
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
      const response = await createUser({ email, password, name, phone });

      if (response === 201) {
        alert("회원가입 성공!");
        navigate("/login");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("회원가입 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "calc(100vh - 4rem)", justifyContent: "center" }}
    >
      <Box
        sx={{
          p: 6,
          boxShadow: 2,
          borderRadius: 5,
          textAlign: "center",
          width: "100%"
        }}
      >
        <img src={logo} alt="Curtaincall Logo" onClick={() => navigate("/")} className="login-logo" style={{ width: '260px', cursor: 'pointer' }} />

        <TextField
          label="이메일"
          type="email"
          variant="outlined"
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          sx={{ width: "400px", mt: 4 }}
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="비밀번호"
          type="password"
          variant="outlined"
          margin="dense"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          error={!!passwordError}
          helperText={passwordError}
          sx={{ width: "400px", mt: 3 }}
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="비밀번호 확인"
          type="password"
          variant="outlined"
          margin="dense"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            validateConfirmPassword(e.target.value);
          }}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
          sx={{ width: "400px", mt: 3 }}
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="이름"
          type="text"
          variant="outlined"
          margin="dense"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => validateName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
          sx={{ width: "400px", mt: 3 }}
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        />

        <TextField
          label="휴대폰 번호"
          type="text"
          variant="outlined"
          margin="dense"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            validatePhone(e.target.value);
          }}
          error={!!phoneError}
          helperText={phoneError}
          sx={{ width: "400px", mt: 3 }}
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        />

        <Button
          variant="contained"
          sx={{
            mt: 3,
            borderRadius: 2,
            width: "400px",
            height: "56px",
            bgcolor: "#800000",
            fontSize: "1.1rem",
            "&:hover": { bgcolor: "#660000" }
          }}
          onClick={handleRegister}
          disabled={!!emailError || !!passwordError || !!confirmPasswordError || !!nameError || !!phoneError}
        >
          회원가입
        </Button>
      </Box>
    </Container>
  );
};

export default Register;