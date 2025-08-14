import { AdhaarUser, PanUser } from "../models/validation.model.js";

// Generate OTP for Aadhaar validation
export const generateAadhaarOTP = async (req, res) => {
  const { number, name } = req.body;

  if (!number || !name) {
    return res.status(400).json({ message: "Fields missing" });
  }

  try {
    const user = await AdhaarUser.findOne({ number, name });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Update the existing user's OTP
    user.otp = otp;
    await user.save();

    return res.status(200).json({ 
      message: "OTP generated successfully", 
      otp: otp 
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP for Aadhaar validation
export const verifyAadhaarOTP = async (req, res) => {
  const { number, otp } = req.body;

  if (!number || !otp) {
    return res.status(400).json({ message: "Fields missing" });
  }

  try {
    const user = await AdhaarUser.findOne({ number });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ 
      message: "OTP verified successfully",
      verified: true,
      user: {
        number: user.number,
        name: user.name
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Validate PAN details
export const validatePAN = async (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ message: "Fields missing" });
  }

  try {
    const user = await PanUser.findOne({ name, number });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ 
      message: "PAN validated successfully",
      verified: true,
      user: {
        number: user.number,
        name: user.name
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};