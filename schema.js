const graphql = require("graphql");
const { _ } = require("loadsh");
const axios = require("axios");
const db = require("./DB/db_connection");
// const db = require("./db.json");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const companyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((resp) => resp.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLInt },
    FIRST_NAME: { type: GraphQLString },
    AGE: { type: GraphQLInt },
    company: {
      type: companyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.company}`)
          .then((resp) => resp.data);
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: UserType,
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        return db.query(`SELECT * FROM USERS WHERE id = ${args.id}`, async (err, rows) => {
          let users = await JSON.parse(JSON.stringify(rows))?.[0];
          if (err) throw err;
          return rows;
        });
        // console.log(result)
        // return axios
        //   .get(`http://localhost:3000/users/${args.id}`)
        //   .then((resp) => resp.data);
      },
    },
    company: {
      type: companyType,
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((resp) => resp.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        FIRST_NAME: { type: new GraphQLNonNull(GraphQLString) },
        AGE: { type: new GraphQLNonNull(GraphQLInt) },
        company: { type: GraphQLInt },
      },
      resolve(parentValue, { FIRST_NAME, AGE }) {
        return axios
          .post(`http://localhost:3000/users`, { FIRST_NAME, AGE })
          .then((resp) => resp.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((resp) => resp.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        FIRST_NAME: { type: GraphQLString },
        AGE: { type: GraphQLInt },
        company: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return axios
          .patch(`http://localhost:3000/users/${args.id}`, args)
          .then((resp) => resp.data);
      },
    },
  },
});
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

module.exports = schema;
