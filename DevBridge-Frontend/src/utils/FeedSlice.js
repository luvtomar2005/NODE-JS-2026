import { createSlice } from "@reduxjs/toolkit"


const feedSlice = createSlice({
    name : "feed",
    initialState : null,
    reducers : {
        addFeed : (state , action) => {
            return action.payload;
        },
        removeFirstFeedItem: (state) => {
            if (!Array.isArray(state) || state.length === 0) return [];
            return state.slice(1);
        },
        removeFeed : (state, action) => {
            return null;
        }
    }
})

export const { addFeed, removeFirstFeedItem, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
