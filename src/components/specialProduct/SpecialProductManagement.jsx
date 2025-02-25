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
import EditSpecialProductDialog from "./EditSpecialProductDialog.jsx";

const BASE_URL = 'http://localhost:8080/api/v1/specialProduct';

// 상태에 대한 한글 라벨 및 색상 매핑
const statusLabels = {
    UPCOMING: '할인 예정',
    ACTIVE: '할인 중',
    DELETED: '할인 종료',
};

const statusColors = {
    UPCOMING: 'orange',
    ACTIVE: 'green',
    DELETED: 'red',
};

const SpecialProductManagement = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [activeProducts, setActiveProducts] = useState([]);
    const [deletedProducts, setDeletedProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 수정 다이얼로그 상태 및 대상 데이터
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

    // 삭제 다이얼로그 상태
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    // 탭 전환 및 페이지 전환 시 데이터 조회
    useEffect(() => {
        if (tabIndex === 0) {
            fetchActiveProducts();
        }
        if (tabIndex === 1) {
            fetchDeletedProducts();
        }
    }, [tabIndex, currentPage]);

    // 활성 특가상품 조회 (페이지네이션 및 검색 적용)
    const fetchActiveProducts = async () => {
        try {
            let url = `${BASE_URL}/search?page=${currentPage}&size=10`;
            if (searchKeyword.trim() !== '') {
                url += `&keyword=${encodeURIComponent(searchKeyword)}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setActiveProducts(data.content);
                setTotalPages(data.totalPages);
            } else {
                const errData = await res.json();
                showAlert(errData.message || '특가상품을 불러오지 못했습니다.', 'error');
            }
        } catch (error) {
            showAlert(error.message || '요청 처리 중 오류가 발생했습니다.', 'error');
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

    // 수정 다이얼로그 열기
    const openEditDialog = (product) => {
        setEditProduct(product);
        setEditDialogOpen(true);
    };

    // 수정 다이얼로그 닫기
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

    // 특가상품 수정 API 호출
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
                const errData = await res.json();
                showAlert(errData.message || '특가상품 수정에 실패했습니다.', 'error');
            }
        } catch (error) {
            showAlert(error.message || '요청 처리 중 오류가 발생했습니다.', 'error');
        }
    };


    // 삭제 다이얼로그 열기
    const openDeleteDialog = (id) => {
        setDeleteProductId(id);
        setDeleteDialogOpen(true);
    };

    // 특가상품 삭제 API 호출 (소프트 삭제)
    const confirmDeleteProduct = async () => {
        try {
            const res = await fetch(`${BASE_URL}/${deleteProductId}`, { method: 'DELETE' });

            if (res.ok) {
                showAlert('특가상품이 삭제되었습니다.');
                fetchActiveProducts();
            } else {
                const errData = await res.json();
                showAlert(errData.message || '특가상품 삭제에 실패했습니다.', 'error');
            }
        } catch (error) {
            showAlert(error.message || '요청 처리 중 오류가 발생했습니다.', 'error');
        } finally {
            setDeleteDialogOpen(false);
            setDeleteProductId(null);
        }
    };

    // 활성 특가상품 승인 API 호출
    const handleApproveProduct = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/approve/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                showAlert('특가상품이 승인되었습니다.');
                fetchActiveProducts();
            } else {
                const errData = await res.json();
                showAlert(errData.message || '승인에 실패했습니다.', 'error');
            }
        } catch (error) {
            showAlert(error.message || '요청 처리 중 오류가 발생했습니다.', 'error');
        }
    };


    // 활성 특가상품 승인 취소 API 호출
    const handleCancelApproveProduct = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/approveCancel/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                showAlert('승인이 취소되었습니다.');
                fetchActiveProducts();
            } else {
                const errData = await res.json();
                showAlert(errData.message || '승인 취소에 실패했습니다.', 'error');
            }
        } catch (error) {
            showAlert(error.message || '요청 처리 중 오류가 발생했습니다.', 'error');
        }
    };


    const showAlert = (message, severity = 'success') => {
        setAlert({ open: true, message, severity });
    };
    const formatDateRange = (start, end) => `${start} ~ ${end}`;

    // 할인 적용 가격 계산 (가격 - (가격 * 할인율/100))
    const calcDiscountedPrice = (price, discountRate) => {
        if (!price || !discountRate) return '';
        return (price * (1 - discountRate / 100)).toLocaleString() + '원';
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value - 1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(0);
            fetchActiveProducts();
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                특가상품 관리
            </Typography>

            <Tabs
                value={tabIndex}
                onChange={(e, newValue) => setTabIndex(newValue)}
                sx={{ mb: 2 }} // 탭과 검색창 사이의 간격 조정
            >
                <Tab label="특가상품" />
                <Tab label="삭제된 특가상품" />
            </Tabs>
            {/* 검색 영역 */}
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
                            setCurrentPage(0);
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <Button variant="contained" color="primary" size="small" onClick={fetchActiveProducts}>
                        검색
                    </Button>
                </Box>
                <Link to="/admin/special-products/new" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary" size="small">
                        특가상품 등록
                    </Button>
                </Link>
            </Box>



            {/* 활성 특가상품 목록 */}
            {tabIndex === 0 && (
                <Box sx={{ mt: 2 }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#eeeeee' }}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>상품 이름</TableCell>
                                    <TableCell>가격</TableCell>
                                    <TableCell>할인율</TableCell>
                                    <TableCell>할인적용된 금액</TableCell>
                                    <TableCell>적용기간</TableCell>
                                    <TableCell>상태</TableCell>
                                    <TableCell>승인</TableCell>
                                    <TableCell align="center">관리</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activeProducts.map((specialProductDto) => (
                                    <TableRow key={specialProductDto.specialProductId}>
                                        <TableCell>{specialProductDto.specialProductId}</TableCell>
                                        <TableCell>{specialProductDto.productName}</TableCell>
                                        <TableCell>{specialProductDto.price?.toLocaleString() + '원'}</TableCell>
                                        <TableCell>{specialProductDto.discountRate}%</TableCell>
                                        <TableCell>{calcDiscountedPrice(specialProductDto.price, specialProductDto.discountRate)}</TableCell>
                                        <TableCell>{formatDateRange(specialProductDto.discountStartDate, specialProductDto.discountEndDate)}</TableCell>
                                        <TableCell>
                                            <Typography style={{ color: statusColors[specialProductDto.status] }}>
                                                {statusLabels[specialProductDto.status]}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {specialProductDto.status === 'UPCOMING' ? (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleApproveProduct(specialProductDto.specialProductId)}
                                                >
                                                    승인
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    size="small"
                                                    onClick={() => handleCancelApproveProduct(specialProductDto.specialProductId)}
                                                >
                                                    승인 취소
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton color="secondary" size="small" onClick={() => openEditDialog(specialProductDto)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={() => openDeleteDialog(specialProductDto.specialProductId)}>
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

            {/* 삭제된 특가상품 목록 */}
            {tabIndex === 1 && (
                <Box sx={{ mt: 2 }}>
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
                                    <TableCell>승인</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deletedProducts.map((product) => (
                                    <TableRow key={product.specialProductId}>
                                        <TableCell>{product.specialProductId}</TableCell>
                                        <TableCell>{product.productName}</TableCell>
                                        <TableCell>{product.price?.toLocaleString() + '원'}</TableCell>
                                        <TableCell>{product.discountRate}%</TableCell>
                                        <TableCell>{calcDiscountedPrice(product.price, product.discountRate)}</TableCell>
                                        <TableCell>{formatDateRange(product.discountStartDate, product.discountEndDate)}</TableCell>
                                        <TableCell>
                                            <Typography style={{ color: statusColors.DELETED }}>
                                                {statusLabels.DELETED}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* 수정 다이얼로그 */}
            <EditSpecialProductDialog
                open={editDialogOpen}
                onClose={closeEditDialog}
                product={editProduct}
                setProduct={setEditProduct}
                onUpdate={handleUpdateProduct}
            />




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
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SpecialProductManagement;
