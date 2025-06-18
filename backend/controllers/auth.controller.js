import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.utils.js";
import { generateandsetcookie } from "../utils/generateandsetcookie.js";
import {
	sendVerificationEmail,
	sendWelcomeEmail,
	forgotPasswordEmail,
	resetPasswordEmail,
} from "../mailtrap/email.js";
import axios from "axios"
export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		if (!email || !password || !name) {
			return res.status(400).json({
				success: false,
				message: "All fields are required!",
			});
		}
		const userFound = await User.findOne({ email });
		if (userFound) {
			return res.status(400).json({
				success: false,
				message: "User already exists!",
			});
		}
		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = generateVerificationToken();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken: verificationToken,
			verificationTokenExpiresAt: new Date(Date.now() + 86400000),
		});
		await user.save();

		generateandsetcookie(res, user._id);

		sendVerificationEmail(user.email, verificationToken);
		return res.status(201).json({
			success: true,
			message: "User created!",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Code not found, Please resend!",
			});
		}
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		sendWelcomeEmail(user.email, user.name);

		return res.status(200).json({
			success: true,
			message: "Great, Email verified Successfully!",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// export const login = async (req, res) => {
// 	try {
// 		const { email, password } = req.body;
// 		const user = await User.findOne({ email });
// 		if (!user) {
// 			return res.status(404).json({
// 				success: false,
// 				message: "Invalid Email!",
// 			});
// 		}
// 		const isPasswordCorrect = await bcryptjs.compare(
// 			password,
// 			user.password
// 		);
// 		if (!isPasswordCorrect) {
// 			return res.status(400).json({
// 				success: false,
// 				message: "Invalid Password!",
// 			});
// 		}
// 		generateandsetcookie(res, user._id);
// 		user.lastLogin = Date.now();
// 		await user.save();

// 		return res.status(200).json({
// 			success: true,
// 			message: "Logged In successfully!",
// 		});
// 	} catch (error) {
// 		return res.status(500).json({
// 			success: false,
// 			message: error,
// 		});
// 	}
// };

export const login = async (req, res) => {
	console.log("called")
	try {
		const { email, password, turnstileToken } = req.body;

		// ✅ 1. Validate Turnstile token presence
		if (!turnstileToken) {
			return res.status(400).json({
				success: false,
				message: 'Missing Turnstile token!',
			});
		}
		// ✅ 2. Verify with Cloudflare
		const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const formData = new URLSearchParams();
formData.append('secret', process.env.TURNSTILE_SECRET_KEY);
formData.append('response', turnstileToken);
formData.append('remoteip', req.ip);

const verifyRes = await axios.post(verifyUrl, formData.toString(), {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
});

if (!verifyRes.data.success) {
	return res.status(403).json({
		success: false,
		message: 'Human verification failed!',
	});
}

   console.log(turnstileToken)
		// ✅ 3. Proceed with your existing login logic
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Invalid Email!',
			});
		}

		const isPasswordCorrect = await bcryptjs.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({
				success: false,
				message: 'Invalid Password!',
			});
		}

		generateandsetcookie(res, user._id);
		user.lastLogin = Date.now();
		await user.save();

		return res.status(200).json({
			success: true,
			message: 'Logged In successfully!',
		});
	} catch (error) {
		console.error('Login error:', error.message);
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		});
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	return res.status(200).json({
		success: true,
		message: "Logged out!",
	});
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Invalide Email!",
			});
		}
		const resetPasswordToken = crypto.randomBytes(30).toString("hex");
		const resetPasswordExpiresAt = new Date(
			Date.now() + 1 * 60 * 60 * 1000
		);

		user.resetPasswordToken = resetPasswordToken;
		user.resetPasswordExpiresAt = resetPasswordExpiresAt;

		await user.save();

		forgotPasswordEmail(
			user.email,
			`${process.env.CLIENT_URI}/reset-password/${resetPasswordToken}`
		);

		return res.status(200).json({
			success: true,
			message: "Reset Password Email sent!",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error!",
		});
	}
};
export const resetPassword = async (req, res) => {
	const { password } = req.body;
	const { token } = req.params;
	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Invalid token!",
			});
		}
		const hashedPassword = await bcryptjs.hash(password, 10);
		user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
		await user.save();

		await resetPasswordEmail(user.email);

		return res.status(200).json({
			success: true,
			message: "Password Updated Successfully!",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error!",
		});
	}
};
export const checkAuth = async(req, res)=>{
    try{
        const user = await User.findById(req.userId);
        if(!user)return res.status(404).json({
			success:false,
			message:"User not found!"
		})
		return res.status(200).json({
			success: true,
			user:{
				...user._doc,
				password:undefined
			}
		})
    }
    catch(error){
        return res.status(500).json({
			success:false,
			message:"Internal server error"
		})
    }
}