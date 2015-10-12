window.CareGiverEnv = {
  "server": {
    "accesspoint": {
      "USER_COLLECTION_URI" : '/users/register',
      "AUTHENTICATION_ENDPOINT" : '/users/oauth/token',
      "CURRENT_USER_URI" : '/users/current',
      "DESTROY_SESSION_ENDPOINT" : '/users/logout',
      "FORM_CONTENT_TYPE" : 'application/json',
    },
    "host": "http://localhost:9100/api",
    "host_kb": "http://killbill.io:8080/1.0/kb"//"http://internal-cg-killbill-production-elb-1051596223.us-east-1.elb.amazonaws.com/billing"
  }
}
