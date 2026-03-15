import { useState, useEffect, useCallback } from "react";
import api from "../api/client";
import AddUserModal from "../components/AddUserModal";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/users/");
            setUsers(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch user list. Please check your permissions.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeactivate = async (userId) => {
        if (!window.confirm("Are you sure you want to deactivate this user account?")) return;
        try {
            await api.patch(`/users/${userId}/deactivate`);
            fetchUsers();
        } catch (err) {
            console.error("Failed to deactivate user", err);
        }
    };

    const getRoleBadge = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return <Badge variant="brand" icon={<Shield size={12} />}>Admin</Badge>;
            case 'pharmacist':
                return <Badge variant="blue">Pharmacist</Badge>;
            default:
                return <Badge variant="gray">{role}</Badge>;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage system access, roles, and user accounts.</p>
                </div>
                <Button 
                    onClick={() => setShowModal(true)}
                    icon={<UserPlus size={18} />}
                >
                    Invite User
                </Button>
            </div>

            {showModal && (
                <AddUserModal 
                    close={() => setShowModal(false)}
                    refresh={fetchUsers}
                />
            )}

            {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3">
                    <UserX size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <Card noPadding className="overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                                                    <UserCircle2 size={24} />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Mail size={14} className="text-slate-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.is_active ? (
                                                <Badge variant="green" icon={<UserCheck size={12} />}>Active</Badge>
                                            ) : (
                                                <Badge variant="red" icon={<UserX size={12} />}>Inactive</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.is_active && (
                                                    <button 
                                                        onClick={() => handleDeactivate(user.id)}
                                                        className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                                    >
                                                        <Ban size={14} />
                                                        Deactivate
                                                    </button>
                                                )}
                                                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No users found in the system.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
