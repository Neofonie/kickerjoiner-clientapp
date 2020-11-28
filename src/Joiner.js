import React, { Component } from 'react';
import { StyleSheet, TextInput, Text } from "react-native";
import Container from 'react-native-container';
import { StylesGlobalObj, Colors, FontSize, FontBold, Spacing } from "./styles";
import { callPlusOne } from "./api";
import Button from './Button';

export default class Joiner extends Component {
    render() {
        return (
            <Container row style={StylesJoiner.wrap}>
                <TextInput
                    style={StylesJoiner.input}
                    onChangeText={(text) => this.props.setState({ nickname: text })}
                    onKeyPress={(event) => {
                        (event.key === 'ENTER')
                            ? callPlusOne(this.props.nickname)
                            : null
                    }}
                    value={this.props.nickname}
                    placeholder="nickname"
                />
                <Button
                    style={StylesJoiner.button}
                    onPress={() => callPlusOne(this.props.nickname)}
                    title="+1"
                />
            </Container>
        )
    }
}

export const StylesJoiner = StyleSheet.create({
    wrap: {
    },
    input: {
        ...StylesGlobalObj.input,
        width: 200,
        height: 35,
        backgroundColor: Colors.white,
        borderRadius: Spacing.borderRadius,
        marginRight: Spacing.md,
    },
    button: {
        borderRadius: Spacing.borderRadius,
    }
});
