const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

let port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});