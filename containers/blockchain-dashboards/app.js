const express = require("express");
const app = express();
const request =require("request");
// const basicAuth = require('basic-auth-connect');
// app.use(basicAuth('admin', 'ibmthinkdev1234'));

app.use(express.static(__dirname + "/public"));

let port = process.env.PORT || 8080;

const BLOCKCHAIN_URL = "http://169.61.3.247:3000";
const BLOCKCHAIN_SELLER_ID = "0e770097-58e2-47f0-b1e2-f13c4e013d21";

app.get("/contracts", function (req,res) {
  // res.send("All contracts");
  let input = {
    type: "query",
    queue: "seller_queue",
    params: {
      userId: BLOCKCHAIN_SELLER_ID,
      fcn: "getAllContracts",
      args: []
    }
  }
  let options = {
    url: BLOCKCHAIN_URL + "/api/execute",
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(options, function (err, _res, body) {
    if (err) _res.send(err);
    requestResults(JSON.parse(body).resultId, 0, res);
  });
});

function requestResults(resultId, attemptNo, callback) {
  let options = {
    url: BLOCKCHAIN_URL + "/api/results/" + resultId,
    method: "GET"
  }
  request(options, function (err, res, body) {
    if (err) res.send(err);
    if (JSON.parse(body).status == "done") {
      console.log(JSON.parse(body));
      const payload = JSON.parse(body).result;
      const resultPayload = JSON.parse(payload).result;
      callback.render('contracts', { list: JSON.parse(resultPayload)});
    } else {
      setTimeout(function () {
        console.log("Attempt no. " + attemptNo);
        requestResults(resultId, attemptNo++, callback);
      }, 1000);
    }
  });
}

// app.get("/contracts/:userId", function (req,res) {
//   res.send(req.params.userId);
// });

app.get("/shop", function (req,res) {
  res.sendFile("/shop.html", {root: __dirname + "/public" });
});

app.get("/products", function (req,res) {
  res.sendFile("/products.html", {root: __dirname + "/public" });
});

app.set('view engine', 'ejs');
app.use(require("body-parser").json());
app.listen(port, function() {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});