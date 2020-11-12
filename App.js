import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { db, connectToWSS, callPlusOne, setGOGOGO, getActiveGames} from "./src/api";


function Br() {
    return '\n';
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.mountedBulli = false;
        this.socket;

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
            this.setState({...state});
        }, async (data) => {
            console.log('on message: ', data)
            switch (data.message) {
                case 'CONNECTION_ON': // connection with server is on
                    // store date && clientid
                    break;
                case 'GAME_UPDATE': // joined game got an update
                console.log('Game Update')
                const games = await getActiveGames();
                this.setState({games})
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
        this.setupConnection();
        const games = await getActiveGames();
        this.setState({games});

        if (games[0].joiner.length === 4) {
            this.setState({
                gogogoVisible: true
            })
        }
    }

     HRDate(timestamp){
        const a = new Date(timestamp * 1000);
        const year = a.getFullYear();
        const monthRaw = a.getMonth();
        const day = a.getDate();
        const hour = a.getHours();
        const min = a.getMinutes();
        return `${day}.${monthRaw + 1}.${year} ${hour}:${min}`;
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
                    onChangeText={(text) => this.setState({nickname: text})}
                    onKeyPress={(event) => {
                        (event.key === 'ENTER')
                            ? callPlusOne(this.state.nickname)
                            : null
                    }}
                    placeholder="nickname"
                />
                {<Button
                    onPress={() => callPlusOne(this.state.nickname)}
                    title="+1"
                />}

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
