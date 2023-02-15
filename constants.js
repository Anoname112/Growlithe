const interval = 30;

const gSpeed = 4;
const scaling = 3;
const tileSize = 16 * scaling;
const tileWidth = 11;
const tileHeight = 8;
const laneY = 3;
const laneCount = 3;
const invinTime = 80;
const bushGenerationRate = 0.2;
const hurdleGenerationRate = 0.2;
const hurdleDelay = 3;
const hitPenalty = 300;

const bodyBackColor = "#222";
const bodyTextColor = "#000";
const bodyFont = "15px Consolas";

const canvasBorderRadius = 0;
const canvasBackColor = "#eee";
const canvasPosition = "fixed";
const canvasWidth = tileSize * tileWidth;
const canvasHeight = tileSize * tileHeight;

const controlPosition = "fixed";
const controlWidth = 55 * scaling;
const controlHeight = canvasHeight;

const gameStatsBackColor = "#f2f2f2";
const gameStatsPosition = "fixed";
const gameStatsWidth = canvasWidth;
const gameStatsHeight = 23;
const gameStatsPadding = 3;
const gameStatsBorder = "1px solid #aaa";
const gameStatsVisibility = "visible";

const audioVisibility = "hidden";

const bgmPath = "resources/bgm.mp3";
const cryPath = "resources/058.ogx";