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
            <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={() => {
                if('onPress' in this.props) {
                    this.props.onPress();
                }
            }}>
                <FontAwesomeIcon
                    icon={lib[this.props.fa]}
                    style={this.props.style}/>
            </TouchableHighlight>
        )
    }
}