const express = require("express");
const morgan = require('morgan');
const dotEnv = require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
// app.use(morgan);
// const corsMiddleware = require("./middleware/corsHandler");
const bodyParser = require("body-parser");
// console.log(dotEnv);

const contactRoutes = require("./routes/contactRoutes");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");

const port = process.env.PORT || 3000;
// app.use(corsMiddleware);
require("./config/db");
app.use(express.json());
app.use(morgan('combined'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
//routes
app.use(errorHandler);
//listening the port here
app.listen(port, () => {
  console.log(`listening to the ${port}`);
});
