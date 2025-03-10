import React, {useState, useEffect} from 'react';
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
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Box,
    Typography,
    Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    createCategory,
    deleteCategory,
    getActiveCategories,
    getDeletedCategories,
    restoreCategory, updateCategory
} from "../../api/categoryApi.js";

const CategoryManagement = () => {
    // 탭: 0 = 활성, 1 = 삭제된 카테고리
    const [tabIndex, setTabIndex] = useState(0);
    const [activeCategories, setActiveCategories] = useState([]);
    const [deletedCategories, setDeletedCategories] = useState([]);
    // 신규 카테고리 생성폼 상태
    const [newCategory, setNewCategory] = useState({name: '', parentId: ''});
    // 수정 다이얼로그 상태
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editCategory, setEditCategory] = useState({id: null, name: ''});
    // 삭제 확인 다이얼로그 상태
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    // Snackbar 알림 상태
    const [alert, setAlert] = useState({open: false, message: '', severity: 'success'});

    // 활성 카테고리 fetch
    const fetchActiveCategories = async () => {
        const data = await getActiveCategories();
        if (data) {
            setActiveCategories(data);
        } else {
            showAlert('활성 카테고리를 불러오지 못했습니다.', 'error');
        }
    };

    // 삭제된 카테고리 fetch
    const fetchDeletedCategories = async () => {
        const data = await getDeletedCategories();
        if (data) {
            setDeletedCategories(data);
        } else {
            showAlert('삭제된 카테고리를 불러오지 못했습니다.', 'error');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            await fetchActiveCategories();
            if (tabIndex === 1) {
                await fetchDeletedCategories();
            }
        };

        fetchCategories();
    }, [tabIndex]);

    // Snackbar alert 처리
    const showAlert = (message, severity = 'success') => {
        setAlert({open: true, message, severity});
    };

    const handleCloseAlert = () => {
        setAlert({...alert, open: false});
    };

    // 탭 변경 핸들러
    const handleTabChange = (e, newValue) => {
        setTabIndex(newValue);
    };

    // 신규 카테고리 생성 (부모 선택은 루트 카테고리만 보여줌)
    const handleCreateCategory = async () => {
        if (!newCategory.name.trim()) {
            showAlert('카테고리 이름은 공백일 수 없습니다.', 'error');
            return;
        }

        if (newCategory.name.length < 1 || newCategory.name.length > 50) {
            showAlert('이름은 1자 이상 50자 이하로 입력해주세요.', 'error');
            return;
        }

        const response = await createCategory({
            name: newCategory.name.trim(),
            parentId: newCategory.parentId || null,
        });

        // `fetcher`가 400, 404 등의 오류일 때 `{ error: "에러 메시지" }`를 반환하므로 처리
        if (response?.error) {
            showAlert(response.error, "error");
            return;
        }

        // 성공 시 처리
        showAlert("카테고리가 생성되었습니다.");
        setNewCategory({name: "", parentId: ""});
        fetchActiveCategories();
    };

    // 삭제 Dialog를 열기 위한 함수
    const openDeleteDialog = (id) => {
        setDeleteCategoryId(id);
        setDeleteDialogOpen(true);
    };

    const cancelDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeleteCategoryId(null);
    };

    // 삭제 확인 Dialog에서 삭제를 실행하는 함수
    const handleDeleteCategory = async () => {
        if (!deleteCategoryId) return;

        const res = await deleteCategory(deleteCategoryId);

        // `fetcher`가 400, 404 등의 오류일 때 `{ error: "에러 메시지" }`를 반환하므로 처리
        if (res?.error) {
            showAlert(res.error, 'error');
            return;
        }

        // 성공 시 처리
        showAlert('카테고리가 삭제되었습니다.');
        await fetchActiveCategories(); // 최신 카테고리 목록 다시 불러오기

        // 상태 초기화
        setDeleteDialogOpen(false);
        setDeleteCategoryId(null);
    };


    // 카테고리 복구
    const handleRestoreCategory = async (id) => {
        if (!id) return;

        const res = await restoreCategory(id);

        if (res?.error) {
            showAlert(res.error, 'error');
            return;
        }

        showAlert('카테고리가 복구되었습니다.');

        // 최신 목록 불러오기
        await getDeletedCategories();
        await getActiveCategories();
    };

    // 수정 다이얼로그 열기
    const openEditDialog = (category) => {
        setEditCategory({id: category.id, name: category.name});
        setEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setEditDialogOpen(false);
        setEditCategory({id: null, name: ''});
    };

    // 카테고리 수정 (PUT)
    const handleUpdateCategory = async () => {
        if (!editCategory.name.trim()) {
            showAlert('카테고리 이름은 공백일 수 없습니다.', 'error');
            return;
        }

        const res = await updateCategory({
            id: editCategory.id,  // ✅ ID 포함해서 보냄
            name: editCategory.name.trim(),
        });

        if (res?.error) {
            showAlert(res.error, 'error'); // fetcher에서 받은 오류 메시지 표시
            return;
        }

        showAlert('카테고리가 수정되었습니다.');
        closeEditDialog();
        await fetchActiveCategories(); // ✅ 최신 목록 불러오기
    };


    // 루트 카테고리만 필터링 (부모 선택에 사용)
    const rootCategories = activeCategories.filter((cat) => cat.parentId === null);

    // 부모-자식 관계 그룹화
    const groupedCategories = rootCategories.map((parent) => {
        const children = activeCategories.filter((cat) => cat.parentId === parent.id);
        return {parent, children};
    });

    return (
        <Container sx={{mt: 4}}>
            {/*<Typography variant="h4" gutterBottom align="center">*/}
            {/*    카테고리 관리*/}
            {/*</Typography>*/}

            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                textColor="secondary"
                indicatorColor="secondary"
            >
                <Tab
                    label="카테고리"
                    sx={{
                        fontFamily: "'Bareun_hipi', sans-serif",
                        '&.MuiTab-root:focus': {
                            outline: 'none'
                        }
                    }}
                />
                <Tab
                    label="삭제된 카테고리"
                    sx={{
                        fontFamily: "'Bareun_hipi', sans-serif",
                        '&.MuiTab-root:focus': {
                            outline: 'none'
                        }
                    }}
                />
            </Tabs>

            {tabIndex === 0 && (
                <Box sx={{mt: 2}}>
                    {/* 신규 카테고리 생성 폼 */}
                    <Paper sx={{p: 2, mb: 2}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            {/* 카테고리 이름 입력 */}
                            <TextField
                                label="카테고리 이름"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                size="small"
                                sx={{minWidth: 200}}
                            />

                            {/* 부모 카테고리 선택 */}
                            <FormControl size="small" sx={{minWidth: 200, flexShrink: 0}}>
                                <InputLabel>부모 카테고리 (선택)</InputLabel>
                                <Select
                                    value={newCategory.parentId}
                                    onChange={(e) => setNewCategory({...newCategory, parentId: e.target.value})}
                                >
                                    <MenuItem value="">
                                        <em>없음</em>
                                    </MenuItem>
                                    {rootCategories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* 생성 버튼 - 오른쪽으로 이동 및 검색 버튼 크기와 맞춤 */}
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleCreateCategory}
                                sx={{
                                    width: 100,
                                    height: '40px',  // 검색 버튼과 높이 맞춤
                                    flexShrink: 0,
                                }}
                            >
                                생성
                            </Button>
                        </Box>
                    </Paper>


                    {/* 활성 카테고리 목록 - 부모와 오른쪽에 자식 카테고리 보여주기 */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor: '#eeeeee'}}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>카테고리 이름</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>자식 카테고리</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {groupedCategories.map(({parent, children}) => (
                                    <TableRow key={parent.id}>
                                        <TableCell>{parent.id}</TableCell>
                                        <TableCell>{parent.name}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{display: 'flex', justifyContent: 'center', gap: 1}}>
                                                <Button variant="outlined" size="small"
                                                        onClick={() => openEditDialog(parent)}>
                                                    수정
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    onClick={() => openDeleteDialog(parent.id)}
                                                >
                                                    삭제
                                                </Button>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {children.length > 0 ? (
                                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                                    {children.map((child) => (
                                                        <Chip
                                                            key={child.id}
                                                            label={child.name}
                                                            // color="primary"
                                                            sx={{'& .MuiChip-deleteIcon': {color: 'red'}}}
                                                            onClick={() => openEditDialog(child)}
                                                            onDelete={() => openDeleteDialog(child.id)}
                                                            deleteIcon={
                                                                <DeleteIcon
                                                                    fontSize="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openDeleteDialog(child.id);
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    자식 없음
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {activeCategories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            활성 카테고리가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {tabIndex === 1 && (
                <Box sx={{mt: 2}}>
                    {/* 삭제된 카테고리 목록 */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor: '#eeeeee'}}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>카테고리 이름</TableCell>
                                    <TableCell>부모 ID</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deletedCategories.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell>{cat.id}</TableCell>
                                        <TableCell>{cat.name}</TableCell>
                                        <TableCell>{cat.parentId || '-'}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="outlined" size="small"
                                                    onClick={() => handleRestoreCategory(cat.id)}>
                                                복구
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {deletedCategories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            삭제된 카테고리가 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* 수정 다이얼로그 */}
            <Dialog open={editDialogOpen} onClose={closeEditDialog}>
                <DialogTitle>카테고리 수정</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="카테고리 이름"
                        fullWidth
                        value={editCategory.name}
                        onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleUpdateCategory}>
                        수정
                    </Button>
                    <Button onClick={closeEditDialog}>취소</Button>
                </DialogActions>
            </Dialog>

            {/* 삭제 확인 다이얼로그 */}
            <Dialog open={deleteDialogOpen} onClose={cancelDeleteDialog}>
                <DialogTitle>카테고리 삭제 확인</DialogTitle>
                <DialogContent>
                    <Typography>정말로 이 카테고리를 삭제하시겠습니까?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleDeleteCategory}>
                        삭제
                    </Button>
                    <Button onClick={cancelDeleteDialog}>취소</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Alert */}
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{width: '100%'}}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CategoryManagement;
