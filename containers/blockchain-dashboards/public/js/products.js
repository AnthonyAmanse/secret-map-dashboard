/*global document:false alert:false XMLHttpRequest:false */

let BLOCKCHAIN_URL = "http://169.61.3.247:3000";
let BLOCKCHAIN_SELLER_ID = "0e770097-58e2-47f0-b1e2-f13c4e013d21";

function getProductsForSale() {
  var type = "query";
  var userId = BLOCKCHAIN_SELLER_ID; // SHOULD BE A SELLER ID
  var fcn = "getProductsForSale"
  var args = []
  var input = {
    type: type,
    queue: 'seller_queue',
    params: {
      userId: userId,
      fcn: fcn,
      args: args
    }
  };

  console.log(input);
  requestServer(input, "query");
}

function requestServer(params, queryOrInvoke) {
  $.ajax({
    url: BLOCKCHAIN_URL + "/api/execute",
    type: "POST",
    data: JSON.stringify(params),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      data = typeof data !== "string" ? data : JSON.parse(data);
      //console.log(" Result ID " + data.resultId);
      getResults(data.resultId, 0, queryOrInvoke);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });
}
function getResults(resultId, attemptNo, queryOrInvoke) {
  if(attemptNo < 60) {
    //console.log("Attempt no " + attemptNo);
    $.get(BLOCKCHAIN_URL + "/api/results/" + resultId).done(function (data) {
      data = typeof data !== "string" ? data : JSON.parse(data);
      //console.log(" Status  " + data.status);
      if(data.status === "done") {
        console.log(JSON.parse(data.result));
        if (queryOrInvoke == "query") {
          var result = JSON.parse(data.result).result

          // this is an array
          console.log(JSON.parse(result));
          let productsJSON = JSON.parse(result);
          let productsCombined = ""
          productsJSON.forEach(function(product) {
            productsCombined = productsCombined + "<div class='blockOfProduct'><form action='/products.html' readonly>" +
            "<input tpye='text' name='productid' class='productid' value='" + product["productid"] + "' readonly>" +
            "<input tpye='text' name='name' class='name' value='" + product["name"] + "' readonly>" +
            "<input tpye='number' name='price' class='price' value='" + product["price"] + "' readonly>" +
            "<input tpye='number' name='count' class='count' value='" + product["count"] + "' readonly>" +
            "<input type='submit' value='Edit'></form></div>";
          });
          let contentOfProducts = productsCombined;
          $(contentOfProducts).hide().appendTo("#content").fadeIn(1000);
        } else {

        }
      } else {
        setTimeout(function () {
          getResults(resultId, attemptNo + 1, queryOrInvoke);
        }, 1000);
      }
    }).fail(function () {
      console.log("error");
    });
  } else {
    console.error("exceeded Number of attempts");
  }
}

getProductsForSale()