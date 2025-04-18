const mongoose = require("mongoose");

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/react-login-tut", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

// Define the schema for the user collection
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
  },
  password: {
    iv: {
      type: String,
      required: true,
    },
    encryptedData: {
      type: String,
      required: true,
    },
  },
});

// Create the model from the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
