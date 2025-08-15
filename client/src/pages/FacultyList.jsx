import React, { Component } from "react";
import Admin_Sidenav from "../components/Admin_Sidenav";
import { connect } from "react-redux";
import { getFaculty } from "../store/actions/admin";
import {
  MdFormatListBulleted,
  MdAssignmentInd,
  MdSupervisorAccount,
  MdViewAgenda,
  MdLocalLibrary,
  MdBuild,
  MdSearch,
} from "react-icons/md";

class FacultyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      faculties: [],
    };

    // Bind methods
    this.handleListView = this.handleListView.bind(this);
    this.handleCardView = this.handleCardView.bind(this);
    this.filter = this.filter.bind(this);
    this.expandInline = this.expandInline.bind(this);
  }

  async componentDidMount() {
    const { getFaculty } = this.props;
    await getFaculty();

    if (this.props.faculty && Array.isArray(this.props.faculty)) {
      this.setState({ faculties: this.props.faculty, isLoading: false });
    } else {
      this.setState({ isLoading: false });
    }
  }

  handleListView() {
    let elements = document.getElementsByClassName("card-body");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
  }

  handleCardView() {
    let elements = document.getElementsByClassName("card-body");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "block";
    }
  }

  filter(e) {
    const filter = e.target.value.toUpperCase();
    const cards = document.getElementsByClassName("card");

    for (let i = 0; i < cards.length; i++) {
      const cardContent = cards[i].querySelector(".individual-card");
      if (cardContent && cardContent.innerText.toUpperCase().includes(filter)) {
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
    }
  }

  expandInline(e) {
    if (e.target.parentElement && e.target.parentElement.lastChild) {
      e.target.parentElement.lastChild.style.display = "block";
    }
  }

  renderCardData() {
    return this.state.faculties.map((faculty) => {
      const {
        _id,
        username,
        name = {},
        currentClass = {},
        department,
        designation,
        emailId,
      } = faculty;

      return (
        <div
          className="col-sm-6"
          key={_id}
          name="facultyCard"
          id={
            username +
            (name.firstname || "") +
            (name.lastname || "") +
            (currentClass.year || "") +
            (currentClass.div || "") +
            department +
            designation
          }
        >
          <div className="card my-2">
            <div className="individual-card">
              <div
                className="card-header"
                onClick={this.expandInline}
                style={{ cursor: "pointer" }}
              >
                Prof. {`${name.firstname || ""} ${name.lastname || ""}`}
                <span className="float-right">
                  {designation === "ClassCoordinator" ? (
                    <MdLocalLibrary size="24" color="firebrick" />
                  ) : designation === "Admin" ? (
                    <MdBuild size="24" color="blue" />
                  ) : designation === "DepartmentInternshipCoordinator" ? (
                    <MdAssignmentInd size="24" color="green" />
                  ) : designation === "CollegeInternshipCoordinator" ? (
                    <MdSupervisorAccount size="24" color="orange" />
                  ) : null}
                </span>
                <br />
                <small className="text-muted">Username: {username}</small>
              </div>
              <div className="card-body">
                <b> Current Class : </b>
                {currentClass.year}{" "}
                {currentClass.div === 0 ? "" : currentClass.div}
                <br />
                <b> Department : </b>
                {department}
                <br />
                <b> Designation : </b>
                {designation}
                <br />
                <b> Email Id : </b>
                {emailId}
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="row no-gutters">
          <div className="col-sm-2 sidenav">
            <Admin_Sidenav activeComponent="2" />
          </div>
          <div className="col-sm-10 of">
            <div className="container-fluid">
              <h4 className="mt-2">
                Faculty List
                <div className="float-right">
                  <div
                    className="btn-group btn-group-toggle btn-sm"
                    data-toggle="buttons"
                  >
                    <label
                      className="btn btn-secondary btn-sm"
                      onClick={this.handleListView}
                    >
                      <MdFormatListBulleted color="white" />
                    </label>
                    <label
                      className="btn btn-secondary active btn-sm"
                      onClick={this.handleCardView}
                    >
                      <MdViewAgenda color="white" />
                    </label>
                  </div>
                </div>
              </h4>
              <hr />
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="filtersearch">
                    <MdSearch /> Search
                  </span>
                </div>
                <input
                  type="text"
                  name="filter"
                  id="filter"
                  className="form-control"
                  placeholder="Filter Faculty"
                  onChange={this.filter}
                  aria-describedby="filtersearch"
                />
              </div>
              <hr />
              <div className="row">
                {this.state.isLoading ? (
                  <p>Loading...</p>
                ) : (
                  this.renderCardData()
                )}
              </div>
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
    faculty: store.faculty,
  }),
  { getFaculty }
)(FacultyList);
