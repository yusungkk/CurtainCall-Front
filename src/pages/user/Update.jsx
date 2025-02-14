import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

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

    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put("/users/update", {
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
      });

      if (response.status === 200) {
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
    <div>
      <h2>회원정보 수정</h2>

      <input
        type="text"
        value={formData.email}
        disabled
      />
      <br />

      <input
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {passwordError && <p style={{ color: "red", fontSize: "12px" }}>{passwordError}</p>}
      <br />

      <input
        type="password"
        placeholder="비밀번호 확인"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
      />
      {confirmPasswordError && <p style={{ color: "red", fontSize: "12px" }}>{confirmPasswordError}</p>}
      <br />

      <input
        type="text"
        placeholder="이름"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {nameError && <p style={{ color: "red", fontSize: "12px" }}>{nameError}</p>}
      <br />

      <input
        type="text"
        placeholder="전화번호"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      {phoneError && <p style={{ color: "red", fontSize: "12px" }}>{phoneError}</p>}
      <br />

      <button onClick={handleUpdate}>수정하기</button>
    </div>
  );
};

export default UpdateUser;