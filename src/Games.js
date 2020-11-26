import React, { Component, Fragment } from 'react';
import Container from "react-native-container/src/index";
import { Button, StyleSheet, Text } from "react-native";
import { HRDate, StylesGlobalObj, Colors, Spacing, FontBold, FontSize } from "./styles";
import { setGOGOGO, deleteGame } from "./api";
import Icon from "./Icon";

export default class Games extends Component {
    // componentWillUnmount
    renderGoButton(player, gameID) {
        const gogogoVisible = (this.props.games && this.props.games.length > 0 && this.props.games[0].joiner.length === 4);
        return (
            <Fragment>
                {!player.gogogo && !gogogoVisible && <Text style={styles.cell}>+1</Text>}
                {player.gogogo && <Text style={styles.gogogoDone}>GOGOGO</Text>}
                {!player.gogogo && gogogoVisible && <Button
                    color={Colors.red}
                    onPress={() => setGOGOGO(player.id, gameID)}
                    title="GOGOGO"
                />}
            </Fragment>
        );
    }

    render(props) {
        return (
            <Container style={styles.wrap}>
                {this.props.games.length === 0 && <Text style={styles.nogames}>No Games available. Join one!</Text>}
                {this.props.games.length > 0 && this.props.games.map((game) => (
                    <Container style={styles.games} key={game.id}>
                        <Container row style={styles.header}>
                            <Container size={1}>
                                <Text style={styles.headerText}>
                                    # {game.id} / {HRDate(game.date)}
                                </Text>
                            </Container>
                            <Icon fa="trash-alt" style={styles.deleteGameBtn} secondaryColor="red" onPress={() => deleteGame(game.id)} />
                        </Container>
                        <Container row style={styles.rowHeader}>
                            <Container size={1} center><Text style={styles.cellH}>ID</Text></Container>
                            <Container size={1} center><Text style={styles.cellH}>CID</Text></Container>
                            <Container size={2} center><Text style={styles.cellH}>Nick</Text></Container>
                            <Container size={3} center><Text style={styles.cellH}>Date</Text></Container>
                            <Container size={3} center><Text style={styles.cellH}>State</Text></Container>
                            <Container size={1} />
                        </Container>
                        {game.joiner.map((player, index) => (
                            <Container row key={player.id} style={{ ...styles.rowJoiner, ...styles[(index%2 === 0) ? 'even' : 'odd'] }}>
                                <Container size={1} center><Text style={styles.cell}>{player.id}</Text></Container>
                                <Container size={1} center><Text style={styles.cell}>{player.clientid}</Text></Container>
                                <Container size={2} center><Text style={styles.cell}>{player.nick}</Text></Container>
                                <Container size={3} center><Text style={styles.date}>{HRDate(player.date)}</Text></Container>
                                <Container size={3} center>{this.renderGoButton(player, game.id)}</Container>
                                <Container size={1} center><Icon fa="trash-alt" /></Container>
                            </Container>
                        ))}
                    </Container>
                ))}
            </Container>)
    }
}
const row = {
    padding: Spacing.sm,
};
const styles = {
    wrap: {
        paddingBottom: Spacing.lg,
    },
    nogames: {
        color: Colors.white,
        ...row,
    },
    games: {
        backgroundColor: Colors.white,
        color: Colors.black,
        borderRadius: Spacing.borderRadius,
    },
    header: {
        borderTopLeftRadius: Spacing.borderRadius,
        borderTopRightRadius: Spacing.borderRadius,
        backgroundColor: Colors.grey,
        ...row,
    },
    headerText: {
        ...FontBold,
        ...FontSize(1),
    },
    deleteGameBtn: {
        margin: Spacing.md,
    },
    rowHeader: {
        backgroundColor: Colors.greyLight,
        paddingLeft: Spacing.md,
        paddingRight: Spacing.md,
    },
    cellH: {
        height: 20,
        ...FontBold,
        ...FontSize(-1),
    },
    row: row,
    even: {
        backgroundColor: Colors.white,
    },
    odd: {
        backgroundColor: Colors.greyLight,
    },
    rowJoiner: {
        height: 40,
        ...row,
    },
    cell: {
        ...StylesGlobalObj.center,
    },
    date: {
        ...FontSize(-1),
    },
    gogogoDone: {
        width: 100,
        ...StylesGlobalObj.center,
        color: Colors.green,
    }
};

export const Styles = StyleSheet.create(styles);