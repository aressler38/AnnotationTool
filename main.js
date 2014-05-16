// Main module and driver cod
define(
   [
    "jquery",
    "underscore", 
    "backbone",
    "annotationModel",
    "annotationView"
], function($, _, backbone, annotationModel, annotationView) {

    // Globals and config here

    // shim for requestAnimationFrame with setTimeout fallback
    window.requestAnimationFrame = (function() {
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();


    /**
     * @constructor
     */
    function AnnotationTool(options) {
        var that = this;
        var model = new annotationModel(options);
        var view = new annotationView({model:model});

        /** @method - proxy to model.get */
        this.get = function(parameter) {
            return model.get(parameter);
        };

        /** @method - proxy to model.set */
        this.set = function(parameter, value) {
            return model.set(parameter, value);
        };

        /** @method - proxy to the view trigger method for events */
        this.trigger = function() {
            view.trigger.apply(view, arguments);
        };

        /** @method - return a base64 representation of the current drawing */
        this.getImg = function(type) {
            return view.getCurrentImage(type);
        };

        this.drawImage = function(img, x, y) {
            view.drawImage.apply(view, arguments);
        };

        /**
         * @object - turn on and off the eraser tool
         */
        this.eraser = {
            on: function() {
                that.set("eraser", "on");
            },
            off: function() {
                that.set("eraser", "off");
            }
        };
        return this;
    }

    /**
     * @method - Set the target on which to overlay the tool.
     * @param - You can pass a css selector or jQuery object.
     */
    AnnotationTool.prototype.setTarget = function(jquery_selector_or_object) {
        this.set("target", jquery_selector_or_object);
    };

    /** @method */
    AnnotationTool.prototype.getTarget = function() {
        return this.get("target");
    };

    /** 
     * @method 
     * @param {string} toolString - The name of the desiered tool to be used (e.g. "pencil").
     */
    AnnotationTool.prototype.setActiveTool = function(toolString) {
        this.set("activeTool", toolString);
    }; 

    /** @method - Set the current brush stroke size */
    AnnotationTool.prototype.setStrokeWidth = function(width) {
        var w = String(width).replace("px", ""); 
        if (Number.isNaN(window.parseInt(w))) {
            throw new Error("Can't parse stroke width");
        }
        else {
            this.model.set("strokeWidth", w);
        }
        return null;
    };

    /** @method - set strok style of canvas brush */
    AnnotationTool.prototype.setStrokeStyle = function(style) {
        this.set("strokeStyle", style);
    };

    /** @method - clear the canvas */
    AnnotationTool.prototype.clear = function() {
        this.trigger("clearCanvas");
    };
    
    
    AnnotationTool.prototype.setBackground = function(imgSrc) {
        this.set("background", imgSrc);
    };

    AnnotationTool.prototype.render = function(jquery_selector_or_object) {
        this.trigger("render", jquery_selector_or_object);
    };
    
    AnnotationTool.prototype.renderUtils = function(jquery_selector_or_object) {
        this.set("toolsTarget", jquery_selector_or_object);
        this.trigger("renderUtils");
    };

    return AnnotationTool;
});


