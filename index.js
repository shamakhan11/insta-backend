import dotenv from "dotenv";
import express, { urlencoded } from "express" ;
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils.js/db.js";

dotenv.config({});
const app = express();

const PORT = process.env.PORT || 3000


app.get("/", (_,res) =>{
    return res.status(200).json({
        message : "i am running succesfully",
        success : true 
    })
})

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin : 'http://localhost:5137',
    credential : true
} 
app.use(cors(corsOptions))


app.listen(PORT, ()=>{
    connectDB();
    console.log(`server is running on port ${PORT}`)
})