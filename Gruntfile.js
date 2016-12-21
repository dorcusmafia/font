/// <reference path="node_modules/responsive-toolkit/dist/bootstrap-toolkit.js" />
/// <binding ProjectOpened='default' />
/// <vs SolutionOpened='default' />
/// <reference path="C:\Projects\SBUF.v3\SBUF.v3\SBUF.v3.Web.Backoffice\Scripts/knockout-extensions.js" />
module.exports = function (grunt) {

    require('time-grunt')(grunt);

    var npmPath = 'node_modules';

    //var jsCitsScriptFiles = [
    //    'Scripts/application.js',
    //    'Scripts/knockout-extensions.js',
    //    'Scripts/ViewModels/UsersViewModel.js',
    //    'Scripts/ViewModels/components/mail-receiver/mail-receiver.js'
    //];
    var jsLibraryFiles = [
        npmPath + '/jquery/dist/jquery.js',
        npmPath + '/bootstrap/dist/js/bootstrap.js',
        npmPath + '/bootstrap-select/dist/js/bootstrap-select.js',
        npmPath + '/moment/min/moment-with-locales.js',
        npmPath + '/select2/dist/js/select2.js',
        npmPath + '/responsive-toolkit/dist/bootstrap-toolkit.js',
        npmPath + '/jquery.scrollto/jquery.scrollTo.js',
        npmPath + '/sticky-kit/dist/sticky-kit.js',
        npmPath + '/nouislider/distribute/nouislider.js',
        npmPath + '/tablesorter/dist/js/jquery.tablesorter.js',
        npmPath + '/knockout/build/output/knockout-latest.js',
        npmPath + '/knockout-mapping/dist/knockout.mapping.js',
        npmPath + '/jquery.ui.widget/jquery.ui.widget.js',
        //npmPath + '/jquery.iframe-transport/jquery.iframe-transport.js',
        npmPath + '/blueimp-file-upload/js/jquery.iframe-transport.js',
        npmPath + '/blueimp-file-upload/js/jquery.fileupload.js',
        npmPath + '/underscore/underscore.js',
        npmPath + '/parsleyjs/dist/parsley.js',
        npmPath + '/parsleyjs/dist/i18n/sv.js',
        npmPath + '/knockout-parsley/knockout.parsley.js',
        npmPath + '/requirejs/require.js',
        npmPath + '/requirejs-text/text.js'
    ];

    grunt.initConfig({

        // Remove write protection on all project files
        // --------------------------------------------------
        exec: {
            remove_writeprotection: {
                command: 'attrib -r *.* /s',
                stdout: false,
                stderr: false
            },
        },

        // Less
        // --------------------------------------------------
        less: {
            dev: {
                options: {
                    strictImports: false
                },
                files: {
                    'dist/css/sbuf.css': 'less/sbuf.less',
                    'dist/css/theme.css': 'less/theme.less'
                }
            }
        },

        // Sass
        // --------------------------------------------------
        sass: {
            options: {
                sourceMap: 'none',
            },
            dist: {
                files: {
                    'dist/css/sbuf.css': 'stylesheets/sbuf.scss'
                }
            }
        },

        // CSS post-processing
        // --------------------------------------------------
        postcss: {
            options: {
                map: {
                    inline: false,
                    annotation: 'dist/css/maps/'
                },
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 2 versions'
                    }),
                    require('cssnano')()
                ]
            },
            dist: {
                files: {
                    'dist/css/sbuf.min.css': 'dist/css/sbuf.css',
                    'dist/css/lib.min.css': 'dist/css/lib.css'
                }
            }
        },

        // Concat
        // --------------------------------------------------
        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: [
                    'Scripts/init.js',
                    'Scripts/app/application.js'
                ],
                dest: 'dist/js/sbuf.js'
            },
            css: {
                src: [
                    'node_modules/bootstrap/dist/css/bootstrap.css',
                    //'node_modules/bootstrap-select/dist/css/bootstrap-select.css',
                    'node_modules/nouislider/distribute/nouislider.css',
                    'node_modules/select2/dist/css/select2.css'
                ],
                dest: 'dist/css/lib.css',
            }
        },

        // Minify JS files
        // --------------------------------------------------
        uglify: {
            dev: {
                options: {
                    mangle: false,
                    beautify: true
                },
                files: {
                    //'dist/js/sbuf.js': jsCitsScriptFiles,
                    //'dist/js/lib.min.js': jsLibraryFiles,
                    'dist/js/sbuf.min.js': 'dist/js/sbuf.js'
                }
            },
            prod: {
                options: {
                    mangle: true,
                    beautify: false
                },
                files: {
                    //'dist/js/sbuf.js': jsCitsScriptFiles,
                    //'dist/js/lib.min.js': jsLibraryFiles,
                    'dist/js/sbuf.min.js': 'dist/js/sbuf.js'
                }
            }
        },

        // Copy files to dist folder
        // -----------------------------------------------------
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: jsLibraryFiles,
                        dest: 'Scripts/lib/',
                        filter: 'isFile',
                        flatten: true
                    }
                ]
            }
        },

        copyFolders: {
            main: {
                files: [
                    {
                        expand: true,
                        src: jsLibraryFiles,
                        dest: 'Scripts/lib/',
                        filter: 'isFile',
                        flatten: true
                    }
                ]
            }
        },

        // Copy files to dist folder
        // -----------------------------------------------------
        //copy: {
        //    main: {
        //        files: [
        //            {
        //                expand: true,
        //                src: [
        //                    'node_modules/bootstrap/dist/css/bootstrap.css',
        //                    'node_modules/bootstrap-select/dist/css/bootstrap-select.css',
        //                    'node_modules/nouislider/distribute/nouislider.css',
        //                    'node_modules/select2/dist/css/select2.css'
        //                ],
        //                dest: 'dist/css/',
        //                filter: 'isFile',
        //                flatten: true
        //            }
        //        ]
        //    }
        //},

        // Clean files (flush) - This task removes files
        // -----------------------------------------------------
        clean: {
            css: [
                'dist/css/*.css'
            ],
            js: [
                'dist/js/*.js'
            ]
        },

        // Validate JS
        // -----------------------------------------------------
        jshint: {
            dev: {
                options: {
                    force: true
                },
                src: [
                    'Scripts/app/**/*.js'
                ]
            },
            prod: {
                options: {
                    force: false
                },
                src: [
                    'Scripts/app/**/*.js'
                ]
            }
        },

        // Watch
        // --------------------------------------------------
        watch: {
            sass: {
                options: {
                    livereload: true
                },
                files: [
                    'stylesheets/*.scss'
                ],
                tasks: [
                    'clean:css',
                    'sass',
                    'concat:css',
                    'postcss'
                ],
            },
            less: {
                options: {
                    livereload: true
                },
                files: [
                    'less/**/*.less'
                ],
                tasks: [
                    'clean:css',
                    'less',
                    'concat:css',
                    'postcss'
                ],
            },
            uglify: {
                files: [
                    'Scripts/**/*.js'
                ],
                tasks: [
                    'clean:js',
                    'concat:js',
                    'uglify:dev'
                ]
            },
            configFiles: {
                files: [
                    'Gruntfile.js'
                ],
                options: {
                    reload: true
                }
            }
        },
    });

    // Load tasks
    // --------------------------------------------------
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');

    // Register tasks
    // --------------------------------------------------
    grunt.registerTask('default', [
        'exec:remove_writeprotection',
        'clean',
        'sass',
        'concat',
        'postcss',
        'jshint:dev',
        'uglify:dev',
        'copy',
        'watch'
    ]);

    grunt.registerTask('build', [
       'clean',
       'sass',
       'concat',
       'postcss',
       'uglify:prod',
       'copy'
    ]);
};