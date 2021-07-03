
import firebase from 'firebase'
import { USER_STATE_CHANGE } from '../constants/index'

// make a call to firestore,
// get dispatch, check is snapshot exists to get data from database,
// send dispatch of type user_state and current user which is called to reducer,
// which updates current user variable
export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({ currentUser: snapshot.data() })
                }
                else {
                    console.log('snapshot does not exist')
                }
            })
    })
}