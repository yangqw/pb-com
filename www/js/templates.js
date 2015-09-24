angular.module('caregiversComApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/emailVerification/emailVerification.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <h3>Verify Your Account</h3>\n" +
    "      <hr>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div sp-email-verification></div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/login/login.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <h3>Login</h3>\n" +
    "      <hr>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div sp-login-form></div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/main/main.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div>\n" +
    "\n" +
    "<header class=\"hero-unit\" id=\"banner\">\n" +
    "  <div if-user-state-known class=\"container\">\n" +
    "    <div if-not-user>\n" +
    "      <h1>'Allo, Welcome to CareGivers!</h1>\n" +
    "      <p class=\"lead\">Your full trust cares with CareGivers</p>\n" +
    "    </div>\n" +
    "    <div if-user>\n" +
    "      <h1>'Allo, {{user.fullName}}</h1>\n" +
    "      <p if-user-not-in-group=\"ROLE_ADMINS_CAREGIVERS\" class=\"lead\">\n" +
    "        If you require profile access, please contact us.\n" +
    "      </p>\n" +
    "    </div>\n" +
    "    <img src=\"assets/images/yeoman.png\" alt=\"I'm Yeoman\">\n" +
    "  </div>\n" +
    "</header>\n" +
    "\n" +
    "<div  if-user-state-known class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div if-user class=\"col-lg-12\">\n" +
    "      <h1 class=\"page-header\">Coming features:</h1>\n" +
    "      <ul class=\"nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6\" ng-repeat=\"thing in awesomeThings\">\n" +
    "        <li><a href=\"#\" tooltip=\"{{thing.info}}\">{{thing.name}}</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<footer class=\"footer\">\n" +
    "  <div class=\"container\">\n" +
    "      <p>© Copyright 2015, provided by Stormpath with AngularJs, supported by Shinetech |\n" +
    "        <a href=\"https://twitter.com/tyhenkel\">@tyhenkel</a> |\n" +
    "         <a href=\"https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open\">Issues</a></p>\n" +
    "  </div>\n" +
    "</footer>\n"
  );


  $templateCache.put('app/passwordReset/passwordReset.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <h3>Reset Your Password</h3>\n" +
    "      <hr>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div sp-password-reset-form></div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/passwordResetRequest/passwordResetRequest.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <h3>Request Password Reset</h3>\n" +
    "      <hr>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div sp-password-reset-request-form></div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/profile/profile.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <h3>My Profile</h3>\n" +
    "      <hr>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <pre ng-bind=\"user | json\"></pre>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/register/my-register.html',
    "<!-- <div ng-include=\"'components/navbar/navbar.html'\"></div> -->\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "  <!-- <div class=\"row\"> -->\n" +
    "  <!--   <div class=\"col-xs-12\"> -->\n" +
    "  <!--     <h3>Registration</h3> -->\n" +
    "  <!--     <hr> -->\n" +
    "  <!--   </div> -->\n" +
    "  <!-- </div> -->\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-offset-4 col-xs-12 col-sm-4\">\n" +
    "    <p class=\"alert alert-success\" ng-show=\"created && !enabled\">Your account has been created.  Please check your email for a verification link.</p>\n" +
    "    <p class=\"alert alert-success\" ng-show=\"created && enabled && !authenticating\">Your account has been created.  <a ui-sref=\"login\">Login Now</a>.</p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-12\">\n" +
    "    <form class=\"form-horizontal\" ng-hide=\"created && !authenticating\" ng-submit=\"submit()\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"spFirstName\" class=\"col-xs-12 col-sm-4 control-label\">First Name</label>\n" +
    "        <div class=\"col-xs-12 col-sm-4\">\n" +
    "          <input class=\"form-control\" id=\"spFirstName\" ng-model=\"formModel.givenName\" placeholder=\"First Name\" ng-disabled=\"creating\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"spLastName\" class=\"col-xs-12 col-sm-4 control-label\">Last Name</label>\n" +
    "        <div class=\"col-xs-12 col-sm-4\">\n" +
    "          <input class=\"form-control\" id=\"spLastName\" ng-model=\"formModel.surname\" placeholder=\"Last Name\" ng-disabled=\"creating\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"spEmail\" class=\"col-xs-12 col-sm-4 control-label\">Email</label>\n" +
    "        <div class=\"col-xs-12 col-sm-4\">\n" +
    "          <input class=\"form-control\" id=\"spEmail\" ng-model=\"formModel.email\" placeholder=\"Email\" ng-disabled=\"creating\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"spPassword\" class=\"col-xs-12 col-sm-4 control-label\">Password</label>\n" +
    "        <div class=\"col-xs-12 col-sm-4\">\n" +
    "          <input type=\"password\" class=\"form-control\" id=\"spPassword\" ng-model=\"formModel.password\" placeholder=\"Password\" ng-disabled=\"creating\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"favColor\" class=\"col-xs-12 col-sm-4 control-label\">Favorite Color</label>\n" +
    "        <div class=\"col-xs-12 col-sm-4\">\n" +
    "          <input type=\"text\" class=\"form-control\" id=\"favColor\" ng-model=\"formModel.customData.favColor\" ng-disabled=\"creating\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <div class=\"col-sm-offset-4 col-sm-4\">\n" +
    "          <p class=\"alert alert-danger\" ng-show=\"error\" ng-bind=\"error\"></p>\n" +
    "          <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"creating\">Register</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/register/register.html',
    "<div ng-include=\"'components/navbar/navbar.html'\"></div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <h3>Registration</h3>\n" +
    "      <hr>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div sp-registration-form post-login-state=\"main\" template-url=\"app/register/my-register.html\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=\"modal-header\">\n" +
    "  <button ng-if=\"modal.dismissable\" type=\"button\" ng-click=\"$dismiss()\" class=\"close\">&times;</button>\n" +
    "  <h4 ng-if=\"modal.title\" ng-bind=\"modal.title\" class=\"modal-title\"></h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <p ng-if=\"modal.text\" ng-bind=\"modal.text\"></p>\n" +
    "  <div ng-if=\"modal.html\" ng-bind-html=\"modal.html\"></div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button ng-repeat=\"button in modal.buttons\" ng-class=\"button.classes\" ng-click=\"button.click($event)\" ng-bind=\"button.text\" class=\"btn\"></button>\n" +
    "</div>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=\"NavbarCtrl\">\n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "      <button class=\"navbar-toggle\" type=\"button\" ng-click=\"isCollapsed = !isCollapsed\">\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "      <a href=\"/\" class=\"navbar-brand\">caregivers-com</a>\n" +
    "    </div>\n" +
    "    <div collapse=\"isCollapsed\" class=\"navbar-collapse collapse\" id=\"navbar-main\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li ng-repeat=\"item in menu\" ng-class=\"{active: isActive(item.link)}\">\n" +
    "          <a ng-href=\"{{item.link}}\">{{item.title}}</a>\n" +
    "        </li>\n" +
    "        <li if-user-in-group=\"ROLE_ADMINS_CAREGIVERS\" ng-class=\"{active: isActive('/profile')}\">\n" +
    "          <a ui-sref=\"profile\">Profile</a>\n" +
    "        </li>\n" +
    "        <li if-not-user ng-class=\"{active: isActive('/register')}\">\n" +
    "          <a ui-sref=\"register\">Register</a>\n" +
    "        </li>\n" +
    "        <li if-not-user ng-class=\"{active: isActive('/login')}\">\n" +
    "          <a ui-sref=\"login\">Login</a>\n" +
    "        </li>\n" +
    "        <li if-user ng-class=\"{active: isActive('/logout')}\">\n" +
    "          <a ui-sref=\"main\" sp-logout>Logout</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
