function createTL() {
  $.ajax({
    method: "GET",
    url: "/api/getTransactions/",
    data: {}
  }).done(function(rows){
    console.log("Request to fetch transactions");
    if("error" in rows){
      console.log(rows["error"]);
    } else {
      $("#tl").html('')
      var tList = '';
      for(var i=0; i<rows.length; i++){
        tList += '<li>ID: ' + JSON.stringify(rows[i]["id"]) + ' - ' + JSON.stringify(rows[i]["text"]) + '- $' + JSON.stringify(rows[i]["amount"]) + '</li>';
      }
      $("#tl").html(tList);
    }
  });
}

function getBalance(){
  $.ajax({
    method: "GET",
    url: "/api/getBalance/",
    data: {}
  }).done(function(data){
    if("error" in data){
      console.log(data["error"]);
    } else {
      console.log(JSON.stringify(data["balance"]["ROUND(TOTAL(amount), 2)"]));
      document.getElementById('balance').innerHTML = JSON.stringify(data["balance"]["ROUND(TOTAL(amount), 2)"]);
    }
  });
}

function getIncome(){
  $.ajax({
    method: "GET",
    url: "/api/getIncome/",
    data: {}
  }).done(function(data){
    if("error" in data){
      console.log(data["error"]);
    } else {
      console.log(JSON.stringify(data["income"]["ROUND(TOTAL(amount), 2)"]));
      document.getElementById('income').innerHTML = JSON.stringify(data["income"]["ROUND(TOTAL(amount), 2)"]);
    }
  });
}

function getExpenses(){
  $.ajax({
    method: "GET",
    url: "/api/getExpenses/",
    data: {}
  }).done(function(data){
    if("error" in data){
      console.log(data["error"]);
    } else {
      console.log(JSON.stringify(data["expense"]["ROUND(TOTAL(amount), 2)"]));
      document.getElementById('expense').innerHTML = JSON.stringify(data["expense"]["ROUND(TOTAL(amount), 2)"]);
    }
  });
}

function addTransaction(){
  $.ajax({
    method: "POST",
    url: "/api/addTransaction/",
    data: {
      text: $("#label").val(),
      amount: $("#amount").val()
    }
  }).done(function(data){
    console.log("Request to add transaction: " + JSON.stringify(data));
    if("error" in data){
      console.log(data["error"]);
    } else{
        createTL();
        getBalance();
        getIncome();
        getExpenses();
    }
  });
}

function updateTransaction(){
  $.ajax({
    method: "PUT",
    url: "/api/updateTransaction/",
    data: {
      id: $("#updateID").val(),
      text: $("#updateLabel").val(),
      amount: $("#updateAmount").val()
    }
  }).done(function(data){
    console.log("Request to update transaction: " + JSON.stringify(data));
    if("error" in data){
      console.log(data["error"]);
    } else{
        createTL();
        getBalance();
        getIncome();
        getExpenses();
    }
  });
}

function deleteTransaction(id) {
  $.ajax({
    method: "DELETE",
    url: "/api/deleteTransaction/",
    data: {
      id: $("#identifier").val()
    }
  }).done(function(data){
    console.log("Request to delete transaction with ID: "+ id);
    if("error" in data){
      console.log(data["error"]);
    } else {
      console.log(data["transactionDeleted"]);
      createTL();
      getBalance();
      getIncome();
      getExpenses();
    }
  });
}

function deleteAll(){
  $.ajax({
    method: "DELETE",
    url: "/api/deleteAll/",
    data: {}
  }).done(function(data){
    console.log("Request to delete all transactions");
    if("error" in data) {
      console.log(data["error"]);
    } else {
      console.log(data["deleteAll"]);
      createTL();
      getBalance();
      getIncome();
      getExpenses();
    }
  });
}

$(function(){
  $("#addSubmit").on('click', function(){ addTransaction(); });
  $("#deleteSubmit").on('click', function(){ deleteTransaction(); });
  $("#updateSubmit").on('click', function(){ updateTransaction(); });
});
