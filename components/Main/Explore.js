import React from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'
import firebase from 'firebase';
require('firebase/firestore')

export default function ExploreScreen() {
    const [users, setUsers] = useState([])
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Explore</Text>
        </View>
    )
}
