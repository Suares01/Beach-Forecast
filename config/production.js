const { DB_NAME, PORT, DB_PASS, DB_USER } = process.env;

module.exports = {
  App: {
    port: PORT || 8080,
    database: {
      uri: `mongodb+srv://${DB_USER}:${DB_PASS}@surfapi.h3qnx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    },
  },
};
