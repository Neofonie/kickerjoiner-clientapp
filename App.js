import React, { Component, Fragment } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import Container from 'react-native-container';
import { connectToWSS, callPlusOne, setGOGOGO, getActiveGames } from "./src/api";
import { styles, Br } from './src/styles';
import Games from './src/Games';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nickname: 'peter',
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

        if (games && games.length > 0 && games[0].joiner.length === 4) {
            this.setState({
                gogogoVisible: true
            })
        }
    }

    renderGoButton(player, gameID) {
        return (
            <Fragment>
                {!player.gogogo && !this.state.gogogoVisible && <Text style={styles.center}>+1</Text>}
                {player.gogogo && <Text style={styles.center}>GOGOGO</Text>}
                {!player.gogogo && this.state.gogogoVisible && <Button
                    style={styles.gameCell}
                    onPress={() => setGOGOGO(player.nick, gameID)}
                    title="GOGOGO"
                />}
            </Fragment>
        );
    }

    renderJoiner() {
        return (
            <Fragment>
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
                <Button
                    onPress={() => callPlusOne(this.state.nickname)}
                    title="+1"
                />
            </Fragment>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Container col>
                    <Container size={2} style={styles.container} row>
                        {this.renderJoiner()}
                    </Container>
                    <Container>
                        <Games games={this.state.games} />
                    </Container>
                    <Container size={2}>
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
