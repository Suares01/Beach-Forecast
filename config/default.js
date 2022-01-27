require("dotenv/config");

const { DB_NAME, API_KEY, TOKEN_SECRET } = process.env;

module.exports = {
  App: {
    port: 3000,
    database: {
      uri: `mongodb://localhost:27017/${DB_NAME}?authSource=admin`,
    },
    auth: {
      secret: `${TOKEN_SECRET}`,
    },
    resources: {
      StormGlass: {
        endpoint: "https://api.stormglass.io/v2",
        apiKey: `${API_KEY}`,
      },
    },
  },
};
