import React, { Component } from 'react';
import { StyleSheet, Text, TextInput } from "react-native";
import Container from "react-native-container/src/index";
import SyncStorage from 'sync-storage';
import { Br, Colors, StylesGlobalObj, Spacing } from "./styles";
import { sendClientNick } from "./api";
import { StylesJoiner } from "./Joiner";
import Button from "./Button";

export default class State extends Component {

    async componentDidMount() {
        const storageNickName = SyncStorage.get('clientnick');
        this.props.setState({ clientnick: storageNickName });
        sendClientNick(storageNickName);
    }

    render() {
        return (
            <Container style={StylesState.wrap}>
                <Container row style={StylesJoiner.wrap}>
                    <TextInput
                        style={StylesJoiner.input}
                        onChangeText={(value) => this.props.setState({ clientnick: value })}
                        onKeyPress={(event) => {
                            (event.key === 'ENTER')
                                ? sendClientNick(this.props.clientnick)
                                : null
                        }}
                        value={this.props.clientnick}
                        placeholder="clientname"
                    />
                    <Button
                        style={StylesJoiner.button}
                        onPress={() => sendClientNick(this.props.clientnick)}
                        title="Set your clientname"
                    />
                </Container>
                <Container>
                    <Br/>
                    {/*<Button

                        onPress={() => this.props.setupConnection()}
                        title="reconnect"
                    />*/}
                    <Text style={StylesState.text}>
                        <Text>{this.props.socketConnection ? 'connected' : 'no connection'}</Text> <Br/>
                        <Text>{this.props.socketEvent || 'no event'}</Text> <Br/>
                        <Text>{this.props.socketError || 'no error'}</Text> <Br/>
                        <Text>{this.props.stateText || 'no state'}</Text> <Br/>
                    </Text>
                </Container>
            </Container>
        )
    }
}

export const StylesState = StyleSheet.create({
    wrap: {
        alignItems: 'flex-start'
    },
    text: {
        color: Colors.white,
    },
});