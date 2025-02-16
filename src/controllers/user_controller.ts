import { Request, Response } from "express";
import User from "../models/users_model";
import Post from "../models/posts_model";
const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -refreshTokens");
    if (!user) {
      res.status(404).send({ status: "Error", message: "User not found" });
      return;
    }
    res.status(200).send({ status: "Success", data: user });
  } catch (err) {
    res.status(400).send({ status: "Error", message: err.message });
  }
};

const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { username } = req.body;

    if (!username || username.trim() === "")
      throw new Error("Please provide a username");

    // Check if the username is already taken by another user
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser.id !== userId)
      throw new Error("Username already taken");

    // Update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true } // Return updated document
    ).select("-password -refreshToken");
    res.status(200).send({ status: "Success", data: updatedUser });
  } catch (err) {
    res.status(400).send({ status: "Error", message: err.message });
  }
};

export default { getUserDetails, updateUserDetails };
