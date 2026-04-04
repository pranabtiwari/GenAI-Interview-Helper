import "dotenv/config";
import app from "./src/index.js";
import connectDB from "./config/db.js";


connectDB();


app.listen(3000, () => {
  console.log("running 3000");
});
