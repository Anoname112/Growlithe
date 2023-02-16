var canvas;
var control;
var arrowUp;
var arrowDown;
var context;
var hidden;
var bgm;
var cry;

var images = [];
var imgBackground = newImg("resources/background.png");
var imgStand = newImg("resources/stand.png");
var imgMove1 = newImg("resources/move1.png");
var imgMove2 = newImg("resources/move2.png");
var imgHurt = newImg("resources/hurt.png");
var imgBush = newImg("resources/bush.png");
var imgRock = newImg("resources/rock.png");
var imgVoltrobLeft = newImg("resources/voltrob_left.png");
var imgVoltrobRight = newImg("resources/voltrob_right.png");
var imgControl = newImg("resources/control.png");
var imgYouWin = newImg("resources/you_win.png");
var playerImages;
var voltrobImages;

var invincibleTime;
var gameSpeed;
var backgroundMovement;
var playerLocation;
var bushes;
var rocks;
var voltrobs;
var hurdleDelay1;
var hurdleDelay2;
var hits;
var score;
var start;
var win;

// inputs
var inputKeyUp;
var inputKeyDown;
var inputKeyX;
var inputMouseUp;
var inputMouseDown;

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
	context.fillStyle = s == null ? "#000" : s;
	context.fillRect(x, y, w, h);
}

function drawImage (img, x, y, w, h) {
	w = (w == null) ? img.width : w;
	h = (h == null) ? img.height : h;
	context.drawImage(img, x, y, w, h);
}

function drawMessage (msg, x, y) {
	context.font = bodyFont;
	context.fillStyle = "#000";
	context.fillText(msg, x, y + bodyFontSize);
}

function playAudio (audio) {
	audio.currentTime = 0;
	audio.play();
}

function floorTen (x) {
	return Math.floor(x / 10) * 10;
}

function attemptHurdleGeneration () {
	var generated = false;
	if (Math.random() < hurdleGenerationRate) {
		generated = true;
		var randomizer = Math.floor(Math.random() * 10) + 1;
		var y = Math.floor(Math.random() * laneCount) + laneY;
		switch (randomizer) {
			case 1:
			case 2:
			case 3:
				// Generate a Voltrob
				voltrobs.push(Object.Voltrob(-2, y));
				break;
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
				// Generate an rock
				rocks.push(Object.Rock(-2, y));
				break;
			default:
				break;
		}
	}
	return generated;
}

function init () {
	initDocument();
	initGame();
	
	start = false;
	message = "CLICK OR PRESS ENTER TO START PLAYING";
	drawMessage(message, (canvas.width - (message.length * 8)) / 2, (canvas.height - bodyFontSize) / 2);
	
	var contentLoaded = false;
	while (!contentLoaded) {
		contentLoaded = true;
		for (var i = 0; i < images.length; i++) {
			if (!images[i].complete) contentLoaded = false;
		}
		if (contentLoaded) {
			setInterval(timerTick, interval);
		}
	}
}

function initDocument () {
	document.body.style.background = bodyBackColor;
	document.body.style.color = bodyTextColor;
	document.body.style.font = bodyFont;
	document.body.addEventListener("touchstart", touchStart, false);
	document.body.addEventListener("touchend", touchEnd, false);
	
	canvas = document.getElementById("myCanvas");
	canvas.style.background = canvasBackColor;
	canvas.style.position = canvasPosition;
	canvas.style.borderRadius = canvasBorderRadius;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	updateCanvasLocation();
	context = canvas.getContext("2d");
	context.imageSmoothingEnabled = false;
	
	control = document.getElementById("control");
	control.style.position = controlPosition;
	control.width = controlWidth;
	control.height = controlHeight;
	updateControlLocation();
	
	arrowUp = document.getElementById("arrowUp");
	arrowUp.onmousedown = arrowUpMouseDown;
	arrowUp.onmouseup = arrowUpMouseUp;
	arrowUp.innerHTML = arrowUpSvg;
	
	arrowDown = document.getElementById("arrowDown");
	arrowDown.onmousedown = arrowDownMouseDown;
	arrowDown.onmouseup = arrowDownMouseUp;
	arrowDown.innerHTML = arrowDownSvg;
	
	gameStats = document.getElementById("gameStats");
	gameStats.style.padding = gameStatsPadding;
	gameStats.style.border = gameStatsBorder;
	gameStats.style.background = gameStatsBackColor;
	gameStats.style.position = gameStatsPosition;
	gameStats.style.visibility = gameStatsVisibility;
	updateGameStatsLocation();
	
	hidden = document.getElementById("hiddenArea");
	hidden.style.visibility = "hidden";
	hidden.innerHTML += "<audio id=\"bgm\" autoplay loop><source src=\"" + bgmPath + "\" /></audio>";
	hidden.innerHTML += "<audio id=\"cry\"><source src=\"" + cryPath + "\" /></audio>";
	bgm = document.getElementById("bgm");
	bgm.style.visibility = audioVisibility;
	bgm.addEventListener('ended', function () {
		this.currentTime = 0;
		this.play();
	}, false);
	cry = document.getElementById("cry");
	cry.style.visibility = audioVisibility;
}

