"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Book,
  Users,
  FolderTree,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { AdminStats } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/stats/admin");
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const booksPerGenreData = stats
    ? {
        labels: stats.booksPerGenre.map((g) => g.genre),
        datasets: [
          {
            label: "Books",
            data: stats.booksPerGenre.map((g) => g.count),
            backgroundColor: [
              "#f58719",
              "#0ea5e9",
              "#10b981",
              "#f59e0b",
              "#8b5cf6",
              "#ec4899",
            ],
          },
        ],
      }
    : null;

  const userRolesData = stats
    ? {
        labels: stats.userRoles.map((r) =>
          r._id === "admin" ? "Admins" : "Users"
        ),
        datasets: [
          {
            data: stats.userRoles.map((r) => r.count),
            backgroundColor: ["#f58719", "#0ea5e9"],
          },
        ],
      }
    : null;

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage your BookWorm platform</p>
          </div>

          {/* Overview Stats */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            stats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Users</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {stats.overview.totalUsers}
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
                          <p className="text-sm text-gray-600">Total Books</p>
                          <p className="text-3xl font-bold text-green-600">
                            {stats.overview.totalBooks}
                          </p>
                        </div>
                        <Book className="w-12 h-12 text-green-600 opacity-20" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Genres</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {stats.overview.totalGenres}
                          </p>
                        </div>
                        <FolderTree className="w-12 h-12 text-purple-600 opacity-20" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Reviews</p>
                          <p className="text-3xl font-bold text-orange-600">
                            {stats.overview.totalReviews}
                          </p>
                        </div>
                        <MessageSquare className="w-12 h-12 text-orange-600 opacity-20" />
                      </div>
                    </CardContent>
                  </Card>

                  <Link href="/admin/reviews">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">
                              Pending Reviews
                            </p>
                            <p className="text-3xl font-bold text-red-600">
                              {stats.overview.pendingReviews}
                            </p>
                          </div>
                          <Badge variant="destructive" className="text-xl">
                            {stats.overview.pendingReviews}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Books per Genre</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {booksPerGenreData && (
                        <div className="h-64">
                          <Bar
                            data={booksPerGenreData}
                            options={{
                              maintainAspectRatio: false,
                              responsive: true,
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userRolesData && (
                        <div className="h-64 flex items-center justify-center">
                          <Doughnut
                            data={userRolesData}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Top Rated Books */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Top Rated Books
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.topRatedBooks.map((book, index) => (
                        <div
                          key={book._id}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-2xl font-bold text-gray-300">
                            #{index + 1}
                          </span>
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{book.title}</p>
                            <p className="text-sm text-gray-600">
                              {book.author}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">
                              {book.averageRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      Recent Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={user.photo}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
