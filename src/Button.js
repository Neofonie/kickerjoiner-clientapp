import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Text } from "react-native";
import { Colors, Spacing } from "./styles";

export default class Button extends Component {
    render() {
        return (
            <TouchableHighlight style={{...StylesButton.button, ...this.props.style}} onPress={() => this.props.onPress()}>
                <Text style={{...StylesButton.title, ...this.props.styleTitle}}>{this.props.title}</Text>
            </TouchableHighlight>
        )
    }
}
export const StylesButton = StyleSheet.create({
    button: {
        backgroundColor: Colors.grey,
        borderRadius: Spacing.borderRadius,
    },
    title: {
        padding: Spacing.md,
        color: Colors.black,
        textAlign: 'center',
    }
});