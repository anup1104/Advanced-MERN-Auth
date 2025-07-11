import { motion } from "framer-motion";
import { formatDate } from "../../utils/date";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const navigate = useNavigate();
	const [user, setUser] = useState(null);
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch(
					"http://localhost:5000/api/auth/get-profile",
					{
						method: "GET",
						credentials: "include",
					}
				);
				if (!res.ok) {
					const error = await res.json();
					throw new Error(error.message);
				}
				const data = await res.json();
				setUser(data.user);
				console.log(data);
			} catch (error) {
				console.log(error.message);
				alert(error.message);
			}
		};
        fetchProfile();
	}, []);

	const handleLogout = async() => {
		try{
            const response = await fetch("http://localhost:5000/api/auth/logout",{
                method:"POST",
                credentials:"include",
            });
            if(!response.ok){
                const error = await response.json();
                throw new Error(error.message);
            }
            navigate("/login");
        }
        catch(error){
            console.log(error);
            alert(error.message);
        }
	};
    if (!user) return <div className="text-white">Loading...</div>;
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
		>
			<h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
				Dashboard
			</h2>

			<div className="space-y-6">
				<motion.div
					className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className="text-xl font-semibold text-green-400 mb-3">
						Profile Information
					</h3>
					<p className="text-gray-300">Name: {user.name}</p>
					<p className="text-gray-300">Email: {user.email}</p>
				</motion.div>
				<motion.div
					className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className="text-xl font-semibold text-green-400 mb-3">
						Account Activity
					</h3>
					<p className="text-gray-300">
						<span className="font-bold">Joined: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className="text-gray-300">
						<span className="font-bold">Last Login: </span>

						{formatDate(user.lastLogin)}
					</p>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="mt-4"
			>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleLogout}
					className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
				>
					Logout
				</motion.button>
			</motion.div>
		</motion.div>
	);
};
export default HomePage;
