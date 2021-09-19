const express = require('express');
const dotenv = require('dotenv');
// const logger = require('morgan');
const bodyparser = require('morgan');
const path = require('path');
const http = require('http');
var testRoute = require('./routes/test');
// const cookieParser = require('cookie-parser');
const cpuCluster = require("./cpu-cluster");
var app = express();
app.use(express.json({ extended: false }));
var rolesRouter = require('./routes/roles');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var seederRouter = require('./routes/seeder');
var notificationRouter = require('./routes/notification');
var leaveRouter = require('./routes/leave');

const mongoose = require("mongoose");
const configs = require("./configs/database.json");
const cors = require('cors');
const { socketPushNotification } = require('./notification/pushNotification');
var corsOptions = {
  origin: '*', //['https://dev.mytestjet.com', 'https://qa.mytestjet.com', 'https://www.mytestjet.com', 'http://localhost:3000', 'http://116.204.228.59:3000' ],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

dotenv.config();
//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


var debug = require("debug")("rajbari");

app.use('/test', testRoute);
//user
app.use('/auth', authRouter);
app.use('/user', userRouter);
//roles
app.use('/role', rolesRouter);
//leave
app.use('/notification', notificationRouter);

//notification
app.use('/leave', leaveRouter);

// Seed Super Admin
app.use('/seeder', seederRouter)

var server = http.createServer(app);

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
};

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  // transports: ['websocket', 'polling'],
  // rejectUnauthorized: false,
  perMessageDeflate: false
});

socketPushNotification(io);

// io.use(async (socket, next) => {
//   const token = socket.handshake.auth.token;
//   console.log("Socket Token--->", token);
//   if (token != undefined) {
//     return next();
//   }
//   else {
//     // return next(new Error("Token not found"));
//     console.log("Token err 2----->", "Token not found");
//   }
// });

// io.on("connection", async (socket) => {
//   // io.set('transports', ['websocket']);
//   console.log(
//     socket.client.conn.server.clientsCount +
//     " users connected...................."
//   );

//   socket.on("disconnect", async (socket) => {
//     // let query = { radisKey: socket.user && socket.user.redisUserIat }
//     // let updateObj = {
//     //   socket_id: null
//     // }

//     // await SocketUsers.findOneAndUpdate(query, updateObj)
//     // await SocketUsers.deleteOne(query)
//     console.log("A user disconnected................");
//   });

//   // let projectInfo = await Employee
//   //     .find({ user_id: socket.user._id })
//   //     .limit(1);

//   // projectInfo[0] && projectInfo[0].member_access_info.map((item, index) => {
//   // console.log("item.user_ids", item.user_ids);
//   socket.on("kabir", (data) => {
//     console.log("socket data", data);
//     data.from = "From Kabir";

//     socket.broadcast.emit("kabir2", data);
//   });
//   // });
// });

const HOST = process.env.RUN_TIME !== "docker" ? configs.host : "authMongo";
module.exports = mongoose.connect(`mongodb://${HOST}:${configs.port}/${configs.db_name}`, OPTIONS)
  .then(() => {
    console.log("Mongodb connected----------------------------->", HOST);
  })
  .catch((err) => {
    console.error("MongoDB", err);
  });

var PORT = normalizePort(process.env.PORT || 5000);
app.set("port", PORT);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// cpuCluster(() => {
// Cluster CPU
server.listen(PORT, () => {
  console.log(`PORT Started ${PORT} || processId:- ${process.pid}`);
});
// });

server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}