import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment/moment";
import {
  changeUserFailure,
  changeUserStart,
  changeUserSuccess,
} from "../../redux/userSlice";
import { UserService } from "../../services/UserService";
import { GroupService } from "../../services/GroupService";
import { Col, Divider, Popconfirm, Row, Skeleton, message } from "antd";

const TeacherView = () => {
  const { isLoading } = useSelector(state => state.users);
  const [teacherGroupLoader, setTeacherGroupLoader] = useState(true);
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [groups, setGroups] = useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleGetTeacher = async () => {
    dispatch(changeUserStart());
    try {
      const data = await UserService.getOneUser(id);
      setTeacher(data);
      dispatch(changeUserSuccess());
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserFailure());
    }
  };

  const handleTeacherGroups = async () => {
    dispatch(changeUserStart());
    try {
      const data = await GroupService.getTeacherGroups(id);
      setGroups(data.groups);
      dispatch(changeUserSuccess());
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserFailure());
    }
    setTeacherGroupLoader(false);
  };

  const handleDeleteTeacher = async () => {
    dispatch(changeUserStart());
    try {
      await UserService.deleteUser(teacher._id);
      dispatch(changeUserSuccess());
      message.success("Ustoz o'chirildi!");
      navigate("/admin/teachers/");
    } catch (error) {
      dispatch(changeUserFailure());
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGetTeacher();
    handleTeacherGroups();
  }, [id]);
  return (
    <div className="teacher-view">
      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          {
            isLoading ? <Skeleton /> : teacher && <div className="teacher-card shadow rounded">
              <img
                className="card-img-top"
                style={{
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "10px 10px 0 0",
                }}
                src={
                  teacher.profilePicture
                    ? teacher.profilePicture.url
                    : "https://cdn-icons-png.flaticon.com/512/46/46139.png"
                }
                alt="teacher-img"
              />
              <div className="card-body">
                <figure>
                  <blockquote>
                    <h6>
                      {teacher.firstname} {teacher.lastname}
                    </h6>
                  </blockquote>
                  <div className="blockquote-footer">{teacher.email}</div>
                </figure>
                <p className="text-muted">
                  {teacher.subject ? (
                    <div>
                      <span className="text-muted">Fan nomi: </span>
                      <span className="ms-2 text-success">
                        {teacher.subject}
                      </span>
                    </div>
                  ) : (
                    <span className="text-warning">Fan kiritilmagan</span>
                  )}
                </p>
                <Popconfirm
                  title={
                    teacher.firstname +
                    " haqidagi barcha ma'lumotlar o'chib ketsinmi?"
                  }
                  okText="o'chirish"
                  okType="danger"
                  cancelText="bekor"
                  onConfirm={handleDeleteTeacher}
                >
                  <p style={{ cursor: "pointer" }} className="text-danger">
                    Ustozni o'chirish
                  </p>
                </Popconfirm>
              </div>
            </div>
          }
        </Col>
        <Col xs={24} sm={24} md={12} lg={18} xl={18} xxl={18}>
          <Divider orientation="left">Tegishli guruhlar</Divider>
          <div className="own-group">
            {
              teacherGroupLoader ? <Skeleton active /> : (
                groups.length > 0 ? groups.map((group, index) => {
                  return (
                    <Link to={`${group._id}`} key={index}>
                      <div className="own-group-item card-body rounded shadow mb-3">
                        <h6>{group.name}</h6>
                        <div className="d-flex gap-3">
                          <p className="text-muted">Ochilgan sanasi: </p>
                          <p>
                            {moment(group.createdAt).format("DD-MM-YYYY")} yil
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                }) : "Guruhlar mavjud emas!"
              )
            }
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherView;
