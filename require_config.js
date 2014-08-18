// Description: configuration file for requirejs

require.config({

    baseURL: "./",

    shim: {
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
        "AnnotationModel" : "js/model/AnnotationModel",
        "AnnotationView"  : "js/view/AnnotationView",
        "utils"           : "js/utils/utils",
        "Tools"           : "js/tools/tools",
        "Pencil"          : "js/tools/pencil/pencil.view"
    }
});
