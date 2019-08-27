/**
 * Created by xaoyang on 12/13/13.
 */
 
function ContentManager(){
    var onDownloadCompleted;
    var numImagesLoaded = 0;

    var NUM_ELMENTS_TO_DOWNLOAD = NUM_DRY + NUM_WET + NUM_RECYCLE + NUM_HARMFUL + NUM_BIN; //加载图片总数

	// garbage items, need to rename
	//干垃圾
	for(var i = 0; i < NUM_DRY; i++){
		this['imgA_'+i] = new Image();
	}
	//湿垃圾
	for(var i = 0; i < NUM_WET; i++){
		this['imgB_'+i] = new Image();
	}
	//可回收垃圾
	for(var i = 0; i < NUM_RECYCLE; i++){
		this['imgC_'+i] = new Image();
	}
	//有害垃圾
	for(var i = 0; i < NUM_HARMFUL; i++){
		this['imgD_'+i] = new Image();
	}
	
	// bin items, need to rename
	this.imgG = new Image(); //干垃圾桶
	this.imgH = new Image(); //湿垃圾桶
	this.imgI = new Image(); //可回收桶
	this.imgJ = new Image(); //有害桶

    // returns image
    this.GetGarbage = function (binType){
		
        binType = typeof binType !== 'undefined' ? binType : false;

        // if user does not define bintypes thus allowing all types of garbage
        if(!binType){
			alert("error");
            // FIGURE OUT A BETTER IMPLEMENTATION..... 
            var num = Math.floor(Math.random() * 4); 
            var no_to_img_map =  [
                {   bin : "dry", 
                    img  : this.imgA  },  
                {   bin : "wet", 
                    img  : this.imgB  },
                {   bin : "recycle", 
                    img  : this.imgC  },
                {   bin : "harmful",
                    img  : this.imgD  }
            ];
        }
        else{
            // goes through the list of useable types
            // need to introduce an object that holds the types and images
            // CURRENT IMPLEMENTATION SUCKS!!!!!!
            var no_to_img_map = [];
            for(var i = 0; i < binType.length; i++){
                switch (binType[i]) {
                    case "dry":
						for(var k = 0; k < NUM_DRY ; k++){
							no_to_img_map.push({bin : binType[i], img: this['imgA_'+k]});
						}
                        break;
                    case "wet":
						for(var k = 0; k < NUM_WET ; k++){
							no_to_img_map.push({bin : binType[i], img: this['imgB_'+k]});
						}
                        break;
                    case "recycle":
						for(var k = 0; k < NUM_RECYCLE ; k++){
							no_to_img_map.push({bin : binType[i], img: this['imgC_'+k]});
						}
                        break;
                    case "harmful":
						for(var k = 0; k < NUM_HARMFUL ; k++){
							no_to_img_map.push({bin : binType[i], img: this['imgD_'+k]});
						}
                        break;
                }
            }
			
            var num = Math.floor(Math.random() * no_to_img_map.length);
			// console.log("--- "+num+" ---");
        }

        return no_to_img_map[num];
    }

    // returns image
    this.GetBin = function (binType) {
		// console.log(binType);
        var type_to_img = {
            'dry' : this.imgG,
            'wet': this.imgH,
            'recycle' : this.imgI,
            'harmful' : this.imgJ
        };
        // console.log(type_to_img[binType]);
        return type_to_img[binType];
    }

    // setting the callback method
    this.SetDownloadCompleted = function(callbackMethod){
		onDownloadCompleted = callbackMethod;
    };

    // public method to launch the download process
    this.StartDownload = function () {
        // get garbage images
		for(var i = 0; i < NUM_DRY; i++){
			SetDownload(this['imgA_'+i], "src/img/dry/dry_"+i+".png", handleImageLoad, handleImageError);
		}
		for(var i = 0; i < NUM_WET; i++){
			SetDownload(this['imgB_'+i], "src/img/wet/wet_"+i+".png", handleImageLoad, handleImageError);
		}
		for(var i = 0; i < NUM_RECYCLE; i++){
			SetDownload(this['imgC_'+i], "src/img/recycle/recycle_"+i+".png", handleImageLoad, handleImageError);
		}
		for(var i = 0; i < NUM_HARMFUL; i++){
			SetDownload(this['imgD_'+i], "src/img/harmful/harmful_"+i+".png", handleImageLoad, handleImageError);
		}
        
        // get garbage bin images
		SetDownload(this.imgG, "src/img/bins/bin_dry.png", handleImageLoad, handleImageError);
        SetDownload(this.imgH, "src/img/bins/bin_wet.png", handleImageLoad, handleImageError);
        SetDownload(this.imgI, "src/img/bins/bin_recycle.png", handleImageLoad, handleImageError);
        SetDownload(this.imgJ, "src/img/bins/bin_harmful.png", handleImageLoad, handleImageError);
    }

    // hands the images
    function SetDownload(imgElement, url,loadedHandler, errorHandler){
        imgElement.src = url;
        // console.log("img source: " + imgElement.src);
        
        imgElement.onload = loadedHandler;
        imgElement.onerror = errorHandler;
    }

    // global handler
    function handleImageLoad(e){
        numImagesLoaded++;

        // console.log("images load: " + numImagesLoaded);

        // If all elements have been downloaded
        if(numImagesLoaded === NUM_ELMENTS_TO_DOWNLOAD){
            console.log("all elements have been loaded");
			numImagesLoaded = 0;
            onDownloadCompleted();
        }
    }

    function handleImageError(e){
        console.log("Error Loading Image :" + e.target.src);
    }
    
}