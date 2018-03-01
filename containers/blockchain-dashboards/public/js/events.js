/*eslint no-undef:0*/

let BLOCKCHAIN_URL = "http://169.60.173.54:3000";
let BLOCKCHAIN_SOCKET = "http://169.60.173.54:3030"

class Events {
  constructor() {
    var self = this;
    self.block = io.connect(BLOCKCHAIN_SOCKET + '/block');
    self.block.on('block', (data) => {
      console.log(data);
      self.update(JSON.parse(data));
    });
    self.block.on('connect', () => {
      console.log("Connected");
    });
    self.requestBlocks();
  }
  requestBlocks() {
    var query = {
      type: "blocks",
      queue: "seller_queue",
      params: {
        "noOfLastBlocks": "20"
      }
    };
    var self = this;
    $.ajax({
      url: BLOCKCHAIN_URL + "/api/execute",
      type: "POST",
      data: JSON.stringify(query),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
        data = typeof data !== "string" ? data : JSON.parse(data);
        console.log(" Result ID " + data.resultId);
        self.getResults(data.resultId, 0, self);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
      }
    });
  }

  getResults(resultId, attemptNo, self) {
    if(attemptNo < 60) {
      //console.log("Attempt no " + attemptNo);
      $.get(BLOCKCHAIN_URL + "/api/results/" + resultId).done(function (data) {
        data = typeof data !== "string" ? data : JSON.parse(data);
        // console.log(" Status  " + data.status);
        if(data.status === "done") {
          self.loadBlocks(JSON.parse(data.result));
        } else {
          setTimeout(function () {
            self.getResults(resultId, attemptNo + 1, self);
          }, 3000);
        }
      }).fail(function () {
        console.log("error");
      });
    } else {
      console.error("exceeded Number of attempts");
    }
  }

  //{"id":"17","fingerprint":"151e2fec76aacd117276","transactions":[{"type":"ENDORSER_TRANSACTION","timestamp":"Fri Jan 19 2018 15:38:22 GMT-0800 (PST)"}]}
  update(eventData) {
    // var rowData = "<tr class='anim highlight'><td width='10%'>" + eventData["id"] + "</td><td width='20%'>" + eventData["fingerprint"] + "</td><td width='50%'>" + JSON.stringify(eventData["transactions"]) + "</td></tr>";
    // $(rowData).hide().prependTo('#table_view tbody').fadeIn("slow").addClass('normal');
    var formattedDate = new Date(eventData['transactions'][0]['timestamp']);
    var day = formattedDate.getDate();
    var month =  formattedDate.getMonth() + 1;
    var hours = formattedDate.getHours();
    var minutes = ("0" + formattedDate.getMinutes()).substr(-2);
    var seconds = ("0" + formattedDate.getSeconds()).substr(-2);
    var myDate = month + "/" + day + " - " + hours + ":" + minutes + ":" + seconds;
    var blockItem  = "<div>" +
      "<table class='blockTable'>" +
      "<tr  class='id'><td>" + eventData["id"] + "</td></tr>" +
      "<tr class='fingerprint'><td>Fingerprint:</td><td class='fingerprint-data'>" + eventData['fingerprint'] + "</td></tr>" +
      "<tr class='timestamp'><td colspan='2'>" + myDate + "</td></tr>";

      var transactions = "";
      eventData['transactions'].forEach(function (transaction) {
        transactions += "<tr class='payload'><td colspan='2'>" + transaction['execution_response'][0]['payload'] + "</td></tr>" +
        "<tr class='transactionId'><td colspan='2'>" + transaction['tx_id'] + "</td></tr>"  
      })

    blockItem = blockItem + transactions + "</table>" + "</div>";
    $(blockItem).hide().prependTo('.blocks').fadeIn("slow").addClass('block-item')
  }
  loadBlocks(data) {
    data = data === "string" ? JSON.parse(data) : data;
    // console.log(data);
    data = data.result.sort((a,b) => b.id - a.id);

    // data = (JSON.parse(data).result) // .sort((a, b) => parseInt(a.id) - parseInt(b.id));
    data.forEach(function(eventData) {
      console.log(eventData);
      var formattedDate = new Date(eventData['transactions'][0]['timestamp']);
      var day = formattedDate.getDate();
      var month =  formattedDate.getMonth() + 1;
      var hours = formattedDate.getHours();
      var minutes = ("0" + formattedDate.getMinutes()).substr(-2);
      var seconds = ("0" + formattedDate.getSeconds()).substr(-2);
      var myDate = month + "/" + day + " - " + hours + ":" + minutes + ":" + seconds;
      var blockItem  = "<div>" +
        "<table class='blockTable'>" +
        "<tr  class='id'><td>" + eventData["id"] + "</td></tr>" +
        "<tr class='fingerprint'><td>Fingerprint:</td><td class='fingerprint-data'>" + eventData['fingerprint'] + "</td></tr>" +
        "<tr class='timestamp'><td colspan='2'>" + myDate + "</td></tr>";

      var transactions = "";
      eventData['transactions'].forEach(function (transaction) {
        transactions += "<tr class='payload'><td colspan='2'>" + transaction['execution_response'][0]['payload'] + "</td></tr>" +
        "<tr class='transactionId'><td colspan='2'>" + transaction['tx_id'] + "</td></tr>"  
      })

      blockItem = blockItem + transactions + "</table>" + "</div>";
      $(blockItem).hide().appendTo('.blocks').fadeIn("slow").addClass('block-item')
      // var rowData = "<tr class='anim highlight'><td width='10%'>" + eventData["id"] + "</td><td width='20%'>" + eventData["fingerprint"] + "</td><td width='50%'>" + JSON.stringify(eventData["transactions"]) + "</td></tr>";
      // $(rowData).hide().appendTo('#table_view tbody').fadeIn("slow").addClass('normal');
    });
  }
}
new Events();