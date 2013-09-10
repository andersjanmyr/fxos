'use strict';
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // add here the libs you install with bower
  var bowerFiles = [
  ];

  grunt.initConfig({
    // -- arbitrary properties --
    // -- end of properties -----

    // JS linter config
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/scripts/**/*.js',
        'test/spec/**/*.js',
        '!app/scripts/vendor/**/*'
      ]
    },

    // Less config
    less: {
      dev: {
        options: {
          paths: ['app/styles']
        },
        files: {
          '.tmp/styles/main.css': 'app/styles/main.less'
        }
      },
      prod: {
        options: {
          paths: ['app/styles'],
          compress: true
        },
        files: {
          '.tmp/styles/main.css': 'app/styles/main.less'
        }
      }
    },

    // watch config
    watch: {
      less: {
        files: ['app/styles/**/*.less'],
        tasks: ['less:dev']
      }
    },

    // server config
    connect: {
      server: {
        options: {
          port: 8000,
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      test: {
        options: {
          port: 9002,
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },

    // mocha (test) config
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://0.0.0.0:9002/index.html'],
          bail: true,
          reporter: 'Spec'
        }
      }
    },

    // clean config
    clean: {
      release: ['public/application.zip'],
      build: [
        'build',
        '.tmp'
      ],
      server: [
        '.tmp'
      ]
    },

    // copy config
    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          src: [
            'styles/**/*.css',
            '!styles/gaiabb/**/*.css',
            'styles/gaiabb/all.css',
            'styles/gaiabb/**/*.{png,gif,jpg,jpeg,svg}',
            'scripts/**/*.js',
            'icons/**/*.{png,jpg,jpeg,svg}',
            'images/**/*.{png,gif,jpg,jpeg,svg}',
            '*.html',
            'manifest.webapp'
          ],
          dest: 'build'
        }, {
          expand: true,
          cwd: 'app',
          src: bowerFiles.map(function (x) { return 'components/' + x; }),
          dest: 'build'
        }]
      },
      less: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: [
            'styles/**/*.css'
          ],
          dest: 'build'
        }]
      }
    },

    // Firefox OS push config
    ffospush: {
      app: {
        appId: 'fxos-weather',
        zip: 'application.zip'
      }
    },

    // compress (zip a file for release) config
    compress: {
      release: {
        options: {
          archive: 'application.zip',
        },
        files: [{
          cwd: 'build',
          expand: true,
          src: '**/*'
        }]
      }
    }
  });

  grunt.registerTask('build', 'Build app for release', [
    'jshint',
    'clean:build',
    'copy:build',
    'copy:less',
  ]);

  grunt.registerTask('release', 'Creates a zip with an app build', [
    'build',
    'less:release',
    'clean:release',
    'compress:release'
  ]);

  grunt.registerTask('test', 'Launch tests in shell with PhantomJS', [
    'jshint',
    'clean:server',
    'less:dev',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('server', 'Launch local server', function (target) {
    if (target === 'test') {
      grunt.task.run([
        'jshint',
        'clean:server',
        'less:dev',
        'connect:test:keepalive'
      ]);
    }
    else {
      grunt.task.run([
        'jshint',
        'clean:server',
        'less:dev',
        'connect:server',
        'watch'
      ]);
    }
  });

  grunt.registerTask('log', 'Outputs FF OS device\'s log', ['ffoslog']);
  grunt.registerTask('reset', 'Resets B2G', ['ffosreset']);
  grunt.registerTask('push', 'Installs the app in the device', function () {
    grunt.task.run([
      'release',
      'ffospush:app'
    ]);
  });

  grunt.registerTask('default', 'Default task', [
    'jshint'
  ]);
};

