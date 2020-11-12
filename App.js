import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { db, connectToWSS, callPlusOne, callGOGOGO} from "./src/api";

function Br() {
    return '\n';
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.mountedBulli = false;
        this.socket;

        this.state = {
            nickname: '',
            gameid: -1,
            gogogoVisible: false,
            stateText: '',
            socketConnection: false,
            socketEvent: '',
            socketError: '',
        }
    }

    async setupConnection(callback) {
        connectToWSS((state) => {
            this.setState({...state});
        })
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.setupConnection();
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({nickname: text})}
                    onKeyPress={(event) => {
                        (event.key === 'ENTER')
                            ? callPlusOne(this.state.nickname)
                            : null
                    }}
                    placeholder="nickname"
                />
                {!this.state.gogogoVisible && <Button
                    onPress={() => callPlusOne(this.state.nickname)}
                    title="+1"
                />}
                {this.state.gogogoVisible && <Button
                    onPress={() => callGOGOGO(this.state.gameid)}
                    title="GOGOGO"
                />}
                <Button
                    onPress={() => this.setupConnection()}
                    title="reconnect"
                />
                <Text style={styles.baseText}>
                    <Br/>
                    <Text style={styles.stateText}>{this.state.socketConnection ? 'connected' : 'no connection'}</Text> <Br/>
                    <Text style={styles.stateText}>{this.state.socketEvent || 'no event'}</Text> <Br/>
                    <Text style={styles.stateText}>{this.state.socketError || 'no error'}</Text> <Br/>
                    <Text style={styles.stateText}>{this.state.stateText || 'no state'}</Text> <Br/>
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CA0000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    baseText: {
        color: '#fff',
        textAlign: 'center',
    },
    stateText: {
        color: '#000',
    },
});
