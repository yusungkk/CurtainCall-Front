import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetcher } from "/src/utils/fetcher";
import { PRODUCT_URL } from "/src/utils/endpoint";
import { deleteProduct } from "/src/api/productApi";

import {
    Box,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    Tooltip,
    Typography,
    TableRow,
    TableCell,
    Button,
    Pagination,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ProductSearch from "/src/components/products/ProductSearch";

function ProductManagement() {
    let url;
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [sortBy, setSortBy] = useState(null);
    const [startDateDirection, setStartDateDirection] = useState("desc");
    const [endDateDirection, setEndDateDirection] = useState("desc");

    const getProducts = async (page, size) => {
        if (isSearchMode) {
            url = `${PRODUCT_URL}/search?keyword=${keyword}&page=${page}&size=${size}`;
        } else {
            url = `${PRODUCT_URL}?page=${page}&size=${size}`;
        }

        if (sortBy === "startDate") {
            url += `&sortBy=${sortBy}&direction=${startDateDirection}`;
        } else if (sortBy === "endDate") {
            url += `&sortBy=${sortBy}&direction=${endDateDirection}`;
        }

        const response = await fetcher(url);

        setProducts(response.content);
        setTotalPages(response.totalPages);
    };

    useEffect(() => {
        getProducts(currentPage, 10);
    }, [currentPage, isSearchMode, keyword, sortBy, startDateDirection, endDateDirection]);

    const handleProductDelete = async (productId) => {
        const responseStatus = await deleteProduct(productId);

        if (responseStatus === 204) {
            alert("상품이 삭제되었습니다");
            getProducts(0, 10);
        }
    };

    const handleSearch = (searchKeyword) => {
        setSortBy(null);
        setKeyword(searchKeyword);
        setIsSearchMode(true);
        setCurrentPage(0);
    };

    const handlePageChange = (e, page) => {
        setCurrentPage(page - 1);
    };

    const handleSort = (column) => {
        setSortBy(column);
        if (column === "startDate") {
            setStartDateDirection((preDirection) => (preDirection === "asc" ? "desc" : "asc"));
        } else if (column === "endDate") {
            setEndDateDirection((preDirection) => (preDirection === "asc" ? "desc" : "asc"));
        }

        setCurrentPage(0);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", padding: "32px 24px" }}>
            <Box>
                <Box
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                    <ProductSearch onSearch={handleSearch} />
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Link to="/admin/products/new">
                            <Button sx={{ background: "#800000" }} variant="contained" size="small">
                                상품 등록
                            </Button>
                        </Link>
                    </Box>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>포스터</TableCell>
                                    <TableCell>상품명</TableCell>
                                    <TableCell>장소</TableCell>
                                    <TableCell
                                        onClick={() => handleSort("startDate")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        시작일 {startDateDirection === "asc" ? "▼" : "▲"}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => handleSort("endDate")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        종료일 {endDateDirection === "asc" ? "▼" : "▲"}
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.productId}>
                                        <TableCell>{product.productId}</TableCell>
                                        <TableCell>
                                            <img
                                                src={product.productImageUrl}
                                                alt={product.productName}
                                                style={{ width: "50px" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip
                                                title={product.productName}
                                                enterDelay={500}
                                                leaveDelay={200}
                                                sx={{
                                                    fontSize: "1.2rem", // 툴팁 텍스트 크기
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        width: "130px", // 11자 정도에 맞게 너비 설정
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {product.productName}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{product.place}</TableCell>
                                        <TableCell>{product.startDate}</TableCell>
                                        <TableCell>{product.endDate}</TableCell>
                                        <TableCell>
                                            <Link to={`/admin/products/${product.productId}/edit`}>
                                                <IconButton color="action">
                                                    <EditIcon />
                                                </IconButton>
                                            </Link>
                                            <IconButton
                                                color="action"
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            `"${product.productName}"을(를) 삭제하시겠습니까?`
                                                        )
                                                    ) {
                                                        handleProductDelete(product.productId);
                                                    }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage + 1}
                        onChange={handlePageChange}
                        sx={{
                            "& .MuiPaginationItem-page.Mui-selected": {
                                backgroundColor: "#800000",
                                color: "#ffffff",
                            },

                            "& .MuiPaginationItem-page": {
                                color: "#555555",
                                "&:hover": {
                                    backgroundColor: "#F5F5F5",
                                },
                            },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default ProductManagement;
