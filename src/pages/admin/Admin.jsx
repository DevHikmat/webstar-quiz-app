import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Menu, message, theme } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { QuizService } from "../../services/QuizService";
import { CategoryService } from "../../services/CategoryService";
import CategoryBox from "../../components/CategoryBox/CategoryBox";
import QuizBox from "../../components/QuizBox/QuizBox";
import GroupsBox from "../../components/GroupBox/GroupBox";
import {
  changeQuizFailure,
  changeQuizStart,
  getQuizSuccess,
} from "../../redux/quizSlice";
import {
  changeCategoryFailure,
  changeCategoryStart,
  getAllCategorySuccess,
} from "../../redux/categorySlice";
import CategoryView from "../../components/CategoryBox/CategoryView";
import QuizView from "../../components/QuizBox/QuizView";
import { authLogout } from "../../redux/authSlice";
import Profile from "../../components/Profile/Profile";
import StudentBox from "../../components/StudentBox/StudentBox";
import StudentInfoBox from "../../components/StudentBox/StudentInfoBox";
import TeacherBox from "../../components/TeacherBox/TeacherBox";
import TeacherView from "../../components/TeacherBox/TeacherView";
import TeacherGrStudents from "../../components/TeacherBox/TeacherGrStudents";
import { UserService } from "../../services/UserService";
const { Header, Sider, Content } = Layout;

const Admin = () => {
  const { auth, quiz, category } = useSelector((state) => state);
  const { currentUser } = auth;
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [teacherList, setTeacherList] = useState([]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleTeachers = async () => {
    try {
      let data = await UserService.getTeachers();
      setTeacherList(data);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleAllQuiz = async () => {
    dispatch(changeQuizStart());
    try {
      const data = await QuizService.getAllQuiz();
      dispatch(getQuizSuccess(data.quizzes));
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeQuizFailure());
    }
  };
  const handleAllCategory = async () => {
    dispatch(changeCategoryStart());
    try {
      const data = await CategoryService.getAllCategory();
      dispatch(getAllCategorySuccess(data.categories));
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeCategoryFailure());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    dispatch(authLogout());
    navigate("/login");
  };

  useEffect(() => {
    toggleSiderMenu();
    handleTeachers();
  }, []);

  useEffect(() => {
    handleAllCategory();
  }, [category.isChange]);

  useEffect(() => {
    handleAllQuiz();
  }, [quiz.isChange]);

  const toggleSiderMenu = () => {
    window.innerWidth <= 576 && setCollapsed(true);
  };

  const adminItems = [
    {
      key: "1",
      icon: <i className="fa-solid fa-server"></i>,
      label: (
        <Link
          to=""
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Kategoriya
        </Link>
      ),
      url: "",
    },
    {
      key: "2",
      icon: <i className="fa-solid fa-book"></i>,
      label: (
        <Link
          to="quiz"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Imtihonlar
        </Link>
      ),
      url: "/quiz",
    },
    {
      key: "3",
      icon: <i className="fa-solid fa-home"></i>,
      label: (
        <Link
          to="homeworks"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Uyga vazifalar
        </Link>
      ),
      url: "/homeworks",
    },
    {
      key: "4",
      icon: <i className="fa-solid fa-users"></i>,
      label: (
        <Link
          to="groups"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Guruhlar
        </Link>
      ),
      url: "/groups",
    },
    {
      key: "5",
      icon: <i className="fa-solid fa-user"></i>,
      label: (
        <Link
          to="students"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          O'quvchilar
        </Link>
      ),
      url: "/students",
    },
    {
      key: "6",
      icon: <i className="fa-solid fa-graduation-cap"></i>,
      label: (
        <Link
          to="teachers"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Ustozlar
        </Link>
      ),
      url: "/teachers",
    },
  ];
  return (
    <div className="admin">
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={250}
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "white" }}
          className="shadow"
        >
          <div className="demo-logo-vertical">
            <Link to="/admin" className="logo-box">
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
                adminItems.findIndex(
                  (item) => "/admin" + item.url === location.pathname
                ) + 1
              ),
            ]}
            items={[
              ...adminItems,
              {
                key: "7",
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
                      <Image
                        preview={false}
                        src={currentUser.profilePicture.url}
                      />
                    ) : (
                      <Image
                        preview={false}
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
              <Route path="/" element={<CategoryBox collapsed={collapsed} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/category/:id" element={<CategoryView />} />
              <Route path="/quiz" element={<QuizBox />} />
              <Route path="/quiz/:id" element={<QuizView />} />
              <Route path="/homeworks" element={<QuizBox boxtype="task" />} />
              <Route path="/homeworks/:id" element={<QuizView />} />
              <Route
                path="/groups"
                element={<GroupsBox teacherList={teacherList} />}
              />
              <Route
                path="/groups/:id"
                element={<TeacherGrStudents />}
              />
              <Route
                path="/groups/:id/:id"
                element={<StudentInfoBox />}
              />
              <Route path="/students/*" element={<StudentBox />} />
              <Route path="/students/view/:id" element={<StudentInfoBox />} />
              <Route path="/teachers" element={<TeacherBox />} />
              <Route path="/teachers/:id" element={<TeacherView />} />
              <Route path="/teachers/:id/:id" element={<TeacherGrStudents />} />
              <Route
                path="/teachers/:id/:id/:id"
                element={<StudentInfoBox />}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default Admin;
