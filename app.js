require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ← Add this line
const app = express();

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const customerRoute = require("./routes/customer");
const cartRoute = require("./routes/cart");
const addressRoute = require("./routes/address");
const countryRoute = require("./routes/country");
const stateRoute = require("./routes/state");
const sliderRoute = require("./routes/slider");
const orderRoute = require("./routes/orders");
const paypalRoutes = require("./routes/paymentpaypal");


app.use(express.json());

app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use("/customer", customerRoute);
app.use("/cart", cartRoute);
app.use("/address", addressRoute);
app.use("/country", countryRoute);
app.use("/state", stateRoute);
app.use("/slider", sliderRoute);
app.use("/order", orderRoute);
app.use("/payments", paypalRoutes);



app.use("*", (req, res) => {
  res.status(404).json({
    msg: "Bad Request",
  });
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

module.exports = app;
