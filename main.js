var canvas;
var ctx;
var control;
var arrowUp;
var arrowDown;
var hidden;
var bgm;
var cry;

var playerImages;
var voltrobImages;

var intervalId;
var start;
var win;
var hits;
var score;
var invincibleTime;
var gameSpeed;
var backgroundMovement;
var playerLocation;
var hurdleDelay1;
var hurdleDelay2;

var bushes;
var rocks;
var voltrobs;

// inputs
var inputKeyUp;
var inputKeyDown;
var inputKeyX;
var inputMouseUp;
var inputMouseDown;

window.onload = function () {
	window.oncontextmenu = onContextMenu;
	window.onresize = onResize;
	window.onkeydown = onKeyDown;
	window.onkeyup = onKeyUp;
	window.onblur = function () {
		//if (gState < 2) pause();
	};
	window.addEventListener("touchstart", onMouseDown, false);
	window.addEventListener("touchend", onMouseUp, false);
	window.onmousedown = onMouseDown;
	window.onmouseup = onMouseUp;
	
	init();
}

function init () {
	initDocument();
	initGame();
	
	start = false;
	message = "PRESS ENTER TO START PLAYING";
	drawMessage(message, canvas.width / 2, (canvas.height - bodyFontSize) / 2, "center");
	
	var contentLoaded = false;
	while (!contentLoaded) {
		contentLoaded = true;
		for (var i = 0; i < images.length; i++) {
			if (!images[i].complete) contentLoaded = false;
		}
		if (contentLoaded) {
			intervalId = setInterval(timerTick, interval);
		}
	}
}

function initDocument () {
	document.body.style.font = bodyFont;
	
	canvas = getElement("myCanvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	updateCanvasLocation();
	ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	
	control = getElement("control");
	control.width = controlWidth;
	control.height = controlHeight;
	updateControlLocation();
	
	arrowUp = getElement("arrowUp");
	arrowUp.onmousedown = arrowUpMouseDown;
	arrowUp.onmouseup = arrowUpMouseUp;
	arrowUp.innerHTML = arrowUpSvg;
	
	arrowDown = getElement("arrowDown");
	arrowDown.onmousedown = arrowDownMouseDown;
	arrowDown.onmouseup = arrowDownMouseUp;
	arrowDown.innerHTML = arrowDownSvg;
	
	gameStats = getElement("gameStats");
	updateGameStatsLocation();
	
	hidden = getElement("hiddenArea");
	hidden.style.visibility = "hidden";
	hidden.innerHTML += "<audio id=\"bgm\" autoplay loop><source src=\"" + bgmPath + "\" /></audio>";
	hidden.innerHTML += "<audio id=\"cry\"><source src=\"" + cryPath + "\" /></audio>";
	bgm = getElement("bgm");
	bgm.style.visibility = audioVisibility;
	bgm.addEventListener('ended', function () {
		this.currentTime = 0;
		this.play();
	}, false);
	cry = getElement("cry");
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

function onContextMenu (e) {
	e.preventDefault();
}

function onResize () {
	updateCanvasLocation();
	updateControlLocation();
	updateGameStatsLocation();
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

function onMouseDown (e) {
	console.log('here');
	var controlCanvasY = e.clientY;
	if (controlCanvasY < window.innerHeight / 2) inputMouseUp = true;
	else inputMouseDown = true;
}

function onMouseUp (e) {
	inputMouseUp = inputMouseDown = false;
	if (!start) {
		start = true;
		bgm.play();
	}
	if (win) restartGame();
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

function restartGame () {
	initGame();
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
			ctx.globalAlpha = 0.3;
			fillRect(0, 0, canvasWidth, canvasHeight);
			ctx.globalAlpha = 1.0;
			
			var youWinWidth = imgYouWin.width * scaling / pcScaling;
			var youWinHeight = imgYouWin.height * scaling / pcScaling;
			var youWinX = (canvasWidth - youWinWidth) / 2;
			var youWinY = (canvasHeight - youWinHeight) / 2;
			drawImage(imgYouWin, youWinX, youWinY, youWinWidth, youWinHeight);
		}
		
		// Update game stats
		var string = "Hits: " + hits + gameStatsSeparator + "Score: " + score;
		if (win) string += gameStatsSeparator + "Press Enter to restart";
		gameStats.innerHTML = string;
	}
}