// import RedisStore from "connect-redis";
// let RedisStore = require("connect-redis").default;

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { createClient } = require("redis");
let RedisStore = require("connect-redis")(session);
const cors = require("cors");
const postRouter = require("./routes/postRoute");
const authRouter = require("./routes/authRouter");

const {
  MONGO_USER,
  MONGO_PASS,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config");

const app = express();

let host = "localhost";
let redisport = 6379;

// The IP address used in the method is for the redis container which is gotten by running the docker inspect command with the contatiner name as an argument
// When I used localhost and also the nodeapp container ip address , it didn't work. until I hardcoded the network ip address for the redis container.
//  NOW By setting the url to the name of the container, it enablels the app to communicate directly with the container network and gets the ip address from it

const redisConnection = createClient({
  socket: { port: redisport, host: REDIS_URL },
  legacyMode: true,
}); // creates a new client

//
(async () => {
  redisConnection.on("connect", () => {
    console.log(
      `[Redis]: Connected to redis server at ${host} on port:${redisport}`
    );
  });
  redisConnection.on("error", (err) => console.log("Redis Client Error", err));

  await redisConnection.connect();
})();

// redisConnection.connect().catch(console.error);

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

let redisStore = new RedisStore({
  client: redisConnection,
  logErrors: true,
});

app.use(cors());
app.use(express.json());

app.enable("trust proxy");

app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      resave: false,
      httpOnly: true,
      maxAge: 300000,
      saveUninitialized: false,
    },
  })
);

const connectDD = async () => {
  try {
    await mongoose.connect(mongoUrl);

    console.log("DB Connected");
  } catch (e) {
    console.error(e);
  }
};

app.get("/api", (req, res, next) => {
  console.log("run here");
  res.send("<h2> Hi There!!node ..</h2>");
});

app.use("/api/user", authRouter);
app.use("/api", postRouter);

const port = process.env.PORT || 3600;

const startServer = () => {
  app.listen(port, () => console.log(`App running on ${port}`));
};
const boot = async () => {
  await connectDD();
  startServer();
};
boot();
