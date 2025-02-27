import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    TextField,
    Box,
    IconButton,
    InputAdornment,
    CircularProgress,
    Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/img.png";
import { getUserData, logout, getUserRole } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { getActiveCategories } from "../../api/categoryApi.js";

const NavigationBar = ({setActive, setRole}) => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [role, setRole] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // 컴포넌트 마운트 시 카테고리 및 사용자 데이터 불러오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserData(); // 로그인 여부 확인
                if (userData === 403) {
                    setUser(null);
                } else {
                    setUser(userData);
                    const userRole = await getUserRole();
                    setRole(userRole);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };

        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const data = await getActiveCategories();
                if (data) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchUserData();
        fetchCategories();
    }, []);


    // 검색 기능
    const handleSearch = () => {
        alert(`검색어: ${searchText}`);
    };

    const handleCategoryClick = (categoryName) => {
        navigate(`/?genre=${categoryName}`);
    };

    // 로그아웃 처리
    const handleLogout = async () => {
        const confirmed = window.confirm("로그아웃 하시겠습니까?");
        if (confirmed) {
            try {
                await logout();
                setUser(null);
                setActive(false);
                setRole("ANONYMOUS");
                window.sessionStorage.removeItem("toggleActive");
                window.sessionStorage.removeItem("wsConnected");
                window.sessionStorage.removeItem("roomId");
                alert("로그아웃 되었습니다.");
                navigate("/");
            } catch (error) {
                console.error("로그아웃 중 오류 발생:", error);
                alert("로그아웃 요청 중 오류가 발생했습니다.");
                window.location.reload();
            }
        }
    };

    return (
        <>
            {/* 상단: 로고, 검색창, 로그인/회원가입/마이페이지 */}
            <AppBar position="static" color="inherit" sx={{ boxShadow: 0, mb: 3 }}>
                <Toolbar sx={{ justifyContent: "space-between", display: "flex" }}>
                    {/* 왼쪽 영역 */}
                    <Box display="flex" alignItems="center" gap={4} sx={{ flex: 1 }}>
                        <img
                            src={logo}
                            alt="Curtaincall Logo"
                            style={{ width: "200px", marginLeft: "-16px" }}
                            onClick={() => navigate("/")}
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
                                    href={role ? "/admin" : "/myPage"}
                                    style={{ textDecoration: "none", color: "inherit", fontSize: "20px" }}
                                >
                                    {role ? "관리자 페이지" : "마이페이지"}
                                </a>
                                <a
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLogout();
                                    }}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                        fontSize: "20px",
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
                                    style={{ textDecoration: "none", color: "inherit", fontSize: "20px" }}
                                >
                                    로그인
                                </a>
                                <a
                                    href="/join"
                                    style={{ textDecoration: "none", color: "inherit", fontSize: "20px" }}
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
                gap={4}
                sx={{ p: 1, mb: 3, ml: 0.5 }}
            >
                {loadingCategories ? (
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
                                    fontSize: "24px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    position: "relative",
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

            <Divider sx={{ position: "absolute", left: 0, right: 0, bgcolor: "#e0e0e0", height: "1px", mb: 7 }} />
        </>
    );
};

export default NavigationBar;
