import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, ProgressViewIOSComponent, Animated } from 'react-native'
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



    const [scrollViewWidth, setScrollViewWidth] = React.useState(0);
    const boxWidth = scrollViewWidth;
    const boxDistance = scrollViewWidth - boxWidth;
    const halfBoxDistance = boxDistance / 2;
    const pan = React.useRef(new Animated.ValueXY()).current;

    return (
        <View style={styles.container}>
            <View style={styles.gallery}>
                <FlatList
                    numColumns={1}
                    scrollEventThrottle={1}
                    contentInsetAdjustmentBehavior="never"
                    snapToAlignment="center"
                    decelerationRate="fast"
                    automaticallyAdjustContentInsets={false}

                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}

                    snapToInterval={boxWidth}
                    contentInset={{
                        left: halfBoxDistance,
                        right: halfBoxDistance,
                    }}
                    contentOffset={{ x: halfBoxDistance * -2, y: 0 }}
                    onLayout={(e) => {
                        setScrollViewWidth(e.nativeEvent.layout.width);
                    }}

                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: pan.x } } }],
                        {
                            useNativeDriver: false,
                        },
                    )}


                    horizontal={false}
                    extraData={posts}
                    data={posts}
                    renderItem={({ item }) => (
                        < View style={styles.containerForImage}>
                            < View style={styles.postInfo}>
                                <Image
                                    source={{
                                        uri: item.user.profilePicture
                                    }}
                                    style={styles.feedProfilePicture}
                                />
                                <Text style={{ fontWeight: "bold", padding: 5, fontSize: 18 }} onPress={() => {
                                    props.navigation.navigate("Profile", { uid: item.user.uid })
                                }}>{item.user.name}</Text>
                            </View>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            < View style={styles.postInteractions}>
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
                                </View>
                                < View style={styles.postInteractions}>
                                    <MaterialCommunityIcons name="comment-outline" size={22}
                                        onPress={() =>
                                            props.navigation.navigate("Comments",
                                                { postId: item.id, uid: item.user.uid })}
                                    />
                                </View>
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
        aspectRatio: 1 / 1,
        borderRadius: 20,
        margin: 5
    },
    postInteractions: {
        padding: 5,
        display: 'flex',
        flexDirection: "row",
    },
    postInfo: {
        paddingLeft: 10,
        display: 'flex',
        flexDirection: "row",
    },
    postInteractionButton: {
        padding: 5,
    },
    feedProfilePicture: {
        width: 30,
        height: 30,
        borderRadius: 400,
        borderWidth: 0.5,
        resizeMode: 'stretch'
    }
})
