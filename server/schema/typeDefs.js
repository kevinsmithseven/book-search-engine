const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    bookId: ID
    authors: [authors]!
    description: String
    title: String
    image: String
    link: String
  }

  input SaveBookInput {
    author: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: SaveBookInput): User
  }
`;

module.exports = typeDefs;
