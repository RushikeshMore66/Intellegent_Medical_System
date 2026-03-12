import { useState, useEffect } from "react";
import api from "../api/client";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/users/");
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch users");
            setLoading(false);
        }
    };

    const handleDeactivate = async (userId) => {
        if (!window.confirm("Are you sure you want to deactivate this user?")) return;
        try {
            await api.patch(`/users/${userId}/deactivate`);
            fetchUsers();
        } catch (err) {
            alert("Failed to deactivate user");
        }
    };

    if (loading) return <div className="p-8">Loading users...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            
            {error && (
                <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 capitalize">{user.role}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {user.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {user.is_active && (
                                        <button 
                                            onClick={() => handleDeactivate(user.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Deactivate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
