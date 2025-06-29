import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await fetch("https://authproject.onrender.com/api/auth/check-auth", {
					method: "GET",
					credentials: "include",
				});
				if (res.ok) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
					navigate("/login");
				}
			} catch (err) {
				setIsAuthenticated(false);
				navigate("/login");
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, [navigate]);

	if (loading) return null; // or a spinner/loading state

	return isAuthenticated ? children : null;
};

export default ProtectedRoute;
