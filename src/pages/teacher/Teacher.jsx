import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Menu, message, theme } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  changeQuizFailure,
  changeQuizStart,
  changeQuizSuccess,
  getQuizSuccess,
} from "../../redux/quizSlice";
import { QuizService } from "../../services/QuizService";
import { authLogout } from "../../redux/authSlice";
import Profile from "../../components/Profile/Profile";
import QuizBox from "../../components/QuizBox/QuizBox";
import TeacherGrStudents from "../../components/TeacherBox/TeacherGrStudents";
import TeacherGroups from "../../components/TeacherBox/TeacherGroups";
import StudentInfoBox from "../../components/StudentBox/StudentInfoBox";
const { Header, Sider, Content } = Layout;

const Teacher = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    dispatch(authLogout());
    navigate("/login");
  };

  const handleGetAllQuiz = async () => {
    dispatch(changeQuizStart());
    try {
      const data = await QuizService.getAllQuiz();
      dispatch(
        getQuizSuccess(
          data.quizzes.map((que, index) => ({ ...que, key: index }))
        )
      );
      dispatch(changeQuizSuccess());
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeQuizFailure());
    }
  };

  useEffect(() => {
    handleGetAllQuiz();
    toggleSiderMenu();
  }, []);

  const toggleSiderMenu = () => {
    window.innerWidth <= 576 && setCollapsed(true);
  };

  const teacherItems = [
    {
      key: "1",
      icon: <i className="fa-solid fa-book"></i>,
      label: (
        <Link
          to=""
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Guruhlar
        </Link>
      ),
      url: "",
    },
    {
      key: "2",
      icon: <i className="fa-solid fa-user"></i>,
      label: (
        <Link
          to="exam"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Imtihonlar
        </Link>
      ),
      url: "/exam",
    },
  ];

  return (
    <div className="teacher">
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "white" }}
          className="shadow"
        >
          <div className="demo-logo-vertical">
            <Link to="/teacher" className="logo-box">
              <img
                src="/static/logo3.png"
                alt="logo"
                className="img-fluid rounded-circle"
              />
            </Link>
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[
              String(
                teacherItems.findIndex(
                  (item) => "/teacher" + item.url === location.pathname
                ) + 1
              ),
            ]}
            items={[
              ...teacherItems,
              {
                key: "3",
                icon: <i className="fa-solid fa-arrow-right-from-bracket"></i>,
                onClick: handleLogout,
                label: <div className="logout-box">Profildan chiqish</div>,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header className="shadow-sm">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="user-title">
              <div className="d-flex align-items-center gap-2">
                <Link to="profile" className="profile-link">
                  <div className="user-title-avatar">
                    {currentUser?.profilePicture ? (
                      <Image src={currentUser.profilePicture.url} />
                    ) : (
                      <Image
                        src="error"
                        fallback="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
                      />
                    )}
                  </div>
                  <h4>
                    {currentUser?.firstname} {currentUser?.lastname}
                  </h4>
                </Link>
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Routes>
              <Route path="/" element={<TeacherGroups />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/group/:id" element={<TeacherGrStudents />} />
              <Route path="/group/:id/:id" element={<StudentInfoBox />} />
              <Route path="/exam" element={<QuizBox />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default Teacher;
