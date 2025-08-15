const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const nodemailer = require("nodemailer");
const transport = require("nodemailer-smtp-transport");
require("dotenv").config();


const options = {
  service: "gmail",
  auth: {
    user: process.env.EMAILFROM,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
const client = nodemailer.createTransport(transport(options));



exports.register = async (req, res, next) => {
  console.log("Registration request received");

  try {
    // Create new student
    const student = await db.Student.create(req.body);
    console.log("student", student);

    if (!student) {
      const err = new Error("Something went wrong. Please try again!");
      return next(err);
    }

    // Prepare welcome email
    const emailContent = `
      <h2>Welcome to IMS!</h2>
      <h4>Your registration as a student was successful.</h4>
    `;

    const email = {
      from: process.env.EMAILFROM,
      to: student.emailId,
      subject: "Registration Successful",
      html: emailContent,
    };

    // Send email
    client.sendMail(email, (err, info) => {
      if (err) {
        console.error("Email sending failed:", err);
        // Still respond with success even if email fails
        return res.status(201).json({
          message: "Registration successful, but email could not be sent.",
          student: {
            id: student.id,
            username: student.username,
            emailId: student.emailId,
          },
        });
      }

      // Respond with success
      res.status(201).json({
        message: "Registration successful. Welcome email sent.",
        student: {
          id: student.id,
          username: student.username,
          emailId: student.emailId,
        },
      });
    });
  } catch (err) {
    // Handle duplicate username error
    if (err.code === 11000) {
      err.message = "Sorry, username is already taken.";
    }
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const student = await db.Student.findOne({ username: req.body.username });

    if (!student) {
      throw new Error("Invalid username/password");
    }

    const valid = await student.comparePassword(req.body.password);
    if (!valid) {
      throw new Error("Invalid username/password");
    }

    const token = jwt.sign(
      { id: student.id, username: student.username },
      process.env.SECRET
    );

    res.json({ id: student.id, username: student.username, token });
  } catch (err) {
    err.message = "Invalid username/password";
    next(err);
  }
};

exports.genPassword = () => {
  var length = 10,
    charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@_",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { username, emailId, role } = req.body;
    var user;
    if (role === "student") {
      user = await db.Student.findOne({
        username: username,
        emailId: emailId,
      });
    } else {
      user = await db.Faculty.findOne({
        username: username,
        emailId: emailId,
      });
    }
    if (!user) {
      let err = new Error();
      err.message =
        "Sorry, the credentials do not match with the one in the database.";
      next(err);
    } else {
      let tempPwd = this.genPassword();
      user.password = tempPwd;
      user.save();
      var email = {
        from: process.env.EMAILFROM,
        to: emailId,
        subject: "Password Changed.",
        html:
          "Your request for password reset has been approved." +
          "<br />You can login to IMS using this temporary password: <br /><b>" +
          tempPwd +
          "</b>",
      };
      client.sendMail(email, (err, info) => {
        if (err) {
          err.message = "Could not send email" + err;
        } else if (info) {
          let message = "Email sent successfully";
          return res.status(200).json({ message });
        }
      });
    }
  } catch (err) {
    err.message = "Could not reset password. Please try again.";
    next(err);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    const details = req.body;
    const student = await db.Student.findById(id);

    for (var key of Object.keys(details)) {
      student[key.toString()] = details[key];
    }
    student.save();
    const { name, currentClass, rollNo, prevSemAttendance, emailId } = student;
    res
      .status(200)
      .json({ name, currentClass, rollNo, prevSemAttendance, emailId });
  } catch (err) {
    err.message = "Could not update";
    next(err);
  }
};

exports.getStudentDetails = async (req, res, next) => {
  try {
    const { id } = req.decoded;

    const student = await db.Student.findById(id);
    if (!student) {
      throw new Error("No student found");
    }
    res.status(200).json(student);
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

exports.resetStudentPassword = async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  const { id } = req.decoded;
  try {
    const Stud = await db.Student.findById({ _id: id });
    const valid = await Stud.comparePassword(oldpassword);
    if (valid) {
      const newhashed = await bcrypt.hash(newpassword, 10);
      const Profile = await db.Student.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            password: newhashed,
          },
        },
        { new: true }
      );
      if (Profile) {
        return res.status(200).json(Profile);
      } else {
        throw new Error("Student not found!");
      }
    } else {
      throw new Error("Old password is wrong!");
    }
  } catch (err) {
    next(err);
  }
};




exports.resetUserPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password:newpassword } = req.body;
  console.log("req.body",req.body);

  try {
    // Try to find in Students first
    let user =
      (await db.Student.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })) ||
      (await db.Faculty.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      }));

      console.log("user",user);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    // Hash and update password
    user.password = newpassword ;

    // Clear token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};



