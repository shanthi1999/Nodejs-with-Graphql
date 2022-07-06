const express = require("express");
const { PORT } = require("./constants");
const expressGraphQl = require("express-graphql").graphqlHTTP;

const schema = require("./schema");
const app = express();

app.use(
  "/graphql",
  expressGraphQl({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log("App Connected to port");
});

module.exports = app;
