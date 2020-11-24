import React, { Component, Fragment } from 'react';
import Container from "react-native-container/src/index";
import { Button, StyleSheet, Text } from "react-native";
import { HRDate, StylesGlobal, StylesGlobalObj, Colors, Spacing, FontBold, FontSize } from "./styles";
import { setGOGOGO } from "./api";

export default class Games extends Component {

    renderGoButton(player, gameID) {
        const gogogoVisible = (this.props.games && this.props.games.length > 0 && this.props.games[0].joiner.length === 4);
        return (
            <Fragment>
                {!player.gogogo && !gogogoVisible && <Text>+1</Text>}
                {player.gogogo && <Text style={styles.gogogoBtn}>GOGOGO</Text>}
                {!player.gogogo && gogogoVisible && <Button
                    style={styles.cell}
                    onPress={() => setGOGOGO(player.id, gameID)}
                    title="GOGOGO"
                />}
            </Fragment>
        );
    }

    render(props) {
        return (
            <Container>
                {this.props.games.length === 0 && <Text style={styles.nogames}>No Games available. Join one!</Text>}
                {this.props.games.length > 0 && this.props.games.map((game) => (
                    <Container style={styles.games} key={game.id}>
                        <Text
                            style={styles.header}># {game.id} / {HRDate(game.date)}</Text>
                        <Container row style={styles.rowHeader}>
                            <Container size={1} center><Text style={styles.cellH}>ID</Text></Container>
                            <Container size={1} center><Text style={styles.cellH}>CID</Text></Container>
                            <Container size={2} center><Text style={styles.cellH}>Nick</Text></Container>
                            <Container size={3} center><Text style={styles.cellH}>Date</Text></Container>
                            <Container size={3} center><Text style={styles.cellH}>State</Text></Container>
                        </Container>
                        {game.joiner.map((player) => (
                            <Container row key={player.id} style={styles.row}>
                                <Container size={1} center><Text style={styles.cell}>{player.id}</Text></Container>
                                <Container size={1} center><Text style={styles.cell}>{player.clientid}</Text></Container>
                                <Container size={2} center><Text style={styles.cell}>{player.nick}</Text></Container>
                                <Container size={3} center><Text style={styles.cell}>{HRDate(player.date)}</Text></Container>
                                <Container size={3} center>{this.renderGoButton(player, game.id)}</Container>
                            </Container>
                        ))}
                    </Container>
                ))}
            </Container>)
    }
}
const row = {
    padding: Spacing.md,
};
const styles = {
    nogames: row,
    games: {
        backgroundColor: Colors.white,
        color: Colors.black,
        borderRadius: Spacing.borderRadius,
    },
    row: row,
    header: {
        borderTopLeftRadius: Spacing.borderRadius,
        borderTopRightRadius: Spacing.borderRadius,
        backgroundColor: Colors.grey,
        ...FontBold,
        ...FontSize(1),
        ...row,
    },
    rowHeader: {
        backgroundColor: Colors.greyLight,
        paddingLeft: Spacing.md,
        paddingRight: Spacing.md,
    },
    cellH: {
        height: 20,
        ...FontSize(-1),
    },
    cell: {
        height: 40,
        textAlign: 'center',
        backgroundColor: 'red'
    },
    gogogoBtn: {
        width: 100,
    }
};

export const Styles = StyleSheet.create(styles);