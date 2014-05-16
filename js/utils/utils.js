
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
                this.canvas.setAttribute("width", this.model.get("canvasWidth"));
                this.canvas.setAttribute("height", this.model.get("canvasHeight"));
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

                function renderStrokePicker(target) {
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
                function renderColorPicker(target) {
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
                if (!toolsTarget) {throw new Error ("Please specify a jQuery selector/target for the tools");}
                /*
                var tools = [
                    renderColorPicker,   
                    renderStrokePicker
                ];
                */
                var tools = [renderColorPicker];
                for (var i=0,tLen=tools.length; i<tLen; i++) tools[i].call(this, toolsTarget);
                return null;
            },


        });


    }
);
