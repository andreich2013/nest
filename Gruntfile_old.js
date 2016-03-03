// Generated on 2015-08-13 using generator-angular 0.11.1
'use strict';

module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take
    require('time-grunt')(grunt);


    // Configurable paths for the application
    var config = {
            name: "nest",
            root: '.',
            app: './project/app',
            bower: './project/bower_components',
            assets: './project/assets',
            dist: './dist',
            config: './config',
            env: ['dev', 'qa', 'prod']
        },
        modRewrite = require('connect-modrewrite');

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        _module: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= _module.app %>/**/*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.livereload.options.livereload %>'
                }
            },
            jsTest: {
                files: ['<%= _module.app %>/**/*.spec.js'],
                tasks: ['newer:jshint:test', 'ngtemplates:test', 'karma']
            },
            compass: {
                files: ['<%= _module.assets %>/**/*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer:server']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.livereload.options.livereload %>'
                },
                files: [
                    '<%= _module.app %>/**/*.html',
                    '<%= _module.assets %>/{,*/}*.css',
                    '<%= _module.assets %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            constants: {
                files: ['<%= _module.app %>/env.js'],
                tasks: ['ngconstant:dev'],
                options: {
                    livereload: '<%= connect.livereload.options.livereload %>'
                }
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                middleware: function (connect, options) {
                    var optBase = (typeof options.base === 'string') ? [options.base] : options.base;

                    return [modRewrite(['!(\\..+)$ /index.html [L]'])]
                        .concat(optBase.map(function (path) {
                            if (path.indexOf('rewrite|') === -1) {
                                return connect.static(path);
                            } else {
                                path = path.replace(/\\/g, '/').split('|');
                                return connect().use(path[1], connect.static(path[2]));
                            }
                        }));
                }
            },
            livereload: {
                options: {
                    //open: true,
                    livereload: 35729,
                    middleware: function (connect) {
                        return [
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            connect.static(config.app),
                            connect.static('.tmp'),
                            connect().use(
                                '/assets',
                                connect.static(config.assets)
                            ),
                            connect().use(
                                '/bower_components',
                                connect.static(config.bower)
                            ),
                            connect().use(
                                '/app',
                                connect.static(config.app)
                            )
                        ];
                    }
                }
            },
            dist: {
                options: {
                    //open: true,
                    base: '<%= _module.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= _module.app %>/**/*.js'
                ]
            },
            test: {
                src: ['<%= _module.app %>/**/*.spec.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= _module.dist %>/{,*/}*',
                        '!<%= _module.dist %>/.git{,*/}*'
                    ]
                }]
            },
            install: ['<%= _module.bower %>'],
            "after-package": ['<%= _module.dist %>/**/*{vendor}*.{js,css}']
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            server: {
                options: {
                    map: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= _module.assets %>/styles/',
                        src: '{,*/}*.css',
                        dest: '<%= _module.assets %>/styles/'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= _module.assets %>/styles/',
                        src: '{,*/}*.css',
                        dest: '<%= _module.assets %>/styles/'
                    }
                ]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= _module.assets %>/styles/scss/',
                cssDir: '<%= _module.assets %>/styles/css/',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= _module.assets %>/images/',
                javascriptsDir: '<%= _module.app %>',
                fontsDir: '<%= _module.assets %>/fonts',
                importPath: '<%= _module.bower %>',
                httpImagesPath: '/assets/images/',
                httpGeneratedImagesPath: '/assets/images/generated',
                httpFontsPath: '/assets/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= _module.dist %>/assets/images/generated'
                }
            },
            server: {
                options: {
                    sourcemap: true
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= _module.dist %>/scripts/{,*/}*.js',
                    '<%= _module.dist %>/assets/styles/{,*/}*.css',
                    '<%= _module.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= _module.app %>/index.html',
            options: {
                dest: '<%= _module.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= _module.dist %>/*.html'],
            css: ['<%= _module.dist %>/assets/styles/{,*/}*.css'],
            js: ['<%= _module.dist %>/scripts/**/*.js'],
            options: {
                assetsDirs: [
                    '<%= _module.dist %>',
                    '<%= _module.dist %>/assets',
                    '<%= _module.dist %>/assets/styles',
                    '<%= _module.dist %>/assets/images',
                    '<%= _module.dist %>/assets/fonts'
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= _module.dist %>/',
                        src: ['*.html'],
                        dest: '<%= _module.dist %>'
                    }
                ]
            }
        },

        uglify: {
            options: {
                mangle: false
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        //only project files
        ngAnnotate: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: ['*.js', '!vendor.js'],
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= _module.app %>/',
                        dest: '<%= _module.dist %>',
                        src: ['*.html']
                    },
                    {
                        expand: true,
                        cwd: '<%= _module.assets %>/images/',
                        src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
                        dest: '<%= _module.dist %>/assets/images'
                    }
                ]
            },
            package: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= _module.assets %>/images/',
                        src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
                        dest: '<%= _module.dist %>/assets/images'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '.',
                        dest: '<%= _module.dist %>',
                        src: ['*.md']
                    }
                ]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'compass:server'
            ],
            dist: [
                'compass:dist'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        // compile angular templates & append to app.js
        ngtemplates: {
            options: {
                module: '<%= _module.name %>',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                usemin: 'scripts/main.js'
            },
            dist: {
                cwd: '<%= _module.app %>',
                src: [
                    '**/*.html',
                    '!index.html'
                ],
                dest: '.tmp/templateCache.js'
            },
            test: {
                options: {
                    usemin: undefined
                },
                cwd: '<%= _module.app %>',
                src: [
                    '**/*.html',
                    '!index.html'
                ],
                dest: '.tmp/templateCache.js'
            }
        },

        ngconstant: {
            options: {
                deps: null,
                wrap: true,
                dest: '<%= _module.app %>/env.js',
                name: '<%= _module.name %>'
            },
            "dev": {
                constants: {
                    "ENV": grunt.file.readJSON(config.config + '/dev.json')
                }
            },
            "qa": {
                constants: {
                    "ENV": grunt.file.readJSON(config.config + '/qa.json')
                }
            },
            "prod": {
                constants: {
                    "ENV": grunt.file.readJSON(config.config + '/prod.json')
                }
            }
        },

        "bower-install-simple": {
            options: {
                directory: '<%= _module.bower %>',
                forceLatest: true
            },
            dev: {
                options: {
                    production: false
                }
            },
            prod: {
                options: {
                    production: true
                }
            }
        }

    });

    grunt.registerTask('serve', 'Compile then start a "connect" web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'package',
                'connect:dist:keepalive'
            ]);
        }

        grunt.task.run([
            'concurrent:server',
            'autoprefixer:server',
            'ngconstant:dev',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'jshint:all',
        'ngtemplates:test',
        'karma'
    ]);

    grunt.registerTask('package', 'Prepare module to be published to production', function () {
        if(!grunt.file.exists(config.dist)){
            grunt.file.mkdir(config.dist);
        }

        grunt.task.run([
            'clean:dist',
            'useminPrepare',
            'ngtemplates:dist',
            'concurrent:dist',
            'autoprefixer:dist',
            'concat',
            'ngAnnotate',
            'copy:package',
            'cssmin',
            'uglify',
            'usemin',
            'clean:after-package'
        ]);
    });

    grunt.registerTask('install', 'Installs dependencies', function () {
        grunt.task.run([
            'clean:install'
        ]);

        var tmp = config.env.indexOf((grunt.option('environment'))),
            env = tmp !== -1 ? config.env[tmp] : 'dev';

        grunt.task.run([
            'bower-install-simple:' + (env === 'prod' ? env : 'dev'),
            'ngconstant:' + env
        ]);
    });
};
