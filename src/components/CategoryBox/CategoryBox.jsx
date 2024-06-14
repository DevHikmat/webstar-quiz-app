import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Drawer, Modal, Row, Tabs, message } from "antd";
import {
  AuditOutlined,
  FileDoneOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import CategoryItem from "./CategoryItem";
import "./Category.scss";
import {
  changeCategoryFailure,
  changeCategoryStart,
  changeCategorySuccess,
} from "../../redux/categorySlice";
import { CategoryService } from "../../services/CategoryService";

const NAMES = {
  EXAM: "EXAM",
  TASK: "TASK",
};

const CategoryBox = () => {
  const catImage = useRef();
  const catName = useRef();
  const modalImage = useRef();
  const modalName = useRef();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { category, isLoading } = useSelector((state) => state.category);
  const [tempId, setTempId] = useState("");
  const [activeTab, setActiveTab] = useState("1");

  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!catName.current.value || !catImage.current.files[0])
      return message.warning("Barcha maydonni to'ldiring!");
    dispatch(changeCategoryStart());
    try {
      let formData = new FormData();
      formData.append("name", catName.current.value);
      formData.append("image", catImage.current.files[0]);
      if (activeTab === "1") formData.append("type", "exam");
      else if (activeTab === "2") formData.append("type", "task");
      const data = await CategoryService.createCategory(formData);
      dispatch(changeCategorySuccess());
      message.success(data.message);
      catName.current.value = "";
      catImage.current.value = "";
      setOpen(false);
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeCategoryFailure());
    }
  };

  const handleEditCategory = async (id) => {
    setTempId(id);
    setIsModalOpen(true);
    const cat = await category.find((item) => item._id === id);
    modalImage.current.value = "";
    modalName.current.value = cat.name;
  };

  const handleUpdate = async () => {
    const files = modalImage.current.files[0];
    const name = modalName.current.value;
    if (!files || !name) return message.warning("Barcha maydonni to'ldiring");

    dispatch(changeCategoryStart());
    const formData = new FormData();
    formData.append("name", name);
    if (files) formData.append("image", files);
    try {
      const data = await CategoryService.updateCategory(formData, tempId);
      message.success(data.message);
      dispatch(changeCategorySuccess());
    } catch (error) {
      message.warning(error.response.data.message);
      dispatch(changeCategoryFailure());
    }
    setIsModalOpen(false);
  };

  const tabContent = (tabName) => {
    let result;
    if (tabName === NAMES.EXAM)
      result = category?.filter((item) => item.type === "exam");
    else if (tabName === NAMES.TASK)
      result = category?.filter((item) => item.type === "task");
    return (
      <Row gutter={24}>
        {result?.map((cat, index) => {
          return (
            <CategoryItem
              handleEditCategory={handleEditCategory}
              key={index}
              cat={cat}
              component="category"
            />
          );
        })}
      </Row>
    );
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="d-flex align-items-center">
          <AuditOutlined className="fs-5" />
          Imtihon kategoriyasi
        </span>
      ),
      children: tabContent(NAMES.EXAM),
    },
    {
      key: "2",
      label: (
        <span className="d-flex align-items-center">
          <FileDoneOutlined className="fs-5" />
          Uygavazifalar kategoriyasi
        </span>
      ),
      children: tabContent(NAMES.TASK),
    },
  ];

  return (
    <div className="category-box">
      <div className="category-box-actions">
        <Tabs
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
          tabBarExtraContent={
            <Button
              className="category-add-btn"
              icon={<PlusOutlined />}
              onClick={() => {
                setOpen(true);
              }}
            />
          }
        />
        <div className="d-flex justify-content-end"></div>
        <>
          <Drawer
            title="Categoriya yaratish"
            placement="right"
            onClose={onClose}
            open={open}
          >
            <div className="hide-menu">
              <label htmlFor="catName" className="mb-2">
                Kategoriya nomi
              </label>
              <input id="catName" className="form-control mb-3" ref={catName} />
              <label htmlFor="catImage" className="mb-2">
                Kategriya rasmi
              </label>
              <input
                id="catImage"
                className="form-control mb-3"
                ref={catImage}
                type="file"
              />
              <Button
                loading={isLoading}
                style={{ height: "35px" }}
                className="mt-4 d-flex w-100 justify-content-center align-items-center"
                icon={<SendOutlined />}
                onClick={handleCreateCategory}
              >
                saqlash
              </Button>
            </div>
          </Drawer>
        </>
      </div>
      <hr />
      <Modal
        footer={false}
        title="Kategoiya ma'lumotlarini o'zgartirish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      >
        <div>
          <label htmlFor="modalFile">Rasm:</label>
          <input
            id="modalFile"
            name="file"
            required={true}
            ref={modalImage}
            className="form-control mb-3"
            type="file"
            accept="image/jpeg, image/png"
          />
        </div>
        <div>
          <label htmlFor="modalName">Nomi:</label>
          <input
            id="modalName"
            className="form-control mb-3"
            required={true}
            ref={modalName}
            placeholder="Kategoriya nomi"
          />
        </div>
        <Button loading={isLoading} onClick={handleUpdate}>
          Saqlash
        </Button>
      </Modal>
    </div>
  );
};

export default CategoryBox;
