import React, { Component, Fragment } from 'react';
import { ScrollView } from 'react-native';
import Container from 'react-native-container';
import { connectToWSS, getActiveGames, sendMessage } from "./src/api";
import { Colors, StylesGlobal } from './src/styles';
import Joiner from './src/Joiner';
import Games from './src/Games';
import State from './src/State';

export default class App extends Component {
    state = {
        nickname: '',
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

    async setupConnection() {
        connectToWSS((state) => {
            this.setState({ ...state });
        }, async (data) => {
            console.log('in react', data);
            switch (data.message) {
                case 'CONNECTION_ON': // connection with server is on
                    // store date && clientid
                    sendMessage({
                        message: 'SET_CLIENTNICK',
                        type: ['react'].join(' / '),
                        nick: null,
                    });
                    break;
                case 'GAME_UPDATE': // joined game got an update
                    console.log('GAME_UPDATE')
                    this.setState({ games: await getActiveGames() })
                    break;
                case 'GAME_READY': // joined game got an update
                    console.log('GAME_READY')
                    this.setState({
                        gogogoVisible: true,
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
                <Container row style={{alignItems: 'flex-end'}}>
                    <Joiner {...this.state} setState={(props)=>this.setState({...props})} />
                </Container>
                <Container size={4} style={StylesGlobal.container}>
                    <ScrollView style={{alignSelf: 'stretch'}}>
                        <Games games={this.state.games}/>
                    </ScrollView>
                </Container>
                <Container center style={{alignItems: 'flex-start'}}>
                    <State {...this.state} setupConnection={this.setupConnection} />
                </Container>
            </Container>
        );
    }
}
