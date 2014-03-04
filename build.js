// Description: configuration file for requirejs

({

    baseURL: "./",

    modules: [
        {
            name: "require_config"
        }
    ],

    dir: 'build',

    mainConfigFile:'require_config.js',

    namespace: 'AnnotationTool'

    //If you want to be able to read it the file, then uncomment the next line.
    //optimize: "none"

})

