'use client';
import React, { useState } from 'react';
import { Calendar, Tag, Clock, ChevronRight, BookOpen, Heart } from 'lucide-react';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    category?: {
      id: number;
      name: string;
    };
    createdAt?: string;
    readTime?: number;
    likes?: number;
  };
}

function getCategoryColor(categoryName: string): string {
  const colors: Record<string, string> = {
    Technology: 'bg-blue-100 text-blue-800 border-blue-200',
    Design: 'bg-purple-100 text-purple-800 border-purple-200',
    Business: 'bg-green-100 text-green-800 border-green-200',
    Lifestyle: 'bg-pink-100 text-pink-800 border-pink-200',
    Travel: 'bg-orange-100 text-orange-800 border-orange-200',
    Food: 'bg-red-100 text-red-800 border-red-200',
    Health: 'bg-teal-100 text-teal-800 border-teal-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[categoryName] || colors.default;
}

export default function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const contentPreview = post.content?.slice(0, 150) + (post.content?.length > 150 ? '...' : '');
  const displayContent = isExpanded ? post.content : contentPreview;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  return (
    <article className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-tight">
              {post.title}
            </h2>
            
            {post.category && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category.name)} transition-all duration-200 hover:scale-105`}>
                <Tag className="w-3 h-3 mr-1" />
                {post.category.name}
              </span>
            )}
          </div>
          
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
              isLiked 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {displayContent}
          </p>
          {post.content && post.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors duration-200"
            >
              {isExpanded ? 'Show less' : 'Read more'}
              <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            {post.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            )}
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {post.likes && (
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                {post.likes + (isLiked ? 1 : 0)} likes
              </span>
            )}
            <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 font-medium">
              <BookOpen className="w-4 h-4" />
              Read full post
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-xl transition-all duration-300 pointer-events-none" />
    </article>
  );
}
