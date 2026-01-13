"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Book, BookOpen, Target, Star, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Recommendation, ReadingStats } from "@/types";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import Navbar from "@/components/shared/Navbar";
import BookCard from "@/components/shared/BookCard";
import Footer from "@/components/shared/Footer";
import {
  BookCardSkeleton,
  StatCardSkeleton,
} from "@/components/shared/LoadingSkeleton";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [goalForm, setGoalForm] = useState({ targetBooks: 12 });
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recsRes, statsRes] = await Promise.all([
        api.get("/stats/recommendations"),
        api.get("/stats/reading"),
      ]);
      setRecommendations(recsRes.data.recommendations);
      setStats(statsRes.data.stats);
      setGoalForm({ targetBooks: user?.readingGoal?.targetBooks || 12 });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/users/reading-goal", {
        targetBooks: parseInt(goalForm.targetBooks.toString()),
        year: new Date().getFullYear(),
      });
      toast.success("Reading goal updated!");
      setShowGoalModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal");
    }
  };

  const goalProgress = stats
    ? Math.min(
        (stats.booksReadThisYear / (user?.readingGoal?.targetBooks || 12)) *
          100,
        100
      )
    : 0;

  const genreData =
    stats && Object.keys(stats.genreBreakdown).length > 0
      ? {
          labels: Object.keys(stats.genreBreakdown),
          datasets: [
            {
              data: Object.values(stats.genreBreakdown),
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

  const monthlyData = stats
    ? {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Books Read",
            data: stats.monthlyReading,
            borderColor: "#f58719",
            backgroundColor: "rgba(245, 135, 25, 0.1)",
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-2">
              Welcome back, {user?.name}! 📚
            </h1>
            <p className="text-gray-600">Let's continue your reading journey</p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-primary to-orange-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-8 h-8" />
                    <span className="text-sm opacity-90">This Year</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">
                    {stats?.booksReadThisYear || 0}
                  </h3>
                  <p className="text-sm opacity-90">Books Read</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Book className="w-8 h-8" />
                    <span className="text-sm opacity-90">Total</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">
                    {stats?.totalPages?.toLocaleString() || 0}
                  </h3>
                  <p className="text-sm opacity-90">Pages Read</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-8 h-8" />
                    <span className="text-sm opacity-90">Average</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">
                    {stats?.averageRating || "N/A"}
                  </h3>
                  <p className="text-sm opacity-90">Rating Given</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8" />
                    <span className="text-sm opacity-90">Streak</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">
                    {stats?.readingStreak || 0}
                  </h3>
                  <p className="text-sm opacity-90">Day Streak</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reading Goal */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-primary" />
                  <CardTitle>2026 Reading Goal</CardTitle>
                </div>
                <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Reading Goal</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateGoal} className="space-y-4">
                      <div>
                        <Label>Books to read in 2026:</Label>
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          value={goalForm.targetBooks}
                          onChange={(e) =>
                            setGoalForm({
                              targetBooks: parseInt(e.target.value),
                            })
                          }
                          className="mt-2"
                          required
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button type="submit" className="flex-1">
                          Update
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowGoalModal(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">
                    {stats?.booksReadThisYear || 0} /{" "}
                    {user?.readingGoal?.targetBooks || 12} books
                  </span>
                  <span className="text-gray-600">
                    {Math.round(goalProgress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-primary to-orange-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${goalProgress}%` }}
                  ></div>
                </div>
              </div>
              {goalProgress >= 100 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-semibold">
                    🎉 Goal achieved! You're amazing!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Charts */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Genre Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {genreData ? (
                    <div className="h-64 flex items-center justify-center">
                      <Doughnut
                        data={genreData}
                        options={{ maintainAspectRatio: false }}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-12">
                      No data yet. Start reading!
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line
                      data={monthlyData!}
                      options={{ maintainAspectRatio: false, responsive: true }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-serif mb-6 flex items-center">
              <span className="mr-2">✨</span>
              Recommended for You
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.slice(0, 12).map((rec) => (
                  <BookCard
                    key={rec.book._id}
                    book={rec.book}
                    showReason={true}
                    reason={rec.reason}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No recommendations yet. Start adding books to your library!
              </p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
