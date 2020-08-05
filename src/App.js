import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, PermissionsAndroid, AsyncStorage} from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import BackgroundTask from 'react-native-background-task';
// https://github.com/react-native-community/react-native-netinfo
import NetInfo from '@react-native-community/netinfo';
// https://stackoverflow.com/questions/45273616/how-to-receive-messages-in-fore-background-react-native

const date = new Date();
const onlineApi = 'http://api.willy-selma.de/sms/state';
//Token: 12345 / SMS-Code = PIN Token
//`ws://${ip}:${port}`;
let URL = '';
let socket = null;
let SMSReadSubscription = null;
let data = {};
const BackgroundPeriod = 1800;// Default is 900 (15 minutes)

BackgroundTask.define(async () => {
  //if ((await NetInfo.fetch()).isConnected) {
  // reconnect to wss
  // send sms
  //}
  // socket.send('im alive my dear :D');
  BackgroundTask.finish();
});

function Br() {
  return '\n';
}

const getDesktopAppIp = async function () {
  console.log('getDesktopAppIp', onlineApi);
  return fetch(onlineApi, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(json => {
      data = json;
      return true;
    });
};

let pingTimeout = null;

// https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
function heartbeat() {
  if (pingTimeout !== null) {
    clearTimeout(pingTimeout);
  }

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.
  pingTimeout = setTimeout(() => {
    if (socket) {
      socket.terminate();
    }
  }, 30000 + 1000);
}

const initWebsocket = async function (whoIs) {
  console.log('initWebsocket', whoIs);
  // if (socket !== null) {
  //   socket.terminate();
  // }
  /*
     {"i": {"WLAN 2": "192.168.178.44"}, "p": 1337}
     {"i": {"Ethernet 2": "172.27.254.22", "WLAN 2": "192.168.211.20"}, "p": 1337}
  */
  const ips = Object.keys(data.i).filter((ipName) => ipName.startsWith('WLAN'));
  const ip = ips[0];
  URL = `ws://${data.i[ip]}:${data.p}`;
  socket = new WebSocket(URL);

  return socket;
};

const sendToken = function (message) {
  console.log('Message:', message);
  //message.body will be the message.
  //message.originatingAddress will be the address.
  // Token: 12345 / SMS-Code = PIN Token
  socket.send(message.body);
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermissionNetwork: false,
      hasPermissionRead: false,
      hasPermissionRecieve: false,
      isConnectingToLaptop: false,
      initWebsocketDone: false,
      isConnectedToLaptop: false,
      isConnectedWithInternet: false,
      serverMessage: '',
      lastSms: '',
      websocket: URL,
      socketError: '',
    };

    NetInfo.addEventListener(state => {
      this.setState({isConnectedWithInternet: state.isConnected});
    });

    SMSReadSubscription = SmsListener.addListener(async (message) => {
      //if (socket !== null) {
      // const message = await AsyncStorage.getItem('@MyApp:key')
      if (!this.state.isConnectingToLaptop && !this.state.isConnectedToLaptop
        || !this.state.isConnectedToLaptop) {
        await this.doInitWebsocket(() => {
          sendToken(message);
        });
      } else {
        sendToken(message);
      }

      this.setState({lastSms: message.body});
    });
  }

  async askForPermission(permission, title, message) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS[permission],
      {
        title,
        message,
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  async requestReadSmsPermission() {
    try {
      //////
      const grantedRead = await this.askForPermission(
        'READ_SMS',
        'Token read',
        'need access to read sms',
      );
      if (grantedRead) {
        console.log('sms read granted', grantedRead);
        this.setState({hasPermissionRead: true});
      }
      //////
      const grantedRecieve = await this.askForPermission(
        'RECEIVE_SMS',
        'Token recieve',
        'need access to recieve sms',
      );
      if (grantedRecieve) {
        console.log('sms recieve granted', grantedRecieve);
        this.setState({hasPermissionRecieve: true});
      }
    } catch (err) {
      console.log(err);
    }
  }

  async doInitWebsocket(callback) {
    this.setState({
      isConnectingToLaptop: false,
      isConnectedToLaptop: false,
      initWebsocketDone: false,
      serverMessage: '',
      socketError: '',
    });

    await getDesktopAppIp();

    this.setState({isConnectingToLaptop: true});

    const socket = await initWebsocket('Component');

    this.setState({initWebsocketDone: true, websocket: URL});

    socket.onmessage = (event) => {
      const data = event.data;
      console.log('component socket.onmessage', data);
      this.setState({serverMessage: data});
    };

    socket.onopen = () => {
      console.log('component socket.onopen');
      this.setState({isConnectedToLaptop: true});

      if (callback) {
        callback();
      }
      heartbeat();
    };
    socket.onclose = () => {
      console.log('component socket.onclose');
      clearTimeout(pingTimeout);
      this.setState({
        isConnectingToLaptop: false,
        isConnectedToLaptop: false,
      });
    };
    socket.onerror = (e) => {
      console.log(e.message);
      this.setState({
        isConnectingToLaptop: false,
        isConnectedToLaptop: false,
        socketError: e.message,
      });
    };
    socket.onping = heartbeat;
  }

  async componentDidMount() {
    console.log('componentDidMount');
    BackgroundTask.schedule({
      period: BackgroundPeriod,
    });

    await this.requestReadSmsPermission();

    await this.doInitWebsocket();
  }

  componentWillUnmount() {
    // remove listener
    SMSReadSubscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.baseText}>
          Hello SMS {date.toLocaleDateString()} {date.toLocaleTimeString()} <Br/>
          Can read SMS: {this.state.hasPermissionRead ? 'yes' : 'no'} <Br/>
          Can recieve SMS: {this.state.hasPermissionRecieve ? 'yes' : 'no'} <Br/>
          Connected with Internet: {this.state.isConnectedWithInternet ? 'yes' : 'no'} <Br/>
          Try connecting Laptop: {this.state.isConnectingToLaptop ? 'yes' : 'no'} <Br/>
          Connected with Laptop: {this.state.isConnectedToLaptop ? 'yes' : 'no'} <Br/>
        </Text>
        <Button
          onPress={() => {
            this.doInitWebsocket();
          }}
          title="Reload Connection to SMS Reciever"
          color="#D73A49"
        />
        <Text style={styles.baseText}>
          <Br/>
          <Text style={styles.smsText}>{this.state.lastSms || 'no sms found'}</Text> <Br/>
          <Text style={styles.smsText}>{this.state.websocket || 'no websocket'}</Text> <Br/>
          <Text style={styles.smsText}>{this.state.socketError || 'no error'}</Text> <Br/>
          <Text style={styles.smsText}>{this.state.serverMessage || 'no server msg'}</Text> <Br/>
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D73A49',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    color: '#fff',
    textAlign: 'center',
  },
  smsText: {
    color: '#000',
  },
});
