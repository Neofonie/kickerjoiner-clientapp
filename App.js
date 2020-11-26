import React, { Component } from 'react';
import { ScrollView, Text, Platform } from 'react-native';
import Container from 'react-native-container';
import { connectToWSS, getActiveGames, sendMessage } from "./src/api";
import { Colors, StylesGlobal, Br, FontBold } from './src/styles';
import Joiner, { StylesJoiner } from './src/Joiner';
import Games from './src/Games';
import State from './src/State';

export default class App extends Component {
    state = {
        nickname: '',
        gameid: -1,
        stateText: '',
        games: [],
        socket: {
            connection: false,
            lastEvent: '',
            error: '',
        },
    }

    async setupConnection() {
        connectToWSS((state) => {
            this.setState({ ...state });
        }, async (data) => {
            console.log('new message from server', data);
            switch (data.message) {
                case 'CONNECTION_ON': // connection with server is on
                    // store date && clientid
                    sendMessage({
                        message: 'SET_CLIENTNICK',
                        type: ['react', Platform.OS].join(' / '),
                        nick: null,
                    });
                    break;
                case 'GAME_UPDATE': // joined game got an update
                    this.setState({ games: await getActiveGames() })
                    break;
                case 'GAME_READY': // joined game got an update
                    this.setState({
                        games: await getActiveGames()
                    });
                    break;
                case 'GAME_GOGOGO': // all four joiners pressed gogogo in one game
                    this.setState({
                        games: await getActiveGames()
                    });
                    break;
            }
        })
    }

    async componentDidMount() {
        await this.setupConnection();
        const games = await getActiveGames();
        this.setState({ games });
    }

    render() {
        return (
            <Container style={{backgroundColor: Colors.red,}}>
                <Container col style={StylesGlobal.container}>
                    <Br />
                    <Text style={StylesJoiner.text}>Joiner</Text>
                    <Container row style={{alignItems: 'flex-end'}}>
                        <Joiner {...this.state} setState={(props)=>this.setState({...props})} />
                    </Container>
                </Container>
                <Container size={4} style={StylesGlobal.container}>
                    <Text style={StylesJoiner.text}>Games</Text>
                    <ScrollView style={{alignSelf: 'stretch'}}>
                        <Games games={this.state.games}/>
                    </ScrollView>
                    <Text style={{ color: Colors.white, ...FontBold }}>
                        TODO:<Br />
                        * Client name + Storage<Br />
                        * GOGOGO Button + GOGOGO Overlay<Br />
                        * Delete Game + Joiner<Br />
                        * Pushnotification<Br />
                    </Text>
                </Container>
                <Container col style={StylesGlobal.container}>
                    <Text style={StylesJoiner.text}>State</Text>
                    <Container center style={{alignItems: 'flex-start'}}>
                        <State {...this.state} setupConnection={this.setupConnection} />
                    </Container>
                </Container>
            </Container>
        );
    }
}
