module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    client: {
      base: "client/app",
      port: 9333,
      // src: ['<%= client.base %>/']
    },
    proxyServer: {
      accessPoint: ['/api', '/oauth'],
      host: 'localhost',
      port: 9000,
    },

    concat: {
      options: {
        separator: ';',
        // banner: "'use strict';\n",
      },
      dist: {
        src: ['client/{app,components}/**/*.js', '!client/app/**/*.spec.js'],
        dest: 'www/js/app.js'
      }
    },

  // grunt.loadNpmTasks 'grunt-contrib-copy'
    copy: {
      images: {
        expand: true,
        cwd: 'client/assets/images/',
        src: '*',
        dest: 'www/assets/images'
      },
      css: {
        expand: true,
        cwd: 'client/assets/stylesheets/',
        dest: 'www/assets/stylesheets',
        src: ['**/*.css']
      },
      bower: {
        expand: true,
        cwd: 'client/',
        src: 'bower_components/**/*',
        dest: 'www'
      },
    },

    // clent www
    clean: ['www/js/*', 'www/css/*', 'www/vendor/*', 'www/assets/images/*'],

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: 'www/index.html',
        ignorePath: '../client/',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/']
      }
    },

    //serve
    connect: {
      server: {
        options: {
          hostname: "*",
          base: "www",
          port: "<%= client.port %>",
        },
      },
    },
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: 'caregiversComApp',
      },
      main: {
        cwd: 'client',
        src: ['{app,components}/**/*.html'],
        dest: 'www/js/templates.js'
      },
    },
    injector: {
      options: {
      },
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function(filePath) {
            console.log(filePath);
            filePath = filePath.replace('/www/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          'www/index.html': [
               [
                 'www/js/*.js'
               ]
            ]
        }
      },

      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/www/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          'www/index.html': [
            'www/assets/stylesheets/**/*.css'
          ]
        }
      }
    },
    watch: {
      dev: {
        files: [ 'Gruntfile.js', 'client/app/**/*.js', 'client/app/**/*.html' ],
        tasks: ['concat:dist', 'ngtemplates:main'],
      },
    }
  });

  grunt.registerTask('default', ['server']);
  grunt.registerTask('build:dev', [
    'copy:images',
    'copy:css',
    'concat:dist',
    'ngtemplates:main',
    'injector:scripts',
    'injector:css',
    'wiredep:target',
  ])
  grunt.registerTask('server', [
    'clean',
    'copy:bower',
    'build:dev',
    // 'configureProxies:server',
    'connect:server',
    'watch:dev',
  ]);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-angular-templates');
  // grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-contrib-connect');
};
