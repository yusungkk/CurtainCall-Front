import { useState } from "react";

import { Box, Button, TextField } from "@mui/material";

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
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
      <TextField
        variant="outlined"
        size="small"
        type="text"
        value={inputKeyword}
        onChange={(e) => setInputKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="상품명 검색"
      />
      <Button onClick={handleSearch} variant="contained" color="secondary">
        검색
      </Button>
    </Box>
  );
}
