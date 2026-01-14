"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Star, BookOpen, Calendar, Hash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Book, Review, UserBook } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function BookDetailsPage() {
  const params = useParams();
  console.log("Book ID:", params.id);
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userBook, setUserBook] = useState<UserBook | null>(null);
  const [loading, setLoading] = useState(true);

  // Add to shelf form
  const [selectedShelf, setSelectedShelf] = useState("");
  const [pagesRead, setPagesRead] = useState("");
  const [adding, setAdding] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
    checkUserBook();
  }, [params.id]);

  const fetchBookDetails = async () => {
    try {
      const { data } = await api.get(`/books/${params.id}`);
      setBook(data.book);
    } catch (error) {
      console.error("Error fetching book:", error);
      toast.error("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/book/${params.id}`);
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const checkUserBook = async () => {
    try {
      const { data } = await api.get("/library");
      const allBooks = [
        ...data.library.wantToRead,
        ...data.library.currentlyReading,
        ...data.library.read,
      ];
      const found = allBooks.find((ub: UserBook) => ub.book?._id === params.id);
      if (found) setUserBook(found);
    } catch (error) {
      console.error("Error checking user book:", error);
    }
  };

  const handleAddToShelf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShelf) {
      toast.error("Please select a shelf");
      return;
    }

    setAdding(true);
    try {
      await api.post("/library", {
        book: params.id,
        shelf: selectedShelf,
        pagesRead: pagesRead ? parseInt(pagesRead) : 0,
      });
      toast.success("Book added to shelf!");
      checkUserBook();
      setSelectedShelf("");
      setPagesRead("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add book");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateProgress = async () => {
    if (!userBook) return;

    try {
      await api.put(`/library/${userBook._id}`, {
        pagesRead: pagesRead ? parseInt(pagesRead) : 0,
      });
      toast.success("Progress updated!");
      checkUserBook();
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/reviews", {
        book: params.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success(
        "Review submitted! It will be visible after admin approval."
      );
      setReviewComment("");
      setReviewRating(5);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  if (!book) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Book not found</p>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Book Cover & Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full rounded-lg shadow-lg mb-6"
                  />

                  <div className="space-y-4">
                    {!userBook ? (
                      <form onSubmit={handleAddToShelf} className="space-y-4">
                        <div>
                          <Label>Add to Shelf</Label>
                          <Select
                            value={selectedShelf}
                            onValueChange={setSelectedShelf}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select a shelf" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wantToRead">
                                Want to Read
                              </SelectItem>
                              <SelectItem value="currentlyReading">
                                Currently Reading
                              </SelectItem>
                              <SelectItem value="read">Read</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedShelf === "currentlyReading" && (
                          <div>
                            <Label>Pages Read</Label>
                            <Input
                              type="number"
                              min="0"
                              max={book.totalPages}
                              value={pagesRead}
                              onChange={(e) => setPagesRead(e.target.value)}
                              placeholder="0"
                              className="mt-2"
                            />
                          </div>
                        )}

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={adding}
                        >
                          {adding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Add to Library"
                          )}
                        </Button>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-green-800 font-semibold text-sm">
                            ✓ In your library:{" "}
                            {userBook.shelf === "wantToRead"
                              ? "Want to Read"
                              : userBook.shelf === "currentlyReading"
                              ? "Currently Reading"
                              : "Read"}
                          </p>
                        </div>

                        {userBook.shelf === "currentlyReading" && (
                          <div>
                            <Label>Update Progress</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                type="number"
                                min="0"
                                max={book.totalPages}
                                value={pagesRead}
                                onChange={(e) => setPagesRead(e.target.value)}
                                placeholder={userBook.progress.pagesRead.toString()}
                              />
                              <Button onClick={handleUpdateProgress}>
                                Update
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Book Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Info */}
              <div>
                <h1 className="text-4xl font-bold font-serif mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {book.genre?.name}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">
                      {book.averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({book.totalRatings} ratings)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <BookOpen className="w-5 h-5" />
                    <span>{book.totalShelved} shelved</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {book.totalPages > 0 && (
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      {book.totalPages} pages
                    </div>
                  )}
                  {book.publicationYear && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {book.publicationYear}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About this book</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </CardContent>
              </Card>

              {/* Write Review */}
              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewRating(rating)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= reviewRating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Your Review</Label>
                      <Textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts about this book..."
                        className="mt-2"
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Submit Review
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <Avatar>
                              <AvatarImage src={(review.user as any).photo} />
                              <AvatarFallback>
                                {getInitials((review.user as any).name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold">
                                  {(review.user as any).name}
                                </p>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  <span className="font-semibold">
                                    {review.rating}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                {formatDate(review.createdAt)}
                              </p>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
