import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../../api/productApi";
import { UPDATE_PRODUCT_URL } from "../../utils/endpoint";
import SaveBtn from "../../components/SaveBtn";
import CancelBtn from "../../components/CancelBtn";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { CloudUpload } from "@mui/icons-material";

function ProductEditForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState();
  const [place, setPlace] = useState("");
  const [runningTime, setRunningTime] = useState("");
  const [price, setPrice] = useState("");
  const [casting, setCasting] = useState("");
  const [notice, setNotice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [childCategories, setChildCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(id);

      setProductName(data.productName);
      setPlace(data.place);
      setRunningTime(data.runningTime);
      setPrice(data.price);
      setCasting(data.casting);
      setNotice(data.notice);
      setImageUrl(data.productImageUrl);
    };

    fetchProduct();

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

          setParentCategories(data.filter((category) => category.parentId === null));
        } else {
          throw new Error(await response.json());
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchCategory();
  }, [id]);

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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!productName.trim()) newErrors.productName = "상품명을 입력하세요.";
    if (!categoryId) newErrors.categoryId = "2차 카테고리를 선택하세요.";
    if (!place.trim()) newErrors.place = "장소를 입력하세요.";
    if (!runningTime) newErrors.runningTime = "러닝타임을 입력하세요.";
    if (!price) newErrors.price = "가격을 입력하세요.";
    if (!casting.trim()) newErrors.casting = "캐스팅을 입력하세요.";
    if (!notice.trim()) newErrors.notice = "공지사항을 입력하세요.";

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
      runningTime,
      price,
      casting,
      notice,
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
      const response = await fetch(UPDATE_PRODUCT_URL(id), {
        method: "PATCH",
        body: formData,
      });

      if (response.status === 204) {
        alert("✅ 상품이 수정되었습니다!");
        navigate("/admin/products");
      } else {
        throw new Error(await response.json());
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={12}>
          {imageUrl && <img src={imageUrl} alt="image-preview" style={{ maxWidth: "100%" }} />}
        </Grid>
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
          <Button component="label" variant="contained" startIcon={<CloudUpload />}>
            포스터 업로드
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
        </Grid>
        <Grid container>
          <Grid size={6}>
            <SaveBtn btnType={"submit"} viewName={"수정"} />
          </Grid>
          <Grid size={6}>
            <CancelBtn onClick={() => navigate("/admin/products")} viewName={"취소"} />
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}

export default ProductEditForm;
