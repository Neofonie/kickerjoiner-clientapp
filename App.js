import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { db, connectToWSS, callPlusOne, setGOGOGO, getActiveGames } from "./src/api";
import styles, { Br } from './src/styles';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nickname: 'tim',
            gameid: -1,
            gogogoVisible: false,
            stateText: '',
            socketConnection: false,
            socketEvent: '',
            socketError: '',
            games: [],
        }
    }

    async setupConnection(callback) {
        connectToWSS((state) => {
            console.log("state", state)
            //this.setState({ ...state });
        }, async (data) => {
            console.log('on message: ', data)
            switch (data.message) {
                case 'CONNECTION_ON': // connection with server is on
                    // store date && clientid
                    break;
                case 'GAME_UPDATE': // joined game got an update
                    console.log('Game Update')
                    const games = await getActiveGames();
                    this.setState({ games })
                    break;
                case 'GAME_READY': // joined game got an update
                    this.setState({
                        gogogoVisible: true
                    });
                    break;
            }
        })
    }

    async componentDidMount() {
        console.log('componentDidMount');
        await this.setupConnection();
        const games = await getActiveGames();
        this.setState({ games });

        if (games[0].joiner.length === 4) {
            this.setState({
                gogogoVisible: true
            })
        }
    }

    HRDate(timestamp) {
        const a = new Date(timestamp * 1000);
        const year = a.getFullYear();
        const month = (a.getMonth() + 1).toString().padStart(2, '0');
        const day = a.getDate().toString().padStart(2, '0');
        const hour = a.getHours().toString().padStart(2, '0');
        const min = a.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hour}:${min}`;
    }

    renderGoButton(player, gameID) {
        return (
            player.gogogo
                ? 'GOGOGO'
                : (this.state.gogogoVisible && <Button
                    onPress={() => setGOGOGO(player.nick, gameID)}
                    title="GOGOGO"
                />));
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={this.state.nickname}
                    //onChangeText={(text) => this.setState({ nickname: text })}
                    onKeyPress={(event) => {
                        (event.key === 'ENTER')
                            ? callPlusOne(this.state.nickname)
                            : null
                    }}
                    placeholder="nickname"
                />
                <Button
                    onPress={() => callPlusOne(this.state.nickname)}
                    title="+1"
                />
                {
                    this.state.games.map((game) => (
                        <Fragment>
                            <Text>{game.id}</Text>
                            {game.joiner.map((player) => (
                                <Fragment>
                                    <Text>{player.nick} | {this.HRDate(player.date)} </Text>
                                    {this.renderGoButton(player, game.id)}
                                </Fragment>
                            ))}
                        </Fragment>
                    ))
                }
                <Text style={styles.baseText}>
                    <Br/>
                    <Text style={styles.stateText}>{this.state.socketConnection ? 'connected' : 'no connection'}</Text>
                    <Br/>
                    <Text style={styles.stateText}>{this.state.socketEvent || 'no event'}</Text> <Br/>
                    <Text style={styles.stateText}>{this.state.socketError || 'no error'}</Text> <Br/>
                    <Text style={styles.stateText}>{this.state.stateText || 'no state'}</Text> <Br/>
                </Text>
            </View>
        );
    }
}
