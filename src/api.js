// https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
const onlineApi = 'https://kij.willy-selma.de/db';
const wsApi = 'wss://kij.willy-selma.de/ws';

// client part
let pingTimeout = null;
let socket;

export function heartbeat() {
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
    console.log('sendMessage', data, socket)
    if (socket) {
        socket.send(JSON.stringify(data));
    }
}

export function connectToWSS(setState) {
    setState({
        socketConnection: false,
    });
    console.log('connectToWSS', wsApi);
    socket = new WebSocket(wsApi);

    socket.on('message', async (json) => {
        console.log('socket.message', json);
        const data = JSON.parse(json);
        console.log(data);
        switch (data.message) {
            case 'CONNECTION_ON': // connection with server is on
                // store date && clientid
                break;
            case 'GAME_UPDATE': // joined game got an update
                                // store data.gameid to compare joined game
                                // ----
                                // GET fetch /db/games/data.gameid
                const game = await db('GET', '/games/' + data.gameid);
                setState({stateText: JSON.stringify(game, null, 2), gameid: data.gameid});
                // refresh state to rerender
                break;
            case 'GAME_READY': // four joiners in one game
                // now activate gogogo button
                setState({gogogoVisible: true, gameid: data.gameid});
                // vibrate app
                // ----
                // GET fetch /db/games/data.gameid
                // refresh state to rerender
                break;
            case 'GAME_GOGOGO': // all four joiners pressed gogog in one game
                                // vibrate app
                                // gogogo screen
                                // ----
                                // GET fetch /db/games/data.gameid
                                // refresh state to rerender
                                // ----
                                // clear state for new game
                break;
        }
    });

    socket.on('open', () => {
        heartbeat();
        setState({
            socketConnection: true,
        });
    });
    socket.on('ping', heartbeat);
    socket.on('error', (e) => {
        console.log('socket.error', e);
        setState({
            socketError: e,
        });
    });
    socket.on('close', (e) => {
        console.log('socket.close', e);
        clearTimeout(pingTimeout);
        setState({
            socketConnection: false,
        });
    });

    return socket;
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

export function callGOGOGO(gameid) {
    sendMessage({
        message: 'GOGOGO',
        gameid: gameid,
    });
}