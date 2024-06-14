import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Menu, message, theme } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import QuizBox from "../../components/QuizBox/QuizBox";
import HistoryBox from "../../components/HistoryBox/HistoryBox";
import {
  changeQuizFailure,
  changeQuizStart,
  changeQuizSuccess,
  getQuizSuccess,
} from "../../redux/quizSlice";
import { QuizService } from "../../services/QuizService";
import QuizStudentView from "../../components/QuizBox/QuizStudentView";
import { authLogout } from "../../redux/authSlice";
import Profile from "../../components/Profile/Profile";
import {
  changeCategoryFailure,
  changeCategoryStart,
  getAllCategorySuccess,
} from "../../redux/categorySlice";
import { CategoryService } from "../../services/CategoryService";
import HomeworkBox from "../../components/Homework/HomeworkBox";
import { GroupService } from "../../services/GroupService";
const { Header, Sider, Content } = Layout;

const Student = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { isExamStart } = useSelector((state) => state.quiz);
  const [collapsed, setCollapsed] = useState(false);
  const [groups, setGroups] = useState(null);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    if (isExamStart) return;
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    dispatch(authLogout());
    navigate("/login");
  };

  const handleGetAllGroups = async () => {
    try {
      const data = await GroupService.getAllGroups();
      setGroups(data.groups);
    } catch (error) {
      console.log(error);
    }
  }

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

  const toggleSiderMenu = () => {
    window.innerWidth <= 576 && setCollapsed(true);
  };

  useEffect(() => {
    handleGetAllGroups()
    handleGetAllQuiz();
    toggleSiderMenu();
    handleAllCategory();
  }, []);

  const items = [
    {
      key: "1",
      icon: <i className="fa-solid fa-book"></i>,
      label: (
        <Link
          to={isExamStart ? "#" : ""}
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Imtihonlar
        </Link>
      ),
      url: "",
    },
    {
      key: "2",
      icon: <i className="fa-solid fa-book"></i>,
      label: (
        <Link
          to={isExamStart ? "#" : "homeworks"}
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Uy ishlari
        </Link>
      ),
      url: "",
    },
    {
      key: "3",
      icon: <i className="fa-solid fa-user"></i>,
      label: (
        <Link
          to={isExamStart ? "#" : "profile"}
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Accaunt
        </Link>
      ),
      url: "/profile",
    },
  ];

  return (
    <div className="student">
      <Layout>
        <Sider
          breakpoint="md"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "white" }}
          className="shadow"
        >
          <div className="demo-logo-vertical">
            <Link to={isExamStart ? "#" : "/student"} className="logo-box">
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
                items.findIndex(
                  (item) => "/student" + item.url === location.pathname
                ) + 1
              ),
            ]}
            items={[
              ...items,
              {
                key: "4",
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
                <Link
                  to={isExamStart ? "#" : "profile"}
                  className="profile-link"
                >
                  <div className="user-title-avatar">
                    {currentUser?.profilePicture ? (
                      <Image
                        preview={false}
                        src={currentUser?.profilePicture?.url}
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
              <Route path="/" element={<QuizBox />} />
              <Route path="/homeworks" element={<HomeworkBox />} />
              <Route path="/homeworks/:id" element={<QuizStudentView />} />
              <Route path="/quiz/:id" element={<QuizStudentView />} />
              <Route path="/profile" element={<Profile groups={groups} />} />
              <Route path="/history" element={<HistoryBox />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default Student;
