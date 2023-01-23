const app = require('./app').app;
const port = process.env.API_PORT || 3001;
const morgan = require('morgan');
app.use(morgan('dev'));

app.listen(port, () => console.log(`Server is listening on port ${port}`));
