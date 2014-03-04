define(
    [
        "jquery",
        "underscore",
        "backbone"
    ],

    function ($, _, backbone) {

        var Pencil = function (annotationView) {
            /* handle any free form drawing  */
        
            return ({
                initialize: function() {
                    var that = this;
                    var $target = annotationView.model.get("target"); 
                    $target.bind("mousedown", function(){that.startMouseDraw.apply(that,arguments)}); 
                    $target[0].addEventListener("touchstart", function(){that.startTouchDraw.apply(that,arguments)}); 
                },
            
                destroy: function() {
                    var $target = annotationView.model.get("target"); 
                    $target.unbind("mousedown", this.startMouseDraw);
                    $target[0].removeEventListener("touchstart", this.startTouchDraw);
                },

                // main event handlers 
                // -------------------

                startMouseDraw: function(e) {
                    e.preventDefault();
                    var $target = annotationView.model.get("target"); 
                    var offsetLeft = $(annotationView.el).offset().left;
                    var offsetTop = $(annotationView.el).offset().top;
                    var x = e.pageX-offsetLeft + 1;
                    var y = e.pageY-offsetTop; 
                    var time = new Date().getTime();
                    var recordingObjects = annotationView.model.get("recordingObjects");

                    function mouseDraw (e) {
                        var x = e.pageX-offsetLeft + 1;
                        var y = e.pageY-offsetTop + 1;
                        var time = new Date().getTime();

                        annotationView.context.lineTo(x,y); 
                        annotationView.context.stroke();
                        recordingObjects.canvasElements.push(new recordingObjects.canvasLineTo(x,y,time));
                    }
                    
                    annotationView.context.beginPath();
                    annotationView.context.moveTo(x,y);
                    recordingObjects.canvasElements.push(new recordingObjects.canvasMoveTo(x,y,time));
                    $target.bind("mousemove", mouseDraw);
                    $target.bind("mouseup", function(){$target.unbind("mousemove", mouseDraw)});
                },

                startTouchDraw: function(e) {
                    e.preventDefault();
                    var $target = annotationView.model.get("target"); 
                    var offsetLeft = $(annotationView.canvas).offset().left;
                    var offsetTop = $(annotationView.canvas).offset().top;
                    var x = e.touches[0].pageX-offsetLeft + 1;
                    var y = e.touches[0].pageY-offsetTop;
                    var time = new Date().getTime();
                    var recordingObjects = annotationView.model.get("recordingObjects");

                    function touchDraw(e) {
                        e.preventDefault();
                        var x = e.touches[0].pageX - offsetLeft + 1;
                        var y = e.touches[0].pageY - offsetTop;
                        var time = new Date().getTime();

                        annotationView.context.lineTo(x,y); 
                        annotationView.context.stroke();
                        recordingObjects.canvasElements.push(new recordingObjects.canvasLineTo(x,y,time));
                    }

                    annotationView.context.beginPath();
                    annotationView.context.moveTo(x,y);
                    recordingObjects.canvasElements.push(new recordingObjects.canvasMoveTo(x,y,time));
                    $target[0].addEventListener("touchmove", touchDraw);
                    $target[0].addEventListener("touchend", function(){$target.unbind("touchmove",touchDraw)});
                }

            });
        }
        return Pencil;
    }
);
