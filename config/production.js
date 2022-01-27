const { DB_NAME, PORT } = process.env;

module.exports = {
  App: {
    port: PORT || 8080,
    database: {
      uri: `mongodb+srv://surfapi.h3qnx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    },
  },
};
