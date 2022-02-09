if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: "config/.env" });
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const routes = require("./routes");
const redisClient = require("./config/redisClient");

const app = express();
const port = process.env.PORT || "5000";

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(fileUpload());

redisClient.connect();
routes(app);

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`);
  process.exit(1);
});
