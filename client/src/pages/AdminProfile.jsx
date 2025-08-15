import React, { Component } from "react";
import { connect } from "react-redux";
import Admin_Sidenav from "../components/Admin_Sidenav";
import { getAdmin, updateAdmin } from "../store/actions/admin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class AdminProfile extends Component {
  state = {
    isLoading: true,
    editing: false,
    data: {
      _id: null,
      name: {
        firstname: "",
        lastname: "",
      },
      department: "",
      designation: "",
      emailId: "",
      username: "",
    },
  };

  componentDidMount() {
    this.props.getAdmin();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.admin !== this.props.admin && this.props.admin) {
      this.setState({
        isLoading: false,
        data: {
          _id: this.props.admin._id || null,
          name: {
            firstname: this.props.admin.name?.firstname || "",
            lastname: this.props.admin.name?.lastname || "",
          },
          department: this.props.admin.department || "",
          designation: this.props.admin.designation || "",
          emailId: this.props.admin.emailId || "",
          username: this.props.admin.username || "",
        },
      });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstname" || name === "lastname") {
      this.setState((prevState) => ({
        data: {
          ...prevState.data,
          name: { ...prevState.data.name, [name]: value },
        },
      }));
    } else {
      this.setState((prevState) => ({
        data: { ...prevState.data, [name]: value },
      }));
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { updateAdmin } = this.props;
    const { _id, name, department, designation, emailId } = this.state.data;

    updateAdmin(_id, { firstname: name.firstname, lastname: name.lastname, department, designation, emailId });
    toast.success("Profile updated successfully!");
    this.setState({ editing: false });
  };

  toggleEdit = () => {
    this.setState((prevState) => ({ editing: !prevState.editing }));
  };

  render() {
    const { editing, data } = this.state;

    return (
      <div>
        <div className="row no-gutters">
          <div className="col-sm-2 sidenav">
            <Admin_Sidenav activeComponent="1" />
          </div>
          <div className="col-sm-10">
            <div className="container-fluid mt-2">
              <h4>My Profile</h4>
              <div className="text-muted">Username: {data.username}</div>
              <hr />
              <form id="form" onSubmit={this.handleSubmit}>
                <div className="alert alert-info">
                  Click <strong>Edit</strong> to fill in the details and{" "}
                  <strong>Update</strong> the information :
                </div>
                <hr />
                <div className="container-fluid">
                  <div className="form-row my-2">
                    <div className="col-sm-6">
                      First Name:
                      <input
                        readOnly={!editing}
                        type="text"
                        name="firstname"
                        id="firstname"
                        className="form-control"
                        value={data.name.firstname}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="col-sm-6">
                      Last Name:
                      <input
                        readOnly={!editing}
                        type="text"
                        name="lastname"
                        id="lastname"
                        className="form-control"
                        value={data.name.lastname}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row my-2">
                    <div className="col-sm-6">
                      Designation:
                      <select
                        id="designation"
                        name="designation"
                        className="form-control"
                        disabled={!editing}
                        value={data.designation}
                        onChange={this.handleChange}
                      >
                        <option value="ClassCoordinator">
                          Class Coordinator
                        </option>
                        <option value="DepartmentIntershipCoordinator">
                          Department Internship Coordinator
                        </option>
                        <option value="CollegeInternshipCoordinator">
                          College Internship Coordinator
                        </option>
                        <option value="Principal">Principal</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      Department:
                      <input
                        readOnly={!editing}
                        type="text"
                        name="department"
                        id="department"
                        className="form-control"
                        value={data.department}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-row my-2">
                    <div className="col-sm-12">
                      Email Id:
                      <input
                        readOnly={!editing}
                        type="email"
                        name="emailId"
                        id="emailId"
                        className="form-control"
                        value={data.emailId}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <div className="text-right">
                  <button
                    type="button"
                    id="editButton"
                    className={`btn ${editing ? "btn-danger" : "btn-secondary"}`}
                    onClick={this.toggleEdit}
                  >
                    {editing ? "Cancel" : "Edit"}
                  </button>
                  <button className="btn border-dark mx-2" type="reset">
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark"
                    id="updateBtn"
                    disabled={!editing}
                  >
                    Update Profile
                  </button>
                </div>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (store) => ({
    auth: store.auth,
    admin: store.currentAdmin,
  }),
  {
    getAdmin,
    updateAdmin,
  }
)(AdminProfile);
