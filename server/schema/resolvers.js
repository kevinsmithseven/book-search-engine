const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (_, { input }, context) => {
      
      const user = context.user;
      
      if (!user) {
        throw new Error("Not authenticated");
      }
      try {        
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: input } }, 
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.error(err);        
        throw new Error("Error saving the book");
      }
    },
    removeBook: async (_, { bookId }, context) => {
      
      const user = context.user;

      if (!user) {
        throw new Error("Not authenticated");
      }
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId: bookId } } }, // Remove the book with the given bookId
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("Couldn't find user with this id!");
        }

        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error("Error removing the book");
      }
    }
  },
};

module.exports = resolvers;
