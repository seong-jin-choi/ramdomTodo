import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const MONGO_URL_PROD = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gptfxzd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URL_PROD);
const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (error: any) => console.log(`Error on DB Connection:${error}`);

db.once("open", handleOpen);
db.on("error", handleError);
