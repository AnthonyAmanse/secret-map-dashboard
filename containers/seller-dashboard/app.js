const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

let port = process.env.PORT || 8000;

// dummy get request to emulate getContractById
app.get("/emulate", function (req,res) {
  const contractId = req.query.contractId;

  // Structure of Contract
  // Id        string `json:"id"`
	// SellerId  string `json:"sellerId"`
	// UserId    string `json:"userId"`
	// ProductId string `json:"productId"`
	// Quantity  int    `json:"quantity"`
	// Cost      int    `json:"price"`
  // State     string `json:"state"`
  
  // Dummy data
  let mockData = {
    id: contractId,
    userId: "USER-1234",
    productId: "Stickers",
    quantity: 2,
    totalPrice: 4,
    state: "pending"
  };

  res.send(mockData);
});

app.use(require("body-parser").json());
app.listen(port, function() {
  console.log("To view your app, open this link in your browser: http://localhost:" + port);
});