"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Users, Shield, User as UserIcon, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types";
import { getInitials, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin"
  ) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-2 flex items-center gap-3">
              <Users className="w-10 h-10 text-primary" />
              Manage Users
            </h1>
            <p className="text-gray-600">
              View and manage user accounts and permissions
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {users.length}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Admins</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {users.filter((u) => u.role === "admin").length}
                    </p>
                  </div>
                  <Shield className="w-12 h-12 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Regular Users</p>
                    <p className="text-3xl font-bold text-green-600">
                      {users.filter((u) => u.role === "user").length}
                    </p>
                  </div>
                  <UserIcon className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.photo} alt={user.name} />
                              <AvatarFallback>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                          >
                            {user.role === "admin" ? (
                              <span className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Admin
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <UserIcon className="w-3 h-3" />
                                User
                              </span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={user.role}
                            onValueChange={(value: "user" | "admin") =>
                              handleRoleChange(user.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
