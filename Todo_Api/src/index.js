import "dotenv/config"
import { app } from "./app"
import connectDB from "./db/db"

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running on port: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("mongodb connection failed!! ", err);
    })

