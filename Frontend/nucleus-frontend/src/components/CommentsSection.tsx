import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosClient';
import type { Comment, CommentCreateRequest } from '../types/Comment';
import type { User } from '../types/User';

interface CommentsSectionProps {
  issueId: number;
  currentUser: User;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ issueId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [issueId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.comments.getCommentsByIssue(issueId);
      console.log('📦 Comments API response:', response);
      
      if (response.data.status === 'success' && response.data.data) {
        setComments(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch comments');
      }
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      setError(error.response?.data?.message || 'Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const commentData: CommentCreateRequest = {
        content: newComment.trim(),
        issueId: issueId
      };

      console.log('🔄 Creating comment:', commentData);
      const response = await api.comments.createComment(commentData);

      if (response.data.status === 'success') {
        setNewComment('');
        await fetchComments(); // Refresh to get the new comment with author data
      } else {
        throw new Error(response.data.message || 'Failed to create comment');
      }
    } catch (error: any) {
      console.error('Error creating comment:', error);
      setError(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await api.comments.deleteComment(commentId);
      if (response.data.status === 'success') {
        await fetchComments();
      } else {
        throw new Error(response.data.message || 'Failed to delete comment');
      }
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      setError(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCommentAuthor = (comment: Comment) => {
    return comment.author?.id === currentUser.id;
  };

  if (loading) {
    return (
      <div className="comments-loading">
        <div className="spinner"></div>
        <p>Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h4>Comments ({comments.length})</h4>
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="comment-form">
        <div className="form-group">
          <label htmlFor="comment-textarea">
            Add a comment as <strong>{currentUser.displayName || currentUser.username}</strong>
          </label>
          <textarea
            id="comment-textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your comment here..."
            rows={4}
            disabled={submitting}
            className="comment-textarea"
          />
        </div>
        <div className="form-actions">
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="btn-primary"
          >
            {submitting ? (
              <>
                <span className="spinner-small"></span>
                Adding Comment...
              </>
            ) : (
              'Add Comment'
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-comments">
            <div className="empty-icon">💬</div>
            <p>No comments yet</p>
            <p className="empty-subtitle">Be the first to comment on this issue</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`comment-item ${isCommentAuthor(comment) ? 'own-comment' : ''}`}
            >
              <div className="comment-header">
                <div className="comment-author">
                  <div className="author-avatar">
                    {comment.author?.displayName?.charAt(0) || comment.author?.username?.charAt(0) || 'U'}
                  </div>
                  <div className="author-info">
                    <strong className="author-name">
                      {comment.author?.displayName || comment.author?.username || 'Unknown User'}
                    </strong>
                    <span className="comment-time">
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt !== comment.createdAt && ' (edited)'}
                    </span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="comment-actions">
                  {isCommentAuthor(comment) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="btn-icon"
                      title="Delete comment"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              
              <div className="comment-content">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CSS Styles */}
      <style>{`
        /* Comments Section Styles */
        .comments-section {
          margin-top: 2rem;
        }

        .comments-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .comments-header h4 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background-color: #ffeaa7;
          border: 1px solid #fdcb6e;
          border-radius: 6px;
          color: #e17055;
          font-size: 0.9rem;
        }

        .error-message button {
          background: none;
          border: none;
          color: #e17055;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0;
        }

        /* Comment Form */
        .comment-form {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          border: 1px solid #e9ecef;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #495057;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .comment-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          min-height: 100px;
          transition: border-color 0.2s ease;
        }

        .comment-textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .comment-textarea:disabled {
          background-color: #f8f9fa;
          opacity: 0.7;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        /* Comments List */
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .comment-item {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1.25rem;
          transition: box-shadow 0.2s ease;
        }

        .comment-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .comment-item.own-comment {
          border-left: 4px solid #3498db;
          background: #f8fafc;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .comment-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          color: #2c3e50;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .comment-time {
          color: #6c757d;
          font-size: 0.8rem;
        }

        .comment-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .btn-icon:hover {
          background-color: #e9ecef;
        }

        .comment-content {
          color: #495057;
          line-height: 1.6;
          white-space: pre-wrap;
          font-size: 0.95rem;
        }

        /* Loading States */
        .comments-loading {
          text-align: center;
          padding: 2rem;
          color: #6c757d;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-right: 0.5rem;
        }

        /* Empty State */
        .empty-comments {
          text-align: center;
          padding: 3rem 2rem;
          color: #6c757d;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-subtitle {
          font-size: 0.9rem;
          margin-top: 0.5rem;
          opacity: 0.7;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .comment-header {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .comment-actions {
            align-self: flex-end;
          }
          
          .comment-form {
            padding: 1rem;
          }
        }

        /* Button Styles */
        .btn-primary {
          padding: 0.75rem 1.5rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #2980b9;
        }

        .btn-primary:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default CommentsSection;