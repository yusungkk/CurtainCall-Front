import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Container,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Box,
    Typography,
    Button,
    Pagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BASE_URL = 'http://localhost:8080/api/v1/specialProduct';

const SpecialProductManagement = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [activeProducts, setActiveProducts] = useState([]);
    const [deletedProducts, setDeletedProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    // 페이지네이션 상태 (검색 버튼 클릭 또는 페이지 전환 시 검색 실행)
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editProduct, setEditProduct] = useState({
        specialProductId: '',
        productName: '',
        startDate: '',
        endDate: '',
        discountRate: '',
        discountStartDate: '',
        discountEndDate: '',
        price: '',
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    // useEffect는 탭 전환 또는 페이지 전환 시에만 실행됩니다.
    useEffect(() => {
        if (tabIndex === 0) {
            fetchActiveProducts();
        }
        if (tabIndex === 1) {
            fetchDeletedProducts();
        }
    }, [tabIndex, currentPage]);

    // 활성 특가상품 조회 (검색은 버튼이나 엔터 시에만 실행)
    const fetchActiveProducts = async () => {
        try {
            let url = `${BASE_URL}/search?page=${currentPage}&size=10`;
            if (searchKeyword.trim() !== '') {
                url += `&keyword=${encodeURIComponent(searchKeyword)}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                // Page 객체 구조: { content: [...], totalPages: 숫자, ... }
                setActiveProducts(data.content);
                setTotalPages(data.totalPages);
            } else {
                throw new Error('특가상품을 불러오지 못했습니다.');
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    };

    // 삭제된 특가상품 조회 (전체 조회)
    const fetchDeletedProducts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/findAllDeleted`);
            if (res.ok) {
                const data = await res.json();
                setDeletedProducts(data);
            } else {
                throw new Error('삭제된 특가상품을 불러오지 못했습니다.');
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    };

    const openEditDialog = (product) => {
        setEditProduct(product);
        setEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setEditDialogOpen(false);
        setEditProduct({
            specialProductId: '',
            productName: '',
            startDate: '',
            endDate: '',
            discountRate: '',
            discountStartDate: '',
            discountEndDate: '',
            price: '',
        });
    };

    const handleUpdateProduct = async () => {
        if (
            !editProduct.productName.trim() ||
            !editProduct.startDate ||
            !editProduct.endDate ||
            !editProduct.discountRate ||
            !editProduct.discountStartDate ||
            !editProduct.discountEndDate ||
            !editProduct.price
        ) {
            showAlert('모든 필드를 입력하세요.', 'error');
            return;
        }
        try {
            const res = await fetch(BASE_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editProduct),
            });
            if (res.ok) {
                showAlert('특가상품이 수정되었습니다.');
                closeEditDialog();
                fetchActiveProducts();
            } else {
                throw new Error('특가상품 수정에 실패했습니다.');
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    };

    const openDeleteDialog = (id) => {
        setDeleteProductId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteProduct = async () => {
        try {
            const res = await fetch(`${BASE_URL}/${deleteProductId}`, { method: 'DELETE' });
            if (res.ok) {
                showAlert('특가상품이 삭제되었습니다.');
                fetchActiveProducts();
            } else {
                throw new Error('특가상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            showAlert(error.message, 'error');
        } finally {
            setDeleteDialogOpen(false);
            setDeleteProductId(null);
        }
    };

    const handleRestoreProduct = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/restore/${id}`, { method: 'PUT' });
            if (res.ok) {
                showAlert('특가상품이 복구되었습니다.');
                fetchDeletedProducts();
                fetchActiveProducts();
            } else {
                throw new Error('특가상품 복구에 실패했습니다.');
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    };

    const showAlert = (message, severity = 'success') => {
        setAlert({ open: true, message, severity });
    };

    const formatDateRange = (start, end) => `${start} ~ ${end}`;

    // 할인된 가격 계산 (가격 - (가격 * 할인율/100))
    const calcDiscountedPrice = (price, discountRate) => {
        if (!price || !discountRate) return '';
        return (price * (1 - discountRate / 100)).toLocaleString() + '원';
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value - 1);
    };

    // 엔터키 입력 시 검색 실행
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // 현재 페이지를 0으로 초기화하고 검색 실행
            setCurrentPage(0);
            fetchActiveProducts();
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                특가상품 관리
            </Typography>

            {/* 검색 영역: 검색창, 검색 버튼, 특가상품 등록 버튼 한 줄에 배치 */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                        label="특가상품 검색"
                        variant="outlined"
                        size="small"
                        sx={{ width: 250 }}
                        value={searchKeyword}
                        onChange={(e) => {
                            setSearchKeyword(e.target.value);
                            // 입력 시 자동 검색하지 않고, 페이지는 0으로 초기화
                            setCurrentPage(0);
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <Button variant="contained" color="primary" size="small" onClick={fetchActiveProducts}>
                        검색
                    </Button>
                </Box>
                <Link to="/admin/special-products/new" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="secondary" size="small">
                        특가상품 등록
                    </Button>
                </Link>
            </Box>

            <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
                <Tab label="특가상품" />
                <Tab label="삭제된 특가상품" />
            </Tabs>

            {tabIndex === 0 && (
                <Box sx={{ mt: 2 }}>
                    {/* 활성 특가상품 리스트 */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#eeeeee' }}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>상품 이름</TableCell>
                                    <TableCell>가격</TableCell>
                                    <TableCell>할인율</TableCell>
                                    <TableCell>할인된 가격</TableCell>
                                    <TableCell>할인 기간</TableCell>
                                    <TableCell align="center">관리</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activeProducts.map((product) => (
                                    <TableRow key={product.specialProductId}>
                                        <TableCell>{product.specialProductId}</TableCell>
                                        <TableCell>{product.productName}</TableCell>
                                        <TableCell>{product.price?.toLocaleString() + '원'}</TableCell>
                                        <TableCell>{product.discountRate}%</TableCell>
                                        <TableCell>{calcDiscountedPrice(product.price, product.discountRate)}</TableCell>
                                        <TableCell>
                                            {formatDateRange(product.discountStartDate, product.discountEndDate)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton color="secondary" size="small" onClick={() => openEditDialog(product)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={() => openDeleteDialog(product.specialProductId)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 페이지네이션 */}
                    <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
                        <Pagination count={totalPages} page={currentPage + 1} onChange={handlePageChange} color="secondary" size="small" />
                    </Box>
                </Box>
            )}

            {tabIndex === 1 && (
                <Box sx={{ mt: 2 }}>
                    {/* 삭제된 특가상품 리스트 */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#eeeeee' }}>
                                    <TableCell sx={{ width: '3%' }}>ID</TableCell>
                                    <TableCell sx={{ width: '20%' }}>상품 이름</TableCell>
                                    <TableCell>가격</TableCell>
                                    <TableCell>할인율</TableCell>
                                    <TableCell>할인된 가격</TableCell>
                                    <TableCell>할인 기간</TableCell>
                                    <TableCell align="center">관리</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deletedProducts.map((product) => (
                                    <TableRow key={product.specialProductId}>
                                        <TableCell sx={{ width: '10%' }}>{product.specialProductId}</TableCell>
                                        <TableCell sx={{ width: '20%' }}>{product.productName}</TableCell>
                                        <TableCell>{product.price?.toLocaleString() + '원'}</TableCell>
                                        <TableCell>{product.discountRate}%</TableCell>
                                        <TableCell>{calcDiscountedPrice(product.price, product.discountRate)}</TableCell>
                                        <TableCell>
                                            {formatDateRange(product.discountStartDate, product.discountEndDate)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" size="small" onClick={() => handleRestoreProduct(product.specialProductId)}>
                                                복구
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}


            {/* 수정 다이얼로그 */}
            <Dialog open={editDialogOpen} onClose={closeEditDialog}>
                <DialogTitle>특가상품 수정</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                        <TextField
                            label="상품 이름"
                            value={editProduct.productName}
                            onChange={(e) => setEditProduct({ ...editProduct, productName: e.target.value })}
                        />
                        <TextField
                            type="number"
                            label="가격"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                        />
                        <TextField
                            type="date"
                            label="할인 시작일"
                            value={editProduct.discountStartDate}
                            onChange={(e) => setEditProduct({ ...editProduct, discountStartDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            type="date"
                            label="할인 종료일"
                            value={editProduct.discountEndDate}
                            onChange={(e) => setEditProduct({ ...editProduct, discountEndDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            type="number"
                            label="할인율(%)"
                            value={editProduct.discountRate}
                            onChange={(e) => setEditProduct({ ...editProduct, discountRate: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleUpdateProduct}>
                        수정
                    </Button>
                    <Button onClick={closeEditDialog}>취소</Button>
                </DialogActions>
            </Dialog>

            {/* 삭제 확인 다이얼로그 */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>특가상품 삭제 확인</DialogTitle>
                <DialogContent>
                    <Typography>정말로 삭제하시겠습니까?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={confirmDeleteProduct}>
                        삭제
                    </Button>
                    <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }} // 📌 Snackbar를 상단 중앙에 배치
            >
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
                    {alert.message}
                </Alert>
            </Snackbar>

        </Container>
    );
};

export default SpecialProductManagement;
