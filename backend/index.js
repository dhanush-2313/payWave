const express = require("express");
const app = express();
const cors = require("cors");
const rootRoute = require("./routes/index");

app.use(cors());
app.use(express.json());
app.use("/api/v1", rootRoute);

app.listen(3000);
