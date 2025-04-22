import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import taskRoutes from "./routes/task.js";
import authRoutes from "./routes/auth.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {console.log("MongoDB connected successfully")}).catch((err) => {console.log("MongoDB connection error: ", err)});

// routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

