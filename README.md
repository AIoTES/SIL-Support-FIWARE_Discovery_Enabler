# AIOTES FIWARE Enabler

## Background
This enabler is an extension to the AIOTES FIWARE bridge, to solve the limitations that the Orion API imposes to the initial discovery of devices the bridge needs performing.

## Description
This enabler offers a rest API that the bridge can use. Not only provides an endpoint for device discovery ```GET /api/devices``` but also proxies some of the required endpoints in Orion, removing the necessity of exposing the broker to the internet.

All methods implemented can be checked opening the swagger interface at ```{{base_url}}/api-docs```.


## Install
An example docker compose file is provided. The enabler should have direct connectivity to the Orion broker and the mongo database.

## Configuration
The docker container accepts a series of environment variables that are specific to each deployment.

| Variable          | Description                                                                                                       | Default value |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | ------------- |
| HTTP_PORT         | Defines the internal port exposed by the server                                                                   | 3000          |
| MONGO_URI         | The mongodb-compliant connection string to the database                                                           | ```empty```   |
| ORION_URL         | The public URL where Orion Context broker is accessible                                                           | ```empty```   |
| NODE_ENV          | A flag to indicate whether the server should run on development (```dev```) or production (```production```) mode | ```dev```     |
| API_KEY           | A string containing the security token to use this API                                                            | ```empty```   |
| API_CONTACT_NAME  | The identifying name of the contact person/organization                                                           |               |
| API_CONTACT_URL   | The URL pointing to the contact information                                                                       |               |
| API_CONTACT_EMAIL | The email address of the contact person/organization                                                              |               |

### Setting the API_KEY through a docker secret:
The enabler will attempt loading the API_KEY from a secret called 'apikey'. If not defined, will try setting it from the environment variable API_KEY.


## License
The AIOTES Fiware Enabler is licensed under the [Affero General Public License (GPL) version 3](https://github.com/telefonicaid/fiware-orion/blob/master/LICENSE).

&copy; 2020 MySphera

### Are there any legal issues with AGPL 3.0? Is it safe for me to use?

There is absolutely no problem in using a product licensed under AGPL 3.0. Issues with GPL (or AGPL) licenses are mostly related with the fact that different people assign different interpretations on the meaning of the term “derivate work” used in these licenses. Due to this, some people believe that there is a risk in just using software under GPL or AGPL licenses (even without modifying it).

For the avoidance of doubt, the owners of this software licensed under an AGPL-3.0 license wish to make a clarifying public statement as follows:

Please note that software derived as a result of modifying the source code of this software in order to fix a bug or incorporate enhancements is considered a derivative work of the product. Software that merely uses or aggregates (i.e. links to) an otherwise unmodified version of existing software is not considered a derivative work, and therefore it does not need to be released as under the same license, or even released as open source.


