/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types/Post';
import { Comment } from '../../types/Comment';
import { createComment, getPostComments } from '../../api/comments';
import { deleteComment } from '../../api/comments';

type CommentsState = {
  comments: Comment[] | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
};

const initialState: CommentsState = {
  comments: null,
  loading: false,
  submitting: false,
  error: null,
};

export const init = createAsyncThunk('comments/fetch', (post: Post) => {
  return getPostComments(post.id);
});

export const addComment = createAsyncThunk(
  'comments/add',
  async (data: Omit<Comment, 'id'>) => {
    const newComment = await createComment(data);

    return newComment;
  },
);

export const removeComment = createAsyncThunk(
  'comments/delete',
  async (commentId: number) => {
    await deleteComment(commentId);

    return commentId;
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(init.pending, state => {
        state.loading = true;
        state.comments = null;
        state.error = null;
      })
      .addCase(init.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(init.rejected, state => {
        state.loading = false;
        state.error = 'Comments not loaded(';
      })
      .addCase(addComment.pending, state => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.submitting = false;
          state.comments?.push(action.payload);
        },
      )
      .addCase(addComment.rejected, state => {
        state.submitting = false;
        state.error = 'Unable to add comment';
      })
      .addCase(
        removeComment.fulfilled,
        (state, action: PayloadAction<number>) => {
          if (state.comments) {
            state.comments = state.comments.filter(
              comment => comment.id !== action.payload,
            );
          }
        },
      )
      .addCase(removeComment.rejected, state => {
        state.error = 'Unable to delete comment';
      });
  },
});

export default commentsSlice.reducer;
