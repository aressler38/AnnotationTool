// Description: configuration file for requirejs

require.config({

    baseURL: "./",

    shim: {
        /*
        jquery: {
            exports: "jQuery"
        },
        */
        noUiSlider: {
            deps: ["jquery"]
        },
        spectrum: {
            deps: ["jquery"] 
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        }
    },
    
    paths: {
        "jquery"          : "vendor/jquery/jquery-1.10.2.min",
        "underscore"      : "vendor/underscore/underscore-min",
        "backbone"        : "vendor/backbone/backbone-min",
        "spectrum"        : "vendor/spectrum/spectrum", // color picker jquery plugin
        "noUiSlider"      : "vendor/noUiSlider-5.0.0/full/jquery.nouislider", // slider plugin
        "annotationModel" : "js/model/annotation.model",
        "annotationView"  : "js/view/annotation.view",
        "utils"           : "js/utils/utils",
        "Tools"           : "js/tools/tools",
        "Pencil"          : "js/tools/pencil/pencil.view"
          
    }
});
