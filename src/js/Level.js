// This class will be responsible for the layers

(function(window) {

	function Level(stage, contentManager, gameWidth, gameHeight) {

		this.levelStage = stage;
		this.levelContentManager = contentManager;

		this.levelWidth = gameWidth;
		this.levelHeight = gameHeight;

		this.levelSpeed = 1;

		// objects
		this.garbage = [];
		this.garbageBin = [];
		this.levelText = [];
		this.scoreText = [];
		this.binTypes = [];

		//settings
		this.garbageInstances = 500;

	}

	// uses date.now() to set up timer
	Level.prototype.createCountDown = function(timeRemaining) {
		var startTime = Date.now();
		return function() {
			return timeRemaining - (Date.now() - startTime);
		}
	}

	// takes millseconds and converts to seconds with one digit following the period
	Level.prototype.convertMStoS = function(num, p) {
		p = typeof p !== 'undefined' ? p : 1;
		return (num / 1000).toFixed(p);
	}

	Level.prototype.StartLevel = function(stageLevel) {
		// depending on the level, populate accordingly
		// need to figure out a better way of implementing this.... 
		stageLevel = typeof stageLevel !== 'undefined' ? stageLevel : 'easy';

		if (stageLevel === "easy") {
			this.binTypes = ['dry', 'wet', 'recycle', 'harmful'];
			this.levelSpeed = 1;
		}

		// if(stageLevel === "normal"){
		// 	this.binTypes = ['landfill', 'recycle', 'compost'];
		// 	this.levelSpeed = 3;
		// }

		// if(stageLevel === "hard"){
		// 	this.binTypes = ['landfill', 'recycle', 'compost', 'reuse', 'electronics', 'chemical'];
		// 	this.levelSpeed = 6;
		// }


		// start 
		this.LoadGarbage();
		this.LoadBins();
		this.setText();
	};

	Level.prototype.LoadBins = function() {
		var xp = this.levelWidth / (this.binTypes.length + 1);
		var yp = this.levelHeight;
		// console.log("---" + xp, yp + "---");
		var xPos;
		var yPos;

		var binCount = this.binTypes.length;

		// 干垃圾桶图片宽高
		var binW = contentManager.imgG.width;
		var binH = contentManager.imgG.height;
		var binSpace = 42; //间距

		//  第一个垃圾桶顶点位置
		var xOrgPos = binW / 2 + 99;
		var yOrgPos = yp - binH / 2 - 35;

		var xPos = binW + binSpace;
		var yPos = yOrgPos;

		for (var i = 0; i < this.binTypes.length; i++) {

			// console.log("level: "+this.binTypes[i]+' '+contentManager.GetBin(this.binTypes[i]))
			this.garbageBin.push(new GarbageBin(this.binTypes[i], contentManager.GetBin(this.binTypes[i]), xOrgPos + (xPos) *
				i, yPos));


		}

		for (var i = 0; i < this.garbageBin.length; i++) {
			this.levelStage.addChild(this.garbageBin[i]);
		}
		console.log(this.garbageBin);
	};

	Level.prototype.LoadGarbage = function(count) {
		// start positions
		var garbageCount = count || 4;
		console.log(garbageCount);
		var xp = this.levelWidth / (this.binTypes.length + 1);
		var yp = this.levelHeight;

		var xPos = 90;
		var yPos = yp / garbageCount;
		var x;
		var y;
		var randomGarbage = {};
		var result = XPOS.concat(); //拷贝X轴坐标数组

		for (var i = 0; i < garbageCount; i++) {
			var ran = Math.floor(Math.random() * result.length); 
			x = result.splice(ran, 1)[0];
			y = 140;
			randomGarbage = this.levelContentManager.GetGarbage(this.binTypes);
			this.garbage.push(new Garbage(randomGarbage.bin, randomGarbage.img, screen_width, screen_height, x, y));
		}

		for (var i = 0; i < this.garbage.length; i++) {
			this.levelStage.addChild(this.garbage[i]);
		}

		console.log(this.garbage);
	};

	Level.prototype.setText = function(level) {

		// this.titleText = new createjs.Text("Garbage Sorter", "bold 36px Arial", "#ffffff");
		//   	this.titleText.x = 10;
		//   	this.titleText.y = 10;

		this.correctText = new createjs.Text("+1", "bold 12px 宋体", "green");
		this.correctText.visible = false;
		//this.correctText.x = 100;
		//this.correctText.y = 100;

		// this.wrongText = new createjs.Text("-50", "bold 36px 宋体", "red");
		// this.wrongText.visible = false;
		//this.wrongText.x = 200;
		//this.wrongText.y = 200;


		//    this.timerText = new createjs.Text("Time Remaining: ", "bold 20px Arial", "#ffffff");
		//    this.timerText.x = 15;
		//    this.timerText.y = 45;
		// 
		// this.timeText = new createjs.Text( convertMStoS(START_TIME) + " s", "bold 20px Arial", "#ffffff");
		// this.timeText.x = 180;
		// this.timeText.y = 45;
		// 	
		// this.scoreText = new createjs.Text("SCORE:", "bold 20px Arial", "#ffffff");
		// this.scoreText.x = screen_width - 200;
		// this.scoreText.y = 15;
		// 
		// this.pointText = new createjs.Text(pointInt, "bold 20px Arial", "#ffffff");
		// this.pointText.x = screen_width - 105;
		// this.pointText.y = 15;


		// put these objects into the level text container
		// this.levelText.push(this.titleText);
		// this.levelText.push(this.wrongText);
		// this.levelText.push(this.timerText);
		// this.levelText.push(this.timeText);
		// this.levelText.push(this.scoreText);
		// this.levelText.push(this.pointText);

		for (var i = 0; i < this.levelText.length; i++) {
			this.levelStage.addChild(this.levelText[i]);
		}

	}

	Level.prototype.setBackground = function() {
		// NOT implemented at the moment
	};


	Level.prototype.setTextPoints = function(objB) {
		this.correctText = new createjs.Text("+1", "bold 30px 宋体", "green");
		this.correctText.visible = true;
		this.correctText.x = objB.x - 10;
		this.correctText.y = objB.y - (Math.random() * objB.radius);

		this.levelStage.addChild(this.correctText);
		this.scoreText.push(this.correctText);
	};

	// 处理得分逻辑
	Level.prototype.handleCollision = function(objA, objB, i) {
		var xD = objA.x - objB.x;
		var yD = objA.y - objB.y;
		var dist = Math.sqrt(xD * xD + yD * yD);
		var point = 0;
		
		// if collision
		if (dist < objA.radius + objB.radius) {
			console.log("触发判定范围");
			if (!objA.pressed) {
				FLAG = true;
				if (objA.type === objB.type) {
					point = 1;
					this.setTextPoints(objB);
				} else {
					console.log("Game Over:分类错误");
					point = 0;
					over();
				}

				objA.remove = true;
			}
		} 
		// 边界线判定
		else {
			if(!objA.hasOwnProperty('pressed')){
				if(objA.y >= BASELINE + 45 ) {
					console.log("Game Over:触发底线");
					over();	
				}
			}
		}

		return point;
	};

	// 垃圾自上而下运动
	Level.prototype.animate = function() {
		for (var i = 0; i < this.garbage.length; i++) {
			if(this.garbage[i].movement === true){
				this.garbage[i].y = this.garbage[i].y + .6; //设置运动距离
			}
			// console.log(this.garbage[i]);
			// this.garbage[i].y = this.garbage[i].y + .6; //设置运动距离
		}
	}

	// update later on... GET RID OF POINT INT AND POINT TEXT
	Level.prototype.Update = function() {
		var point = 0;
		var current = convertMStoS(currentCountDown()); //每秒倒计时
		for (var i = 0; i < this.garbage.length; i++) {
			this.garbage[i].tick(this.levelSpeed);
			for (var j = 0; j < this.garbageBin.length; j++) {
				point += this.handleCollision(this.garbage[i], this.garbageBin[j]);
			}

			if (this.garbage[i].remove) {
				this.levelStage.removeChild(this.garbage[i].boundingBox);
				this.levelStage.removeChild(this.garbage[i]);
				this.garbage.splice(i, 1);
			}
		}

		// 2s加载2~4件垃圾
		if (GAME_TIME - current >= 4) {
			GAME_TIME = current;
			// console.log("2s触发一次");
			var count = Math.floor(Math.random()*3+2); //2~4随机数
			this.LoadGarbage(count);
		}

		this.animate();
		this.levelStage.update();
		return point;
	};

	window.Level = Level;


}(window));
