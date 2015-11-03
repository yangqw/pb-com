# caregivers-com
This is project for website, it is caregivers.com as SPA


## Configure the Access Keys
Create your credentials file at ~/.aws/credentials (C:\Users\USER_NAME\.aws\credentials for Windows users) and save the following lines after replacing the underlined values with your own.
<pre>
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
</pre>



## how to start server
* the families server can be started with those commands

```bash
grunt 
grunt --site=families # same
```

and host will be served at **http://localhost:9333**

* this partners server can be started with following comand

```bash
grunt --site=partners
```
and host will be served at **http://localhost:9334**

## how to deploy staging
You need install awscli, which can be installed via homebrew.
```bash
grunt build:staging --site=families
. ./.dep_staging_families.sh
```


