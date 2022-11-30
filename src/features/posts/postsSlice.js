import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import sub from "date-fns/sub";
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState({
        status: 'idle', // 'idle' | 'loading' | 'succeded' | 'failed'
        error: null,
});


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL);
    return response.data;
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (iniitialPost) => {
    const response = await axios.post(POSTS_URL, iniitialPost);
    return response.data;
});

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
        return response.data;
    } catch (error) {
        //return err.message;
        return initialPost; // only for testing Redux!
    }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`);
        if(response?.status === 200) return initialPost;
        return `${response.status}: ${response.statusText }`;
    } catch (error) {
        return error.message;
    }
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action){
            const { postId, reaction } = action.payload;
            const existingPost = state.entities[postId];
            if(existingPost){
                existingPost.reactions[reaction]++;
            }
        },
        increaseCount(state, action){
            state.count += 1;
        }, 
    },
    extraReducers(builder){
        builder
            .addCase(fetchPosts.pending, (state, action)=>{
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status =  'succeeded';
                //ading date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    //differintiate the time do the posts won't have the same time ago
                    post.date = sub(new Date(), {minutes: min++}).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });
                //adds any fetched posts to the state
                postsAdapter.upsertMany(state, loadedPosts);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId);
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                postsAdapter.addOne(state, action.payload);
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if(!action.payload?.id){
                    console.log("Couldn't update the post");
                    console.log(action.payload);
                    return;
                }
                action.payload.date = new Date().toISOString();
                postsAdapter.upsertOne(state, action.payload);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if(!action.payload?.id){
                    console.log("Couldn't delete the post");
                    console.log(action.payload);
                    return;
                }
                const { id } = action.payload;
                postsAdapter.removeOne(state, id)
            });    
    }
});

export const {
    selectAll: selectAllPosts,
    selectIds: selectPostsIds,
    selectById: selectPostById
} = postsAdapter.getSelectors(state => state.posts);


export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.count;

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;