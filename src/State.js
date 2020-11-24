import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from "react-native";
import { Br, Colors, StylesGlobalObj, Spacing } from "./styles";

export default class State extends Component {
    render () {
        return (
            <View>
                <Button
                    onPress={() => this.props.setupConnection()}
                    title="reconnect"
                />
                <Text style={StylesState.text}>
                    <Text>{this.props.socketConnection ? 'connected' : 'no connection'}</Text> <Br/>
                    <Text>{this.props.socketEvent || 'no event'}</Text> <Br/>
                    <Text>{this.props.socketError || 'no error'}</Text> <Br/>
                    <Text>{this.props.stateText || 'no state'}</Text> <Br/>
                </Text>
            </View>
        )
    }
}

export const StylesState = StyleSheet.create({
    text: {
        marginTop: Spacing.lg,
        color: Colors.black,
        ...StylesGlobalObj.center,
    },
});