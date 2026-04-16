import "dotenv/config";
import app from "./src/index.js";
import connectDB from "./config/db.js";

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`running ${port}`);
});
