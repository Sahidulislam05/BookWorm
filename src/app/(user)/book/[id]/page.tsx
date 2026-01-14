// This route is deprecated - use /book/[id] instead
// Keeping for backward compatibility

import { redirect } from "next/navigation";

export default function OldBookDetailsPage({ params }: { params: { id: string } }) {
  // Redirect to new route
  redirect(`/book/${params.id}`);
}
