import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Profile(props) {
    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)



    useEffect(() => {
        const { currentUser, posts } = props;

        // if we are trying to access our own profile, 
        // fill in profile page with current user data
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        }

        // if we are trying to access another profile,
        // fill in profile page with data that matches the id we
        // are looking for
        else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })
        }


    }, [props.route.params.uid])

    if (user === null) {
        return <View />
    }
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text>{user.name}</Text>
            </View>
            <View style={styles.gallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View style={styles.containerForImage}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    containerForImage: {
        flex: 1 / 3
    },
    info: {
        margin: 20
    },
    gallery: {
        flex: 1
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1

    }
})
