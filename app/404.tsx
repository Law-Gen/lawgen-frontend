"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-primary">Page Not Found</h1>
        <p className="text-muted-foreground mt-2">The page you’re looking for doesn’t exist.</p>
      </div>
    </div>
  );
}
