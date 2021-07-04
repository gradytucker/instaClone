// file that is caused after successful login or registe
import React, { Component } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase'
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from './redux/actions';
import { fetchUserPosts } from './redux/actions';
import { fetchUserFollowing } from './redux/actions';
import { clearData } from './redux/actions';

import ActivityScreen from 'components/Main/Activity';
import ExploreScreen from 'components/Main/Explore';
import FeedScreen from 'components/Main/Feed';
import ProfileScreen from 'components/Main/Profile';


const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" tabBarOptions={{ showLabel: false }}>
                <Tab.Screen name="Feed" component={FeedScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        )
                    }} />
                <Tab.Screen name="Explore" component={ExploreScreen} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={26} />
                        )
                    }} />
                <Tab.Screen name="PostContainer" component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Post")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                        )
                    }} />
                <Tab.Screen name="Activity" component={ActivityScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="bell" color={color} size={26} />
                        )
                    }} />
                <Tab.Screen name="Profile" component={ProfileScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        )
                    }} />
            </Tab.Navigator>
        )
    }
}

// functions to bind components to redux and get fetchUser()
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) =>
    bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Main);
