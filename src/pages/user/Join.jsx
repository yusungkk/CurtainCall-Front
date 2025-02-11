import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

const API_BASE_URL = "http://localhost:8080/api/users";

  const handleRegister = async () => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, phone }),
      mode: "cors",
    });

    if (response.ok) {
      alert("회원가입 성공!");
    } else {
      alert("회원가입 실패!");
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <input type="text" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} /><br />
      <input type="text" placeholder="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} /><br />
      <button onClick={handleRegister}>회원가입</button>
    </div>
  );
};

export default Register;