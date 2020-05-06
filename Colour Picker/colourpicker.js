var red = document.getElementById("red");
var blue = document.getElementById("blue");
var green = document.getElementById("green");
var background = document.body.style;
var sample = document.getElementById("colourSample").style;

var colour;

start();

function start(){
	document.getElementById("current").textContent = "Current Colour: " + getColour(red.value, green.value, blue.value);
}

function update(colour){
	background.backgroundColor = colour;
	sample.backgroundColor = colour;
}

function getColour(red, blue, green){
	return "rgb(" + red +", "+blue+", "+green+")";
}




red.addEventListener("input", function(){
	colour = getColour(red.value, green.value, blue.value);
	document.getElementById("current").textContent = "Current Colour: " + colour;
	update(colour);
});


blue.addEventListener("input", function(){
	colour = getColour(red.value, green.value, blue.value);
	document.getElementById("current").textContent = "Current Colour: " + colour;
	update(colour);
});


green.addEventListener("input", function(){
	colour = getColour(red.value, green.value, blue.value);
	document.getElementById("current").textContent = "Current Colour: " + colour;
	update(colour);
});