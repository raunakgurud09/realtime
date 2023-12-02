import dotenv from "dotenv";
import { httpServer } from "./app";
import connectDB from "./db/index";

dotenv.config({
  path: "./.env",
});

const majorNodeVersion = +process.env.NODE_VERSION?.split(".")[0] || 0;

const server = () => {
  httpServer.listen(process.env.PORT || 8080, () => {
    console.info(
      `📑 Visit the documentation at: http://localhost:${
        process.env.PORT || 8080
      }`
    );
    console.log("⚙️  Server is running on port: " + process.env.PORT);
  });
};

const Start = async function () {
  if (majorNodeVersion >= 14) {
    try {
      await connectDB();
      server();
    } catch (err) {
      console.log("Mongo db connect error: ", err);
    }
  } else {
    connectDB()
      .then(() => {
        server();
      })
      .catch((err) => {
        console.log("Mongo db connect error: ", err);
      });
  }
};

Start()