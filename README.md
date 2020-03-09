# AIOTES FIWARE Enabler

## Configuration
The docker container accepts a series of environment variables that are specific to each deployment.

| Variable | Description | Default value |
|----------|-------------|---------------|
|HTTP_PORT|Defines the internal port exposed by the server| 3000|
|MONGO_URI|The mongodb-compliant connection string to the database|```empty```|
|NODE_ENV|A flag to indicate whether the server should run on developemnt (```dev```) or production (```prod```) mode|```dev```|
|API_KEY|A string containing the security token to use this API|```empty```|
|API_CONTACT_NAME|The identifying name of the contact person/organization||
|API_CONTACT_URL|The URL pointing to the contact information||
|API_CONTACT_EMAIL|The email address of the contact person/organization||

