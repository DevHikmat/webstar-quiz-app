import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Col, Popconfirm, Row, message } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  changeCategoryFailure,
  changeCategoryStart,
  changeCategorySuccess,
} from "../../redux/categorySlice";
import { CategoryService } from "../../services/CategoryService";
import { memo } from "react";
const CategoryItem = ({ cat, handleEditCategory, component = "" }) => {
  const dispatch = useDispatch();

  const handleDeleteCategory = async (id) => {
    dispatch(changeCategoryStart());
    try {
      const data = await CategoryService.deleteCategory(id);
      message.success(data);
      dispatch(changeCategorySuccess());
    } catch (error) {
      dispatch(changeCategoryFailure());
      message.error(error.response.data.message);
    }
  };
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
      <div className="category-box-item rounded shadow mb-3">
        <Row gutter={24}>
          <Col xl={5}>
            <img
              style={{ height: "100px", width: "100px", objectFit: "cover" }}
              className="img-fluid rounded"
              src={cat.image?.url}
              alt="img"
            />
          </Col>
          <Col xl={19}>
            <h6 className="pt-2">{cat.name}</h6>
            <div className="d-flex gap-3">
              <Link to={`${component && component + "/"}${cat._id}`}>
                <Button size="small" icon={<EyeOutlined />}></Button>
              </Link>
              <Button
                size="small"
                onClick={() => handleEditCategory(cat._id)}
                icon={<EditOutlined />}
              ></Button>
              <Popconfirm
                okText="o'chirish"
                cancelText="bekor qilish"
                title="Diqqat! Shu kategoriyaga doir barcha savollar o'chib ketadi."
                okType="danger"
                onConfirm={() => handleDeleteCategory(cat._id)}
              >
                <Button size="small" icon={<DeleteOutlined />}></Button>
              </Popconfirm>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default memo(CategoryItem);
