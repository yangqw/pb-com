## caregivers-com
This is project for website, it is caregivers.com as SPA

## Frameworks and libs
In this project we use [Angular.js](https://angularjs.org/), [Materializecss](http://materializecss.com/), stormpath-sdk-angularjs, stripe-angular, angular-easyfb, raygun4js, ui-router, grunt

for more detail, please check bower.json file

## Note for Developers
  our works are based on `staging`, so please create branch base on staging branch, the master branch is not always up to date

## project structure

```bash
.
├── Gruntfile.js
├── README.md
├── bower.json
├── client
│   ├── assets
│   ├── bower_components
│   ├── components
│   ├── families
│   ├── index.html
│   └── partners
├── env
│   ├── dev.js
│   ├── prod.js
│   └── staging.js
├── package.json
└── www
    ├── families
    └── partners
```

* code is under __client__ folder, notice that enterpoint is index.html, this is the base template for both partner & family sites; all the code under client (**except families and partners**) are shared files, if you write stylesheets or js libs that are used on both sites, then you should put them under **client/assets/javascripts** and **client/assets/css** ; also for shared components such as navbar, sidemenu we put them under **client/components/** folder

### Family/Partner Site
family site related codes are under **client/families**, code structure is as below:

```bash
.
├── app
│   ├── app.js
│   ├── config
│   │   └── config.js
│   ├── main
│   │   ├── main.controller.js
│   │   ├── main.controller.spec.js
│   │   ├── main.html
│   │   └── main.js
│   │   ├── passwordResetRequest.controller.js
│   │   ├── passwordResetRequest.controller.spec.js
│   │   ├── passwordResetRequest.html
│   │   └── passwordResetRequest.js
|
|..........................
|
│   ├── profile
│   │   ├── profile.controller.js
│   │   ├── profile.controller.spec.js
│   │   ├── profile.css
│   │   ├── profile.html
│   │   └── profile.js
├── assets
│   ├── images
│   │   └── caregivers-logo-header-40px.jpg
│   ├── js
│   │   └── creditcardjs-v0.10.12.min.js
│   └── stylesheets
│       ├── account.css
│       ├── app.css
│       ├── emailVerification.css
│       ├── login.css
│       ├── main.css
│       ├── passwordReset.css
│       ├── passwordResetRequest.css
│       ├── profile.css
│       ├── register.css
│       └── sidebar.css

``` 

* as you can see, we seperate functions by pages; if we want to check home page, we should check files under app/main folder, the route is control by `main.js` file (in some newer pages I use *.route.js to clarify this is just a route file), we use [ui-router](https://github.com/angular-ui/ui-router) to do the routing feature, so its related html is obviously `main.html`, and controller is `main.controller.js`

* if you want to add style for this page, there are two places to go:
	1. add under families/assets/stylesheets/ 
	2. or just drop one in families/app/main/

	
(partner site has same structure)

## Config site settings

there are some global settings for sites, which located under 

```dash
env
├── dev.js
├── prod.js
└── staging.js
```
and content is similar

```js
window.CareGiverEnv = {
  "server": {
    "accesspoint": {
      "REGISTER_URI" : '/api/users/register',
      "EMAIL_VERIFICATION_ENDPOINT" : '/api/users/emailVerification',
      "AUTHENTICATION_ENDPOINT" : '/api/users/oauth/token',
      "CURRENT_USER_URI" : '/api/users/current',
      "DESTROY_SESSION_ENDPOINT" : '/api/users/logout',
      "FORGOT_PASSWORD_ENDPOINT" : '/api/users/forget_password',
      "CHANGE_PASSWORD_ENDPOINT" : '/api/users/reset_password',
      "FORM_CONTENT_TYPE" : 'application/json',
    },
    "host": "http://localhost:9100",                      // api server
    "host_kb": "https://gw.caregivers.com"	              // api server for killbill service
  },

  "component":{
    "raygun":{
      "initkey":{
        "FAMILIES": "Q6vaxRitsZoLRvxQ7pKsKw==",
        "PARTNERS": "h0ixr2ghLc+Cg82KiDhQ0g=="
      }
    },
    "stripe":{
      "PUBLISHABLE_KEY": "pk_test_d1aKYweI07SGiH1OUk1Jr10t"
    },
    "ezfb":{
      "APP_ID": "1633212660281900",
      "APP_SECRET": ""
    }
  },

  "isStaging": false
}

```

when develop, the only setting option you should care is `host`, this is how we access server api, if you want use staging api server(also this is what I did in dev), just change its content to `http://api-proxy.caregiversstagingstack.justinsaul.svc.tutum.io:9100`


## how to start server
* the families server can be started with those commands

```bash
grunt 
grunt --site=families # same effect
```

when run this command, all needed files under client shared folders and families folders will be copy to www/families folder, and site related js will be concated as
`
  js/app.js
  js/env.js
  js/templates.js
`, and site related css will be concated as `css/all.css`


and host will be served at **http://localhost:9333**

* this partners server can be started with following comand

```bash
grunt --site=partners
```
when run this command, all needed files under client shared folders and families folders will be copy to www/partners folder, and site related js will be concated as
`
  js/app.js
  js/env.js
  js/templates.js
`, and site related css will be concated as `css/all.css`

and host will be served at **http://localhost:9334**


## Features

### Family Site

#### family register (/register)

* register logic is located in file `client/families/app/register/cg-register-form.directive.js`, by calling $user.create, request will be send to 
```
http://api-proxy.caregiversstagingstack.justinsaul.svc.tutum.io:9100/api/users/register`
```, the backend api server will call stormpath and create an stormpath account for user

* once new user set up, user will be redirect to user login page and try autologin user

#### family login (/login)

* the login logic is in `client/families/app/login/login.controller.js`. people can login with facebook account or stormpath account. there are few steps after user login.
	1. create contact if user dont have contactId 
	2. create killbill account if user dont have killbill account
	3. create stripe account if user dont have stripe token

#### family profile (/profile)

#### family timesheet (/timesheet)

### Partner Site
partner site only can login user, person will get invitation email and by clicking the link to login

#### partner login (/login)
* there are few steps when user first login, the process is a little different from family
	1. update partnerId, set partner token used flag to true
	2. create killbill tenant account if there is no kbTenant set
	3. create stripe account if there is no stripeAccountId set
	
	
#### partner billing info (/profile)



## how to deploy staging
You need install `awscli`, which can be installed via homebrew. then

### Configure the Access Keys for AWS
Create your credentials file at ~/.aws/credentials (C:\Users\USER_NAME\.aws\credentials for Windows users) and save the following lines after replacing the underlined values with your own.

```
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

### Deply

```bash
grunt build:staging --site=families
. ./.dep_staging_families.sh
```

### Webview

* to test request for backup page, user must login first, then directly go to this link: http://partners-staging.caregivers.com/headless/request-for-backup	
* to test review page, user must login first, then directly go to this link: http://partners-staging.caregivers.com/headless/full-review
* to test editable availability page, user must login first, then directly go to this link: http://partners-staging.caregivers.com/headless/availiabilty/edit

#### For Mobile Developers
there are two ways to carry access_token to bypass login process

* add accessToken as query params in url, for example

```
http://localhost:9334/headless/full-review?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9%2EeyJzdWIiOiIyTk1DTkVJQUZJNDczQkExOU1DWE04VlYyIiwiaXNzIjoiaHR0cHM6Ly9hcGkuc3Rvcm1wYXRoLmNvbS92MS9hcHBsaWNhdGlvbnMvMUlpNVNJY1FzOWFORzlIbUY3anB2SiIsImV4cCI6MTQ1MDE4ODM0MCwiaWF0IjoxNDUwMTcwMzQwfQ_-xTe882421L%2E5DW1xi2jxKYjn0zoBtZJ5g3zxFcC8J0
```

please notice that since there is dot(.) in accessToken, we have to encode access token, and replace . to %2E to make sure browser can parse correct route

* add header when request url, I test that using firefox with extension called "ModifyHeaders"

simply add another header options in ModifyHeaders

```
Authorization:  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxWUpER080VE1PVkwzV0Q2OUJUUEk2TEtEIiwiaXNzIjoiaHR0cHM6Ly9hcGkuc3Rvcm1wYXRoLmNvbS92MS9hcHBsaWNhdGlvbnMvMUlpNVNJY1FzOWFORzlIbUY3anB2SiIsImV4cCI6MTQ1MDI4NjYxMCwiaWF0IjoxNDUwMjY4NjEwfQ.bVr6C2BPXg9Nvhd1lrOpiHmaPQlA3BNPtxfNS5saCVo
```
and then access URL

