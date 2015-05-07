module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: 'dist/',
      lib : 'lib/',
      tmp : 'tmp/'
    },

    copy: {
      tmp: {
        expand: true,
        cwd   : 'tmp/src/',
        src   : '**/*.js',
        dest  : 'lib/'
      }
    },

    babel: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: [{
            expand: true,
            cwd: "src",
            src: "**/*.js",
            dest: "tmp",
            ext: '.js'
        }]
      }
    },

    browserify: {
      dist: {
        files: {
          'dist/rivets-intl.js': ['tmp/main.js']
        },
        options: {
          browserifyOptions: {
            standalone: "IntlComponent"
          }
        }
      }
    },

    uglify: {
      options: {
        preserveComments        : 'some',
        sourceMap               : true,
        sourceMapRoot           : 'rivets-intl/',
        sourceMapIncludeSources : true
      },

      dist: {
        options: {
          sourceMapIn : 'dist/rivets-intl.js.map'
        },

        files: {
          'dist/rivets-intl.min.js': [
            'dist/rivets-intl.js'
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  //grunt.loadNpmTasks('grunt-bundle-jsnext-lib');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default', [
    'clean',
    'babel',
    'browserify',
    'copy:tmp'
  ]);
};
