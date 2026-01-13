"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Video, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tutorial } from "@/types";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    category: "other" as
      | "book-review"
      | "reading-tips"
      | "author-interview"
      | "book-recommendation"
      | "other",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTutorial) {
        await api.put(`/tutorials/${editingTutorial._id}`, formData);
        toast.success("Tutorial updated successfully!");
      } else {
        await api.post("/tutorials", formData);
        toast.success("Tutorial created successfully!");
      }

      resetForm();
      setShowModal(false);
      fetchTutorials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save tutorial");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tutorial: Tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({
      title: tutorial.title,
      description: tutorial.description || "",
      youtubeUrl: tutorial.youtubeUrl,
      category: tutorial.category,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tutorial?")) return;

    try {
      await api.delete(`/tutorials/${id}`);
      toast.success("Tutorial deleted successfully!");
      fetchTutorials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete tutorial");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      youtubeUrl: "",
      category: "other",
    });
    setEditingTutorial(null);
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 font-serif mb-2">
                Manage Tutorials
              </h1>
              <p className="text-gray-600">
                Add and manage YouTube video tutorials
              </p>
            </div>
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingTutorial ? "Edit Tutorial" : "Add New Tutorial"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Tutorial title..."
                      required
                    />
                  </div>

                  <div>
                    <Label>YouTube URL *</Label>
                    <Input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, youtubeUrl: e.target.value })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Paste the full YouTube video URL
                    </p>
                  </div>

                  <div>
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="book-review">Book Review</SelectItem>
                        <SelectItem value="reading-tips">
                          Reading Tips
                        </SelectItem>
                        <SelectItem value="author-interview">
                          Author Interview
                        </SelectItem>
                        <SelectItem value="book-recommendation">
                          Book Recommendation
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of the tutorial..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {editingTutorial ? "Update Tutorial" : "Create Tutorial"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tutorials Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
            </div>
          ) : tutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <Card key={tutorial._id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={tutorial.thumbnail}
                      alt={tutorial.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 right-2">
                      {tutorial.category.replace("-", " ")}
                    </Badge>
                  </div>

                  <CardContent className="pt-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {tutorial.title}
                    </h3>
                    {tutorial.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {tutorial.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(tutorial)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(tutorial._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No tutorials yet. Create your first tutorial!
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
