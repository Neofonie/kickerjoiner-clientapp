import React, { Component, Fragment } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import Container from 'react-native-container';
import { StatusBar } from 'expo-status-bar';
import { connectToWSS, callPlusOne, setGOGOGO, getActiveGames } from "./src/api";
import styles, { Br, HRDate } from './src/styles';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nickname: 'tim',
            gameid: -1,
            gogogoVisible: false,
            stateText: '',
            games: [],
            socket: {
                connection: false,
                lastEvent: '',
                error: '',
            },
        }
    }

    async setupConnection(callback) {
        connectToWSS((state) => {
            this.setState({ ...state });
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

    renderGoButton(player, gameID) {
        return (
            <Fragment>
                {player.gogogo && <Text>GOGOGO</Text>}
                {!player.gogogo && this.state.gogogoVisible && <Button
                    onPress={() => setGOGOGO(player.nick, gameID)}
                    title="GOGOGO"
                />}
            </Fragment>
        );
    }

    renderGames() {
        return (this.state.games.map((game) => (
            <Container key={game.id}>
                <Text># {game.id} / {HRDate(game.date)}</Text>
                {game.joiner.map((player) => (
                    <Container row>
                        <Container><Text>{player.nick}</Text></Container>
                        <Container size={1}><Text>{HRDate(player.date)}</Text></Container>
                        <Container>{this.renderGoButton(player, game.id)}</Container>
                    </Container>
                ))}
            </Container>
        )));
    }

    render() {
        return (
            <View style={styles.container}>
                <Container col>
                    <Container size={2} style={{ ...styles.container }} row>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => this.setState({ nickname: text })}
                            onKeyPress={(event) => {
                                (event.key === 'ENTER')
                                    ? callPlusOne(this.state.nickname)
                                    : null
                            }}
                            value={this.state.nickname}
                            placeholder="nickname"
                        />
                        {!this.state.gogogoVisible && <Button
                            onPress={() => callPlusOne(this.state.nickname)}
                            title="+1"
                        />}
                    </Container>
                    <Container size={2}>
                        {this.renderGames()}
                    </Container>
                    <Container col>
                        <Button
                            onPress={() => this.setupConnection()}
                            title="reconnect"
                        />
                        <Text style={styles.baseText}>
                            <Br/>
                            <Text
                                style={styles.stateText}>{this.state.socketConnection ? 'connected' : 'no connection'}</Text>
                            <Br/>
                            <Text style={styles.stateText}>{this.state.socketEvent || 'no event'}</Text> <Br/>
                            <Text style={styles.stateText}>{this.state.socketError || 'no error'}</Text> <Br/>
                            <Text style={styles.stateText}>{this.state.stateText || 'no state'}</Text> <Br/>
                        </Text>
                    </Container>
                </Container>
            </View>
        );
    }
}
