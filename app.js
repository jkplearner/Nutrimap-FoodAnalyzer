const express = require("express");
const User = require("./mongo"); // Import the user model
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// AES Encryption/Decryption Configuration
const secretKey = "60d17f58e0d6c385f25a90c5792121cd93d4c6b91e1faec7891a022ca2076e5c"; // 32-byte hex key
const algorithm = "aes-256-cbc";

// Function to encrypt text
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Generate a unique initialization vector
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, "hex"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

// Function to decrypt text
function decrypt(encryptedData, ivHex) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, "hex"), Buffer.from(ivHex, "hex"));
  let decrypted = decipher.update(Buffer.from(encryptedData, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Login Route
app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // User does not exist
      return res.json("notexist");
    }

    // Decrypt the stored password
    const decryptedPassword = decrypt(user.password.encryptedData, user.password.iv);

    // Check if the password matches
    if (decryptedPassword === password) {
      return res.json({ status: "exist", name: user.name });
    } else {
      // Password is incorrect
      return res.json("incorrect");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json("fail");
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Encrypt the password before storing it
  const encryptedPassword = encrypt(password);

  const newUser = {
    name,
    email,
    password: encryptedPassword, // Store the encrypted password and IV
  };

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User already exists
      return res.json("exist");
    }

    // Create a new user
    await User.create(newUser);
    return res.json("success");
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json("fail");
  }
});

// Start the server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
