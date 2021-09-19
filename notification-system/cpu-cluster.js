const cluster = require("cluster");
const os = require("os");
 
/**
 *  Check CLuster Enabled or not
 * @param {boolean} isClusterEnabled
 */
module.exports = (callback, isClusterEnabled) => {
  if (cluster.isMaster) {
    var cpus = os.cpus();
    // Fork workers.
    for (let i = 0; i < cpus.length; i++) {
      cluster.fork();
    }
    cluster.on("online", () => {
      console.log(`Worker-> ${process.pid}`);
    });
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Process worker ${worker.process.pid} died`);
    });
  } else {
    callback();
    // Workers can share any TCP connection
    // In this case it is an HTTP server
  }
};