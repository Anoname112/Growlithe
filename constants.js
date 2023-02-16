const interval = 10;
const gSpeed = 3;
const scaling = 3;
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

const bodyBackColor = "#222";
const bodyTextColor = "#000";
const bodyFontSize = 15;
const bodyFont = bodyFontSize + "px Consolas";

const canvasBorderRadius = 0;
const canvasBackColor = "#eee";
const canvasPosition = "fixed";
const canvasWidth = tileSize * tileWidth;
const canvasHeight = tileSize * tileHeight;

const controlPosition = "fixed";
const controlWidth = canvasHeight / 2;
const controlHeight = canvasHeight;
const arrowColor = "#f2f2f2";
const arrowUpSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-up" width="' + controlWidth + '" height="' + controlWidth + '" viewBox="0 0 24 24" stroke-width="2" stroke="' + arrowColor + '" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path></svg>';
const arrowDownSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-big-down" width="' + controlWidth + '" height="' + controlWidth + '" viewBox="0 0 24 24" stroke-width="2" stroke="' + arrowColor + '" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"></path></svg>';

const gameStatsBackColor = "#f2f2f2";
const gameStatsPosition = "fixed";
const gameStatsWidth = canvasWidth;
const gameStatsHeight = 23;
const gameStatsPadding = 3;
const gameStatsBorder = "1px solid #aaa";
const gameStatsVisibility = "visible";
const gameStatsSeparator = " | ";

const audioVisibility = "hidden";

const bgmPath = "resources/bgm.mp3";
const cryPath = "resources/058.ogx";