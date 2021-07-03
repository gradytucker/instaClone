import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'
import firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
require('firebase/firestore')

export default function ExploreScreen(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (searchString) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', searchString)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
            })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <TextInput
                placeholder="search for users"
                onChangeText={(searchString) => fetchUsers(searchString)} />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate("Profile", { uid: item.id })
                    }}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}


