"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  name: string;
  description: string;
  url: string;
  GroupID: string; // Add GroupID based on your API response
  language?: string; // Add language based on your API response
}

export default function ArticlePage() {
  const { data: session } = useSession();
  const params = useParams();
  const contentId = params.contentId as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session && contentId) {
      // Ensure contentId is available
      fetchArticle();
    }
  }, [session, contentId]); // Add contentId to dependency array

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL}/api/v1/contents/${contentId}/view`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch article");

      const data = await res.json();
      setArticle(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Ensure article.GroupID is present before navigating */}
      <Link href={`/categories/${article?.GroupID || ""}`}>
        <Button variant="ghost">← Back to Topics</Button>
      </Link>

      {loading ? (
        <p className="mt-4 text-center">Loading...</p>
      ) : article ? (
        <div className="mt-6 space-y-4">
          <h1 className="text-2xl font-bold">{article.name}</h1>
          <p className="text-muted-foreground">{article.description}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button>Open Full Article</Button>
          </a>
        </div>
      ) : (
        <p className="mt-4 text-center">No article found</p>
      )}
    </div>
  );
}
