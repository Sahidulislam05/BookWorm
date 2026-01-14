"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Book as BookIcon,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, Genre } from "@/types";
import toast from "react-hot-toast";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Swal from "sweetalert2";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    totalPages: "",
    publicationYear: "",
    isbn: "",
    coverImage: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/books?limit=100");
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const { data } = await api.get("/genres");
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("genre", formData.genre);
      data.append("description", formData.description);
      data.append("totalPages", formData.totalPages);
      if (formData.publicationYear)
        data.append("publicationYear", formData.publicationYear);
      if (formData.isbn) data.append("isbn", formData.isbn);
      if (formData.coverImage) data.append("coverImage", formData.coverImage);

      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Book updated successfully!");
      } else {
        await api.post("/books", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Book created successfully!");
      }

      if (!formData.genre) {
        toast.error("Please select a genre");
        setSubmitting(false);
        return;
      }

      resetForm();
      setShowModal(false);
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save book");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre._id,
      description: book.description,
      totalPages: book.totalPages.toString(),
      publicationYear: book.publicationYear?.toString() || "",
      isbn: book.isbn || "",
      coverImage: null,
    });
    setImagePreview(book.coverImage);
    setShowModal(true);
  };
  

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true, // swaps confirm and cancel buttons
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/books/${id}`);
        toast.success("Book deleted successfully!");
        fetchBooks();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete book");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      genre: "",
      description: "",
      totalPages: "",
      publicationYear: "",
      isbn: "",
      coverImage: null,
    });
    setImagePreview(null);
    setEditingBook(null);
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 font-serif mb-2">
                Manage Books
              </h1>
              <p className="text-gray-600">
                Add, edit, and remove books from the catalog
              </p>
            </div>
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingBook ? "Edit Book" : "Add New Book"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Cover Image */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden border-2 border-primary">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <Label htmlFor="coverImage" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>Upload Cover Image</span>
                      </Button>
                      <Input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Title *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Author *</Label>
                      <Input
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Genre *</Label>
                      <Select
                        value={formData.genre}
                        onValueChange={(value) =>
                          setFormData({ ...formData, genre: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre._id} value={genre._id}>
                              {genre.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Total Pages *</Label>
                      <Input
                        type="number"
                        value={formData.totalPages}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalPages: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Publication Year</Label>
                      <Input
                        type="number"
                        value={formData.publicationYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            publicationYear: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>ISBN</Label>
                      <Input
                        value={formData.isbn}
                        onChange={(e) =>
                          setFormData({ ...formData, isbn: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Description *</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={5}
                        required
                      />
                    </div>
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
                      {editingBook ? "Update Book" : "Create Book"}
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

          {/* Books Table */}
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
                      <TableHead>Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Pages</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book._id}>
                        <TableCell>
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {book.title}
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{book.genre?.name}</Badge>
                        </TableCell>
                        <TableCell>{book.totalPages}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">
                              {book.averageRating.toFixed(1)}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ({book.totalRatings})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(book)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(book._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
