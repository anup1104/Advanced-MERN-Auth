import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import Turnstile from "react-turnstile";
import axios from "axios";
function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [token, setToken] = useState("");
	const navigate = useNavigate();
	const turnstileRef = useRef(null);

	const handleLogin = async (e) => {
		e.preventDefault();

		if (!token) {
			alert("Please complete the human verification.");
			return;
		}

		console.log("Turnstile Token:", token);
		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						password,
						turnstileToken: token,
					}),
					credentials: "include",
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Something went wrong!");
			}

			navigate("/");
		} catch (error) {
			console.error(error);
			alert(error.message);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full rounded-2xl bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-xl overflow-hidden"
		>
			<div className="p-8">
				<h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
					LogIn
				</h2>

				<form className="w-full p-2" onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						icon={Lock}
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<div className="my-4 flex justify-center w-full max-w-full overflow-hidden">
						<div className="scale-[0.9] sm:scale-100 transition-transform duration-300">
							<Turnstile
								ref={turnstileRef}
								sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
								onVerify={(token) => {
									console.log("Token:", token);
									setToken(token);
								}}
								onExpire={() => setToken("")}
								options={{
									theme: "light",
									size: "normal", // or "compact"
								}}
							/>
						</div>
					</div>

					<motion.button
						className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white transition duration-200"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="submit"
					>
						LogIn
					</motion.button>
				</form>
			</div>

			<div className="px-8 py-4 bg-gray-600 bg-opacity-50 flex justify-center">
				<p className="text-sm text-white">
					Don't have an account?{" "}
					<Link
						to="/signup"
						className="text-green-400 hover:underline"
					>
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
}

export default LoginPage;
