'use client';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import PostForm from '../../../components/PostForm';
import { trpc } from '../../../../lib/trpc';

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const postId = parseInt(params.id as string);

  // TRPC queries
  const { data: post, isLoading: postLoading, isError: postError } = trpc.post.byId.useQuery({ id: postId });
  const { data: categories = [], isLoading: categoriesLoading } = trpc.category.all.useQuery();

  const isLoading = postLoading || categoriesLoading;

  const handlePostSuccess = () => {
    setTimeout(() => {
      router.push('/dashboard');
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
          <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Post not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The post you're looking for doesn't exist.</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">BlogSpace</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Edit Post</p>
              </div>
            </Link>

            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="py-8">
        <PostForm 
          categories={categories} 
          onSuccess={handlePostSuccess}
          onCategoryCreated={handleCategoryCreated}
          editingPost={post}
        />
      </main>
    </div>
  );
}