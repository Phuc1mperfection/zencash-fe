import { useCallback } from "react";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  RefreshCw,
  UserX,
  UserCheck,
  Key,
  Loader2,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import adminService from "../../services/adminService";

interface User {
  id: string;
  username: string;
  email: string;
  fullname?: string;
  roles: string[];
  active: boolean;
  avatar?: string;
  currency?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'inactive', 'admin', 'user'
  const [sortBy, setSortBy] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const { toast } = useToast();

  const filterUsers = useCallback(() => {
    let result = [...users];

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.fullname?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filter
    if (filter === "active") {
      result = result.filter((user) => user.active);
    } else if (filter === "inactive") {
      result = result.filter((user) => !user.active);
    } else if (filter === "admin") {
      result = result.filter((user) => user.roles.includes("ADMIN"));
    } else if (filter === "user") {
      result = result.filter((user) => !user.roles.includes("ADMIN"));
    }

    // Apply sort
    result.sort((a, b) => {
      let aValue = a[sortBy as keyof User];
      let bValue = b[sortBy as keyof User];

      // Handle sorting for different types
      if (typeof aValue === "boolean") {
        aValue = aValue ? "1" : "0";
        bValue = bValue ? "1" : "0";
      } else if (Array.isArray(aValue)) {
        aValue = aValue.join(",");
        if (Array.isArray(bValue)) {
          bValue = bValue.join(",");
        }
      } else if (aValue === null || aValue === undefined) {
        aValue = "";
      } else if (bValue === null || bValue === undefined) {
        bValue = "";
      }

      if (sortOrder === "asc") {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });

    setFilteredUsers(result);
  }, [users, searchQuery, filter, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.searchUsers();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return { ...user, active: !currentStatus };
          }
          return user;
        })
      );
      toast({
        title: "Thành công",
        description: `Đã ${
          !currentStatus ? "kích hoạt" : "vô hiệu hóa"
        } người dùng`,
      });
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thay đổi trạng thái người dùng",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };
  const resetUserPassword = async (userId: string, userEmail: string) => {
    setActionLoading(userId);
    try {
      await adminService.resetUserPassword(userEmail);
      toast({
        title: "Thành công",
        description: `Mật khẩu đã được đặt lại và gửi tới ${userEmail}`,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đặt lại mật khẩu",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001e2b] to-[#023430] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/admin"
              className="flex items-center text-gray-300 hover:text-[#00ed64] transition mr-4"
            >
              <ChevronLeft size={20} className="mr-1" />
              <span>Quay lại</span>
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Quản lý người dùng
            </h1>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-gray-800/50 hover:bg-white/15 transition"
          >
            <RefreshCw size={16} className="mr-2" />
            Làm mới
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-800/50 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex-1 mb-4 md:mb-0 md:mr-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-gray-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/5 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00ed64] focus:border-transparent appearance-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Đã vô hiệu hóa</option>
                  <option value="admin">Admin</option>
                  <option value="user">Người dùng</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 size={30} className="animate-spin text-[#00ed64]" />
              <span className="ml-2 text-gray-300">Đang tải...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-300">Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700/30">
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("username")}
                    >
                      <div className="flex items-center">
                        <span>Username</span>
                        {sortBy === "username" && (
                          <ArrowUpDown
                            size={16}
                            className="ml-1 text-[#00ed64]"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        <span>Email</span>
                        {sortBy === "email" && (
                          <ArrowUpDown
                            size={16}
                            className="ml-1 text-[#00ed64]"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("fullname")}
                    >
                      <div className="flex items-center">
                        <span>Họ tên</span>
                        {sortBy === "fullname" && (
                          <ArrowUpDown
                            size={16}
                            className="ml-1 text-[#00ed64]"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("roles")}
                    >
                      <div className="flex items-center">
                        <span>Vai trò</span>
                        {sortBy === "roles" && (
                          <ArrowUpDown
                            size={16}
                            className="ml-1 text-[#00ed64]"
                          />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleSort("active")}
                    >
                      <div className="flex items-center">
                        <span>Trạng thái</span>
                        {sortBy === "active" && (
                          <ArrowUpDown
                            size={16}
                            className="ml-1 text-[#00ed64]"
                          />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-700/30 hover:bg-white/5"
                    >
                      <td className="px-4 py-3">{user.username}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.fullname || "-"}</td>
                      <td className="px-4 py-3">
                        {user.roles.includes("ADMIN") ? (
                          <span className="inline-block bg-[#00ed64]/20 text-[#00ed64] px-2 py-1 rounded-md text-xs font-medium">
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-xs font-medium">
                            USER
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {user.active ? (
                          <span className="inline-block bg-green-500/20 text-green-300 px-2 py-1 rounded-md text-xs font-medium">
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="inline-block bg-red-500/20 text-red-300 px-2 py-1 rounded-md text-xs font-medium">
                            Đã vô hiệu hóa
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              toggleUserStatus(user.id, user.active)
                            }
                            disabled={actionLoading === user.id}
                            className={`p-2 rounded-md ${
                              actionLoading === user.id
                                ? "bg-gray-500/20 text-gray-400"
                                : user.active
                                ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                            } transition disabled:opacity-70 flex items-center justify-center w-9 h-9`}
                            title={
                              user.active
                                ? "Vô hiệu hóa tài khoản"
                                : "Kích hoạt tài khoản"
                            }
                          >
                            {user.active ? (
                              <UserX size={18} />
                            ) : (
                              <UserCheck size={18} />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              resetUserPassword(user.id, user.email)
                            }
                            disabled={actionLoading === user.id}
                            className={`p-2 rounded-md ${
                              actionLoading === user.id
                                ? "bg-gray-500/20 text-gray-400"
                                : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                            } transition disabled:opacity-70 flex items-center justify-center w-9 h-9`}
                            title="Đặt lại mật khẩu"
                          >
                            <Key size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
