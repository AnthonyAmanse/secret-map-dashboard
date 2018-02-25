/*global document:false alert:false XMLHttpRequest:false */

let searchButton = document.getElementById("submit-contract-id");

if (searchButton) {
  searchButton.addEventListener("click", searchContractById);
}

function searchContractById() {
  var type = "query";
  var userId = "06f2a544-bcdd-4b7d-8484-88f693e10aae"; // SHOULD BE A SELLER ID
  var fcn = "getState"
  var args = $('#contract-id').val().split(',');
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
    url: "http://148.100.98.53:3000/api/execute",
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
    $.get("http://148.100.98.53:3000/api/results/" + resultId).done(function (data) {
      data = typeof data !== "string" ? data : JSON.parse(data);
      //console.log(" Status  " + data.status);
      if(data.status === "done") {
        console.log(JSON.parse(data.result));
        if (queryOrInvoke == "query") {
          updateDashboard(JSON.parse(data.result));
        } else {
          updateRightContents(JSON.parse(data.result));
        }
      } else {
        setTimeout(function () {
          getResults(resultId, attemptNo + 1, queryOrInvoke);
        }, 3000);
      }
    }).fail(function () {
      console.log("error");
    });
  } else {
    console.error("exceeded Number of attempts");
  }
}

function updateDashboard(receivedPayload) {
  if (JSON.parse(receivedPayload.result).response == "") {
    console.log("contract not found...")
    let contractNotFound = "<div class='not-found'>Contract Not Found</div>";
    $("div#content").text("");
    $("div#content").addClass("not-found");

    $(contractNotFound).hide().appendTo("#content").fadeIn(1000);
  } else {
    let contractData = JSON.parse(receivedPayload.result);
    console.log(contractData);
    let tableOfContract = "<div class='contract-details'>" +
    "<table class='contract-table'>" +
    "<tr class='contract-id-row'><td colspan='2'><span>" + contractData['id'] + "</span><br/><span class='contract-label'>Contract ID</span></td></tr>" +
    "<tr class='contract-user-row'><td colspan='2'><span>" + contractData['userId'] + "</span><br/><span class='contract-label'>User ID</span></td></tr>" +
    "<tr class='contract-product-row'><td class='product-name'>" + contractData['productId'] + "</td><td class='product-quantity'><span>x " + contractData['quantity'] + "</span><br/><span class='contract-label'>Quantity</span></td></tr>" +
    "<tr class='contract-total-row'><td colspan='2'><span>" + contractData['cost'] + "</span> <span class='contract-label'> Fitcoins</span></td></tr>" +
    "</table></div>";

    let rightSide = "";
    const state = contractData.state;
    if (state == "pending") {
      rightSide = "<div class='buttons'>" +
      "<button id='complete-button' onclick='completeTransaction()'>Complete</button>" +
      // "<span>Transaction payload?</span>" +
      "<button id='decline-button' onclick='declineTransaction()'>Decline</button>" +
      "</div>";
    } else {
      rightSide = "<div class='buttons'><div class='transaction-payload'>The transaction has already been " +
      state + "d</div></div>";
    }
    $("div#content").text("");
    $("div#content").removeClass("not-found");
    const combinedData = tableOfContract + rightSide;
    $(combinedData).hide().appendTo("#content").fadeIn(1000);
  }
}

function updateRightContents(receivedPayload) {
  $("div.buttons").text("");
  let rightSide = "<div class='transaction-payload'>" + JSON.stringify(receivedPayload) + "</div>";
  $(rightSide).hide().appendTo(".buttons").fadeIn(1000);
}

function completeTransaction() {
  var type = "invoke";
  var userId = "06f2a544-bcdd-4b7d-8484-88f693e10aae"; // SHOULD BE A SELLER ID
  var fcn = "transactPurchase"
  var args = $('#contract-id').val().split(',');
  args.push("complete");
  args.unshift(userId);
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
  requestServer(input, "invoke");
}

function declineTransaction() {
  var type = "invoke";
  var userId = "06f2a544-bcdd-4b7d-8484-88f693e10aae"; // SHOULD BE A SELLER ID
  var fcn = "transactPurchase"
  var args = $('#contract-id').val().split(',');
  args.push("declined");
  args.unshift(userId);
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
  requestServer(input, "invoke");
}