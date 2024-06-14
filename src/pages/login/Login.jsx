import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { AuthService } from "../../services/AuthService";
import {
  authChangeStart,
  authChangeSuccess,
  authChangeFailure,
} from "../../redux/authSlice";
import "./Login.scss";
import { setAxiosInstanceToken } from "../../services/axiosInstance";

const Login = () => {
  const { isLoading } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const email_rf = useRef();
  const passw_rf = useRef();

  const showPassword = () => {
    setShow(true);
  };
  const hidePassword = () => {
    setShow(false);
  };

  const handleLogin = async (e) => {
    message.loading("loading...");
    e.preventDefault();
    dispatch(authChangeStart());
    try {
      const data = await AuthService.login({
        email: email_rf.current.value,
        password: passw_rf.current.value,
      });
      localStorage.setItem("id", data.user._id);
      localStorage.setItem("token", data.token);
      setAxiosInstanceToken(data.token);
      dispatch(authChangeSuccess(data.user));
      message.destroy();
      message.success(`Salom ${data.user.firstname}!`);
    } catch (error) {
      dispatch(authChangeFailure());
      message.destroy();
      message.error("Bu foydalanuvchi topilmadi!");
    }
  };
  return (
    <div className="login">
      <div className="login-content shadow">
        <div className="login-content-left">
          <img src="/static/logo3.png" alt="logo" />
        </div>
        <div className="login-content-right">
          <h3>Login</h3>
          <form onSubmit={(e) => handleLogin(e)}>
            <div className="input-box mb-3">
              <label className="fa-solid fa-envelope"></label>
              <input
                ref={email_rf}
                type="email"
                className="shadow"
                placeholder="E-mail"
                required
              />
            </div>
            <div className="input-box mb-3">
              <label className="fa-solid fa-lock"></label>
              <input
                ref={passw_rf}
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
            <button
              disabled={isLoading}
              type="submit"
              className="login-btn mb-2"
            >
              login
            </button>
            <div>
              <Link to="/signup">Or register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
