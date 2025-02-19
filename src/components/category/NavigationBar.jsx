import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Box,
    IconButton,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useCategoryStore from "./useCategoryStore";

const NavigationBar = () => {
    const { categories, getCategories, loading } = useCategoryStore();
    const [searchText, setSearchText] = useState("");

    // 컴포넌트 마운트 시 카테고리 불러오기
    useEffect(() => {
        getCategories();
    }, [getCategories]);

    const handleSearch = () => {
        alert(`검색어: ${searchText}`);
    };

    const handleCategoryClick = (categoryId) => {
        alert(`카테고리 #${categoryId} 클릭!`);
    };

    return (
        <>
            {/* 상단: 로고, 사이트명 + 검색창, 로그인/회원가입/마이페이지 */}
            <AppBar position="static" color="inherit" sx={{ boxShadow: 0, p: 1 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    {/* 왼쪽 영역 */}
                    <Box display="flex" alignItems="center" gap={2}>
                        <img src="/logo.png" alt="CurtainCall Logo" style={{ height: "40px" }} />
                        <Typography variant="h6" color="primary">
                            CurtainCall
                        </Typography>
                        {/* 검색창 */}
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="검색어 입력"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            sx={{ width: "200px" }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleSearch}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* 오른쪽 영역 */}
                    <Box display="flex" gap={2}>
                        <a
                            href="/login"
                            style={{ textDecoration: "none", color: "inherit", fontSize: "14px" }}
                        >
                            로그인
                        </a>
                        <a
                            href="/signup"
                            style={{ textDecoration: "none", color: "inherit", fontSize: "14px" }}
                        >
                            회원가입
                        </a>
                        <a
                            href="/mypage"
                            style={{ textDecoration: "none", color: "inherit", fontSize: "14px" }}
                        >
                            마이페이지
                        </a>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* 하단: 최상위 카테고리 링크 */}
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
                gap={2}
                sx={{ p: 1 }}
            >
                {loading ? (
                    <CircularProgress size={20} />
                ) : (
                    categories
                        .filter((cat) => cat.parentId == null)
                        .map((cat) => (
                            <Box
                                key={cat.id}
                                component="a"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCategoryClick(cat.id);
                                }}
                                sx={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    fontSize: "1em",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    position: "relative",
                                    // Hover 시 밑줄 효과: pseudo-element 사용
                                    "&:hover::after": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: "-2px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "100%",
                                        height: "2px",
                                        bgcolor: "currentColor",
                                    },
                                }}
                            >
                                {cat.name}
                            </Box>
                        ))
                )}
            </Box>
        </>
    );
};

export default NavigationBar;
