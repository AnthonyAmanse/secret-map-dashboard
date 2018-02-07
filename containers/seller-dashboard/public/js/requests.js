/*global document:false alert:false XMLHttpRequest:false */

let searchButton = document.getElementById("submit-contract-id");
let xhttp = new XMLHttpRequest();

searchButton.addEventListener("click", searchContract)

function searchContract() {
  let _contractId = document.getElementById("contract-id").value;
  httpGetAsync("/emulate?contractId=" + _contractId, updateDashboard); // should be replaced with actual request to shop-backend API.
}

// Do a GET request to dummy GET API.
function httpGetAsync(url,callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

function updateDashboard(contractData) {
  contractData = JSON.parse(contractData);
  console.log(contractData);
  let tableOfContract = "<div class='contract-details'>" +
  "<table class='contract-table'>" +
  "<tr class='contract-id-row'><td colspan='2'>" + contractData['id'] + "</td></tr>" +
  "<tr class='contract-user-row'><td colspan='2'>" + contractData['userId'] + "</td></tr>" +
  "<tr class='contract-product-row'><td class='product-name'>" + contractData['productId'] + "</td><td class='product-quantity'><span>x " + contractData['quantity'] + "</span><br/><span class='contract-label'>Quantity</span></td></tr>" +
  "<tr class='contract-total-row'><td colspan='2'><span>" + contractData['totalPrice'] + "</span> <span class='contract-label'> Fitcoins</span></td></tr>" +
  "</table></div>";
  let rightSide = "<div class='buttons'>" +
  "<button id='complete-button'>Complete</button>" +
  "<span>Transaction payload?</span>" +
  "<button id='decline-button'>Decline</button>" +
  "</div>";

  $("div#content").text("");

  const combinedData = tableOfContract + rightSide;
  $(combinedData).hide().appendTo("#content").fadeIn(1000);

}