/// <reference path="node_modules/responsive-toolkit/dist/bootstrap-toolkit.js" />
/// <binding ProjectOpened='default' />
/// <vs SolutionOpened='default' />
module.exports = function (grunt) {

    require('time-grunt')(grunt);

    var npmPath = 'node_modules';

    var jsLibraryFiles = [
        npmPath + '/jquery/dist/jquery.js',
        // npmPath + '/bootstrap/dist/js/bootstrap.js',
        // npmPath + '/responsive-toolkit/dist/bootstrap-toolkit.js',
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
                    'assets/css/construct.css': 'src/stylesheets/construct.scss'
                }
            }
        },

        // CSS post-processing
        // --------------------------------------------------
        postcss: {
            options: {
                map: {
                    inline: false,
                    annotation: 'assets/css/maps/'
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
                    'assets/css/construct.min.css': 'assets/css/construct.css',
                }
            }
        },

        // Copy files
        // -----------------------------------------------------
        copy: {
            js: {
                files: [
                    {
                        expand: true,
                        src: jsLibraryFiles,
                        dest: 'src/js/lib/',
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
                    'assets/js/construct.min.js': [
                        'src/js/app/nav-sticky.js'
                    ],
                    'assets/js/libs.min.js': [
                        'src/js/lib/jquery.js',
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
                    'assets/js/construct.min.js': [
                        'src/js/app/nav-sticky.js'
                    ],
                    'assets/js/libs.min.js': [
                        'src/js/lib/jquery.js',
                        jsLibraryFiles
                    ],
                }
            }
        },

        // Clean files (flush) - This task removes files
        // -----------------------------------------------------
        clean: {
            css: [
                'assets/css/**/*.*'
            ],
            js: [
                'assets/js/**/*.* '
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
                    'src/js/app/**/*.js'
                ]
            },
            prod: {
                options: {
                    force: false
                },
                src: [
                    'src/js/app/**/*.js'
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
                    'src/stylesheets/**/*.scss'
                ],
                tasks: [
                    'clean:css',
                    'sass',
                    'postcss'
                ],
            },
            uglify: {
                files: [
                    'src/js/**/*.js'
                ],
                tasks: [
                    'clean:js',
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
        'postcss',
        'jshint:dev',
        'copy:js',
        'uglify:dev',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'sass',
        'postcss',
        'copy:js',
        'uglify:prod',
    ]);
};
