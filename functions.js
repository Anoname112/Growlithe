function getElement (id) {
	return document.getElementById(id);
}

function updateCanvasLocation () {
	canvas.style.left = (window.innerWidth - canvas.width) / 2;
	canvas.style.top = (window.innerHeight - canvas.height) / 2;
}

function updateControlLocation () {
	control.style.left = (window.innerWidth + canvas.width) / 2;
	control.style.top = (window.innerHeight - canvas.height) / 2;
}

function updateGameStatsLocation () {
	gameStats.style.left = (window.innerWidth - canvas.width) / 2;
	gameStats.style.top = (window.innerHeight - canvas.height) / 2 - gameStatsHeight;
}

function newImg (path) {
	var tempImg = new Image;
	tempImg.src = path;
	images.push(tempImg);
	return tempImg;
}

function fillRect (x, y, w, h, s) {
	ctx.fillStyle = s == null ? "#000000" : s;
	ctx.fillRect(x, y, w, h);
}

function drawImage (img, x, y, w, h) {
	w = (w == null) ? img.width : w;
	h = (h == null) ? img.height : h;
	ctx.drawImage(img, x, y, w, h);
}

function drawMessage (msg, x, y, align) {
	ctx.textAlign = (align == null) ? "start" : align;
	ctx.font = bodyFont;
	ctx.fillStyle = "#000000";
	ctx.fillText(msg, x, y + bodyFontSize);
	ctx.textAlign = "start";
}

function playAudio (audio) {
	audio.currentTime = 0;
	audio.play();
}

function floor (value, floor) {
	return Math.floor(value / floor) * floor;
}
