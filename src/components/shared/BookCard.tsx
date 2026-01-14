"use client";

import Link from "next/link";
import { Star, BookOpen } from "lucide-react";
import { truncateText } from "@/lib/utils";
import { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
  showReason?: boolean;
  reason?: string;
}

export default function BookCard({
  book,
  showReason = false,
  reason = "",
}: BookCardProps) {
  return (
    <Link href={`/books/${book._id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
        {/* Cover Image */}
        <div className="relative h-72 overflow-hidden bg-gray-100">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showReason && reason && (
            <Badge className="absolute top-2 right-2 bg-primary text-white shadow-md">
              ✨ Recommended
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-serif font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>

          <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

          {book.genre && (
            <Badge variant="secondary" className="mb-2">
              {book.genre.name}
            </Badge>
          )}

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {truncateText(book.description, 100)}
          </p>

          {/* Rating & Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-800">
                {book.averageRating > 0 ? book.averageRating.toFixed(1) : "N/A"}
              </span>
              <span className="text-gray-500">({book.totalRatings || 0})</span>
            </div>

            {book.totalShelved > 0 && (
              <div className="flex items-center space-x-1 text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>{book.totalShelved}</span>
              </div>
            )}
          </div>

          {showReason && reason && (
            <div className="mt-3 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              💡 {reason}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
