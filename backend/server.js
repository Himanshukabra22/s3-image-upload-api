import express from "express";
import bodyParser from "body-parser";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
dotenv.config();
app.use(cors());

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const s3 = new AWS.S3();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", (req, res) => {
  var buf = Buffer.from(
    req.body.myFile.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  var data = {
    Key: "abcde",
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    ACL: "public-read",
    Bucket: "up-event-object-bucket",
  };

  s3.putObject(data, function (err, data) {
    if (err) {
      console.log(err);
      console.log("Error uploading data: ", data);
    } else {
      console.log("successfully uploaded the image!");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
