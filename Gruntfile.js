module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-aws-s3');
  var path = require('path');
  var modRewrite = require('connect-modrewrite');
  var serveStatic = require('serve-static')
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    aws_s3: {
      production: {
      options: {
        bucket: 'families.caregivers.com',
      },
        files: [
          {expand: true, cwd: 'www', src: ['**'], dest: '/'}
        ]
      }
    },
    client: {
      base: "client/families/app",
      port: 9333,
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
        src: ['client/families/app/**/*.js', 'client/components/**/*.js', '!client/app/**/*.spec.js'],
        dest: 'www/js/app.js'
      }
    },

  // grunt.loadNpmTasks 'grunt-contrib-copy'
    copy: {
      images: {
        expand: true,
        cwd: 'client/families/assets/images/',
        src: ['*', '**/*'],
        dest: 'www/assets/images'
      },
      js: {
        expand: true,
        cwd: 'client/families/assets/js/',
        src: ['*.js'],
        dest: 'www/assets/js'
      },
      css: {
        expand: true,
        cwd: 'client/families/assets/stylesheets/',
        dest: 'www/assets/stylesheets',
        src: ['**/*.css']
      },
      index: {
        expand: true,
        cwd: 'client/',
        dest: 'www/',
        src: ['index.html']
      },
      script: {
        expand: true,
        flatten: true,
        cwd: 'client',
        dest: 'www/js',
        src: ['families/app/**/*.js', 'components/**/*.js' , '!app/**/*.spec.js']
      },
      devEnv: {
        expand: true,
        cwd: 'env',
        dest: 'www/js/',
        rename: function(desc, file) {
          return desc + "env.js"
        },
        src: ['dev.js']
      },
      prodEnv: {
        expand: true,
        cwd: 'env',
        dest: 'www/js/',
        rename: function(desc, file) {
          return desc + "env.js"
        },
        src: ['prod.js']
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
        src: ['families/app/**/*.html','components/**/*.html'],
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
            filePath = filePath.replace('/www/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          'www/index.html': [
               [
                 'www/js/env.js',
                 'www/js/app.js',
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
      options: {
        livereload: true,
      },
      dev: {
        files: ['client/families/app/**/*.js', 'client/families/app/**/*.html', 'env/*.js', 'client/families/assets/stylesheets/*.css'],
        tasks: ['copy:devEnv', 'concat:dist', 'ngtemplates:main'],
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
    'copy:images',
    'copy:js',
    'copy:css',
    'copy:prodEnv',
    'concat:dist',
    'ngtemplates:main',
    'injector:scripts',
    'injector:css',
    'wiredep:target',
  ])

  grunt.registerTask('deploy:prod', function () {
    grunt.task.run(['build:prod', 'aws_s3']);
  });

  grunt.registerTask('build:dev', [
    'copy:images',
    'copy:js',
    'copy:css',
    'copy:index',
    'copy:devEnv',
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
    'watch:configFiles',
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
