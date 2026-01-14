"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Library, BookOpen, BookMarked, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { UserBook } from "@/types";
import { getShelfLabel, getShelfColor } from "@/lib/utils";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import Navbar from "@/components/shared/Navbar";
import { BookCardSkeleton } from "@/components/shared/LoadingSkeleton";
import Footer from "@/components/shared/Footer";

export default function MyLibraryPage() {
  const [library, setLibrary] = useState<{
    wantToRead: UserBook[];
    currentlyReading: UserBook[];
    read: UserBook[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const { data } = await api.get("/library");
      setLibrary(data.library);
    } catch (error) {
      console.error("Error fetching library:", error);
      toast.error("Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  const renderBookList = (books: UserBook[]) => {
    if (books.length === 0) {
      return (
        <div className="text-center py-12">
          <Library className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No books in this shelf yet</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((userBook, index) => (
          <Link key={index} href={`/book/${userBook.book?._id}`}>
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
              <div className="flex gap-4 p-4">
                <img
                  src={userBook.book?.coverImage}
                  alt={userBook.book?.title}
                  className="w-24 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 line-clamp-2">
                    {userBook.book?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {userBook.book?.author}
                  </p>

                  <Badge className={getShelfColor(userBook.shelf)}>
                    {getShelfLabel(userBook.shelf)}
                  </Badge>

                  {userBook.shelf === "currentlyReading" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{Math.round(userBook.progress.percentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${userBook.progress.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {userBook.progress.pagesRead} /{" "}
                        {userBook.book.totalPages} pages
                      </p>
                    </div>
                  )}

                  {userBook.notes && (
                    <p className="text-xs text-gray-600 mt-2 italic line-clamp-2">
                      "{userBook.notes}"
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-2 flex items-center">
              <Library className="w-10 h-10 mr-3 text-primary" />
              My Library
            </h1>
            <p className="text-gray-600">
              Organize and track your reading journey
            </p>
          </div>

          {/* Stats */}
          {!loading && library && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Want to Read</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {library.wantToRead.length}
                      </p>
                    </div>
                    <BookMarked className="w-12 h-12 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Currently Reading</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {library.currentlyReading.length}
                      </p>
                    </div>
                    <BookOpen className="w-12 h-12 text-yellow-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Read</p>
                      <p className="text-3xl font-bold text-green-600">
                        {library.read.length}
                      </p>
                    </div>
                    <CheckCircle2 className="w-12 h-12 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="wantToRead" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="wantToRead"
                className="flex items-center gap-2"
              >
                <BookMarked className="w-4 h-4" />
                Want to Read
              </TabsTrigger>
              <TabsTrigger
                value="currentlyReading"
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Currently Reading
              </TabsTrigger>
              <TabsTrigger value="read" className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Read
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wantToRead">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                renderBookList(library?.wantToRead || [])
              )}
            </TabsContent>

            <TabsContent value="currentlyReading">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                renderBookList(library?.currentlyReading || [])
              )}
            </TabsContent>

            <TabsContent value="read">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                renderBookList(library?.read || [])
              )}
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
