import { useState } from "react";

import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
                label="상품 검색"
                variant="outlined"
                size="small"
                sx={{ width: 350 }}
                type="text"
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon onClick={handleSearch} sx={{ cursor: "default" }} />
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Box>
    );
}
