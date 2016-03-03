module.exports = function( grunt ) {
  'use strict';

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
        server: './project/server',
        env: ['dev', 'qa', 'prod']
      };

  grunt.loadNpmTasks('grunt-wiredep');

  /**
    Node package info
  */
  grunt.initConfig({
    // Project settings
    _module: config,

    pkg: grunt.file.readJSON('package.json'),

    wiredep: {
      app: {
        src: 'index.html'
      }
    },

    clean: {
      install: ['<%= _module.bower %>'],
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

  grunt.registerTask('install', 'Installs dependencies', function () {
    var tmp = config.env.indexOf((grunt.option('environment'))),
        env = tmp !== -1 ? config.env[tmp] : 'dev';

    grunt.task.run([
      'clean:install',
      'bower-install-simple:' + (env === 'prod' ? env : 'dev'),
      'ngconstant:' + env
    ]);
  });

  /**
    Start the web server on port 8080
  */
  grunt.registerTask('serve', 'Start express server', function() {
    require(config.server + '/server.js').listen(8080, function () {
      grunt.log.writeln('Web server running at http://localhost:8080.');
    }).on('close', this.async());
  });

  /**
    Set the server task as our default.
  */
  grunt.registerTask('default', ['serve']);
};
