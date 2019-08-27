/**
 * Created by xaoyang on 12/12/13.
 */
(function (window){
    function GarbageBin(GarbageBinType, imgGarbageBin, x, y){
        this.initialize(GarbageBinType, imgGarbageBin, x, y);
    }
    
    GarbageBin.prototype = new createjs.Sprite();
    
    //public properties
    GarbageBin.prototype.bounds = 0;   // visual radius size
    GarbageBin.prototype.hit = 0;  // average radial disparity

    // constructor:
    GarbageBin.prototype.Sprite_intialize = GarbageBin.prototype.initialize;

	GarbageBin.width;
	GarbageBin.height;
	GarbageBin.radius;
	GarbageBin.boundingBox; 

    // initialization
    GarbageBin.prototype.initialize = function (GarbageBinType, imgGarbageBin, x, y){
        // console.log("GarbageBin object initialized");
        // console.log("GarbageBin type: " +  GarbageBinType);
        // console.log("GarbageBin img src: " + imgGarbageBin.src);
       
       	var halfX = Math.floor(imgGarbageBin.width / 2);
       	var halfY = Math.floor(imgGarbageBin.height / 2);
       	
        // if width exceeds the image, will not display the image
        var localSpriteSheet = new createjs.SpriteSheet({
            images: [imgGarbageBin], // image to use
            frames: {width: imgGarbageBin.width, height: imgGarbageBin.height, regX: halfX, regY: halfY},
            animations: {
                move: [0,0, "move", 4]
            }
        });

        this.Sprite_intialize(localSpriteSheet);
        // start playing the first sequence:
        this.gotoAndPlay("move");    // animate
		
		// GarbageBin type
        this.type = GarbageBinType;
        
        this.direction = 1;
		
		// default starting position
		this.x = x;
		this.y = y;
		
		// get image size
		this.width = imgGarbageBin.width;
		this.height = imgGarbageBin.height;
		
        //velocity
        this.vX = 1;
        this.vY = 0;
        // starting directly at the first frame of the walk_h sequence
        this.currentFrame = 0;
    
    	// create the bounding box for the object
        
    	this.boundingBox = new createjs.Shape();
    	this.radius = Math.sqrt((this.width/2 * this.width/2) + (this.height/2 * this.height/2));
    	this.radius = this.radius * .4;
    	this.boundingBox.graphics.beginStroke("blue").ss(1,0,1).drawCircle(this.x, this.y, this.radius);
    	stage.addChild(this.boundingBox);
        this.boundingBox.visible = false;
        
    }

    GarbageBin.prototype.tick = function() {
        // not doing anything right now
    }
	
	// 鼠标移过区域触发
	GarbageBin.prototype.on("rollover", function(evt) {
		evt.target.alpha = .5;
        evt.target.scaleX = 1;
        evt.target.scaleY = 1;
        evt.target.boundingBox.visible = false;
		// console.log(evt.target.type);
		// stage.addChild(evt.target.boundingBox);
	});
	
	// 鼠标移出区域触发
	GarbageBin.prototype.on("rollout", function(evt) {
		evt.target.alpha = 1;
        evt.target.scaleX = 1;
        evt.target.scaleY = 1;
        evt.target.boundingBox.visible = false;
		//stage.removeChild(evt.target.boundingBox);
	});

    window.GarbageBin = GarbageBin;
}(window))