function initGame () {
	win = false;
	hits = 0;
	score = 0;
	invincibleTime = invinTime * 0.75;
	backgroundMovement = 0;
	gameSpeed = gSpeed;
	playerLocation = {
		x: tileSize * 9,
		y: tileSize * 5
	}
	playerImages = [];
	playerImages.push(imgMove1);
	playerImages.push(imgStand);
	playerImages.push(imgMove2);
	playerImages.push(imgStand);
	playerImages.push(imgHurt);
	
	voltrobImages = [];
	voltrobImages.push(imgVoltrobLeft);
	voltrobImages.push(imgVoltrobRight);
	
	bushes = [];
	bushes.push(new Object(1, 0));
	bushes.push(new Object(6, 0));
	bushes.push(new Object(3, 1));
	bushes.push(new Object(7, 7));
	
	rocks = [];
	voltrobs = [];
	hurdleDelay1 = 0;
	hurdleDelay2 = 0;
}

function restartGame () {
	initGame();
}

function timerTick () {
	if (!win && start) {
		// Game movements
		if (invincibleTime > 0) invincibleTime--;
		else score += 1;
		if (score == winScore) win = true;
		backgroundMovement = (backgroundMovement + gameSpeed) % (tileSize * 2);
		for (var i = 0; i < bushes.length; i++) bushes[i].X += gameSpeed;
		for (var i = 0; i < rocks.length; i++) rocks[i].X += gameSpeed;
		for (var i = 0; i < voltrobs.length; i++) {
			voltrobs[i].X += gameSpeed;
			if (voltrobs[i].Y <= (laneY - 1) * tileSize) {
				voltrobs[i].Y = (laneY - 1) * tileSize;
				voltrobs[i].Direction = 1;
			}
			else if (voltrobs[i].Y >= (laneY + laneCount) * tileSize) {
				voltrobs[i].Y = (laneY + laneCount) * tileSize;
				voltrobs[i].Direction = -1;
			}
			voltrobs[i].Y += gameSpeed / 2 * voltrobs[i].Direction;
		}
		
		// Input processing
		if ((inputKeyUp || inputMouseUp) && playerLocation.y > tileSize * (laneY + 1)) playerLocation.y -= scaling * gameSpeed / 2;
		if ((inputKeyDown || inputMouseDown) && playerLocation.y < tileSize * (laneY + laneCount)) playerLocation.y += scaling * gameSpeed / 2;
		
		// Collision check
		if (invincibleTime == 0) {
			for (var i = playerLocation.x + (imgStand.width / 4 * scaling); i < playerLocation.x + (imgStand.width * 2 / 3 * scaling); i++) {
				for (var j = playerLocation.y - 1; j >= playerLocation.y - (imgStand.height / 2 * scaling); j--) {
					// Collision with rocks
					for (var k = 0; k < rocks.length; k++) {
						if (i >= rocks[k].X && i < rocks[k].X + imgRock.width * scaling &&
							j >= rocks[k].Y && j < rocks[k].Y + imgRock.height * scaling) {
							invincibleTime = invinTime;
							hits++;
							score -= hitPenalty;
							if (score < 0) score = 0;
							playAudio(cry);
							break;
						}
					}
					// Collision with voltrobs
					for (var k = 0; k < voltrobs.length; k++) {
						if (i >= voltrobs[k].X && i < voltrobs[k].X + imgVoltrobLeft.width * scaling &&
							j >= voltrobs[k].Y && j < voltrobs[k].Y + imgVoltrobLeft.height * scaling) {
							invincibleTime = invinTime;
							hits++;
							score -= hitPenalty;
							if (score < 0) score = 0;
							playAudio(cry);
							break;
						}
					}
					if (invincibleTime > 0) break;
				}
				if (invincibleTime > 0) break;
			}
		}
		
		
		// Delete objects
		for (var i = 0; i < bushes.length; i++) if (bushes[i].X > canvasWidth) bushes.splice(i, 1);
		for (var i = 0; i < rocks.length; i++) if (rocks[i].X > canvasWidth) rocks.splice(i, 1);
		for (var i = 0; i < voltrobs.length; i++) if (voltrobs[i].X > canvasWidth) voltrobs.splice(i, 1);
		
		// Generate objects
		if (backgroundMovement % tileSize == 0) {
			// Generate bushes
			for (var i = 0; i < tileHeight; i++) {
				if (i < laneY - 1 || i > (laneY + laneCount)) {
					if (Math.random() < bushGenerationRate) bushes.push(new Object(-2, i));
				}
			}
			
			// Generate hurdles
			if (hurdleDelay1 > 0) {
				if (hurdleDelay2 == 0) {
					if (attemptHurdleGeneration()) hurdleDelay2 = 2;
				}
				else hurdleDelay2--;
				hurdleDelay1--;
			}
			else {
				if (hurdleDelay2 == 0) {
					if (attemptHurdleGeneration()) hurdleDelay1 = 2;
				}
				else hurdleDelay2--;
			}
		}
		
		// Drawing
		var backgroundX = backgroundMovement - (tileSize * 2);
		var backgroundWidth = imgBackground.width * scaling;
		var backgroundHeight = imgBackground.height * scaling;
		var playerImageDirectory = (invincibleTime > invinTime * 0.75) ? 4 : parseInt((backgroundMovement % tileSize) / (tileSize / (playerImages.length - 1)));
		var playerY = playerLocation.y - (playerImages[playerImageDirectory].height * scaling);
		var playerWidth = playerImages[playerImageDirectory].width * scaling;
		var playerHeight = playerImages[playerImageDirectory].height * scaling;
		var voltrobImageDirectory = parseInt((backgroundMovement % tileSize) / (tileSize / voltrobImages.length));
		drawImage(imgBackground, backgroundX, 0, backgroundWidth, backgroundHeight);
		for (var i = 0; i < bushes.length; i++) drawImage(imgBush, bushes[i].X, bushes[i].Y, imgBush.width * scaling, imgBush.height * scaling);
		for (var i = 0; i < rocks.length; i++) drawImage(imgRock, rocks[i].X, rocks[i].Y, imgRock.width * scaling, imgRock.height * scaling);
		for (var i = 0; i < voltrobs.length; i++) {
			var width = voltrobImages[voltrobImageDirectory].width * scaling;
			var height = voltrobImages[voltrobImageDirectory].height * scaling;
			drawImage(voltrobImages[voltrobImageDirectory], voltrobs[i].X, voltrobs[i].Y, width, height);
		}
		drawImage(playerImages[playerImageDirectory], playerLocation.x, playerY, playerWidth, playerHeight);
		if (win) {
			context.globalAlpha = 0.3;
			fillRect(0, 0, canvasWidth, canvasHeight);
			context.globalAlpha = 1.0;
			
			var youWinX = (canvasWidth - imgYouWin.width) / 2;
			var youWinY = (canvasHeight - imgYouWin.height) / 2;
			drawImage(imgYouWin, youWinX, youWinY);
		}
		
		// Update game stats
		var string = "Hits: " + hits + gameStatsSeparator + "Score: " + score;
		if (win) string += gameStatsSeparator + "Press Enter to restart";
		gameStats.innerHTML = string;
	}
}

