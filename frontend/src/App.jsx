import React from "react";
import FloatingShape from "./components/FloatingShape";
import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import { useNavigate, Navigate } from "react-router-dom";
import ResetPassword from "./pages/ResetPassword";
function App() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 bg-green-600 flex items-center justify-center relative overflow-hidden">
			<FloatingShape
				color="bg-green-500"
				size="w-64 h-64"
				top="-5%"
				left="10%"
				delay={0}
			/>
			<FloatingShape
				color="bg-emerald-500"
				size="w-48 h-648"
				top="70%"
				left="80%"
				delay={5}
			/>
			<FloatingShape
				color="bg-lime-500"
				size="w-32 h-32"
				top="40%"
				left="-10%"
				delay={2}
			/>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				></Route>
				<Route
					path="/signup"
					element={
						<RedirectIfAuthenticated>
							<SignUpPage />
						</RedirectIfAuthenticated>
					}
				></Route>
				<Route
					path="/login"
					element={
						<RedirectIfAuthenticated>
							<LoginPage />
						</RedirectIfAuthenticated>
					}
				></Route>
				<Route
					path="/verify-email"
					element={
						<RedirectIfAuthenticated>
							<EmailVerificationPage />
						</RedirectIfAuthenticated>
					}
				></Route>
				<Route
					path="/forgot-password"
					element={
						<RedirectIfAuthenticated>
							<ForgotPassword />
						</RedirectIfAuthenticated>
					}
				></Route>
				<Route
					path="/reset-password/:token"
					element={
						<RedirectIfAuthenticated>
							<ResetPassword />
						</RedirectIfAuthenticated>
					}
				></Route>
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</div>
	);
}

export default App;
