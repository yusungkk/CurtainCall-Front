import React, { useState, useEffect } from 'react';
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
  getActiveCategories,
  getDeletedCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from '../api/categoryApi';

const AdminCategoryManagement = () => {
  // 탭: 0 = 활성, 1 = 삭제된 카테고리
  const [tabIndex, setTabIndex] = useState(0);
  const [activeCategories, setActiveCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  // 신규 카테고리 생성폼 상태
  const [newCategory, setNewCategory] = useState({ name: '', parentId: '' });
  // 수정 다이얼로그 상태
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState({ id: null, name: '' });
  // 삭제 확인 다이얼로그 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  // Snackbar 알림 상태
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  // 활성 카테고리 fetch
  const fetchActiveCategories = async () => {
    try {
      const data = await getActiveCategories();
      setActiveCategories(data);
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // 삭제된 카테고리 fetch
  const fetchDeletedCategories = async () => {
    try {
      const data = await getDeletedCategories();
      setDeletedCategories(data);
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  useEffect(() => {
    fetchActiveCategories();
    if (tabIndex === 1) {
      fetchDeletedCategories();
    }
  }, [tabIndex]);

  // Snackbar alert 처리
  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // 탭 변경 핸들러
  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  // 신규 카테고리 생성
  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      showAlert('카테고리 이름은 공백일 수 없습니다.', 'error');
      return;
    }
    if (newCategory.name.length < 1 || newCategory.name.length > 50) {
      showAlert('이름은 1자 이상 50자 이하로 입력해주세요.', 'error');
      return;
    }
    try {
      await createCategory({
        name: newCategory.name.trim(),
        parentId: newCategory.parentId || null,
      });
      showAlert('카테고리가 생성되었습니다.');
      setNewCategory({ name: '', parentId: '' });
      fetchActiveCategories();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // 삭제 Dialog 열기
  const openDeleteDialog = (id) => {
    setDeleteCategoryId(id);
    setDeleteDialogOpen(true);
  };

  const cancelDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteCategoryId(null);
  };

  // 삭제 확인 Dialog에서 삭제 실행
  const confirmDeleteCategory = async () => {
    if (!deleteCategoryId) return;
    try {
      await deleteCategory(deleteCategoryId);
      showAlert('카테고리가 삭제되었습니다.');
      fetchActiveCategories();
    } catch (error) {
      showAlert(error.message, 'error');
    } finally {
      setDeleteDialogOpen(false);
      setDeleteCategoryId(null);
    }
  };

  // 카테고리 복구
  const handleRestoreCategory = async (id) => {
    try {
      await restoreCategory(id);
      showAlert('카테고리가 복구되었습니다.');
      fetchDeletedCategories();
      fetchActiveCategories();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // 수정 다이얼로그 열기
  const openEditDialog = (category) => {
    setEditCategory({ id: category.id, name: category.name });
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditCategory({ id: null, name: '' });
  };

  // 카테고리 수정 (PUT)
  const handleUpdateCategory = async () => {
    if (!editCategory.name.trim()) {
      showAlert('카테고리 이름은 공백일 수 없습니다.', 'error');
      return;
    }
    try {
      await updateCategory({
        id: editCategory.id,
        name: editCategory.name.trim(),
      });
      showAlert('카테고리가 수정되었습니다.');
      closeEditDialog();
      fetchActiveCategories();
    } catch (error) {
      showAlert(error.message, 'error');
    }
  };

  // 루트 카테고리 (parentId가 null)
  const rootCategories = activeCategories.filter((cat) => cat.parentId === null);

  // 부모-자식 관계 그룹화
  const groupedCategories = rootCategories.map((parent) => {
    const children = activeCategories.filter((cat) => cat.parentId === parent.id);
    return { parent, children };
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        카테고리 관리
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="활성 카테고리" />
        <Tab label="삭제된 카테고리" />
      </Tabs>

      {tabIndex === 0 && (
        <Box sx={{ mt: 2 }}>
          {/* 신규 카테고리 생성 폼 */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              신규 카테고리 생성
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                label="카테고리 이름"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                size="small"
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>부모 카테고리 (선택)</InputLabel>
                <Select
                  label="부모 카테고리 (선택)"
                  value={newCategory.parentId}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, parentId: e.target.value })
                  }
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
              <Button variant="contained" onClick={handleCreateCategory}>
                생성
              </Button>
            </Box>
          </Paper>

          {/* 활성 카테고리 목록 */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#eeeeee' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>카테고리 이름</TableCell>
                  <TableCell></TableCell>
                  <TableCell>자식 카테고리</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedCategories.map(({ parent, children }) => (
                  <TableRow key={parent.id}>
                    <TableCell>{parent.id}</TableCell>
                    <TableCell>{parent.name}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Button variant="outlined" size="small" onClick={() => openEditDialog(parent)}>
                          수정
                        </Button>
                        <Button
                          variant="contained"
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
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {children.map((child) => (
                            <Chip
                              key={child.id}
                              label={child.name}
                              color="primary"
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
        <Box sx={{ mt: 2 }}>
          {/* 삭제된 카테고리 목록 */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#eeeeee' }}>
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
                      <Button variant="contained" size="small" onClick={() => handleRestoreCategory(cat.id)}>
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
            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleUpdateCategory}>
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
          <Button variant="contained" color="error" onClick={confirmDeleteCategory}>
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminCategoryManagement;
