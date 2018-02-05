/*eslint no-undef:0*/
class Events {
  constructor() {
    //const socket = new WebSocket('ws://localhost:8080');;
    //socket.on('block', (evt) => this.doSocketMessage(evt));
    var ws = new WebSocket('ws://148.100.108.176:8080');
    var self = this;
    // Load initial data
    this.xhr = new XMLHttpRequest();
    this.xhr.addEventListener('load', () => this.loadData());
    this.xhr.open('GET', "http://148.100.108.176:3002/api/blocks?noOfLastBlocks=15", true);
    this.xhr.send(null);
    ws.onmessage = function(event) {
      console.log("Received Event ");
      console.log(JSON.parse(event.data));
      self.update(JSON.parse(event.data));
    };
    ws.onopen = function(event) {
      console.log("open on " + event);
      //  ws.send("hellow world");
    };
    ws.onerror = function(event) {
      console.log("Error on" + event);
    };
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
      "<tr class='fingerprint'><td>Fingerprint:</td><td>" + eventData['fingerprint'] + "</td></tr>" +
      "<tr class='timestamp'><td colspan='2'>" + myDate + "</td></tr>" +
      // "<tr class='message'><td>Message:</td></tr>" +
      "<tr class='message'><td colspan='2'>" + "Sample message? User has traded in footsteps or User has redeemed fitcoins for a shirt" + "</td></tr>" + // replace this with eventData's message
      // "<tr class='fingerprint'><td>Message:</td><td>" + eventData['transactions'][0]['execution_response'][0]['message'] + "</td></tr>" +
      "<tr class='payload'><td colspan='2'>" + "payload: {<br/><br/>}" + "</td></tr>" + // replace this with eventData's payload
      // "<tr class='fingerprint'><td>Message:</td><td>" + eventData['transactions'][0]['execution_response'][0]['payload'] + "</td></tr>" +
      "<tr class='transactionId'><td colspan='2'>" + eventData['transactions'][0]['tx_id'] + "</td></tr>" +
      "</table>" +
      "</div>";
    $(blockItem).hide().prependTo('.blocks').fadeIn("slow").addClass('block-item')
  }
  loadData() {
    var data = JSON.parse(this.xhr.responseText).result;
    data = (JSON.parse(data).result) // .sort((a, b) => parseInt(a.id) - parseInt(b.id));
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
        "<tr class='fingerprint'><td>Fingerprint:</td><td>" + eventData['fingerprint'] + "</td></tr>" +
        "<tr class='timestamp'><td colspan='2'>" + myDate + "</td></tr>" +
        // "<tr class='message'><td>Message:</td></tr>" +
        "<tr class='message'><td colspan='2'>" + "Sample message? User has traded in footsteps or User has redeemed fitcoins for a shirt" + "</td></tr>" + // replace this with eventData's message
        // "<tr class='fingerprint'><td>Message:</td><td>" + eventData['transactions'][0]['execution_response'][0]['message'] + "</td></tr>" +
        "<tr class='payload'><td colspan='2'>" + "payload: {<br/><br/>}" + "</td></tr>" + // replace this with eventData's payload
        // "<tr class='fingerprint'><td>Message:</td><td>" + eventData['transactions'][0]['execution_response'][0]['payload'] + "</td></tr>" +
        "<tr class='transactionId'><td colspan='2'>" + eventData['transactions'][0]['tx_id'] + "</td></tr>" +
        "</table>" +
        "</div>";
      $(blockItem).hide().appendTo('.blocks').fadeIn("slow").addClass('block-item')
      // var rowData = "<tr class='anim highlight'><td width='10%'>" + eventData["id"] + "</td><td width='20%'>" + eventData["fingerprint"] + "</td><td width='50%'>" + JSON.stringify(eventData["transactions"]) + "</td></tr>";
      // $(rowData).hide().appendTo('#table_view tbody').fadeIn("slow").addClass('normal');
    });
  }
}
new Events();
