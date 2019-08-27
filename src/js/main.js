/**
 * Created by xaoyang on 12/13/13.
 */
 
var canvas;
var stage;
var level;
var contentManager;
var screen_width;
var screen_height;

var titleText;
var scoreText;
var timerText;
var timeText;
var pointText;
var pointInt = 0;
var fpsLabel;

var NUM_DRY = 10;
var NUM_WET = 15;
var NUM_RECYCLE = 16;
var NUM_HARMFUL = 8;
var NUM_BIN = 4;

// timer stuff
var currentCountDown;

var garbage;
var recycle;
var reuse;
var landfill;
var compost;

var INSTANCE_COUNT = 100;
var START_TIME = 20000; //ms
var WARNING_TIME = 10000; //ms
var GAME_TIME = 20; //s
var GAME_ON = true;
var FLAG = false; //是否在有效拖拽范围内
var SETTING = 'easy';
var XPOS = [135,230,325,420,515,610,705]; //随机X轴坐标
var BASELINE = 505; //底线y轴坐标

// checks to see if mobile
var isMobile;
var window_width;
var window_height;

// uses date.now() to set up timer
function createCountDown(timeRemaining) {
    var startTime = Date.now();
    return function() {
       return timeRemaining - ( Date.now() - startTime );
    }
}

// takes millseconds and converts to seconds with one digit following the period
function convertMStoS(num, p){
	p = typeof p !== 'undefined' ? p : 1;
	return (num/ 1000).toFixed();
}

// 绘制canvas 
function handleCanvas(){

	canvas = document.getElementById("canvas");
	//canvas.width = window.innerWidth * .985 ;
	//canvas.height= window.innerHeight * .9 ;	// need to display buttons at bottom

	var w = 837;
	var h = 656;

	// canvas.width = w * .985 ;
	// canvas.height= h * .9 ;	
	// need to display buttons at bottom

}

// 初始化
function init(){
	
	isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/); 

    handleCanvas();

    canvas = document.getElementById("canvas");

    stage = new createjs.Stage(canvas);
    screen_width = canvas.width;
    screen_height= canvas.height;

    // enable mouse/touch events
	stage.enableDOMEvents(false);
	stage.enableMouseOver(60);
	// createjs.Touch.enable(stage);

    contentManager = new ContentManager();
    contentManager.SetDownloadCompleted(prepareGame);
    contentManager.StartDownload();

    // testing out the level class
    level = new Level(stage, contentManager, screen_width, screen_height);
	reset();
}

// 重置
function reset(){
    stage.removeAllChildren();
    createjs.Ticker.removeAllEventListeners();
    stage.update();

    pointInt = 0;
	GAME_TIME = 20;
    GAME_ON = true;
    ITEM_SPEED = 1;
    currentCountDown = createCountDown(START_TIME); 
    console.log("Game has been reset");
}

// 游戏结束
function over(){
	// reset();
	// init();
	stage.enableDOMEvents(false);
	createjs.Touch.disable(stage);
	timeText.text = "0s";
	GAME_ON = false;
	stage.update();
}

function setText() {

    // timerText = new createjs.Text("Time Remaining: ", "bold 20px Arial", "#ffffff");
    // timerText.x = 15;
    // timerText.y = 45;
	
	timeText = new createjs.Text( convertMStoS(START_TIME) + "s", "bold 28px 宋体", "#d2270f");
	timeText.x = 280;
	timeText.y = 45;
		
	scoreText = new createjs.Text("SCORE:", "bold 20px Arial", "#ffffff");
	scoreText.x = screen_width - 200;
	scoreText.y = 15;
	
	pointText = new createjs.Text(pointInt, "bold 20px Arial", "#ffffff");
	pointText.x = screen_width - 105;
	pointText.y = 15;

	// fpsLabel = new createjs.Text("-- fps", "bold 20px Arial", "#FFF");
 //    fpsLabel.x = 15;
 //    fpsLabel.y = 70;
}

function drawLines(){

	var x = canvas.width;
	var y = BASELINE;

	var g;
	
	g = new createjs.Shape();
	g.graphics.setStrokeStyle(1).beginStroke("blue").moveTo(0,y).lineTo(x,y);
	stage.addChild(g);

}

// 预备舞台
function prepareGame(){
	setText();
	drawLines();
    // stage.addChild(timerText);
	stage.addChild(timeText);
    stage.addChild(scoreText);
	stage.addChild(pointText);
	// stage.addChild(fpsLabel);
	level.StartLevel(SETTING);
	stage.update();
}

function startGame(){
	init();
    console.log("Game has started");
	stage.enableDOMEvents(true);
	createjs.Touch.enable(stage);
	// start timer
	currentCountDown = createCountDown(START_TIME); 
	createjs.Ticker.init();
    createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.setFPS(60);
}

function tick(){

	if(GAME_ON){
		
		timeText.text = convertMStoS(currentCountDown()) + "s";  
		if(convertMStoS(currentCountDown()) < 0 || convertMStoS(currentCountDown()) == 0){
			timeText.text = "0s";
			GAME_ON = !GAME_ON;
			over();
		}
		if(convertMStoS(currentCountDown()) < convertMStoS(WARNING_TIME)){
			timeText.color = "red";
		}

		// quick fix, update later
		pointInt += level.Update();
		pointText.text = pointInt;
		// fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
		
		
	}
}