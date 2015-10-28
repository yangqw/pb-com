#!/usr/bin/env bash

# Test
#aws s3 sync ./www s3://new-sync1
aws s3 sync ./www/partners s3://partners-staging.caregivers.com
