import { StyleSheet } from "react-native";

export function Br() {
    return '\n';
}

export function HRDate(timestamp) {
    const a = new Date(timestamp * 1000);
    const year = a.getFullYear();
    const month = (a.getMonth() + 1).toString().padStart(2, '0');
    const day = a.getDate().toString().padStart(2, '0');
    const hour = a.getHours().toString().padStart(2, '0');
    const min = a.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} ${hour}:${min}`;
}

export const styles = StyleSheet.create({
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
    center: {
        textAlign: 'center',
    }
});