const mongoose = require("mongoose");

mongoose.set("debug", true);

mongoose.Promise = global.Promise;

// mongoose.connect("mongodb://localhost/internship", {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify:false,
// });


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ Connection Error:", err));


module.exports.Student = require("./student");

module.exports.Internship = require("./internship");

module.exports.Notices = require("./notices");

module.exports.Faculty = require("./faculty");