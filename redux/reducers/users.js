import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, } from "../constants"

const initialState = {
    users: [],
    usersLoaded: 0
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }

        default:
            return state;
    }

}