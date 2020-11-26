import React, { Component } from 'react';
import { TouchableHighlight } from 'react-native';
//import { fab } from '@fortawesome/free-brands-svg-icons'
//import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const lib = {
    'trash-alt': faTrashAlt,
}

// https://github.com/FortAwesome/react-native-fontawesome

export default class Icon extends Component {
    render() {
        return (
            <TouchableHighlight onPress={() => this.props.onPress()}>
                <FontAwesomeIcon icon={lib[this.props.fa]} style={this.props.style || {}} secondaryColor={this.props.secondaryColor}/>
            </TouchableHighlight>
        )
    }
}