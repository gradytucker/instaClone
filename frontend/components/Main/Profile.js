import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, ProgressViewIOSComponent } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Profile(props) {
    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)
    const [postsCount, setPostsCount] = useState(null)
    const [followingCount, setFollowingCount] = useState(null)
    const [followerCount, setFollowerCount] = useState(null)



    useEffect(() => {
        const { currentUser, posts } = props;

        // if we are trying to access our own profile, 
        // fill in profile page with current user data
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
            setPostsCount(postsCount)
            setFollowingCount(followingCount)
            setFollowerCount(followerCount)
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

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])



    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
        firebase.firestore()
            .collection("followers")
            .doc(props.route.params.uid)
            .collection("userFollowers")
            .doc(firebase.auth().currentUser.uid)
            .set({})
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                following: firebase.firestore.FieldValue.increment(1)
            })
        firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .update({
                followers: firebase.firestore.FieldValue.increment(1)
            })
    }

    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete({})
        firebase.firestore()
            .collection("followers")
            .doc(props.route.params.uid)
            .collection("userFollowers")
            .doc(firebase.auth().currentUser.uid)
            .delete({})
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                following: firebase.firestore.FieldValue.increment(-1)
            })
        firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .update({
                followers: firebase.firestore.FieldValue.increment(-1)
            })

    }



    const onLogout = () => {
        firebase.auth().signOut();
    }

    const onChangeProfilePicture = () => { }

    if (user === null) {
        return <View />
    }
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <View style={styles.profileUsername}>
                    <Image
                        source={{
                            uri: user.profilePicture
                        }}
                        style={styles.profilePicture}
                        onPress={() => {
                            if (props.route.params.uid === firebase.auth().currentUser.uid) {
                                onChangeProfilePicture();
                            }
                        }}
                    />
                </View>
                <View style={styles.profileUsername}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 25,
                    }}>{user.name}</Text>
                </View>
                < View style={styles.profileDetailsContainer}>
                    < View style={styles.profileDetail}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 25,
                        }}>{user.posts}</Text>
                        <Text>{"\n"}Posts</Text>
                    </View>
                    < View style={styles.profileDetail}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 25,
                        }}>{user.followers}</Text>
                        <Text>{"\n"}Followers</Text>
                    </View>
                    < View style={styles.profileDetail}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 25,
                        }}>{user.following}</Text>
                        <Text>{"\n"}Following</Text>
                    </View>
                </View>
                {props.route.params.uid !== firebase.auth().currentUser.uid ? (<View>
                    {following ? (<Button
                        title='Following'
                        onPress={() => onUnfollow()}
                    />

                    ) : (<Button
                        title='Follow'
                        onPress={() => onFollow()}
                    />
                    )}
                </View>
                ) :
                    <Button
                        title='Sign out'
                        onPress={() => onLogout()}
                    />}
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
        </View >
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
    postsCount: store.userState.postsCount,
    followingCount: store.userState.followingCount,
    followerCount: store.userState.followerCount
})

export default connect(mapStateToProps, null)(Profile);


const styles = StyleSheet.create({
    profileUsername: {
        paddingBottom: 5,
        display: 'flex',
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: 'center',
        flexShrink: 1,

    },
    profileDetailsContainer: {
        paddingTop: 10,
        display: 'flex',
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: 'center',
    },
    profileDetail: {
        alignItems: 'center',
        justifyContent: 'center',
        display: "flex",
        flexShrink: 2,
        margin: 20
    },
    container: {
        flex: 1,
        marginTop: 40
    },
    containerForImage: {
        flex: 1 / 3,
        padding: 2
    },
    info: {
        margin: 10
    },
    gallery: {
        flex: 1
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1,
        borderRadius: 10,
        margin: 1

    },
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 400,
        borderWidth: 0.5,
        resizeMode: 'stretch'
    }
})
