import { useState } from "react";

export default function ProductSearch({ onSearch }) {
  const [inputKeyword, setInputKeyword] = useState("");

  const handleSearch = () => {
    onSearch(inputKeyword);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputKeyword}
        onChange={(e) => setInputKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="상품명 검색"
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
}
