#!/usr/bin/env bash

# Test
#aws s3 sync ./www s3://new-sync1
aws s3 sync ./www/families s3://families-staging.caregivers.com
