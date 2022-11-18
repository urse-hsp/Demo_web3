import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { Image, StyleSheet } from "react-native"

const tabbar = [
    {
        name: "资产",
        component: require("../pages/HomeScreen").default,
        icon: require("../assets/tab/tab_assets_nor.png"),
        selectIcon: require("../assets/tab/tab_assets_sel.png")
    },
    {
        name: "发现",
        component: require("../pages/DAppScreen").default,
        icon: require("../assets/tab/tab_find_nor.png"),
        selectIcon: require("../assets/tab/tab_find_sel.png")
    },
    {
        name: "我的",
        component: require("../pages/MyScreen").default,
        icon: require("../assets/tab/tab_mine_nor.png"),
        selectIcon: require("../assets/tab/tab_mine_sel.png")
    },
] 

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: 'rgba(3, 178, 75, 1)',
                inactiveTintColor: 'rgba(183, 191, 204, 1)',
                labelStyle: {
                    fontSize: 10,
                    marginBottom:3,
                    fontWeight:'bold'
                },
                tabStyle: {
                    backgroundColor: '#fff',
                    borderRightColor: '#fff',
                },
            }}>
            {
                tabbar.map((item, index) => {
                    return (
                        <Tab.Screen key={index} name={item.name} component={item.component}
                            options={{
                                tabBarIcon: ({ focused }) => (
                                    <Image source={focused ? item.selectIcon : item.icon} style={[styles.image]} />
                                ),
                            }}
                        />
                    )
                })
            }
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 24,
        height: 24,
        marginBottom:-8
    },
});

export default TabNavigator;