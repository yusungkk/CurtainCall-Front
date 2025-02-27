import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert
} from "@mui/material";
import {registerSpecialProduct, searchProducts} from "../../api/specialProductApi.js";

const RegisterSpecialProductDialog = ({ open, onClose, onRegister }) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [discountStartDate, setDiscountStartDate] = useState("");
    const [discountEndDate, setDiscountEndDate] = useState("");
    const [discountRate, setDiscountRate] = useState("");

    // Snackbar 상태
    const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" });

    // showAlert 함수: 내부에서 직접 생성
    const showAlert = (message, severity = "success") => {
        setAlertState({ open: true, message, severity });
    };

    const handleAlertClose = () => {
        setAlertState({ ...alertState, open: false });
    };

    // 🔍 상품 검색 API 호출
    const handleSearch = async () => {
        if (!searchKeyword.trim()) return;

        const response = await searchProducts(searchKeyword);

        // 응답이 비어있거나 error가 있을 때 처리
        if (response?.error) {
            showAlert(response.error, "error");
            return;
        }

        // response가 배열인지 확인 후, 배열일 경우만 상태 업데이트
        if (Array.isArray(response)) {
            setSearchResults(response); // 페이지네이션 대응
        } else {
            showAlert("검색 결과가 없습니다.", "warning");
        }
    };


    // 🟢 상품 선택 시 정보 설정
    const handleProductSelect = (product) => {
        setSelectedProduct(product);
    };

    // 특가상품 등록 API 호출
    const handleRegister = async () => {
        if (!selectedProduct || !discountStartDate || !discountEndDate || !discountRate) {
            showAlert("모든 필드를 입력하세요.", "warning");
            return;
        }

        const newSpecialProduct = {
            productId: selectedProduct.productId,
            productName: selectedProduct.productName,
            price: selectedProduct.price,
            startDate: selectedProduct.startDate,
            endDate: selectedProduct.endDate,
            place: selectedProduct.place,
            runningTime: selectedProduct.runningTime,
            discountStartDate,
            discountEndDate,
            discountRate: parseInt(discountRate, 10),
            status: "UPCOMING", // 기본값 설정
        };

        const response = await registerSpecialProduct(newSpecialProduct);

        if (response?.error) {
            showAlert(response.error, "error");
            return;
        }

        showAlert("특가상품이 등록되었습니다.", "success");
        onRegister(); // 등록 후 목록 갱신
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth>
                <DialogTitle>특가상품 등록</DialogTitle>
                <DialogContent>
                    {/* 🔍 검색 필드 */}
                    <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}> {/* `mt: 2` 추가 */}
                        <TextField
                            label="상품 검색"
                            variant="outlined"
                            size="small"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch(); // Enter 키 입력 시 검색 실행
                                }
                            }}
                            fullWidth
                        />

                        <Button variant="outlined" onClick={handleSearch}>
                            검색
                        </Button>
                    </Box>

                    {/* 🔍 검색 결과 리스트 */}
                    {searchResults.length > 0 ? (
                        <List sx={{ maxHeight: 200, overflowY: "auto", border: "1px solid #ddd", borderRadius: 1 }}>
                            {searchResults.map((product) => (
                                <ListItem
                                    button
                                    key={product.productId}
                                    onClick={() => handleProductSelect(product)}
                                >
                                    <ListItemText
                                        primary={product.productName}
                                        secondary={`가격: ${product.price.toLocaleString()}원`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        searchKeyword && <Typography color="textSecondary">검색 결과가 없습니다.</Typography>
                    )}

                    {/* 🟢 선택한 상품 정보 표시 */}
                    {selectedProduct && (
                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <Typography variant="h6">{selectedProduct.productName}</Typography>
                            <Typography>📌 가격: {selectedProduct.price.toLocaleString()}원</Typography>
                            <Typography>📌 장소: {selectedProduct.place}</Typography>
                            <Typography>📌 러닝타임: {selectedProduct.runningTime}분</Typography>
                            <Typography>📌 공연 시작일: {selectedProduct.startDate}</Typography>
                            <Typography>📌 공연 종료일: {selectedProduct.endDate}</Typography>
                        </Box>
                    )}

                    {/* 🟠 할인 정보 입력 */}
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <TextField
                            type="date"
                            label="할인 시작일"
                            value={discountStartDate}
                            onChange={(e) => setDiscountStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            type="date"
                            label="할인 종료일"
                            value={discountEndDate}
                            onChange={(e) => setDiscountEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            type="number"
                            label="할인율 (%)"
                            value={discountRate}
                            onChange={(e) => setDiscountRate(e.target.value)}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleRegister} disabled={!selectedProduct}>
                        등록
                    </Button>
                    <Button onClick={onClose}>취소</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={alertState.open}
                autoHideDuration={3000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={alertState.severity} onClose={handleAlertClose}>
                    {alertState.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default RegisterSpecialProductDialog;
