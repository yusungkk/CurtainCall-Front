import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../api/userApi.js";
import {
  Container, Box, TextField, Button, Typography
} from "@mui/material";

const UpdateUser = ({ user }) => {
  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  const [formData, setFormData] = useState({
    email: user.email,
    password: "",
    confirmPassword: "",
    name: user.name,
    phone: user.phone,
  });

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert("사용자 정보가 없습니다.");
      navigate("/myPage");
    }
  }, [user, navigate]);

  const validateInputs = () => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
    const nameRegex = /^[가-힣]*$/;
    const phoneRegex = /^010\d{8}$/;

    let isValid = true;

    // 비밀번호 검증
    if (formData.password && !passwordRegex.test(formData.password)) {
      setPasswordError("영대소문자, 특수문자, 숫자를 포함한 8자 이상 16자 이하여야 합니다.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // 이름 검증
    if (!nameRegex.test(formData.name)) {
      setNameError("이름은 한글만 입력 가능합니다.");
      isValid = false;
    } else {
      setNameError("");
    }

    // 전화번호 검증
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError("'-' 없이 010으로 시작하는 11자리 전화번호를 입력해 주세요.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateInputs()) return;

    try {
      const response = await updateUser({
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
      });

      if (response.email) {
        alert("회원정보가 수정되었습니다.");
        window.location.reload();
      } else {
        alert("회원정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원정보 수정 중 오류 발생:", error);
      alert("회원정보 수정에 실패했습니다.");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", justifyContent: "center" }}
    >
      <Box
        sx={{
          p: 6,
          bgcolor: "white",
          boxShadow: 2,
          borderRadius: 5,
          textAlign: "center",
          width: "100%",
        }}
      >
        <Typography variant="h4" gutterBottom>
          회원정보 수정
        </Typography>

        <TextField
          label="이메일"
          type="email"
          variant="outlined"
          margin="dense"
          value={formData.email}
          disabled
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
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          label="전화번호"
          type="text"
          variant="outlined"
          margin="dense"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            "&:hover": { bgcolor: "#660000" },
          }}
          onClick={handleUpdate}
          disabled={!!passwordError || !!confirmPasswordError || !!nameError || !!phoneError}
        >
          수정하기
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateUser;