
// pretty much everything in here needs to be executed within the context of 
// the annotationtool view. 
define(
    [

    ],
    function() {
        return ({
                
            dataURItoBlob: function(dataURI) {
                // convert base64 to raw binary data held in a string
                // doesn't handle URLEncoded DataURIs
                var byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(dataURI.split(',')[1]);
                else
                    byteString = unescape(dataURI.split(',')[1]);
                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                // write the bytes of the string to an ArrayBuffer
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                // write the ArrayBuffer to a blob, and you're done
                return new Blob([ab],{type: mimeString});
            },

            // prepare a new canvas
            readyCanvas: function() {
                this.canvas = this.el;
                this.context = this.canvas.getContext("2d");
                // ----------------------------------------------------------------------------------------
                // Set HTML attributes
                this.$el.attr("id", this.model.get("id"));
                this.setSize(this.model.get("canvasWidth"), this.model.get("canvasHeight"));
                // do you want splash animation?
                if (this.model.get("splashAnimation")) {
                    $(this.canvas).addClass("annotation-tool-transition-all");
                    $(this.canvas).addClass("splashAnimation");
                }
                /*
                // HACK: this is a hack for google chrome mobile. I've notified them.
                //       if the context isn't used, then the following animation runs sloooooowwwww.... ....
                annotationTool.context.stroke();
                */
            },

            renderUtils: function() {

                // initialize methods for rendering tools...

                function renderStrokePicker (target) {
                    var context = this.context;
                    this.strokePicker = document.createElement("div");
                    this.strokePicker.setAttribute("class", "annotation-tool noUiSlider");
                    $(target).append(this.strokePicker);
                    var that = this;
                    $(that.strokePicker).noUiSlider({
                        range: [1,20],
                        start: 1,   
                        slide: function() {
                            context.lineWidth = this.val();
                        },
                        step: 1,
                        handles: 1
                          
                    });
                }
                function renderColorPicker (target) {
                    var context = this.context;
                    // create a colorpicker via spectrum
                    this.colorPicker = document.createElement("input");
                    this.colorPicker.setAttribute("class", "annotation-tool");
                    this.colorPicker.setAttribute("type", "text");
                    $(target).append(this.colorPicker);
                    $(this.colorPicker).spectrum({
                        color:"black",
                        change: function(color) {
                            context.strokeStyle = color.toHexString(); 
                        }
                    });
                }

                var toolsTarget = this.model.get("toolsTarget");
                if (!toolsTarget) {throw "Please specify a jQuery selector/target for the tools";}
                /*
                var tools = [
                    renderColorPicker,   
                    renderStrokePicker
                ];
                */
                var tools = [renderColorPicker];
                for (var i=0,tLen=tools.length; i<tLen; i++) { tools[i].call(this, toolsTarget); }
                return null;
            },

            /**
             * Draw a 'soft' line on a canvas. This method will actually draw several lines with 
             * different transparancies and widths to make the illusion of a single soft line.
             *
             * @param {Object} ctx The 2d drawing context of a canvas
             * @param {Number} x1 starting x coordinate
             * @param {Number} y1 starting y coordinate
             * @param {Number} x2 ending x coordinate
             * @param {Number} y2 ending y coordinate
             * @param {Number} [lineWidth] width of line to draw
             * @param {String} [rgb] Hex color code (e.g. #1e1e1e) 
             * @param {Number} [alpha] alpha channel 
             */
            drawSoftLine: function (ctx, x1, y1, x2, y2, lineWidth, rgb, alpha) {
                var widths = [1   , 0.8 , 0.6 , 0.4 , 0.2  ];
                var alphas = [0.2 , 0.4 , 0.6 , 0.8 , 1    ];
                var _alpha;
                var previousAlpha = 0;
                if (!alpha) { alpha = 0.7; }
                if (!lineWidth) { lineWidth = ctx.lineWidth; }
                var firstLineWidth = lineWidth
                var deltaAlpha = null;
                var r,g,b;
                if (!rgb) { rgb = ctx.strokeStyle; }
                var hexColors = rgb.substring(1);
                r = Number("0x"+hexColors[0]+hexColors[1]);
                g = Number("0x"+hexColors[2]+hexColors[3]);
                b = Number("0x"+hexColors[4]+hexColors[5]);
                for (var pass = 0; pass < widths.length; pass++) {
                    ctx.beginPath();
                    ctx.lineWidth = lineWidth * widths[pass];
                    ctx.lineCap = "round";
                    _alpha = alphas[pass] * alpha;
                    // Formula: (1 - alpha) = (1 - deltaAlpha) * (1 - previousAlpha)
                    deltaAlpha = 1 - (1 - _alpha) / (1 - previousAlpha);
                    console.log(deltaAlpha);
                    ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + deltaAlpha + ")";
                    ctx.lineCap = "round";
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    previousAlpha = _alpha;
                }
                ctx.lineWidth = firstLineWidth; // reset context's lineWidth property.
            }
        });
    }
);
