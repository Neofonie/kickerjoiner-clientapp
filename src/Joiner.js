import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, Text } from "react-native";
import Container from 'react-native-container';
import { StylesGlobal, Colors, FontSize, FontBold } from "./styles";
import { callPlusOne } from "./api";

export default class Joiner extends Component {
    render() {
        return (
            <Container center style={StylesJoiner.wrap}>
                <Container row center style={StylesJoiner.inputGroup}>
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
                        onPress={() => callPlusOne(this.props.nickname)}
                        title="+1"
                    />
                </Container>
            </Container>
        )
    }
}

export const StylesJoiner = StyleSheet.create({
    input: {
        ...StylesGlobal.input,
        width: 200,
    },
    wrap: {
        // borderColor: '#fff',
        // borderWidth: 1,
        height: 100,
    },
    text: {
        color: Colors.white,
        ...FontBold,
        ...FontSize(1),
    },
    inputGroup: {

    }
});
