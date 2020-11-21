import React, { Component, Fragment } from 'react';
import Container from "react-native-container/src/index";
import { StyleSheet, Text } from "react-native";
import { HRDate } from "./styles";

export default class Games extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gogogoVisible: false,
            games: [],
        }
    }

    render() {
        return (
            <Container style={styles.games}>
                {this.state.games.length === 0 && <Text>No Games available yet. Join one +1</Text>}
                {this.state.games.length > 0 && this.state.games.map((game) => (
                    <Container key={game.id}>
                        <Text
                            style={{ ...styles.gameRow, ...styles.gameHeader }}># {game.id} / {HRDate(game.date)}</Text>
                        <Container row style={{ ...styles.gameRow, ...styles.gameRowHeader }}>
                            <Container size={1}><Text style={styles.center}>Clnt</Text></Container>
                            <Container size={1}><Text>Nick</Text></Container>
                            <Container size={2}><Text style={styles.center}>Date</Text></Container>
                            <Container size={1}><Text style={styles.center}>State</Text></Container>
                        </Container>
                        {game.joiner.map((player) => (
                            <Container row key={player.nick} style={styles.gameRow}>
                                <Container size={1}><Text
                                    style={{ ...styles.gameCell, ...styles.center }}>{player.client_id}</Text></Container>
                                <Container size={1}><Text style={styles.gameCell}>{player.nick}</Text></Container>
                                <Container size={2}><Text
                                    style={styles.gameCell}>{HRDate(player.date)}</Text></Container>
                                <Container size={1}>{this.renderGoButton(player, game.id)}</Container>
                            </Container>
                        ))}
                    </Container>
                ))}
            </Container>)
    }
}

export const styles = StyleSheet.create({
    games: {
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 5,
        marginBottom: 24,
        width: 300,
    },
    gameHeader: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: '#ccc',
        fontWeight: 'bold',
    },
    gameRowHeader: {
        backgroundColor: '#e3e3e3',
    },
    gameRow: {
        padding: 6,
    },
    gameCell: {
        height: 40
    },
});