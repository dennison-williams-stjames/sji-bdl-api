const app = require('./app').app;
const port = process.env.API_PORT || 3001;

app.listen(port, () => console.log(`Server is listening on port ${port}`));
