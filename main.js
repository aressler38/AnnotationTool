// Main module and driver cod
define([
    "js/AnnotationTool"
], function (AnnotationTool) {

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

    return AnnotationTool;
});


