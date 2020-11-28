import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import Container from 'react-native-container';
import SyncStorage from 'sync-storage';
import { connectToWSS, getActiveGames, sendClientNick } from "./src/api";
import { Colors, StylesGlobal, Br, FontBold, Spacing } from './src/styles';
import Joiner, { StylesJoiner } from './src/Joiner';
import Games from './src/Games';
import State from './src/State';

export default class App extends Component {
    state = {
        nickname: '',
        clientnick: '',
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
            //console.log('new message from server', data);
            switch (data.message) {
                case 'CONNECTION_ON': // connection with server is on
                    // store date && clientid
                    sendClientNick(null);
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

    async UNSAFE_componentWillMount() {
        const data = await SyncStorage.init();
        console.log('AsyncStorage is ready!', data);
    }

    async componentDidMount() {
        await this.setupConnection();
        const games = await getActiveGames();
        this.setState({ games });
    }

    render() {
        return (
            <Container style={{ backgroundColor: Colors.red, }}>
                <ScrollView style={{ alignSelf: 'stretch', paddingTop: Spacing.xxl }}>
                    <Container col style={{ ...StylesGlobal.container }}>
                        <Text style={{ color: Colors.white, ...FontBold }}>
                            TODO:<Br/>
                            * https://github.com/lukeed/sockette <Br />
                            * Pushnotification<Br/>
                        </Text>
                        <Text style={StylesGlobal.text}>Joiner</Text>
                        <Joiner {...this.state} setState={(props) => this.setState({ ...props })}/>
                    </Container>
                    <Container style={StylesGlobal.container}>
                        <Text style={StylesGlobal.text}>Games</Text>
                        <Games games={this.state.games}/>
                    </Container>
                    <Container col style={StylesGlobal.container}>
                        <Text style={StylesGlobal.text}>Clients</Text>
                        <State {...this.state} setState={(props) => this.setState({ ...props })}
                               setupConnection={this.setupConnection}/>
                    </Container>
                </ScrollView>
            </Container>
        );
    }
}