function arrowUpMouseDown (e) {
	inputMouseUp = true;
}

function arrowUpMouseUp (e) {
	inputMouseUp = false;
}

function arrowDownMouseDown (e) {
	inputMouseDown = true;
}

function arrowDownMouseUp (e) {
	inputMouseDown = false;
}

function touchStart (e) {
	var controlCanvasY = e.touches[0].pageY;
	if (controlCanvasY < window.innerHeight / 2) inputMouseUp = true;
	else inputMouseDown = true;
}

function touchEnd (e) {
	inputMouseUp = inputMouseDown = false;
	if (!start) {
		start = true;
		bgm.play();
	}
	if (win) restartGame();
}

function onKeyDown (e) {
	toggleKeyInput(e.keyCode, true);
}

function onKeyUp (e) {
	toggleKeyInput(e.keyCode, false);
}

function toggleKeyInput (key, bool) {
	switch (key) {
		case 13:	// Enter
			if (!start) {
				start = true;
				bgm.play();
			}
			if (win) restartGame();
			break;
		case 38:	// Up
			inputKeyUp = bool;
			break;
		case 40:	// Down
			inputKeyDown = bool;
			break;
		case 88:	// X
			break;
		default:
			break;
	}
}

function onMouseUp (e) {
	if (!start) {
		start = true;
		bgm.play();
	}
	if (win) restartGame();
}

function onResize () {
	updateCanvasLocation();
	updateControlLocation();
	updateGameStatsLocation();
}

window.onload = function () {
	window.onkeydown = onKeyDown;
	window.onkeyup = onKeyUp;
	window.onmouseup = onMouseUp;
	window.onresize = onResize;
	
	init();
}