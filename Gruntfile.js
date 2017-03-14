/// <reference path="node_modules/responsive-toolkit/dist/bootstrap-toolkit.js" />
/// <binding ProjectOpened='default' />
/// <vs SolutionOpened='default' />
module.exports = function (grunt) {

    require('time-grunt')(grunt);

    var npmPath = 'node_modules';

    var jsLibraryFiles = [
        npmPath + '/jquery/dist/jquery.js',
        npmPath + '/bootstrap/dist/js/bootstrap.js',
        npmPath + '/responsive-toolkit/dist/bootstrap-toolkit.js',
        npmPath + '/tether/dist/js/tether.js',
        // npmPath + '/jquery-lazy/jquery.lazy.js',
        npmPath + '/hypher/dist/jquery.hypher.js',
        'scripts/app/sv.js', // This jQuery version cannot be downloaded via npm. https://github.com/bramstein/hyphenation-patterns/blob/master/dist/browser/sv.js
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

        // Sass
        // --------------------------------------------------
        sass: {
            options: {
                sourceMap: 'none',
            },
            dist: {
                files: {
                    'dist/css/construct.css': 'stylesheets/construct.scss'
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
                    'dist/css/construct.min.css': 'dist/css/construct.css',
                }
            }
        },

        // Concat
        // --------------------------------------------------
        concat: {
            options: {
                separator: ';'
            },
            // js: {
            //     src: [
            //         'scripts/init.js',
            //         'scripts/app/application.js'
            //     ],
            //     dest: 'dist/js/construct.js'
            // },
            // css: {
            //     src: [
            //         'node_modules/bootstrap/dist/css/bootstrap.css',
            //         'node_modules/select2/dist/css/select2.css'
            //     ],
            //     dest: 'dist/css/lib.css',
            // }
        },

        // Copy files
        // -----------------------------------------------------
        copy: {
            js: {
                files: [
                    {
                        expand: true,
                        src: jsLibraryFiles,
                        dest: 'scripts/lib/',
                        filter: 'isFile',
                        flatten: true
                    }
                ]
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
                    'dist/js/construct.min.js': [
                        'scripts/init.js',
                        'scripts/app/application.js'
                    ],
                    'dist/js/cits.min.js': [
                        'scripts/app/nav-sticky.js'
                    ],
                    'dist/js/libs.min.js': [
                        'scripts/jquery.js',
                        jsLibraryFiles
                    ],
                }
            },
            prod: {
                options: {
                    mangle: true,
                    beautify: false
                },
                files: {
                    'dist/js/construct.min.js': [
                        'scripts/init.js',
                        'scripts/app/application.js'
                    ],
                    'dist/js/cits.min.js': [
                        'scripts/app/nav-sticky.js'
                    ],
                    'dist/js/libs.min.js': [
                        'scripts/jquery.js',
                        jsLibraryFiles
                    ],
                }
            }
        },

        // Clean files (flush) - This task removes files
        // -----------------------------------------------------
        clean: {
            css: [
                'dist/css/**/*.css'
            ],
            js: [
                'dist/js/**/*.js'
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
                    'scripts/app/**/*.js'
                ]
            },
            prod: {
                options: {
                    force: false
                },
                src: [
                    'scripts/app/**/*.js'
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
                    'stylesheets/**/*.scss'
                ],
                tasks: [
                    'clean:css',
                    'sass',
                    // 'concat:css',
                    'postcss'
                ],
            },
            uglify: {
                files: [
                    'scripts/**/*.js'
                ],
                tasks: [
                    'clean:js',
                    // 'concat:js',
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');

    // Register tasks
    // --------------------------------------------------
    grunt.registerTask('default', [
        'exec:remove_writeprotection',
        'clean',
        'sass',
        // 'concat',
        'postcss',
        'jshint:dev',
        'copy:js',
        'uglify:dev',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'sass',
        // 'concat',
        'postcss',
        'copy:js',
        'uglify:prod',
    ]);
};
