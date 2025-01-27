import User from "../models/User.js";

const register = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    // Check if a user already exists with the provided email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exists with this email." });
    }
    // Create a new user and save to the database
    const newUser = new User({ email });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User register successfully.", userId: newUser._id });
  } catch (error) {
    console.error("[User Register]: ", error); //for debugging
    res.state(500).json({ error: "Server error during registration" });
  }
};

export default register;
