const express = require("express");
const dotEnv = require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
// const corsMiddleware = require("./middleware/corsHandler");
// const bodyParser = require("body-parser");
// console.log(dotEnv);

const contactRoutes = require("./routes/contactRoutes");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");

const port = process.env.PORT || 3000;
// app.use(corsMiddleware);
require("./config/db");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app;
//routes
app.use(errorHandler);
//listening the port here
app.listen(port, () => {
  console.log(`listening to the ${port}`);
});
