import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import "../assets/css/Auth.css";

import {
  authUser,
  logout,
  authUser_f,
  logout_f,
  authUser_a,
} from "../store/actions";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      User_type: "1",
      errors: {},
    };
  }

  // Validation on every keystroke
  validateField = (name, value) => {
    let errors = { ...this.state.errors };

    if (name === "username") {
      errors.username = value.trim() ? "" : "Username is required";
    }

    if (name === "password") {
      errors.password = value ? "" : "Password is required";
    }

    this.setState({ errors });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => this.validateField(name, value));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, User_type } = this.state;
    const { authType } = this.props;
    const { authUser, authUser_a, authUser_f } = this.props;

    // Only submit if both fields are valid
    if (!username.trim() || !password) return;

    if (User_type === "1") {
      authUser(authType || "login", { username, password });
    } else if (User_type === "2") {
      authUser_f("login_faculty", { username, password });
    } else if (User_type === "3") {
      authUser_a("login_admin", { username, password });
    }
  };

  render() {
    const { username, password, errors, User_type } = this.state;
    const isFormValid = username.trim() !== "" && password !== "";

    return (
      <div className="section">
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx">
              <p>Internship Management System</p>
            </div>

            <div className="formBx">
              <form onSubmit={this.handleSubmit}>
                <div className="Errorbox">
                  <div className="my-4 text-center" style={{ zIndex: "10" }}>
                    <ErrorMessage />
                  </div>
                </div>
                <h2>Sign In</h2>

                <div className="input-container">
                  <input
                    type="text"
                    value={username}
                    name="username"
                    placeholder="Username"
                    autoComplete="off"
                    className="input form-control"
                    onChange={this.handleChange}
                  />
                  <small className="text-danger error-space">
                    {errors.username || "\u00A0"}
                  </small>
                </div>

                <div className="input-container">
                  <input
                    type="password"
                    value={password}
                    name="password"
                    placeholder="Password"
                    className="input form-control"
                    autoComplete="off"
                    onChange={this.handleChange}
                  />
                  <small className="text-danger error-space">
                    {errors.password || "\u00A0"}
                  </small>
                </div>

                <select
                  name="User_type"
                  value={User_type}
                  onChange={this.handleChange}
                  className="form-control"
                >
                  <option value="1">Student</option>
                  <option value="2">Faculty</option>
                  <option value="3">Admin</option>
                </select>

                <p className="signup">
                  <a href="/forgotpassword">Forgot password?</a>
                </p>

                <div className="text-center">
                  <Link
                    className="btn-custom mr-2"
                    style={{ textDecoration: "none" }}
                    to="/register"
                  >
                    <b>Register</b>
                  </Link>
                  <input
                    type="submit"
                    value="Login"
                    name="loginBtn"
                    disabled={!isFormValid}
                    className={`login-btn ${
                      isFormValid ? "enabled-btn" : "disabled-btn"
                    }`}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(() => ({}), {
  authUser,
  logout,
  authUser_f,
  logout_f,
  authUser_a,
})(Auth);
