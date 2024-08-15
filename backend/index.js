const express = require("express");
const app = express();
const cors = require("cors");
const rootRoute = require("./routes/index");
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/v1", rootRoute);

app.use(function (req, res, err, next) {
  res.json({ msg: "some error occured" });
  next();
});
app.listen(port);
