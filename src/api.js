import { Platform } from "react-native";
import SyncStorage from 'sync-storage';
// https://github.com/websockets/ws#how-to-detect-and-close-broken-connections

const onlineApi = 'https://kij.willy-selma.de/db';
export const wsApi = 'wss://kij.willy-selma.de/ws';

// client part
let pingTimeout = null;
let socket;

export function heartbeat(socket) {
    console.log('heartbeat');
    if (pingTimeout !== null) {
        clearTimeout(pingTimeout);
    }

    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    pingTimeout = setTimeout(() => {
        if (socket) {
            console.log('heartbeat.terminate');
            socket.terminate();
        }
    }, 30000 + 1000);
}

/**
 *  sendMessage({
            message: 'PLUS_ONE',
            nick: nickname || 'willy',
        });
 * @param data
 */
export function sendMessage(data) {
    //console.log('sendMessage', data)
    if (socket) {
        socket.send(JSON.stringify(data));
    }
}

export function connectToWSS(setState, onMessage) {
    setState({
        socketEvent: 'connectToWSS',
        socketConnection: false,
    });

    console.log('connectToWSS', wsApi);
    socket = new WebSocket(wsApi);

    socket.onmessage = async (event) => {
        const data = event.data;
        onMessage(JSON.parse(data));
    }
    socket.onopen = () => {
        setState({
            socketEvent: 'open',
            socketConnection: true,
        });
        heartbeat();
    };
    socket.onping = heartbeat;
    socket.onerror = (e) => {
        console.log('socket.error', e);
        setState({
            socketEvent: 'error',
            socketConnection: false,
            socketError: e,
        });
    };
    socket.onclose = (e) => {
        console.log('socket.close', e);
        clearTimeout(pingTimeout);
        setState({
            socketEvent: 'close',
            socketConnection: false,
        });
    };

    console.log('connectToWSS done');
}

export function getTimestampNow() {
    return Math.floor(Date.now() / 1000);
}

/**
 * const game = await db('GET', '/games/' + data.gameid);
 */
export async function db(method, url, data) {
    return await fetch(onlineApi + url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
}

export function callPlusOne(nick) {
    sendMessage({
        message: 'PLUS_ONE',
        nick: nick || 'anonymous',
    });
}

export async function setGOGOGO(joinerID, gameID) {
    sendMessage({
        message: 'GOGOGO',
        gameid: gameID,
        joinerid: joinerID,
    });
}

export async function deleteGame(gameID) {
    await db('DELETE', '/games/' + gameID);

    sendMessage({
        message: 'GAME_UPDATE',
        gameid: gameID,
        reason: 'delete game',
    });
}

export async function deleteJoiner(joinerID, gameID) {
    const game = await db('GET', '/games/' + gameID);
    const filteredJoiner = game.joiner.filter((player) => (player.id !== joinerID));
    await db('PATCH', '/games/' + gameID, {
        joiner: filteredJoiner,
    });

    sendMessage({
        message: 'GAME_UPDATE',
        gameid: gameID,
        joinerid: joinerID,
        reason: 'delete joiner',
    });
}

export async function getActiveGames() {
    const showLastHourGames = getTimestampNow() - 3600; // 3600 = 1h in sec
    //const games = await db('GET', `/games?donedate_gte=${showLastHourGames}&_sort=date&_order=desc`);
    const games = await db('GET', `/games?_sort=date&_order=desc`);
    //console.log('games', games)
    return games;
}

export function sendClientNick(nickname) {
    if (nickname) {
        SyncStorage.set('clientnick', nickname);
        sendMessage({
            message: 'SET_CLIENTNICK',
            type: ['react', Platform.OS].join(' / '),
            nick: nickname,
        });
    }
}