// src/components/RedirectIfAuthenticated.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RedirectIfAuthenticated = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await fetch("https://localhost:5000/api/auth/check-auth", {
					method: "GET",
					credentials: "include",
				});
				if (res.ok) {
					setIsAuthenticated(true);
					navigate("/");  
				}
			} catch (err) {
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	if (loading) return null; // or show spinner
	return !isAuthenticated ? children : null;
};

export default RedirectIfAuthenticated;
