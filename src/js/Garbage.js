
/**
 * Created by xaoyang on 12/12/13.
 */
 
(function (window){
    function Garbage(garbageType, imgGarbage, sW, sH, x, y){
        this.initialize(garbageType, imgGarbage, sW, sH, x, y);
    }
    
    Garbage.prototype = new createjs.Sprite();
    
    //public properties [not really sure what they do]
    Garbage.prototype.bounds = 0;   // visual radius size
    Garbage.prototype.hit = 0;  // average radial disparity
	Garbage.prototype.isPressup = false; 

	Garbage.width;
	Garbage.height;
	Garbage.radius;
	Garbage.boundingBox;
    Garbage.pressed = false;
	
    // constructor:
    Garbage.prototype.Sprite_intialize = Garbage.prototype.initialize;

    // initialization
    Garbage.prototype.initialize = function (garbageType, imgGarbage, sW, sH, x, y){

       	this.width = imgGarbage.width;
       	this.height = imgGarbage.height;
       	
       	var halfX = Math.floor(imgGarbage.width / 2);
       	var halfY = Math.floor(imgGarbage.height / 2);
       	
        // becareful: if width exceeds the image, will not display the image
        var localSpriteSheet = new createjs.SpriteSheet({
            images: [imgGarbage], // image to use
            frames: {width: imgGarbage.width, height: imgGarbage.height, regX: halfX, regY: halfY, spacing: 0, margin: 0},
            animations: {
                move: [0,0, "move", 4]
            }
        });

        this.Sprite_intialize(localSpriteSheet);
        // start playing the first sequence:
        this.gotoAndPlay("move");    // animate

		// garbage type
        this.type = garbageType;
        this.direction = 1;

        this.sWidth = sW;
        this.sheight = sH;
		
		// default starting position
		this.x = x;
		this.y = y;
		this.movement = true;

        this.remove = false;

        // can scale image
        this.scaleX = 1;
        this.scaleY = 1;

        //velocity
        this.vX = 1;
        this.vY = 0;
        
        // starting directly at the first frame of the walk_h sequence
        this.currentFrame = 0;
       
       	// create the bounding box for the object
       	this.boundingBox = new createjs.Shape();
        this.radius = Math.sqrt((this.width/2 * this.width/2) + (this.height/2 * this.height/2));
		this.radius = this.radius * .4;
		// console.log(this.radius);
       	this.boundingBox.graphics.beginStroke("purple").ss(1,0,1).drawCircle(0, 0, this.radius);
       	this.boundingBox.visible = false;
        stage.addChild(this.boundingBox);
       	       
    }

    Garbage.prototype.tick = function(speed) {
        
        /*
        if(this.movement){
            this.x += this.vX * (this.direction * speed);
        }
        */
		
		this.boundingBox.x = this.x;
		this.boundingBox.y = this.y;
    }
	
	Garbage.prototype.on("mousedown", function(evt) {
		evt.target.movement = false;
	});
	
	Garbage.prototype.on("pressmove", function(evt) {
		// console.log(evt);
        // if user slects then no movement
        evt.target.movement = false;
		// 禁止向上拖拽
		if(evt.stageY - evt.target.y >= 0){
			evt.target.x = evt.stageX;
			evt.target.y = evt.stageY;
			evt.target.pressed = true;
		}
        
        if(isMobile){
            evt.target.boundingBox.visible = false;
        }
	});

    Garbage.prototype.on("pressup", function(evt) {
		evt.target.movement = true;
        evt.target.pressed = false;
        evt.target.boundingBox.visible = false;
		FLAG = false;
		setTimeout(function(){ 
			if(!FLAG){
				console.log("Game Over:拖拽中途放手");
				over();
			}
		}, 100);
		
        if(isMobile){
             evt.target.boundingBox.visible = false;
        }
    });


	// rollover and rollout does not work for touch
	Garbage.prototype.on("rollover", function(evt) {
		evt.target.alpha = .5;
        evt.target.boundingBox.visible = false;
	});
	
	
	Garbage.prototype.on("rollout", function(evt) {
		evt.target.alpha = 1;
        evt.target.boundingBox.visible = false;
	});

    window.Garbage = Garbage;
}(window))