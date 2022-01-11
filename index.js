const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/main");
require("dotenv/config");

const app = express();

app.use(bodyParser.json());
app.use("/api", apiRoutes);

var PORT = process.env.PORT || 3003;

mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true });
mongoose.connection
  .once("open", () => console.log(`Connected to the database successfully.\nServer live on ${PORT}`))
  .on("error", (error) => {
    console.warn("Warning", error);
  });

app.listen(PORT);