import { StyleSheet } from "react-native";

export function Br() {
    return '\n';
}

export default styles = StyleSheet.create({
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