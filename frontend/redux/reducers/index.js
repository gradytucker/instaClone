
import { combineReducers } from "redux";
import { user } from 'components/redux/reducers/user'
import { users } from 'components/redux/reducers/users'

const Reducers = combineReducers({
    userState: user,
    usersState: users
})

export default Reducers