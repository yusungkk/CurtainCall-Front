import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
} from "@mui/material";

const EditSpecialProductDialog = ({ open, onClose, product, setProduct, onUpdate }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>특가상품 수정</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    {/* ✅ 첫 번째 줄: 상품 이름 + 가격 */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            label="상품 이름"
                            value={product.productName}
                            disabled // ✅ 읽기 전용
                            fullWidth
                        />
                        <TextField
                            type="number"
                            label="가격"
                            value={product.price}
                            disabled // ✅ 읽기 전용
                            fullWidth
                        />
                    </Box>

                    {/* ✅ 두 번째 줄: 공연 시작 날짜 + 공연 종료 날짜 */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            type="date"
                            label="공연 시작일"
                            value={product.startDate}
                            disabled // ✅ 읽기 전용
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            type="date"
                            label="공연 종료일"
                            value={product.endDate}
                            disabled // ✅ 읽기 전용
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Box>

                    {/* ✅ 세 번째 줄: 할인 시작일 + 할인 종료일 + 할인율 */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                            type="date"
                            label="할인 시작일"
                            value={product.discountStartDate}
                            onChange={(e) =>
                                setProduct({ ...product, discountStartDate: e.target.value })
                            }
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            type="date"
                            label="할인 종료일"
                            value={product.discountEndDate}
                            onChange={(e) =>
                                setProduct({ ...product, discountEndDate: e.target.value })
                            }
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            type="number"
                            label="할인율(%)"
                            value={product.discountRate}
                            onChange={(e) =>
                                setProduct({ ...product, discountRate: e.target.value })
                            }
                            fullWidth
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onUpdate}>
                    수정
                </Button>
                <Button onClick={onClose}>취소</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditSpecialProductDialog;
