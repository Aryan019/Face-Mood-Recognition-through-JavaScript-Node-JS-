const express = require('express')
const app = express()


//serve our static files
app.use(express.static('public')) 
app.listen(5000)