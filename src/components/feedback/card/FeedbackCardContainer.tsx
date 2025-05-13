
import React, { useState } from 'react';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackType } from '@/types/feedback';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { addComment, fetchComments, deleteComment } from '@/services/feedback/commentService';
import { CommentType } from '@/types/comments';

interface FeedbackCardContainerProps {
  feedback: FeedbackType;
  onUpvote: (id: string) => void;
  onComment: (id: string) => void;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
  onRepost?: (id: string) => void;
  navigateOnComment?: boolean;
}

export function FeedbackCardContainer({
  feedback,
  onUpvote,
  onComment,
  onReport,
  onDelete,
  onRepost,
  navigateOnComment = false
}: FeedbackCardContainerProps) {
  const { user } = useAuth();
  const { features } = useFeatureFlags();
  const [isUpvoted, setIsUpvoted] = useState(feedback.isUpvoted || false);
  const [upvotes, setUpvotes] = useState(feedback.upvotes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isAuthor = user?.id === feedback.author.id;
  const isOwnFeedback = isAuthor;

  const handleUpvote = () => {
    // Don't process upvotes for reposts
    if (feedback.isRepost) return;
    
    if (isOwnFeedback) return;
    if (isUpvoted) return; // Don't allow un-upvote

    setIsUpvoted(true);
    setUpvotes(prev => prev + 1);
    onUpvote(feedback.id);
  };

  const handleCommentClick = () => {
    if (!features.enableComments) return;
    
    if (navigateOnComment) {
      onComment(feedback.id);
      return;
    }
    
    if (!showComments) {
      loadComments();
    }
    setShowComments(!showComments);
    setShowCommentForm(!showComments);
    onComment(feedback.id);
  };

  const loadComments = async () => {
    if (comments.length > 0 || !features.enableComments) return;
    
    setIsLoading(true);
    try {
      const fetchedComments = await fetchComments(feedback.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (content: string): Promise<void> => {
    if (!features.enableComments) return Promise.resolve();
    
    try {
      const newComment = await addComment({
        feedbackId: feedback.id,
        content
      });
      
      setComments(prev => [...prev, newComment]);
      setShowCommentForm(false); // Hide the form after posting
      return Promise.resolve();
    } catch (error) {
      console.error('Error submitting comment:', error);
      return Promise.reject(error);
    }
  };

  const handleDeleteComment = async (commentId: string): Promise<void> => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting comment:', error);
      return Promise.reject(error);
    }
  };

  const handleShowReplyForm = () => {
    if (!features.enableComments) return;
    setShowCommentForm(true);
  };
  
  const handleRepostClick = () => {
    if (!onRepost) return;
    onRepost(feedback.id);
  };

  return (
    <div className="w-full mb-4">
      <FeedbackCard
        feedback={feedback}
        isManager={isManager}
        isAuthor={isAuthor}
        isUpvoted={isUpvoted}
        upvotes={upvotes}
        showComments={showComments}
        comments={comments}
        isLoading={isLoading}
        showCommentForm={showCommentForm}
        onUpvote={handleUpvote}
        onCommentClick={handleCommentClick}
        onReport={onReport}
        onDelete={onDelete}
        onRepost={handleRepostClick}
        onSubmitComment={handleSubmitComment}
        onDeleteComment={handleDeleteComment}
        onShowReplyForm={handleShowReplyForm}
        commentsEnabled={features.enableComments}
      />
    </div>
  );
}
