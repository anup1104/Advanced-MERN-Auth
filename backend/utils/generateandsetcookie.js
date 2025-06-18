import jwt from "jsonwebtoken";
export const generateandsetcookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
    res.cookie("token", token, {
        httpOnly: true, // can only be accessed by browser
        secure: process.env.NODE_ENV === "Production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    return token;
};
