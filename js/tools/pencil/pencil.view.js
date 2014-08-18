define([
    "jquery",
    "utils"
], function ($, utils) {

    var Pencil = function (annotationView) {
        /* handle any free form drawing  */

        var x0,y0;
    
        function draw (x,y) {
            utils.drawSoftLine(annotationView.context, x0, y0, x, y); 
            annotationView.context.stroke();
            annotationView.context.closePath();
        }

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

            startMouseDraw: function(event) {
                event.preventDefault();
                var $target = annotationView.model.get("target"); 
                var offsetLeft = $(annotationView.el).offset().left;
                var offsetTop = $(annotationView.el).offset().top;
                x0 = event.pageX-offsetLeft;
                y0 = event.pageY-offsetTop; 
                var time = new Date().getTime();
                //var recordingObjects = annotationView.model.get("recordingObjects");

                function mouseDraw (event) {
                    var x = event.pageX-offsetLeft;
                    var y = event.pageY-offsetTop ;
                    var time = new Date().getTime();
                    draw(x,y)
                    x0 = x;
                    y0 = y;
                 //   recordingObjects.canvasElements.push(new recordingObjects.canvasLineTo(x,y,time));
                }

                annotationView.context.beginPath();
                annotationView.context.moveTo(x0,y0);
                //recordingObjects.canvasElements.push(new recordingObjects.canvasMoveTo(x,y,time));
                $target.bind("mousemove", mouseDraw);
                $target.bind("mouseup", function(){$target.unbind("mousemove", mouseDraw)});
            },

            startTouchDraw: function(event) {
                event.preventDefault();
                var $target = annotationView.model.get("target"); 
                var offsetLeft = $(annotationView.canvas).offset().left;
                var offsetTop = $(annotationView.canvas).offset().top;
                x0 = event.touches[0].pageX-offsetLeft;
                y0 = event.touches[0].pageY-offsetTop;
                var time = new Date().getTime();
                //var recordingObjects = annotationView.model.get("recordingObjects");

                function touchDraw(event) {
                    event.preventDefault();
                    var x = event.touches[0].pageX - offsetLeft;
                    var y = event.touches[0].pageY - offsetTop;
                    var time = new Date().getTime();
                    draw(x,y)
                    x0 = x;
                    y0 = y;
                 //   recordingObjects.canvasElements.push(new recordingObjects.canvasLineTo(x,y,time));
                }

                annotationView.context.beginPath();
                annotationView.context.moveTo(x0,y0);
                //recordingObjects.canvasElements.push(new recordingObjects.canvasMoveTo(x,y,time));
                $target[0].addEventListener("touchmove", touchDraw);
                $target[0].addEventListener("touchend", function(){$target.unbind("touchmove",touchDraw)});
            }

        });
    }
    return Pencil;
});
