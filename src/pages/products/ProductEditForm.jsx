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

  const [formData, setFormData] = useState({
    productName: "",
    categoryId: null,
    place: "",
    runningTime: "",
    price: "",
    casting: "",
    notice: "",
    imageUrl: "",
    image: null,
    errors: {},
  });

  const [categoryData, setCategoryData] = useState({
    categories: [],
    parentCategories: [],
    selectedParentId: null,
    childCategories: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProduct(id);

      setFormData((prev) => ({
        ...prev,
        productName: data.productName,
        place: data.place,
        runningTime: data.runningTime,
        price: data.price,
        casting: data.casting,
        notice: data.notice,
        imageUrl: data.productImageUrl,
      }));
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

          setCategoryData((prev) => ({
            ...prev,
            categories: data,
            parentCategories: data.filter((category) => category.parentId === null),
          }));
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
    const filteredChildCategories = categoryData.categories.filter(
      (category) => category.parentId === parentId
    );

    setCategoryData((prev) => ({
      ...prev,
      selectedParentId: parentId,
      childCategories: filteredChildCategories,
    }));
  };

  const handleChildCategoryChange = (e) => {
    const childId = parseInt(e.target.value, 10);

    setFormData((prev) => ({
      ...prev,
      categoryId: childId,
    }));
  };

  const handleImageChange = (e) => {
    const updatedImage = e.target.files[0];

    setFormData((prev) => ({
      ...prev,
      image: updatedImage,
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.productName.trim()) newErrors.productName = "상품명을 입력하세요.";
    if (!formData.categoryId) newErrors.categoryId = "2차 카테고리를 선택하세요.";
    if (!formData.place.trim()) newErrors.place = "장소를 입력하세요.";
    if (!formData.runningTime) newErrors.runningTime = "러닝타임을 입력하세요.";
    if (!formData.price) newErrors.price = "가격을 입력하세요.";
    if (!formData.casting.trim()) newErrors.casting = "캐스팅을 입력하세요.";
    if (!formData.notice.trim()) newErrors.notice = "공지사항을 입력하세요.";

    setFormData((prev) => ({
      ...prev,
      errors: newErrors,
    }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const productData = {
      productName: formData.productName,
      categoryId: formData.categoryId,
      place: formData.place,
      runningTime: formData.runningTime,
      price: formData.price,
      casting: formData.casting,
      notice: formData.notice,
    };

    const updatedFormData = new FormData();

    updatedFormData.append(
      "product",
      new Blob([JSON.stringify(productData)], {
        type: "application/json",
      })
    );
    updatedFormData.append("image", formData.image);

    try {
      const response = await fetch(UPDATE_PRODUCT_URL(id), {
        method: "PATCH",
        body: updatedFormData,
      });

      if (response.status === 204) {
        alert("✅ 상품이 수정되었습니다!");
        navigate("/admin/products");
      } else {
        throw new Error(await response.json());
      }
    } catch (e) {
      alert("수정 중 오류가 발생했습니다. 다시 수정해 주세요");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={12}>
          {formData.imageUrl && (
            <img src={formData.imageUrl} alt="image-preview" style={{ maxWidth: "100%" }} />
          )}
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="상품명"
            value={formData.productName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                productName: e.target.value,
              }))
            }
            error={!!formData.errors.productName}
            helperText={formData.errors.productName}
          />
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel>1차 카테고리</InputLabel>
            <Select
              value={categoryData.selectedParentId || ""}
              onChange={handleParentCategoryChange}
              label="1차 카테고리"
            >
              <MenuItem value="">1차 카테고리</MenuItem>
              {categoryData.parentCategories.map((category) => (
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
              value={formData.categoryId || ""}
              onChange={handleChildCategoryChange}
              label="2차 카테고리"
              error={!!formData.errors.categoryId}
            >
              <MenuItem value="">2차 카테고리</MenuItem>
              {categoryData.childCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {formData.errors.categoryId && (
              <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                {formData.errors.categoryId}
              </Box>
            )}
          </FormControl>
        </Grid>
        <Grid size={4}>
          <TextField
            fullWidth
            label="장소"
            value={formData.place}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                place: e.target.value,
              }))
            }
            error={!!formData.errors.place}
            helperText={formData.errors.place}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            fullWidth
            label="러닝타임 (분)"
            type="number"
            value={formData.runningTime}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                runningTime: e.target.value,
              }))
            }
            error={!!formData.errors.runningTime}
            helperText={formData.errors.runningTime}
          />
        </Grid>
        <Grid size={4}>
          <TextField
            fullWidth
            label="가격 (원)"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: e.target.value,
              }))
            }
            error={!!formData.errors.price}
            helperText={formData.errors.price}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="캐스팅"
            value={formData.casting}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                casting: e.target.value,
              }))
            }
            error={!!formData.errors.casting}
            helperText={formData.errors.casting}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            label="공지사항"
            multiline
            rows={4}
            value={formData.notice}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                notice: e.target.value,
              }))
            }
            error={!!formData.errors.notice}
            helperText={formData.errors.notice}
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
