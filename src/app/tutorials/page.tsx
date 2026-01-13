"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Video, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tutorial } from "@/types";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const { data } = await api.get("/tutorials");
      setTutorials(data.tutorials);
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      toast.error("Failed to load tutorials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 font-serif mb-2 flex items-center">
              <Video className="w-10 h-10 mr-3 text-primary" />
              Book Tutorials
            </h1>
            <p className="text-gray-600">
              Learn from book reviews, reading tips, and author interviews
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="pt-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : tutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <Card
                  key={tutorial._id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative group cursor-pointer">
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <a
                        href={tutorial.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="bg-primary rounded-full p-4">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </a>
                    </div>
                    <Badge className="absolute top-2 right-2">
                      {tutorial.category.replace("-", " ")}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {tutorial.title}
                    </CardTitle>
                  </CardHeader>

                  {tutorial.description && (
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {tutorial.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tutorials available yet</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
