module.exports = function (grunt) {
  var path = require('path');
  var modRewrite = require('connect-modrewrite');
  var serveStatic = require('serve-static');
  var validSites = [
    {name: 'families', port: 8333},
    {name: 'partners', port: 8334}
  ];
  var clientPort = 8333;
  var site = 'families';

  for (var s in validSites) {
    if(validSites[s].name === grunt.option('site')) {
      site = validSites[s].name;
      clientPort = validSites[s].port;
    }
  }

  var siteFolder = 'client/' + site;
  var destinationFolder = 'www/' + site;
  var destinationIndex = destinationFolder + '/index.html';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    client: {
      base: siteFolder + "/app",
      port: clientPort,
    },
    proxyServer: {
      accessPoint: ['/api', '/oauth'],
      host: 'api.caregivers.com/prod',
      port: 80,
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [siteFolder + '/app/app.js', siteFolder + '/app/**/*.js', 'client/components/**/*.js', '!' + siteFolder + '/app/**/*.spec.js'],
        dest: destinationFolder + '/js/app.js'
      },
      css: {
        src: ['client/assets/css/*.css', siteFolder + '/assets/stylesheets/*.css', siteFolder + '/app/**/*.css'],
        dest: destinationFolder + '/css/all.css',
        options: {
          separator: ''
        }
      },
    },

  // grunt.loadNpmTasks 'grunt-contrib-copy'
    copy: {
      images_global: {
        expand: true,
        cwd: 'client/assets/images/',
        src: ['*', '**/*'],
        dest: destinationFolder + '/assets/images'
      },
      images: {
        expand: true,
        cwd: siteFolder + '/assets/images/',
        src: ['*', '**/*'],
        dest: destinationFolder + '/assets/images'
      },
      js_global: {
        expand: true,
        cwd:  'client/assets/',
        src: ['plugins/**/*.js'],
        dest: destinationFolder + '/assets/js'
      },
      js: {
        expand: true,
        cwd: siteFolder + '/assets/js/',
        src: ['*.js'],
        dest: destinationFolder + '/assets/js'
      },
      css_global: {
        expand: true,
        cwd: 'client/assets/',
        src: ['css/vendors/*.css', 'plugins/**/**/**/*.css', 'plugins/**/**/*.css', 'fonts/*'],
        dest: destinationFolder + '/assets/stylesheets'
      },
      css: {
        expand: true,
        cwd: siteFolder + '/assets/stylesheets/',
        dest: destinationFolder + '/assets/stylesheets',
        src: ['**/*.css']
      },
      index: {
        expand: true,
        cwd: 'client/',
        dest: destinationFolder,
        src: ['index.html']
      },
      script: {
        expand: true,
        flatten: true,
        cwd: 'client',
        dest: destinationFolder + '/js',
        src: [site + '/app/**/*.js', 'components/**/*.js' , '!' + site + '/app/**/*.spec.js']
      },
      devEnv: {
        expand: true,
        cwd: 'env',
        dest: destinationFolder + '/js/',
        rename: function(desc, file) {
          return desc + "env.js"
        },
        src: ['dev.js']
      },
      stagingEnv: {
        expand: true,
        cwd: 'env',
        dest: destinationFolder + '/js/',
        rename: function(desc, file) {
          return desc + "env.js"
        },
        src: ['staging.js']
      },
      prodEnv: {
        expand: true,
        cwd: 'env',
        dest: destinationFolder + '/js/',
        rename: function(desc, file) {
          return desc + "env.js"
        },
        src: ['prod.js']
      },
      bower: {
        expand: true,
        cwd: 'client/',
        src: 'bower_components/**/*',
        dest: destinationFolder
      },
    },

    // clent www
    clean: [destinationFolder + '/js/*', destinationFolder + '/assets/stylesheets/*',  destinationFolder + '/css/*', destinationFolder + '/vendor/*', destinationFolder + '/assets/images/*'],

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: destinationFolder + '/index.html',
        ignorePath: '../client/',
        exclude: [/bootstrap-sass-official/, '/json3/', '/es5-shim/'],
        "overrides": {
          "moment": {
            "main": "min/moment-with-locales.js"
          },
          // "stormpath-sdk-angularjs" : {
          //   "main": [
          //     "dist/stormpath-sdk-angularjs.js",
          //     "dist/stormpath-sdk-angularjs.tpls.js"
          //   ],
          // }
        }
      }
    },

    //serve
    connect: {
      server: {
        options: {
          hostname: "*",
          base: destinationFolder,
          open: true,
          port: "<%= client.port %>",
          livereload: true,
          middleware: function(connect, options) {
            var middlewares;
            middlewares = [];
            middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]']));
            options.base.forEach(function(base) {
              return middlewares.push(serveStatic(base));
            });
            return middlewares;
          }
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
        src: [site + '/app/**/*.html','components/**/*.html'],
        dest: destinationFolder + '/js/templates.js'
      },
    },
    injector: {
      options: {
        destFile: destinationIndex,
      },
      // Inject application script files into index.html (doesn't include bower)
      scripts_and_css: {
        options: {
          transform: function(filePath) {
            if (/^.*\.css$/.test(filePath)) {
              filePath = filePath.replace('/'+destinationFolder, '');
              return '<link rel="stylesheet" href="' + filePath + '">';
            } else if (/^.*\.js$/.test(filePath) && filePath.indexOf('creditcardjs') < 0){
              filePath = filePath.replace('/'+destinationFolder, '');
              return '<script src="' + filePath + '"></script>';
            }

          },
          template: 'client/index.html',
        },
        files: {
          src: [
            destinationFolder + '/js/env.js',
            destinationFolder + '/js/app.js',
            destinationFolder + '/js/*.js',
            destinationFolder + '/assets/js/**/*.js',
            destinationFolder + '/assets/stylesheets/**/*.css',
            destinationFolder + '/css/*.css'
          ]
        }
      },
      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/'+destinationFolder, '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          template: 'client/index.html',
        },
        files: {
          src: [
            destinationFolder + '/assets/stylesheets/**/*.css'
          ]
        }
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      dev: {
        files: [siteFolder + '/app/**/*.js', siteFolder + '/app/**/*.html', 'env/*.js', 'client/components/**/*.js', 'client/components/**/*.html'],
        tasks: ['copy:devEnv', 'concat:dist', 'ngtemplates:main'],
      },
      devCss: {
        files: ['client/assets/css/**/*.css', siteFolder + '/assets/stylesheets/**/*.css', siteFolder + '/app/**/*.css'],
        tasks: ['concat:css'],
        options: {
          reload: true
        }
      },
      configFiles: {
        files: [ 'Gruntfile.js'],
        options: {
          reload: true
        }
      },
    }
  });

  grunt.registerTask('default', ['server']);
  grunt.registerTask('build:prod', [
    'copy:images_global',
    'copy:images',
    'copy:js_global',
    'copy:js',
    'copy:css_global',
    // 'copy:css',
    'copy:index',
    'copy:prodEnv',
    'concat:dist',
    'ngtemplates:main',
    'injector:scripts_and_css',
    'wiredep:target',
  ]);

  grunt.registerTask('build:staging', [
    'copy:images_global',
    'copy:images',
    'copy:js_global',
    'copy:js',
    'copy:css_global',
    // 'copy:css',
    'copy:index',
    'copy:stagingEnv',
    'concat:dist',
    'concat:css',
    'ngtemplates:main',
    'injector:scripts_and_css',
    'wiredep:target',
  ])

  grunt.registerTask('deploy:prod', function () {
    grunt.task.run(['build:prod']);
  });

  grunt.registerTask('build:dev', [
    'copy:images_global',
    'copy:images',
    'copy:js_global',
    'copy:js',
    'copy:css_global',
    // 'copy:css',
    'copy:index',
    'copy:devEnv',
    'concat:dist',
    'concat:css',
    'ngtemplates:main',
    'injector:scripts_and_css',
    'wiredep:target',
  ])

  grunt.registerTask('server', [
    'clean',
    'copy:bower',
    'build:dev',
    'connect:server',
    'watch',
  ]);
  grunt.registerTask('server:staging', [
    'clean',
    'copy:bower',
    'build:staging',
    'connect:server',
    'watch',
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
