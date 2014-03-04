define(
    [
        "jquery",
        "underscore",
        "backbone",
        "Tools",
        "spectrum",
        "noUiSlider",
        "utils"
    ],

    function($, _, backbone, Tools, None, None, utils) {

        var AnnotationView = backbone.View.extend({
            
            tagName:"canvas",
            className:"annotation-canvas",
           
            activeTool: null, 
            
            initialize: function() {
                return null;
            },
            
            events: function() {
                // BIND MODEL LISTENERS
                this.listenTo(this.model, "change:activeTool", this.setActiveTool);
                this.listenTo(this.model, "change:strokeWidth", this.setStrokeWidth);
                this.listenTo(this.model, "change:strokeStyle", this.setStrokeStyle);
                this.listenTo(this.model, "change:background", this.setBackground);
                this.listenTo(this.model, "change:eraser", this.setEraser);
                // BIND TRIGGER LISTENERS
                this.on("clearCanvas", this.clearCanvas, this);
                this.on("getCurrentImage", this.getCurrentImage, this);
                this.on("render", this.render, this);
                this.on("renderUtils", this.renderUtils, this);
                // BIND VIEW EVENTS HERE
                var events = {};
                return events;
            },
            
            render: function(target) {
                utils.readyCanvas.call(this); 
                this.model.set("target", $(target));
                var $target = this.model.get("target");
                if (!$target[0]) throw new Error("You need to specify a HTML Element");
                $target.html(this.el);
                return null;
            },

            setEraser: function() {
                if (this.model.get("eraser") === "on") {
                    this.context.globalCompositeOperation = "copy";
                    this.context.strokeStyle = "rgba(255,255,255,0)";
                    $(this.colorPicker).spectrum("disable");
                }
                else {
                    this.context.globalCompositeOperation = "source-over";
                    this.context.strokeStyle = "rgba(0,0,0,1)";
                    $(this.colorPicker).spectrum("enable");
                    $(this.colorPicker).spectrum("set", 000000);
                }
                return null;
            },

            setBackground: function() {
                this.$el.css({
                    "background-image": "url("+this.model.get("background")+")",
                    "background-repeat": "no-repeat"
                });
                return null;
            },

            setStrokeStyle: function() {
                this.context.strokeStyle = this.model.get("strokeStyle");
                return null;
            },

            setStrokeWidth: function() {
                this.context.lineWidth = this.model.get("strokeWidth");
                return null;
            },
            
            getCurrentImage: function(type) {
                if (type) return this.el.toDataURL(type);
                else return this.el.toDataURL("image/png");
            },

            getCurrentBlob: function() {
                var blob = utils.dataURItoBlob(this.getCurrentImage());
                this.model.set("currentBlob", blob);
                return blob;
            },

            setActiveTool: function(toolString) {
                if (!this.model.get("target")) throw new Error("An HTML target isn't set.");
                this.destroyCurrentTool();
                this.initializeTool(toolString);
            },
            
            renderUtils: function(){return utils.renderUtils.call(this);},

            initializeTool: function(toolString) {
                var tool = (toolString.changed) ? toolString.changed.activeTool : toolString;
                tool = (typeof tool == "string") ? tool.toLowerCase() : undefined;
                if (!tool) {throw new Error("you can't initialize that tool");}
                else {
                    switch (tool) {
                        case "pencil":
                            this.activeTool = new Tools.Pencil(this);
                            this.activeTool.initialize();
                            break;
                        default:
                            throw new Error(tool+" is not a valid tool name");
                    }
                }
            },

            destroyCurrentTool: function() {
                if (this.currentTool && this.currentTool.destroy) {
                    console.log("finished destroying the current tool.");
                    this[this.currentTool].destroy();
                }
                else {
                    return -1;
                }
            },

            reCreateCanvas: function() {
                // IF THE CANVAS IS RESIZED, THEN USE THIS TO GET THE CONTENT BACK 
                var canvasElements = annotationTool.model.get("recordingObjects").canvasElements;
                var len = canvasElements.length;
                for (var i=0; i<len; i++) {
                    this.paintCanvasObject(canvasElements[i]);
                }
            },

            paintCanvasObject: function(canvasObject) {
                if (typeof(canvasObject) != "object") {throw new Error("Expecting a canvas object.");}
                var name = canvasObject.name; 
                if (name == "canvasMoveTo") {
                    console.log("canvas move to");
                    this.context.moveTo(canvasObject.x, canvasObject.y);
                }
                else if (name == "canvasLineTo") {
                    console.log("canvas line to");
                    this.context.lineTo(canvasObject.x, canvasObject.y);
                    this.context.stroke();
                }
            },
            
            clearCanvas: function () {
                this.context.clearRect(0, 0, this.el.width, this.el.height);
            },


            sendImg: function () {
                
                var postConfig = {
                    resourceType: "image",
                    resourceName: "user-image.png",
                    resourceDesc: "",
                    isAttachment: false,
                    isPublic: true
                }
                var fd = new FormData();
                for (var i in postConfig) {
                    if (postConfig.hasOwnProperty(i)) fd.append(i, postConfig[i]);
                }

                // append blob with file name
                fd.append("resourcePath", this.getCurrentBlob(), "mycoolfile2.png");

                $.ajax({
                    url: "localhost",
                    type: "POST",
                    data: fd,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        console.log(arguments);
                    },
                    error: function(jqXHR, textStatus, errorMessage) {
                        console.log(arguments);
                    }
                });                


            }, 

            playback: function() {
                
                this.clearCanvas();
                
                var recordingObjects = this.model.get("recordingObjects");
                var canvasElements = recordingObjects.canvasElements;
                var initialTime = recordingObjects.initialTime;
                var finalTime = recordingObjects.finalTime;
                var timeCounter = initialTime;
                var arrayCounter = 0;
                var arrayLen = canvasElements.length; 
                var offsetLeft = $(this.el).offset().left;
                var offsetTop = $(this.el).offset().top;
                var time = 0;

                function replay() { 
                    var startTime = (window.performance.now) ? 
                        (window.performance.now()) : Date.now();
                    requestAnimFrame(redrawCanvas);
                    function redrawCanvas() {
                        // end animation if the arrayCounter has reached the last element in the array
                        if (arrayCounter == arrayLen) {
                            console.log("end animation");
                            return null;
                        }
                        // otherwise continue...
                        var now = (window.performance.now) ? 
                            (window.performance.now() - startTime) : (Date.now() - startTime);
                        var name = canvasElements[arrayCounter].name;
                        time = now;
                        var dt = canvasElements[arrayCounter].timeStamp - initialTime;
                        if ((now - dt) > 0) {
                            annotationTool.paintCanvasObject(canvasElements[arrayCounter]);
                            arrayCounter++;
                        }
                        requestAnimFrame(redrawCanvas);
                    }
                }
                replay();
            },

            canvasGoAway: function(faster) {
                var counter = ((faster) ? 99:0);
                var that = this;
                function animateOverlay(t) {
                    counter = counter+1;
                    var val = counter / 100;
                    $(that.el).css("-webkit-transform", 
                        "matrix("+((1.0-val)*val)+','+(1.0-val)+','+(1.0-val)+','+((1.0-val)*val)+",0,0)"
                    );
                    if (counter>99) {
                        return null;
                    }
                    window.requestAnimFrame(animateOverlay);
                }
                window.requestAnimFrame(animateOverlay);
            },
            
            canvasComeBack: function(faster) {
                var counter = ((faster) ? 99:0);
                var that = this;
                function animateOverlay(t) {
                    counter = counter+1;
                    var val = counter / 100;
                    $(that.el).css("-webkit-transform", 
                        "matrix("+((1.0)*val)+','+(1.0-val)+','+(1.0-val)+','+((1.0)*val)+",0,0)"
                    );
                    if (counter>99) {
                        return null;
                    }
                    window.requestAnimFrame(animateOverlay);
                }
                window.requestAnimFrame(animateOverlay);
            },

            canvasOverlayCurrent: function() {
                // take a screenshot of the canvas and position it over the target
                var screenshot = this.getCurrentImage();//annotationTool.canvas.toDataURL("image/png");
                annotationTool.fakeCanvas = document.createElement("img"); 
                annotationTool.fakeCanvas.setAttribute("src", screenshot);
                annotationTool.canvasGoAway(true);
                $(annotationTool.fakeCanvas).css(annotationTool.canvasStyle);
                annotationTool.target.insertBefore(annotationTool.fakeCanvas, $(annotationTool.target).children()[0]);
            }

        });

        return AnnotationView;
    }
);
