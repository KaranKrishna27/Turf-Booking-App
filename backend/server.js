const express = require("express");
const userRoutes = require('./routes/userRoutes');
const turfRoutes = require("./routes/turfRoutes");
const bookingRoutes = require("./routes/bookingRoutes")
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config({path:"MERN Project/.env"});

const connectDB = require("./config/db");
connectDB();

app.use(express.json());
app.use(cors());

app.get("/",(req,res) =>{
    res.send("API is running...");
});


app.use('/api/users', userRoutes);
app.use("/api/turfs", turfRoutes);
app.use("/api/bookings", bookingRoutes)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
