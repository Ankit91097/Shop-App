const { v4: uuidv4 } = require("uuid");

const createId = () => {
  return uuidv4();
};

module.exports = createId;
