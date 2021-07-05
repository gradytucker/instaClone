import { USER_POSTS_STATE_CHANGE, USER_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USER_POSTSCOUNT_STATE_CHANGE, USER_FOLLOWINGCOUNT_STATE_CHANGE, USER_FOLLOWERSCOUNT_STATE_CHANGE, CLEAR_DATA } from "../constants/index"

const initialState = {
    currentUser: null,
    posts: [],
    following: [],
    postsCount: 0,
    followingCount: 0,
    followerCount: 0
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_POSTSCOUNT_STATE_CHANGE:
            return {
                ...state,
                postsCount: action.postsCount
            }
        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        case USER_FOLLOWINGCOUNT_STATE_CHANGE:
            return {
                ...state,
                followingCount: action.followingCount
            }
        case USER_FOLLOWERSCOUNT_STATE_CHANGE:
            return {
                ...state,
                followerCount: action.followerCount
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }

}