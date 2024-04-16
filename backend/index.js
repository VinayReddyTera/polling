require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routing');
// const myErrorLogger = require('./utilities/errorLogger');
// const myRequestLogger = require('./utilities/requestLogger');
const cors = require("cors");
const app = express();
const path = require('path');
// const userservice = require('./service/users')

app.use(cors());
app.use(bodyParser.json());

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer,{
  cors : { origin :'*'}
})

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    io.emit('message',message);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Methods", "DELETE, PUT");
     res.header(
       "Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept"
     );
     next();
});

// app.use(myRequestLogger);
app.use('/',router);
// app.use(myErrorLogger);

app.use(express.static(path.join(__dirname+'/dist')));
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname+'/dist/index.html'))
})

port = process.env.PORT || 1204;
httpServer.listen(port,()=>{
  console.log(`server listening on port ${port}`);
});

module.exports = app;