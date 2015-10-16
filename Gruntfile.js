module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-aws-s3');
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
      base: "client/app",
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
        src: ['client/{app,components}/**/*.js', '!client/app/**/*.spec.js'],
        dest: 'www/js/app.js'
      }
    },

  // grunt.loadNpmTasks 'grunt-contrib-copy'
    copy: {
      images: {
        expand: true,
        cwd: 'client/assets/images/',
        src: ['*', '**/*'],
        dest: 'www/assets/images'
      },
      js: {
        expand: true,
        cwd: 'client/assets/js/',
        src: ['*.js'],
        dest: 'www/assets/js'
      },
      css: {
        expand: true,
        cwd: 'client/assets/stylesheets/',
        dest: 'www/assets/stylesheets',
        src: ['**/*.css']
      },
      script: {
        expand: true,
        flatten: true,
        cwd: 'client',
        dest: 'www/js',
        src: ['{app,components}/**/*.js' , '!app/**/*.spec.js']
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
        files: ['client/app/**/*.js', 'client/app/**/*.html', 'env/*.js', 'client/assets/stylesheets/*.css'],
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
