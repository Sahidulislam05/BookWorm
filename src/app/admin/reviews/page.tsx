"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { MessageSquare, Check, X, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Review } from "@/types";
import { getInitials, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("pending");

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const { data } = await api.get(`/reviews${params}`);
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    reviewId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await api.put(`/reviews/${reviewId}/status`, { status });
      toast.success(`Review ${status}!`);
      fetchReviews();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || `Failed to ${status} review`
      );
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted!");
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  const renderReview = (review: Review) => (
    <Card key={review._id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage
              src={(review.user as any).photo}
              alt={(review.user as any).name}
            />
            <AvatarFallback>
              {getInitials((review.user as any).name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">{(review.user as any).name}</p>
                <p className="text-sm text-gray-500">
                  {(review.user as any).email}
                </p>
              </div>
              <Badge
                variant={
                  review.status === "approved"
                    ? "default"
                    : review.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {review.status}
              </Badge>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>

              {(review.book as any).title && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-semibold">Book:</span>
                  <span>{(review.book as any).title}</span>
                  <span className="text-gray-400">
                    by {(review.book as any).author}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {review.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(review._id, "approved")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUpdateStatus(review._id, "rejected")}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
              {review.status === "approved" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(review._id, "rejected")}
                >
                  <X className="w-4 h-4 mr-1" />
                  Unapprove
                </Button>
              )}
              {review.status === "rejected" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(review._id, "approved")}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(review._id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-2 flex items-center gap-3">
              <MessageSquare className="w-10 h-10 text-primary" />
              Moderate Reviews
            </h1>
            <p className="text-gray-600">
              Review and approve user-submitted book reviews
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            value={filter}
            onValueChange={(value: any) => setFilter(value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 px-2 py-0.5 text-xs"
                  >
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value={filter}>
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                </div>
              ) : reviews.length > 0 ? (
                <div>{reviews.map(renderReview)}</div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No {filter !== "all" ? filter : ""} reviews found
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
