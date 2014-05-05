/*
 * Default Gruntfile for AppGyver Steroids
 * http://www.appgyver.com
 *
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-traceur');

  grunt.initConfig({
    clean: {
      generatedJS: ['dist/*.js', 'demo/notification.js', 'demo/styles/notification.css']
    },

    traceur: {
      options: {
        sourceMaps: true,
        includeRuntime: true
      },
      dev: {
        files: {
          'dist/notification.js': ['notification.js']
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            src: ['dist/notification.js', 'styles/notification.css'],
            dest: 'demo/',
            expand: true
          }
        ]
      }
    },

    watch: {
      scripts: {
        files: ['notification.js', 'demo/demo.js', 'styles/notification.css'],
        tasks: ['make-dev-files']
      }
    }
  });

  grunt.registerTask("make-dev-files", [
    "clean:generatedJS",
    "traceur:dev",
    "copy:main"
  ]);

  grunt.registerTask("default", [
    "make-dev-files",
    "watch:scripts"
  ]);
};

