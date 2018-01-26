const app = require('./app')
const PORT = process.env.NODE_ENV || 3000;

app.listen(PORT, function(){
    console.log(`Server listening on port ${PORT}....`);
})

module.exports = app;