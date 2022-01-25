const { DB_USER, DB_PASS, DB_NAME } = process.env;

module.exports = {
  App: {
    database: {
      uri: `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_NAME}.h3qnx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    },
  },
};
