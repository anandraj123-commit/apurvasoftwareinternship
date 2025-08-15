const mongoose = require("mongoose");

mongoose.set("debug", true);

mongoose.Promise = global.Promise;

// mongoose.connect("mongodb://localhost/internship", {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify:false,
// });

mongoose.connect(
"mongodb+srv://Apurva_Software_Solutions:Apurvasoftwaresolutions12345@cluster0.safjqky.mongodb.net/internship?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Connection Error:", err));


module.exports.Student = require("./student");

module.exports.Internship = require("./internship");

module.exports.Notices = require("./notices");

module.exports.Faculty = require("./faculty");