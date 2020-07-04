require("dotenv").config();
const http = require("http");

const { app } = require("./app");

http.createServer(app).listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
