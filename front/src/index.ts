import express from "express";

const app = express();
app.get("/", (_, res) => {
  res.send("<h1>Hibi</h1>");
});
let { PORT } = process.env;
if (PORT === undefined) {
  PORT = "3000";
}
app.listen(parseInt(PORT));
