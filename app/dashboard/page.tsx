'use client';
import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '../../lib/trpc';
import { Plus, Edit2, Trash2, BookOpen, Tag, ArrowLeft, Search, Filter } from 'lucide-react';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);

  // TRPC queries
  const { data: posts = [], isLoading: postsLoading, refetch: refetchPosts } = trpc.post.all.useQuery();
  const { data: categories = [], isLoading: categoriesLoading, refetch: refetchCategories } = trpc.category.all.useQuery();

  // TRPC mutations
  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => refetchPosts(),
  });

  const createCategory = trpc.category.create.useMutation({
    onSuccess: () => {
      refetchCategories();
      setNewCategoryName('');
    },
  });

  const updateCategory = trpc.category.update.useMutation({
    onSuccess: () => {
      refetchCategories();
      setEditingCategory(null);
    },
  });

  const deleteCategory = trpc.category.delete.useMutation({
    onSuccess: () => refetchCategories(),
  });

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? post.categoryId === Number(selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });

  const handleDeletePost = (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost.mutate({ id });
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      createCategory.mutate({ name: newCategoryName.trim() });
    }
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && editingCategory.name.trim()) {
      updateCategory.mutate({ 
        id: editingCategory.id, 
        name: editingCategory.name.trim() 
      });
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('Are you sure you want to delete this category? This will affect all posts in this category.')) {
      deleteCategory.mutate({ id });
    }
  };

  if (postsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            </div>
            <Link
              href="/post/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Tag className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Filter className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredPosts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Posts Management ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Categories Management ({categories.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'posts' ? (
              <div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Posts List */}
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm || selectedCategory ? 'Try adjusting your search criteria' : 'Create your first post to get started'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.map((post) => (
                      <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {post.content.substring(0, 150)}...
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>ID: {post.id}</span>
                              {post.categoryId && (
                                <span>
                                  Category: {categories.find(c => c.id === post.categoryId)?.name || 'Unknown'}
                                </span>
                              )}
                              <span>Slug: {post.slug}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Link
                              href={`/post/${post.id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
                              title="Edit post"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors"
                              title="Delete post"
                              disabled={deletePost.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Create New Category */}
                <form onSubmit={handleCreateCategory} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Create New Category</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={createCategory.isPending || !newCategoryName.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                    >
                      {createCategory.isPending ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>

                {/* Categories List */}
                {categories.length === 0 ? (
                  <div className="text-center py-12">
                    <Tag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">Create your first category above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        {editingCategory?.id === category.id ? (
                          <form onSubmit={handleUpdateCategory} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                            <button
                              type="submit"
                              disabled={updateCategory.isPending}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategory(null)}
                              className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 dark:text-white">{category.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {category.id} • Slug: {category.slug} • Posts: {posts.filter(p => p.categoryId === category.id).length}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors"
                                title="Edit category"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors"
                                title="Delete category"
                                disabled={deleteCategory.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}