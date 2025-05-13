
import { FeedbackType } from './feedback';

export type CommentType = {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  feedbackId: string;
  createdAt: Date;
};

export type CreateCommentInput = {
  content: string;
  feedbackId: string;
};
