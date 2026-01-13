import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function calculateReadingProgress(
  pagesRead: number,
  totalPages: number
): number {
  if (!totalPages || totalPages === 0) return 0;
  return Math.min(Math.round((pagesRead / totalPages) * 100), 100);
}

export function getShelfLabel(shelf: string): string {
  const labels: Record<string, string> = {
    wantToRead: "Want to Read",
    currentlyReading: "Currently Reading",
    read: "Read",
  };
  return labels[shelf] || shelf;
}

export function getShelfColor(shelf: string): string {
  const colors: Record<string, string> = {
    wantToRead: "bg-blue-100 text-blue-800",
    currentlyReading: "bg-yellow-100 text-yellow-800",
    read: "bg-green-100 text-green-800",
  };
  return colors[shelf] || "bg-gray-100 text-gray-800";
}
