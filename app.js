const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require("./app/routes/user")
const indexRoutes = require("./app/routes/index")
const authMiddleware = require("./app/middlewares/auth")
require('dotenv').config()
// create express app
const app = express();
app.set('secretKey', 'tampan');
// Setup server port
const port = process.env.PORT || 3000;
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// define a root route

app.use('/',indexRoutes);
// listen for requests

app.use('/user',userRoutes);
app.get('/test',authMiddleware.isAuth, (req,res) => {
  res.json({message:"Hello World"});
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})