const express = require("express");
const app = express();
const request =require("request");

app.use(express.static(__dirname + "/public"));

let port = process.env.PORT || 8080;

//getAllContracts
// var input = {
//   type: query,
//   params: {
//     userId: sellerID,
//     fcn: getAllContracts
//     args: (none)
//   }
// }
app.get("/contracts", function (req,res) {
  // res.send("All contracts");
  let input = {
    type: "query",
    params: {
      userId: "1cb20708-4979-45b3-bb7e-55a3e54944cb",
      fcn: "getAllContracts",
      args: []
    }
  }
  let options = {
    url: "http://148.100.108.176:3002/api/execute",
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
    url: "http://148.100.108.176:3002/api/results/" + resultId,
    method: "GET"
  }
  request(options, function (err, res, body) {
    if (err) res.send(err);
    if (JSON.parse(body).status == "done") {
      const payload = JSON.parse(body).result;
      const resultPayload = JSON.parse(payload).result;
      const contracts = JSON.parse(resultPayload).response;
      callback.render('contracts', { list: JSON.parse(contracts)});
    } else {
      setTimeout(function () {
        console.log("Attempt no. " + attemptNo);
        requestResults(resultId, attemptNo++, callback);
      }, 3000);
    }
  });
}

app.get("/contracts/:userId", function (req,res) {
  res.send(req.params.userId);
});

app.get("/shop", function (req,res) {
  res.sendFile("/shop.html", {root: __dirname + "/public" });
})

app.set('view engine', 'ejs');
app.use(require("body-parser").json());
app.listen(port, function() {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});