import React from 'react';
import { StyleSheet, Text } from "react-native";

export function Br() {
    return <Text>{'\n'}</Text>;
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

export const Colors = {
    red: '#CA0000',
    white: '#fff',
    grey: '#ccc',
    greyLight: '#e3e3e3',
    black: '#000',
}

export const Spacing = {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 32,
    borderRadius: 5,
}

export const FontSize = (size) => {
    const sizes = {
        '-2': 8,
        '-1': 12,
        0: 16,
        1: 24,
        2: 32,
    };

    return { fontSize: sizes[size] || sizes[0] }
}

export const FontBold = { fontWeight: 'bold' };

export const StylesGlobalObj = {
    container: {
        backgroundColor: Colors.red,
        padding: Spacing.lg,
    },
    input: {
        height: 40,
        padding: Spacing.md,
        borderColor: Colors.grey,
        borderWidth: 1,
        backgroundColor: Colors.white,
    },
    center: {
        textAlign: 'center',
    },
};
export const StylesGlobal = StyleSheet.create(StylesGlobalObj);