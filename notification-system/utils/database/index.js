const mongoose = require("mongoose");
const configs = require("../../configs/database.json");
// const { config } = require("../redis-server");
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
};
// const HOST = process.env.RUN_TIME !== "docker" ? "localhost" : "authMongo";

const HOST = process.env.RUN_TIME !== "docker" ? configs.host : "authMongo";
module.exports = mongoose.connect(`mongodb://${HOST}:${configs.port}/${configs.db_name}`, OPTIONS)
.then(() => {
  console.log("Mongodb connected----------------------------->", HOST);
})
.catch((err) => {
  console.error("MongoDB", err);
});
