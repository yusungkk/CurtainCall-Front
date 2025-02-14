import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const UpdateUser = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get("/users/myPage");
        setUser({
          email: response.data.email,
          password: "",
          confirmPassword: "",
          name: response.data.name,
          phone: response.data.phone,
        });
      } catch (error) {
        console.error("사용자 정보 요청 중 오류 발생:", error);
        alert("사용자 정보를 가져오는데 실패했습니다.");
      }
    };

    fetchUserData();
  }, [navigate]);

  const validateInputs = () => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
    const nameRegex = /^[가-힣]*$/;
    const phoneRegex = /^010\d{8}$/;

    let isValid = true;

    // 비밀번호 검증
    if (user.password && !passwordRegex.test(user.password)) {
      setPasswordError("영대소문자, 특수문자, 숫자를 포함한 8자 이상 16자 이하여야 합니다.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // 비밀번호 확인 검증
    if (user.password !== user.confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // 이름 검증
    if (!nameRegex.test(user.name)) {
      setNameError("이름은 한글만 입력 가능합니다.");
      isValid = false;
    } else {
      setNameError("");
    }

    // 전화번호 검증
    if (!phoneRegex.test(user.phone)) {
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
      navigate("/");
      return;
    }

    try {
      const response = await axios.put("/users/update", {
        password: user.password,
        name: user.name,
        phone: user.phone,
      });

      if (response.status === 200) {
        alert("회원정보가 수정되었습니다.");
        navigate("/myPage");
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
        value={user.email}
        disabled
      />
      <br />

      <input
        type="password"
        placeholder="비밀번호"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      {passwordError && <p style={{ color: "red", fontSize: "12px" }}>{passwordError}</p>}
      <br />

      <input
        type="password"
        placeholder="비밀번호 확인"
        value={user.confirmPassword}
        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
      />
      {confirmPasswordError && <p style={{ color: "red", fontSize: "12px" }}>{confirmPasswordError}</p>}
      <br />

      <input
        type="text"
        placeholder="이름"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      {nameError && <p style={{ color: "red", fontSize: "12px" }}>{nameError}</p>}
      <br />

      <input
        type="text"
        placeholder="전화번호"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />
      {phoneError && <p style={{ color: "red", fontSize: "12px" }}>{phoneError}</p>}
      <br />

      <button onClick={handleUpdate}>수정하기</button>
    </div>
  );
};

export default UpdateUser;