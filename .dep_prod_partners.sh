#!/usr/bin/env bash

if ! command -v grunt > /dev/null; then
  printf 'Grunt is not installed.\n'
fi

if ! command -v aws > /dev/null; then
  printf 'aws-cli is not installed.\n'
fi

# Build families.cg.com for staging
grunt build:prod --site=partners

# sync directory to Staging on S3
aws s3 sync ./www/partners s3://partners.caregivers.com --acl public-read
