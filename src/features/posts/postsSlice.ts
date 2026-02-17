/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types/Post';
import { getUserPosts } from '../../api/posts';
import { User } from '../../types/User';

type PostsState = {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: PostsState = {
  posts: null,
  loading: false,
  error: null,
};

export const init = createAsyncThunk('posts/fetch', (user: User) => {
  return getUserPosts(user.id);
});

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(init.pending, state => {
        state.loading = true;
        state.posts = null;
        state.error = null;
      })
      .addCase(init.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(init.rejected, state => {
        state.loading = false;
        state.error = 'Posts not loaded, sorry..';
      });
  },
});

export default postSlice.reducer;
