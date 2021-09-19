
const path = require("path");
const fs = require("fs");
module.exports = (res) => {
  return {
    /**
     * Response any json data
     * @param {any} data
     * @param {integer} code
     */
    toJson: (data, code = 200) => {
      return res.status(code).json(data);
    },
    /**
     * Response error as json format
     * @param {string | any} message
     * @param {integer} code
     */
    toError: (message, code = 404) => {
      if (typeof message === "object") {
        return res.status(code).json(message);
      } else {
        return res.status(code).json({
          status: code,
          data: {},
          message,
        });
      }
    },
    /**
     * Response filesystem to request
     * @param {string} location
     */
    toFile: (...location) => {
      const relocate = "../storage/" + location.join("/");
      const filePath = path.join(__dirname, relocate.trim("/"));
      // console.log("abcd", fs.readFileSync(filePath, "utf8"));
      if (fs.readFileSync(filePath, "utf8")) {
        return res.sendFile(filePath);
      } else {
        return res.sendStatus(404);
      }
    },
  };
};
