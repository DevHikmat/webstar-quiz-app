import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { AuthService } from "../../services/AuthService";
import {
  authChangeStart,
  authChangeSuccess,
  authChangeFailure,
} from "../../redux/authSlice";
import "./Signup.scss";
import { setAxiosInstanceToken } from "../../services/axiosInstance";
import { GroupService } from "../../services/GroupService";

const Signup = () => {
  const { isLoading } = useSelector((state) => state.auth);
  const [groups, setGroups] = useState([]);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);

  const showPassword = () => {
    setShow(true);
  };
  const hidePassword = () => {
    setShow(false);
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(authChangeStart());
    try {
      const data = await AuthService.signup({ ...user, role: "student" });
      localStorage.setItem("id", data.user._id);
      localStorage.setItem("token", data.token);
      setAxiosInstanceToken(data.token);
      dispatch(authChangeSuccess(data.user));
      message.success(`Salom ${data.user.firstname}!`);
    } catch (error) {
      dispatch(authChangeFailure());
      message.error("Bunday foydalanuvchi allaqachon ro'yxatdan o'tgan!");
    }
  };

  const handleGroups = async () => {
    try {
      const data = await GroupService.getAllGroups();
      setGroups(data.groups);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGroups();
  }, []);

  return (
    <div className="signup">
      <div className="signup-content shadow">
        <div className="signup-content-left">
          <img src="/static/logo3.png" alt="logo" />
        </div>
        <div className="signup-content-right">
          <h3>Sign up</h3>
          <form onSubmit={(e) => handleRegister(e)}>
            <div className="input-box mb-3">
              <label htmlFor="firstname" className="fa-solid fa-user"></label>
              <input
                id="firstname"
                onChange={(e) => handleChange(e)}
                type="text"
                className="shadow"
                placeholder="Ismingiz"
                required
              />
            </div>
            <div className="input-box mb-3">
              <label htmlFor="lastname" className="fa-solid fa-user"></label>
              <input
                id="lastname"
                onChange={(e) => handleChange(e)}
                type="text"
                className="shadow"
                placeholder="Familyangiz"
                required
              />
            </div>
            <div className="input-box mb-3">
              <label htmlFor="email" className="fa-solid fa-envelope"></label>
              <input
                id="email"
                onChange={(e) => handleChange(e)}
                type="email"
                className="shadow"
                placeholder="E-mail"
                required
              />
            </div>
            <div className="input-box mb-3">
              <label htmlFor="password" className="fa-solid fa-lock"></label>
              <input
                id="password"
                onChange={(e) => handleChange(e)}
                type={show ? "text" : "password"}
                className="shadow"
                placeholder="parol"
                required
              />
              {show ? (
                <i
                  onClick={hidePassword}
                  className="pass-action fa-solid fa-eye"
                ></i>
              ) : (
                <i
                  onClick={showPassword}
                  className="pass-action fa-solid fa-eye-slash"
                ></i>
              )}
            </div>
            <div className="input-box mb-3">
              <label htmlFor="group" className="fa-solid fa-users-line"></label>
              <select
                name="group"
                id="group"
                className="shadow"
                onChange={(e) => handleChange(e)}
                required
              >
                <option value="" style={{ display: "none" }}>
                  Guruhni tanlash
                </option>
                {groups?.map((group, index) => {
                  return (
                    <option key={index} value={group._id}>
                      {group.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="signup-btn mb-2"
            >
              register
            </button>
            <div>
              <Link to="/login">Or login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
