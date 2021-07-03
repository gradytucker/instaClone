import React from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'

function Profile(props) {
    const { currentUser, posts } = props
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text>{currentUser.name}</Text>
            </View>
            <View style={styles.gallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View>
                            style={styles.containerForImage}
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
