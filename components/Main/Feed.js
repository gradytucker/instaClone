import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, ProgressViewIOSComponent } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let posts = [];
        if (props.usersLoaded == props.following.length) {
            for (let i = 0; i < props.following.length; i++) {
                const user = props.users.find(el => el.uid === props.following[i]);
                if (user != undefined) {
                    posts = [...posts, ...user.posts];
                }
            }

            posts.sort(function (x, y) {
                return x.creation - y.creation;
            })

            setPosts(posts);
        }
    }, [props.usersLoaded])


    return (
        <View style={styles.container}>
            <View style={styles.gallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View style={styles.containerForImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
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
    following: store.userState.following,
    users: store.usersState.users,
    usersLoaded: store.usersState.usersLoaded
})

export default connect(mapStateToProps, null)(Feed);


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
