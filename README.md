[![npm module downloads](https://img.shields.io/npm/dt/newman-pro.svg)](https://www.npmjs.org/package/newman-pro) [![Build Status](https://travis-ci.org/allenheltondev/newman-pro.svg?branch=master)](https://travis-ci.org/allenheltondev/newman-pro) [![Coverage Status](https://coveralls.io/repos/github/allenheltondev/newman-pro/badge.svg)](https://coveralls.io/github/allenheltondev/newman-pro) 

# newman-pro
Newman Runner is a CLI tool that uses the Postman-Pro api to pull the latest version of your collections and environments and run your newman tests.

## Requirements
You must have a valid Postman Pro license and an [integration api key](https://tyler-cloud-project.postman.co/integrations/services/pm_pro_api/).

## Usage
The following command line arguments are available for use:
|Argument        | Alias | Description|
|----------------|-------|------------|
|api-key         |a      |Set the Postman Pro api key for a single invocation|
|set-api-key     |       |Set the Postman Pro api key permanently|
|clear-api-key   |       |Clear the saved Postman Pro api key|
|collection-name |c      |Name of the collection to run|
|environment-name|e      |Name of the environment in which to run the collection|
|collection-uid  |       |Uid of the collection to run|
|environment-uid |       |Uid of the environment in which to run the collection|
|bail            |b      |Abort newman at first test failure|
|reporter        |r      |The type of reporter to build the newman results in|

## Examples
Run newman-pro for a single collection
```
newman-pro --api-key XXXXXXXXXXX -collection-name "Integration Tests"
```

Set the Api key and run multiple collections
```
newman-pro --set-api-key XXXXXXXXXXXXX
newman-pro -c "Weather API Collection"
newman-pro -c "Weather API Integration Tests" -e "Integration Environment"
```

Run newman-pro with a specific collection id, but environment name
```
newman-pro --api-key XXXXXXXX --collection-uid 0777b14b-e626-4733-bb87-f03d2377c71b -e "Dev env"
```