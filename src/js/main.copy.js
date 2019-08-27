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
var pointText;
var pointInt = 0;
var fpsLabel;

var NUM_DRY = 4;
var NUM_WET = 4;
var NUM_RECYCLE = 5;
var NUM_HARMFUL = 3;
var NUM_BIN = 4;

// timer stuff
var currentCountDown;

var garbage;
var recycle;
var reuse;
var landfill;
var compost;

var INSTANCE_COUNT = 100;
var START_TIME = 45000; //ms
var WARNING_TIME = 20000; //ms
var GAME_ON = true;
var SETTING = 'four';

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
	return (num/ 1000).toFixed(p);
}


function handleCanvas(){

	canvas = document.getElementById("canvas");
	//canvas.width = window.innerWidth * .985 ;
	//canvas.height= window.innerHeight * .9 ;	// need to display buttons at bottom

	var w = 640;
	var h = 1136;

	canvas.width = w * .985 ;
	canvas.height= h * .9 ;	// need to display buttons at bottom

}

function init(){

	isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/); 

    handleCanvas();

    canvas = document.getElementById("canvas");

    stage = new createjs.Stage(canvas);
    screen_width = canvas.width;
    screen_height= canvas.height;

    // enable mouse/touch events
	stage.enableMouseOver(10);
	createjs.Touch.enable(stage);

    contentManager = new ContentManager();
    contentManager.SetDownloadCompleted(startGame);
    contentManager.StartDownload();

    // testing out the level class
    level = new Level(stage, contentManager, screen_width, screen_height);
}

function reset(){
    stage.removeAllChildren();
    createjs.Ticker.removeAllEventListeners();
    stage.update();
    
    pointInt = 0;
    GAME_ON = true;
    ITEM_SPEED = 1;
    currentCountDown = createCountDown(START_TIME); 
    console.log("Game has been reset");
}

function easy(){
	reset();
	SETTING = 'easy';
	init();
}

function normal(){
	reset();
	SETTING = 'normal';
	init();
}

function hard(){
	reset();
	SETTING = 'hard';
	init();
}

function setText() {

    timerText = new createjs.Text("Time Remaining: ", "bold 20px Arial", "#ffffff");
    timerText.x = 15;
    timerText.y = 45;
	
	timeText = new createjs.Text( convertMStoS(START_TIME) + " s", "bold 20px Arial", "#ffffff");
	timeText.x = 180;
	timeText.y = 45;
		
	scoreText = new createjs.Text("SCORE:", "bold 20px Arial", "#ffffff");
	scoreText.x = screen_width - 200;
	scoreText.y = 15;
	
	pointText = new createjs.Text(pointInt, "bold 20px Arial", "#ffffff");
	pointText.x = screen_width - 105;
	pointText.y = 15;

	fpsLabel = new createjs.Text("-- fps", "bold 20px Arial", "#FFF");
    fpsLabel.x = 15;
    fpsLabel.y = 70;
}

function drawLines(num){

	var x = canvas.width / (num + 1);
	var y = canvas.height;

	var g = [];

	for(var i = 0; i < num; i ++){
		g.push(new createjs.Shape());
		g[i].graphics.setStrokeStyle(3).beginStroke("blue").moveTo(x+(x * i),0).lineTo(x+(x*i),y);
		stage.addChild(g[i]);
	}

}


function startGame(){
    console.log("Game has started");

	setText();

	//drawLines(3);
    stage.addChild(timerText);
    stage.addChild(timeText);
    stage.addChild(scoreText);
	stage.addChild(pointText);
	stage.addChild(fpsLabel);
	
	level.StartLevel(SETTING);

	// start timer
	currentCountDown = createCountDown(START_TIME); 
		
    stage.update();
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(60);
}

function tick(){

	if(GAME_ON){

		timeText.text = convertMStoS(currentCountDown()) + " seconds";  
		if(convertMStoS(currentCountDown()) < 0 || convertMStoS(currentCountDown()) == 0){
			timeText.text = "0.0 seconds";
			GAME_ON = !GAME_ON;
		}
		if(convertMStoS(currentCountDown()) < convertMStoS(WARNING_TIME)){
			timeText.color = "red";
		}

		// quick fix, update later
		pointInt += level.Update();
		pointText.text = pointInt;
		fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
	}
}