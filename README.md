# St. James Infirmary San Francisco Bad Date List API

This application is intended to be run in a Docker container and is expected to
be running alongside the corresponding [webapp](https://github.com/dennison-williams-stjames/sji-bdl-client) and mongodb instance.  

Configureation variables are expected to be set in .env files and passed to docker.  Running the complete environment can be acchieved with the [sji-bdl-deployment](https://github.com/dennison-williams-stjames/sji-bdl-deployment) docker-compose.

St. James Infirmary is looking for volunteer contributers to resolve [issues with this project](https://github.com/dennison-williams-stjames/sji-bdl-api/issues).  Please [add an issue](https://github.com/dennison-williams-stjames/sji-bdl-api/issues/new) if you need development support.

## Configuration variables
process.env.NODE_ENV - The node environment. default: 'development'  
process.env.API_PORT - The port the API should listen on. default: 3001  
process.env.MONGO_USERNAME - The MongoDB username. default: 'sji-bdl-api'  
process.env.MONGO_PASSWORD - The MongoDB password. default: 'sji-bdl-api'  
process.env.MONGO_HOSTNAME - The MongoDB hostname. default: 'localhost'  
process.env.MONGO_PORT - The MongoDB port. default: 27017  
process.env.MONGO_DB - The MongoDB database. default: 'sji-bdl'  
process.env.JWT_SECRET - Security key used by the admin model for hashing credentials.  This must be set!  
