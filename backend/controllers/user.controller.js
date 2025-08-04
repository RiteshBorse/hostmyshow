import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { mail, otpFormat } from "../utils/email.js";
import { generateOTP } from "../utils/generateOTP.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    if (!email || !username || !password || !role) {
        return res.status(400).send({
            message: "All fields are required",
            success: false
        });
    }

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).send({
            message: "User already exists",
            success: false
        });
    }

    const otp = generateOTP();
    const hashPassword = await bcrypt.hash(password, 10);

    user = new User({
        username,
        email,
        password: hashPassword,
        role,
        otp,
        otpExpires: Date.now() + 15 * 60 * 1000 // 15 minutes from now
    });

    await user.save();

    // TODO: Send OTP via email here
    const content = {
        to : user.email,
        subject : "HostMyShow OTP Verification",
        html : otpFormat(user.username , otp)
    };

    const sent = await mail(content);
    if(!sent){
        return res.status(400).send({
            message : "Problem with sending OTP",
            success : false
        })
    }
  
    return res.status(200).send({
        message: "OTP sent to your email",
        success: true
    });
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { otp, email } = req.body;

    if (!otp || !email) {
        return res.status(400).send({
            message: "OTP missing",
            success: false
        });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
        return res.status(400).send({
            message: "OTP not verified or expired",
            success: false
        });
    }

    user.otp = "";
    user.otpExpires = null;
    await user.save();

    return res.status(200).send({
        user,
        message: "OTP verified. Registration successful",
        success: true
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            message: "All fields are required",
            success: false
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).send({
            message: "User does not exist",
            success: false
        });
    }

    if (user.otp) {
        if (Date.now() > user.otpExpires) {
            await User.findOneAndDelete({ email });
            return res.status(400).send({
                message: "OTP was not verified in time. Account deleted",
                success: false
            });
        } else {
            return res.status(400).send({
                message: "Please verify your OTP to activate your account",
                success: false
            });
        }
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).send({
            message: "Incorrect email or password",
            success: false
        });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return res.status(200)
        .cookie("token", token, {
            httpOnly: true,
            sameSite : "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 
        })
        .send({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            token,
            message: "Login successful",
            success: true
        });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
   .populate("eventsOrganized", "title banner  status eventDateTime")
    .populate("eventsAttended", "title banner status eventDateTime")


  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    user,
    message: "User profile fetched successfully",
  });
});

const logout = asyncHandler(async (req ,res) => {
    res.clearCookie("token" , {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).send({
        message : "Logout Successfull", 
        success : true
    })
})

export { register, verifyOtp, login , logout , getUserProfile };
