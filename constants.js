const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isPortrait = window.innerWidth < window.innerHeight;

const interval = 10;
const gSpeed = 3;
const mobileScaling = 1.7;
const pcScaling = 3;
const scaling = isMobile ? mobileScaling : pcScaling;
const tileSize = 16 * scaling;
const tileWidth = 11;
const tileHeight = 8;
const laneY = 3;
const laneCount = 3;
const invinTime = 80;
const bushGenerationRate = 0.2;
const hurdleGenerationRate = 0.2;
const hitPenalty = 500;
const winScore = 2000;

// Body
const bodyMargin = "0";
const bodyBackColor = "#222222";
const bodyTextColor = "#000000";
const bodyFontSize = 15;
const bodyFont = bodyFontSize + "px Consolas";

// Canvas
const canvasBorderRadius = 0;
const canvasBackColor = "#EEEEEE";
const canvasWidth = tileSize * tileWidth;
const canvasHeight = tileSize * tileHeight;

// Control
const controlWidth = canvasHeight / 2;
const controlHeight = canvasHeight;
const arrowColor = "#F2F2F2";
const arrowUpSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + controlWidth + '" height="' + controlWidth + '" viewBox="0 0 24 24" stroke-width="2" stroke="' + arrowColor + '" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path></svg>';
const arrowDownSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + controlWidth + '" height="' + controlWidth + '" viewBox="0 0 24 24" stroke-width="2" stroke="' + arrowColor + '" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"></path></svg>';

const gameStatsBackColor = "#F2F2F2";
const gameStatsPosition = "fixed";
const gameStatsHeight = 23;
const gameStatsVisibility = "visible";
const gameStatsSeparator = " | ";

// Sound
const audioVisibility = "hidden";
const bgmPath = "resources/bgm.mp3";
const cryPath = "resources/058.ogx";

const images = [];
const imgBackground = newImg("resources/background.png");
const imgStand = newImg("resources/stand.png");
const imgMove1 = newImg("resources/move1.png");
const imgMove2 = newImg("resources/move2.png");
const imgHurt = newImg("resources/hurt.png");
const imgBush = newImg("resources/bush.png");
const imgRock = newImg("resources/rock.png");
const imgVoltrobLeft = newImg("resources/voltrob_left.png");
const imgVoltrobRight = newImg("resources/voltrob_right.png");
const imgControl = newImg("resources/control.png");
const imgYouWin = newImg("resources/you_win.png");
