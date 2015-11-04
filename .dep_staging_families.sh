#!/usr/bin/env bash

if ! command -v grunt > /dev/null; then
  printf 'Grunt is not installed.\n'
fi

if ! command -v aws > /dev/null; then
  printf 'aws-cli is not installed.\n'
fi


# Build families.cg.com for staging
grunt build:staging --site=families

# sync directory to Staging on S#
aws s3 sync ./www/families s3://families-staging.caregivers.com --acl public-read
