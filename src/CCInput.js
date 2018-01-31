import React, { Component } from "react";
import PropTypes from 'prop-types';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
} from "react-native";

const s = StyleSheet.create({
  baseInputStyle: {
    color: "black",
    fontSize: 14,
  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(["valid", "invalid", "incomplete"]),

    containerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
  };

  static defaultProps = {
    label: "",
    value: "",
    status: "incomplete",
    keyboardType: "numeric",
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => {},
    onChange: () => {},
    onBecomeEmpty: () => {},
    onBecomeValid: () => {},
  }

  componentWillReceiveProps(newProps) {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = this.props;
    const { status: newStatus, value: newValue } = newProps;

    if (value !== "" && newValue === "") {
      onBecomeEmpty(field);
    }

    if (status !== "valid" && newStatus === "valid") {
      onBecomeValid(field);
    }
  }

  focus() {
    this.input.focus();
  }

  _onFocus() {
    setTimeout(() => {
      this.props.onFocus(this.props.field);
    }, 50);
  }

  _onChange(value) {
    this.props.onChange(this.props.field, value);
  }

  render() {
    const { field, label, value, placeholder, status, keyboardType,
            containerStyle, inputStyle, labelStyle,
            validColor, invalidColor, placeholderColor } = this.props;

    return (
      <View onPress={this.focus}
            style={containerStyle}>
        { !!label && <Text style={[labelStyle]}>{label}</Text>}
        <TextInput ref={(ref) => {this.input = ref}}
            autoFocus={(field == "number")}
            keyboardType={keyboardType}
            returnKeyType={keyboardType === 'numbers-and-punctuation' ? "done" : "default"}
            autoCapitalise="words"
            autoCorrect={false}
            accessible={this.props.accessible}
            accessibilityLabel={this.props.accessibilityLabel}
            accessibilityTraits={this.props.accessibilityTraits}
            style={[
              s.baseInputStyle,
              inputStyle,
              ((validColor && status === "valid") ? { color: validColor } :
                (status !== "valid" && field === "number" && (value.length > 0 && value.match(/\d/g).length >= 16)) ? { color: invalidColor } :
               (invalidColor && status === "invalid") ? { color: invalidColor } :
               {}),
            ]}
            underlineColorAndroid={"transparent"}
            placeholderTextColor={placeholderColor}
            placeholder={placeholder}
            value={value}
            onFocus={this._onFocus.bind(this)}
            onChangeText={this._onChange.bind(this)}
            numberOfLines={1}
            onSubmitEditing={(event) => {this.props._handleSubmit();}}/>
      </View>
    );
  }
}
