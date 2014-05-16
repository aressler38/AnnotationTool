define(
    [
        "jquery",
        "underscore",
        "backbone"
    ],

    function($, _, backbone) {

        var AnnotationModel = backbone.Model.extend({
            
            defaults: {
                size: [300,300],
                canvasWidth: 300,
                canvasHeight: 300,
                strokeWidth: 2
            },

            initialize: function() {
                var that = this;
                var $target = $(this.get("target"));
                if (this.get("canvasWidth") || this.get("canvasHeight")) {
                    /*
                    console.log( "Danger, Danger Will Robinson! You are initializing the annotation tool without "
                                +"specifying the canvasWidth and canvasHeight! The default values will be used: "
                                +this.defaults.canvasWidth+"x"+this.defaults.canvasHeight);
                    */
                }
                
                if ($target[0]) {
                    this.set("target", $target);
                    this.set("canvasWidth", $target.width());
                    this.set("canvasHeight", $target.height());
                }
                this.set("id", _.uniqueId("annotation-canvas-"));
                this.on("change:target", function(){that.set("target", $(arguments[1]))});
                this.on("change:toolsTarget", function(){that.set("toolsTarget", $(arguments[1]))});

                //***************************************************************************************
                //=============================================
                // Canvas Object Types To Be Remembered
                //=============================================
                // note: canvas renders its graphics via a GPU. Unlike SVG, no grapics are represented 
                // as DOM objects. Thus, in order to redraw a canvas, we need to remember what is on the 
                // canvas. Furthurmore, we will remember the time at which a graphic is drawn so that we
                // may replay the entire drawing in real time. 
                // 
                // REQUIRED: use the new keyword to initialize any of these objects before pushing them
                //           upon the recordingObjects.canvasElements array.
                //***************************************************************************************

                this.set("recordingObjects", {
                    canvasMoveTo: function(x,y,t) {
                        this.name = "canvasMoveTo";
                        this.x = x;
                        this.y = y;
                        this.timeStamp = t;
                        return this;
                    },
                    canvasLineTo: function(x,y,t) {
                            this.name = "canvasLineTo";
                            this.x = x;
                            this.y = y;
                            this.timeStamp = t;
                            return this;
                    },
                    initialTime:0,
                    finalTime:0,
                    canvasElements:[]
                });
            }
        });

        return AnnotationModel;
    }
);
