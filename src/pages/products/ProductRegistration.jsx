import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CREATE_PRODUCT_URL } from "../../utils/endpoint";
import SaveBtn from "../../components/SaveBtn";
import CancelBtn from "../../components/CancelBtn";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CloudUpload } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductRegistration = () => {
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [place, setPlace] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [price, setPrice] = useState("");
  const [casting, setCasting] = useState("");
  const [notice, setNotice] = useState("");
  const [productDetails, setProductDetails] = useState([]);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [childCategories, setChildCategories] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/categories", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          const filteredCategories = data.filter((category) => category.parentId === null);
          setParentCategories(filteredCategories);
        } else {
          throw new Error(await response.json());
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchCategory();
  }, []);

  const addProductDetail = () => {
    setProductDetails([...productDetails, { date: "", time: "", remain: "" }]);
  };

  const removeProductDetail = (index) => {
    setProductDetails(productDetails.filter((_, i) => i !== index));
  };

  const updateProductDetail = (index, field, value) => {
    const updatedDetails = [...productDetails];
    updatedDetails[index][field] = value;
    setProductDetails(updatedDetails);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleParentCategoryChange = (e) => {
    const parentId = parseInt(e.target.value, 10);
    setSelectedParentId(parentId);

    const filteredChildCategories = categories.filter((category) => category.parentId === parentId);
    setChildCategories(filteredChildCategories);
  };

  const handleChildCategoryChange = (e) => {
    const childId = parseInt(e.target.value, 10);
    setCategoryId(childId);
  };

  // 유효성 검사
  const validateForm = () => {
    let newErrors = {};

    if (!productName.trim()) newErrors.productName = "상품명을 입력하세요.";
    if (!categoryId) newErrors.categoryId = "2차 카테고리를 선택하세요.";
    if (!place.trim()) newErrors.place = "장소를 입력하세요.";
    if (!startDate) newErrors.startDate = "시작 날짜를 선택하세요.";
    if (!endDate) newErrors.endDate = "종료 날짜를 선택하세요.";
    if (!runningTime) newErrors.runningTime = "러닝타임을 입력하세요.";
    if (!price) newErrors.price = "가격을 입력하세요.";
    if (!casting.trim()) newErrors.casting = "캐스팅을 입력하세요.";
    if (!notice.trim()) newErrors.notice = "공지사항을 입력하세요.";
    if (!image) newErrors.image = "이미지를 업로드하세요.";
    if (productDetails.length === 0)
      newErrors.productDetails = "최소 하나의 공연 일정을 추가하세요.";

    // 공연 일정 유효성 검사
    productDetails.forEach((detail, index) => {
      if (!detail.date) newErrors[`date${index}`] = "요일을 선택하세요.";
      if (!detail.time) newErrors[`time${index}`] = "시간을 선택하세요.";
      if (!detail.remain) newErrors[`remain${index}`] = "잔여 좌석을 입력하세요.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const productData = {
      productName,
      categoryId,
      place,
      startDate,
      endDate,
      runningTime,
      price,
      casting,
      notice,
      productDetails,
    };

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], {
        type: "application/json",
      })
    );
    formData.append("image", image);

    try {
      const response = await fetch(CREATE_PRODUCT_URL, {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        alert("상품이 등록되었습니다!");
        navigate("/admin/products");
      } else {
        throw new Error(await response.json());
      }
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert("상품 등록에 실패했습니다.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="상품명"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              error={!!errors.productName}
              helperText={errors.productName}
            />
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel>1차 카테고리</InputLabel>
              <Select
                value={selectedParentId || ""}
                onChange={handleParentCategoryChange}
                label="1차 카테고리"
              >
                <MenuItem value="">1차 카테고리</MenuItem>
                {parentCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={6}>
            <FormControl fullWidth>
              <InputLabel>2차 카테고리</InputLabel>
              <Select
                value={categoryId || ""}
                onChange={handleChildCategoryChange}
                label="2차 카테고리"
                error={!!errors.categoryId}
              >
                <MenuItem value="">2차 카테고리</MenuItem>
                {childCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                  {errors.categoryId}
                </Box>
              )}
            </FormControl>
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="시작 날짜"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.startDate}
              helperText={errors.startDate}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              fullWidth
              label="종료 날짜"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.endDate}
              helperText={errors.endDate}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="장소"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              error={!!errors.place}
              helperText={errors.place}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="러닝타임 (분)"
              type="number"
              value={runningTime}
              onChange={(e) => setRunningTime(e.target.value)}
              error={!!errors.runningTime}
              helperText={errors.runningTime}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              fullWidth
              label="가격 (원)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="캐스팅"
              value={casting}
              onChange={(e) => setCasting(e.target.value)}
              error={!!errors.casting}
              helperText={errors.casting}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="공지사항"
              multiline
              rows={4}
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
              error={!!errors.notice}
              helperText={errors.notice}
            />
          </Grid>

          <Grid size={12}>
            {productDetails.map((detail, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>요일 선택</InputLabel>
                  <Select
                    value={detail.date}
                    onChange={(e) => updateProductDetail(index, "date", e.target.value)}
                    label="요일 선택"
                    error={!!errors[`date${index}`]}
                  >
                    <MenuItem value="">요일 선택</MenuItem>
                    <MenuItem value="월">월</MenuItem>
                    <MenuItem value="화">화</MenuItem>
                    <MenuItem value="수">수</MenuItem>
                    <MenuItem value="목">목</MenuItem>
                    <MenuItem value="금">금</MenuItem>
                    <MenuItem value="토">토</MenuItem>
                    <MenuItem value="일">일</MenuItem>
                  </Select>
                  {errors[`date${index}`] && (
                    <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                      {errors[`date${index}`]}
                    </Box>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>시간 선택</InputLabel>
                  <Select
                    value={detail.time}
                    onChange={(e) => updateProductDetail(index, "time", e.target.value)}
                    label="시간 선택"
                    error={!!errors[`time${index}`]}
                  >
                    <MenuItem value="">시간 선택</MenuItem>
                    {[...Array(24).keys()].map((hour) => (
                      <MenuItem key={hour} value={`HOUR_${hour.toString().padStart(2, "0")}_00`}>
                        {`${hour.toString().padStart(2, "0")}:00`}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors[`time${index}`] && (
                    <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                      {errors[`time${index}`]}
                    </Box>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="잔여 좌석"
                  type="number"
                  value={detail.remain}
                  onChange={(e) => updateProductDetail(index, "remain", e.target.value)}
                  error={!!errors[`remain${index}`]}
                  helperText={errors[`remain${index}`]}
                />

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => removeProductDetail(index)}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            ))}

            <Button component="label" variant="contained" onClick={addProductDetail} sx={{ mt: 2 }}>
              + 일정 추가
            </Button>
            {errors.productDetails && (
              <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                {errors.productDetails}
              </Box>
            )}
          </Grid>

          <Grid size={12}>
            <Button component="label" variant="contained" startIcon={<CloudUpload />}>
              포스터 업로드
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {errors.image && (
              <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>{errors.image}</Box>
            )}
          </Grid>

          <Grid container>
            <Grid size={6}>
              <SaveBtn btnType={"submit"} viewName={"등록"} />
            </Grid>
            <Grid size={6}>
              <CancelBtn onClick={() => navigate("/admin/products")} viewName={"취소"} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ProductRegistration;
