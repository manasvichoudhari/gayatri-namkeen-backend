require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminOfferRoutes = require("./routes/adminOfferRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const app = express();


// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


// Database + Server Start
const PORT = process.env.PORT || 5000;


connectDB()
.then(() => {

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });

})
.catch((err)=>{

  console.log("Database Connection Failed:", err.message);

});



// Test Route
app.get("/", (req,res)=>{

  res.send("API Running");

});



// Routes
app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/products", productRoutes);

app.use("/api/admin/users", adminUserRoutes);

app.use("/api/offers", adminOfferRoutes);

app.use("/api/payment", paymentRoutes);



// Error Catch
process.on("uncaughtException",(err)=>{

  console.log("Server Error:",err.message);

});