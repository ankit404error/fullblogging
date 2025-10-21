'use client';
import { useState, useEffect } from 'react';
import { Send, FileText, Tag, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff, Save, Plus } from 'lucide-react';
import { trpc } from '../../lib/trpc';

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  categoryId?: number | null;
}

interface PostFormProps {
  categories: Category[];
  onSuccess?: () => void;
  onCategoryCreated?: (newCategory: Category) => void;
  editingPost?: Post;
}

interface FormErrors {
  title?: string;
  content?: string;
  categoryId?: string;
  newCategory?: string;
}

export default function PostForm({ categories, onSuccess, onCategoryCreated, editingPost }: PostFormProps) {
  const [title, setTitle] = useState(editingPost?.title || '');
  const [content, setContent] = useState(editingPost?.content || '');
  const [categoryId, setCategoryId] = useState(editingPost?.categoryId?.toString() ?? '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const createPost = trpc.post.create.useMutation();
  const updatePost = trpc.post.update.useMutation();
  const createCategory = trpc.category.create.useMutation();

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setCategoryId(editingPost.categoryId?.toString() ?? '');
    }
  }, [editingPost]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    if (!categoryId && categoryId !== 'new') {
      newErrors.categoryId = 'Please select a category';
    }
    
    if (categoryId === 'new' && !newCategoryName.trim()) {
      newErrors.newCategory = 'Please enter a category name';
    } else if (categoryId === 'new' && newCategoryName.trim().length < 2) {
      newErrors.newCategory = 'Category name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setErrors({});
    
    try {
      let selectedCategoryId = categoryId;
      
      if (categoryId === 'new' && newCategoryName.trim()) {
        const newCategory = await createCategory.mutateAsync({ name: newCategoryName.trim() });
        selectedCategoryId = newCategory.id.toString();
        
        if (onCategoryCreated) {
          onCategoryCreated(newCategory);
        }
      }
      
      const postData = {
        title: title.trim(), 
        content: content.trim(), 
        categoryId: selectedCategoryId ? parseInt(selectedCategoryId) : undefined,
      };
      
      if (editingPost) {
        await updatePost.mutateAsync({ id: editingPost.id, ...postData });
        setSuccessMessage('Post updated successfully!');
      } else {
        await createPost.mutateAsync(postData);
        setSuccessMessage(isDraft ? 'Draft saved successfully!' : 'Post published successfully!');
      }
      
      if (!editingPost) {
        resetForm();
      }
      
      setTimeout(() => {
        setSuccessMessage('');
        onSuccess?.();
      }, 2000);
      
    } catch (error) {
      setErrors({ title: editingPost ? 'Failed to update post. Please try again.' : 'Failed to create post. Please try again.' });
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategoryId('');
    setIsDraft(false);
    setNewCategoryName('');
    setShowNewCategoryInput(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || newCategoryName.trim().length < 2) {
      setErrors(prev => ({ ...prev, newCategory: 'Category name must be at least 2 characters' }));
      return;
    }

    setErrors(prev => ({ ...prev, newCategory: undefined }));

      try {
        const newCategory = await createCategory.mutateAsync({ name: newCategoryName.trim() });
        
        if (onCategoryCreated) {
          onCategoryCreated(newCategory);
        }
        
        setCategoryId(newCategory.id.toString());
        setShowNewCategoryInput(false);
        setNewCategoryName('');
        
        const tempMessage = `Category "${newCategory.name}" created successfully!`;
        setSuccessMessage(tempMessage);
        setTimeout(() => {
          if (successMessage === tempMessage) {
            setSuccessMessage('');
          }
        }, 3000);
    } catch (error) {
      setErrors(prev => ({ ...prev, newCategory: 'Failed to create category. Please try again.' }));
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {editingPost ? 'Update your post with new content or corrections' : 'Share your thoughts and ideas with the world'}
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-800 dark:text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Post Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title for your post..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                errors.title 
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              maxLength={100}
            />
            <div className="absolute right-3 top-3 text-xs text-gray-400">
              {title.length}/100
            </div>
          </div>
          {errors.title && (
            <div className="mt-2 flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.title}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-3">
            <div className="relative">
              <select
                id="category"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (e.target.value !== 'new') {
                    setNewCategoryName('');
                    setShowNewCategoryInput(false);
                  } else {
                    setShowNewCategoryInput(true);
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer ${
                  errors.categoryId 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <option value="">Choose a category for your post</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                <option value="new" className="font-medium text-blue-600 dark:text-blue-400">
                  + Create New Category
                </option>
              </select>
              <Tag className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {showNewCategoryInput && (
              <div className="animate-slide-in">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter new category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors.newCategory 
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    maxLength={50}
                  />
                  <div className="absolute right-3 top-3 text-xs text-gray-400">
                    {newCategoryName.length}/50
                  </div>
                </div>
                {errors.newCategory && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.newCategory}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={createCategory.isPending || !newCategoryName.trim()}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    {createCategory.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {createCategory.isPending ? 'Creating...' : 'Create Category'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategoryName('');
                      setCategoryId('');
                      setErrors(prev => ({ ...prev, newCategory: undefined }));
                    }}
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {errors.categoryId && (
            <div className="mt-2 flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.categoryId}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{wordCount} words</span>
              <span>~{estimatedReadTime} min read</span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide' : 'Preview'}
              </button>
            </div>
          </div>
          
          {showPreview ? (
            <div className="min-h-[200px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold mb-4">{title || 'Preview Title'}</h3>
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                  {content || 'Start typing your content to see the preview...'}
                </div>
              </div>
            </div>
          ) : (
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here... Share your insights, stories, or expertise."
              rows={12}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-y min-h-[200px] ${
                errors.content 
                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            />
          )}
          
          {errors.content && (
            <div className="mt-2 flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.content}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="draft"
            checked={isDraft}
            onChange={(e) => setIsDraft(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="draft" className="text-sm text-gray-700 dark:text-gray-300">
            Save as draft (won't be published immediately)
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={createPost.isPending || updatePost.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {(createPost.isPending || updatePost.isPending) ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isDraft ? (
              <Save className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {(createPost.isPending || updatePost.isPending) ? 'Saving...' : editingPost ? 'Update Post' : isDraft ? 'Save Draft' : 'Publish Post'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (editingPost) {
                setTitle(editingPost.title);
                setContent(editingPost.content);
                setCategoryId(editingPost.categoryId?.toString() ?? '');
              } else {
                setTitle('');
                setContent('');
                setCategoryId('');
              }
              setErrors({});
              setIsDraft(false);
              setNewCategoryName('');
              setShowNewCategoryInput(false);
            }}
            disabled={createPost.isPending || updatePost.isPending}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 font-medium disabled:cursor-not-allowed"
          >
            {editingPost ? 'Reset Changes' : 'Clear Form'}
          </button>
        </div>
      </form>
    </div>
  );
}
