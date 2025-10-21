'use client';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PostForm from '../../components/PostForm';
import { trpc } from '../../../lib/trpc';

export default function NewPost() {
  const router = useRouter();

  // TRPC queries
  const { data: categories = [], isLoading } = trpc.category.all.useQuery();

  const handlePostSuccess = () => {
    setTimeout(() => {
      router.push('/posts');
    }, 2000);
  };

  const handleCategoryCreated = () => {
    // Categories will be automatically refetched by TRPC
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">BlogSpace</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Share your thoughts</p>
              </div>
            </Link>

            <Link 
              href="/posts"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Link>
          </div>
        </div>
      </header>

      <main className="py-8">
        <PostForm 
          categories={categories} 
          onSuccess={handlePostSuccess}
          onCategoryCreated={handleCategoryCreated}
        />
      </main>
    </div>
  );
}
