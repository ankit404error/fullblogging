"use client";

import React from "react";
import { trpc } from "@/lib/trpc";

export default function TestPage() {
  const { data: posts, isLoading, isError } = trpc.post.all.useQuery();
  const { data: categories } = trpc.category.all.useQuery();

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-500">Error loading data</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📝 All Posts</h1>
      {posts?.length ? (
        <ul className="list-disc ml-5">
          {posts.map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong> — {post.content.slice(0, 50)}...
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-2">📚 Categories</h2>
      {categories?.length ? (
        <ul className="list-disc ml-5">
          {categories.map((cat) => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
      ) : (
        <p>No categories yet.</p>
      )}
    </div>
  );
}
