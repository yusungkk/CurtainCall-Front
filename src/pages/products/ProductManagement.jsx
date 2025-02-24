import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetcher } from "../../utils/fetcher";
import { PRODUCT_URL } from "../../utils/endpoint";
import { deleteProduct } from "../../api/productApi";

import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ProductSearch from "../../components/products/ProductSearch";

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
  }, [
    currentPage,
    isSearchMode,
    keyword,
    sortBy,
    startDateDirection,
    endDateDirection,
  ]);

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
      setStartDateDirection((preDirection) =>
        preDirection === "asc" ? "desc" : "asc"
      );
    } else if (column === "endDate") {
      setEndDateDirection((preDirection) =>
        preDirection === "asc" ? "desc" : "asc"
      );
    }

    setCurrentPage(0);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box>
        <ProductSearch onSearch={handleSearch} />

        <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            color="secondary"
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="/admin/products/new">
            <Button variant="contained" color="secondary">
              상품 등록
            </Button>
          </Link>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>no</TableCell>
                  <TableCell>포스터</TableCell>
                  <TableCell>제목</TableCell>
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
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.place}</TableCell>
                    <TableCell>{product.startDate}</TableCell>
                    <TableCell>{product.endDate}</TableCell>
                    <TableCell>
                      <Link to={`/admin/products/${product.productId}/edit`}>
                        <IconButton color="secondary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
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
      </Box>
    </Box>
  );
}

export default ProductManagement;
