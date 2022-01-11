const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/main");
require("dotenv/config");

const app = express();

app.use(bodyParser.json());
app.use("/api", apiRoutes);

var PORT = process.env.PORT || 4444;

app.get("/", (req, res) => {
  res.status(200).send("Ticket Portal API Submission");
});

mongoose.connect(
  "mongodb+srv://admin:pass$12@cluster0.do7ow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
mongoose.connection
  .once("open", () => console.log(`Connected to the database successfully.\nServer live on ${PORT}`))
  .on("error", (error) => {
    console.warn("Warning", error);
  });

app.listen(PORT);