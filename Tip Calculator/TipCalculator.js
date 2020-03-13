var TipVal = document.querySelector("#tipAmount");
var TotalVal = document.querySelector("#total");
var TotalPer = document.querySelector('#app')
var submit = document.querySelector("#submit");


submit.addEventListener("click", function(){
	var subtotal = document.getElementById('subtotal').value;
	var tip = document.getElementById('tip').value;
	var split = parseInt(document.getElementById('people').value);
	TipVal.textContent = calculateTip(parseFloat(subtotal, 10), parseFloat(tip,10));
	TotalVal.textContent = calculateTotal(parseFloat(subtotal, 10), parseFloat(tip,10));
	TotalPer.textContent = (calculateTotal(parseFloat(subtotal, 10), parseFloat(tip,10))/split).toFixed(2);
})


function calculateTip(subtotal, tip){
	var tipAmount = (subtotal * (tip * 0.01)).toFixed(2);
	return tipAmount;
}

function calculateTotal(subtotal, tip){
	var total = (subtotal * (1 + (tip * 0.01))).toFixed(2);
	return total;
}
