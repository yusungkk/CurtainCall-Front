import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    TextField,
    Box,
    IconButton,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useCategoryStore from "./useCategoryStore";
import logo from "../../assets/img.png";
import { getUserData, logout } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
    const navigate = useNavigate();
    const { categories, getCategories, loading } = useCategoryStore();
    const [searchText, setSearchText] = useState("");
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // 컴포넌트 마운트 시 카테고리 불러오기
    useEffect(() => {
        getCategories();
        const fetchUserData = async () => {
            try {
                const userData = await getUserData(); // 로그인 여부 확인 로직 수정 예정
                setUser(userData);
            } catch (error) {
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUserData();
    }, [getCategories]);

    const handleSearch = () => {
        alert(`검색어: ${searchText}`);
    };

    const handleCategoryClick = (categoryName) => {
        navigate(`/?genre=${categoryName}`);
    };

    const handleLogout = async () => {
        const confirmed = window.confirm("로그아웃 하시겠습니까?");
        if (confirmed) {
            try {
                const response = await logout();
                setUser(null);
                alert("로그아웃 되었습니다.");
                navigate("/");
                window.location.reload();
            } catch (error) {
                console.error("로그아웃 중 오류 발생:", error);
                alert("로그아웃 요청 중 오류가 발생했습니다.");
                navigate("/");
                window.location.reload();
            }
        }
    };

    return (
        <>
            {/* 상단: 로고, 사이트명 + 검색창, 로그인/회원가입/마이페이지 */}
            <AppBar position="static" color="inherit" sx={{ boxShadow: 0, p: 1, mb: 5 }}>
                <Toolbar sx={{ justifyContent: "space-between", display: "flex" }}>
                    {/* 왼쪽 영역 */}
                    <Box display="flex" alignItems="center" gap={4} sx={{ flex: 1 }}>
                        <img
                            src={logo}
                            alt="Curtaincall Logo"
                            style={{ width: "200px" }}
                            onClick={() => navigate("/")} // 클릭 시 홈으로 이동
                        />
                        {/* 검색창 */}
                        <TextField
                            variant="outlined"
                            size="medium"
                            placeholder="검색어 입력"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            sx={{ width: "400px" }}
                            InputProps={{
                                sx: {
                                    height: "50px",
                                    padding: "5px",
                                },
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
                        {loadingUser ? (
                            <CircularProgress size={20} />
                        ) : user ? (
                            <>
                                <a
                                    href="/myPage"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        fontSize: "18px",
                                    }}
                                >
                                    마이페이지
                                </a>
                                <a
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLogout();
                                    }}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        fontSize: "18px",
                                        cursor: "pointer",
                                    }}
                                >
                                    로그아웃
                                </a>
                            </>
                        ) : (
                            <>
                                <a
                                    href="/login"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        fontSize: "18px",
                                    }}
                                >
                                    로그인
                                </a>
                                <a
                                    href="/join"
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        fontSize: "18px",
                                    }}
                                >
                                    회원가입
                                </a>
                            </>
                        )}
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
                                    handleCategoryClick(cat.name);
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
