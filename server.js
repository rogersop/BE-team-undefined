const app = require('./app')

app.listen(3000, function(){
    console.log('Server listening on port 3000....');
})

module.exports = app;