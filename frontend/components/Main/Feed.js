import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, ProgressViewIOSComponent } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return y.creation - x.creation;
            })
            setPosts(props.feed);
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId, likeVal) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({});
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likes: firebase.firestore.FieldValue.increment(1)
            });
    }

    const onDislikePress = (userId, postId, likeVal) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likes: firebase.firestore.FieldValue.increment(-1)
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.gallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    extraData={posts}
                    data={posts}
                    renderItem={({ item }) => (
                        < View style={styles.containerForImage}>
                            <Text style={{ fontWeight: "bold", padding: 5 }}>{item.user.name}</Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            < View style={styles.postInteractions}>
                                {item.currentUserLike ?
                                    (
                                        <MaterialCommunityIcons name="heart" size={22}
                                            onPress={() => {
                                                onDislikePress(item.user.uid, item.id, item.like);
                                            }} />
                                    ) :
                                    (
                                        <MaterialCommunityIcons name="heart-outline" size={22}

                                            onPress={() => {
                                                onLikePress(item.user.uid, item.id, item.like);
                                            }} />
                                    )
                                }
                                <MaterialCommunityIcons name="comment" size={22}
                                    onPress={() =>
                                        props.navigation.navigate("Comments",
                                            { postId: item.id, uid: item.user.uid })}
                                />
                            </View>
                            < View style={styles.postInteractions}>
                                <Text style={{ fontWeight: "bold" }}>{item.user.name}: </Text>
                                <Text>{item.caption}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

export default connect(mapStateToProps, null)(Feed);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerForImage: {
        flex: 1 / 3,
        paddingTop: 20,
        paddingBottom: 30
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
    },
    postInteractions: {
        padding: 5,
        display: 'flex',
        flexDirection: "row",
    }
})
