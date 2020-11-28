import React, { Component, Fragment } from 'react';
import Container from "react-native-container/src/index";
import { StyleSheet, Text } from "react-native";
import { Br, HRDate, StylesGlobalObj, Colors, Spacing, FontBold, FontSize } from "./styles";
import { setGOGOGO, deleteGame, deleteJoiner } from "./api";
import Icon from "./Icon";
import Button from './Button';

export default class Games extends Component {

    renderGogogoOverlay(game) {
        if (!game.done) {
            return null;
        }
        return (
            <Container style={styles.gogogoOverlay} center>
                <Text style={styles.gogogoOverlayLabel}>
                    GOGOGO<Br/>
                    <Text style={styles.gogogoOverlayLabelDate}>{HRDate(game.donedate)}</Text>
                </Text>
            </Container>
        )
    }

    renderGameDeleteButton(game) {
        return (
            <Container row style={styles.deleteBtnWrap}>
                {game.done && <Icon
                    style={{ ...styles.deleteGameBtnGameDoneShadow }}
                    fa="trash-alt"/>}
                <Icon
                    style={{ ...(game.done && styles.deleteGameBtnGameDone) }}
                    fa="trash-alt"
                    onPress={() => deleteGame(game.id)}/>
            </Container>
        )
    }

    renderGoButton(player, gameID) {
        const gogogoVisible = (this.props.games && this.props.games.length > 0 && this.props.games[0].joiner.length === 4);
        return (
            <Fragment>
                {!player.gogogo && !gogogoVisible && <Text style={styles.cell}>+1</Text>}
                {player.gogogo && <Text style={styles.gogogoBtnDone}>GOGOGO</Text>}
                {!player.gogogo && gogogoVisible && <Button
                    style={styles.gogogoBtn}
                    styleTitle={styles.gogogoBtnTitle}
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
                        {this.renderGogogoOverlay(game)}
                        {this.renderGameDeleteButton(game)}
                        <Container row style={styles.header}>
                            <Text style={styles.headerText}>
                                # {game.id} / {HRDate(game.date)}
                            </Text>
                        </Container>
                        <Container row style={styles.rowHeader}>
                            <Container size={1}><Text style={styles.cellH}>ID</Text></Container>
                            <Container size={1}><Text style={styles.cellH}>CID</Text></Container>
                            <Container size={3}><Text style={styles.cellH}>Nick</Text></Container>
                            <Container size={3} center><Text style={styles.cellH}>Date</Text></Container>
                            <Container size={3}><Text style={styles.cellH}>State</Text></Container>
                            <Container size={1}/>
                        </Container>
                        {game.joiner.map((player, index) => (
                            <Container row key={player.id}
                                       style={{
                                           ...styles.rowJoiner,
                                           ...styles[(index % 2 === 0) ? 'even' : 'odd'],
                                           ...(styles[index + 1 === game.joiner.length ? 'last' : ''])
                                       }}
                            >
                                <Container size={1}><Text>{player.id}</Text></Container>
                                <Container size={1}><Text>{player.clientid}</Text></Container>
                                <Container size={3}><Text>{player.nick}</Text></Container>
                                <Container size={3} center><Text
                                    style={styles.date}>{HRDate(player.date)}</Text></Container>
                                <Container size={3} center>{this.renderGoButton(player, game.id)}</Container>
                                <Container size={1} center>
                                    <Icon fa="trash-alt" onPress={() => deleteJoiner(player.id, game.id)}/></Container>
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
const redTextShadow = {
    textShadowColor: Colors.red,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
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
        position: 'relative',
        backgroundColor: Colors.white,
        color: Colors.black,
        borderRadius: Spacing.borderRadius,
        marginBottom: Spacing.md,
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
    deleteBtnWrap: {
        position: 'absolute',
        zIndex: 2,
        right: Spacing.sm,
        top: Spacing.sm,
        padding: Spacing.md,
    },
    deleteGameBtnGameDone: {
        color: Colors.white,
        zIndex: 2,
        position: 'absolute',
        right: 0,
    },
    deleteGameBtnGameDoneShadow: {
        color: Colors.red,
        zIndex: 1,
        position: 'absolute',
        top: 2,
        right: -2,
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
    last: {
        borderBottomLeftRadius: Spacing.borderRadius,
        borderBottomRightRadius: Spacing.borderRadius,
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
        ...StylesGlobalObj.center,
    },
    gogogoBtn: {
        backgroundColor: Colors.red,
    },
    gogogoBtnTitle: {
        color: Colors.white,
    },
    gogogoBtnDone: {
        width: 100,
        ...StylesGlobalObj.center,
        color: Colors.green,
    },
    gogogoOverlay: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: Colors.white,
        borderRadius: Spacing.borderRadius,
    },
    gogogoOverlayLabel: {
        ...FontSize(2),
        ...FontBold,
        textAlign: 'center',
        color: Colors.white,
        ...redTextShadow,
        transform: [{ rotate: '-33deg' }],
    },
    gogogoOverlayLabelDate: {
        ...FontSize(0),
    },
};

export const StylesGames = StyleSheet.create(styles);