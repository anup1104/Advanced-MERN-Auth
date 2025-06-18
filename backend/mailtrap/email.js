import { client, sender } from "./mailtrap.config.js";
import {
	VERIFICATION_EMAIL_TEMPLATE,
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE
} from "./emailTemplates.js";
import { resetPassword } from "../controllers/auth.controller.js";
export const sendVerificationEmail = async (email, verificationToken) => {
	const recipients = [
		{
			email,
		},
	];
	try {
		await client.send({
			from: sender,
			to: recipients,
			subject: "Verification Code",
			html: VERIFICATION_EMAIL_TEMPLATE.replace(
				"{verificationCode}",
				verificationToken
			),
			category: "Email Verification",
		});
	} catch (error) {
		console.log(error);
		throw new error(`Error sending the email to user ${email}`);
	}
};
export const sendWelcomeEmail = async (email, name) => {
	const recipients = [
		{
			email,
		},
	];
	try {
		await client.send({
			from: sender,
			to: recipients,
			subject: "Verification Code",
			html: WELCOME_EMAIL_TEMPLATE.replace(
				"{userName}",
				name
			),
			category: "Email Verification",
		});
	} catch (error) {
		console.log(error);
		throw new error(`Error sending the email to user ${email}`);
	}
};
export const forgotPasswordEmail = async (email, resetURL) => {
	const recipients = [
		{
			email,
		},
	];
	try {
		await client.send({
			from: sender,
			to: recipients,
			subject: "Reset Password Request",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
				"{resetURL}",
				resetURL
			),
			category: "Reset Password Request",
		});
	} catch (error) {
		console.log(error);
		throw new error(
			`Error sending the email to user for Password Reset ${email}`
		);
	}
};
export const resetPasswordEmail = async (email) => {
	const recipients = [
		{
			email,
		},
	];
	try {
		await client.send({
			from: sender,
			to: recipients,
			subject: "Reset Password Done",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Reset Password completed",
		});
	} catch (error) {
		console.log(error);
		throw new error(
			`Error sending the email to user for Password Reset Done ${email}`
		);
	}
};
