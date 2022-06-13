// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';

import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';

import Setting from 'components/setting';
import {getStyleForReactSelect} from 'utils/styles';

const MAX_NUM_OPTIONS = 100;

export default class ReactSelectSetting extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string,
        onChange: PropTypes.func,
        theme: PropTypes.object.isRequired,
        isClearable: PropTypes.bool,
        options: PropTypes.array.isRequired,
        isLoading: PropTypes.bool,
        value: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
            PropTypes.string,
        ]),
        addValidate: PropTypes.func,
        removeValidate: PropTypes.func,
        required: PropTypes.bool,
        allowUserDefinedValue: PropTypes.bool,
        limitOptions: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {invalid: false};
    }

    componentDidMount() {
        if (this.props.addValidate && this.props.name) {
            this.props.addValidate(this.props.name, this.isValid);
        }
    }

    componentWillUnmount() {
        if (this.props.removeValidate && this.props.name) {
            this.props.removeValidate(this.props.name);
        }
    }

    componentDidUpdate() {
        if(this.state.invalid)
            this.isValid();
    }

    handleChange = (value) => {
        if (this.props.onChange) {
            if (Array.isArray(value)) {
                this.props.onChange(this.props.name, value.map((x) => x.value));
            } else {
                const newValue = value ? value.value : null;
                this.props.onChange(this.props.name, newValue);
            }
        }
    };

    filterOptions = (input) => {
        let options = this.props.options;
        if (input) {
            options = options.filter((x) => x.label.toLowerCase().includes(input.toLowerCase()));
        }
        return Promise.resolve(options.slice(0, MAX_NUM_OPTIONS));
    };

    isValid = () => {
        if (!this.props.required) {
            return true;
        }

        const valid = Boolean(this.props.value);

        this.setState({invalid: !valid});
        return valid;
    };

    render() {
        const requiredMsg = 'This field is required.';
        let validationError = null;
        if (this.props.required && this.state.invalid) {
            validationError = (
                <p className='help-text error-text'>
                    <span>{requiredMsg}</span>
                </p>
            );
        }
        let selectComponent = null;
        if (this.props.limitOptions && this.props.options.length > MAX_NUM_OPTIONS) {
            // The parent component has let us know that we may have a large number of options, and that
            // the dataset is static. In this case, we use the AsyncSelect component and synchronous func
            // this.filterOptions() to limit the number of options being rendered at a given time.
            selectComponent = (
                <AsyncSelect
                    {...this.props}
                    loadOptions={this.filterOptions}
                    defaultOptions={true}
                    menuPortalTarget={document.body}
                    menuPlacement='auto'
                    onChange={this.handleChange}
                    isLoading={this.props.isLoading}
                    styles={getStyleForReactSelect(this.props.theme)}
                />
            );
        } else {
            selectComponent = (
                <ReactSelect
                    {...this.props}
                    menuPortalTarget={document.body}
                    menuPlacement='auto'
                    isLoading={this.props.isLoading}
                    onChange={this.handleChange}
                    styles={getStyleForReactSelect(this.props.theme)}
                />
            );
        }

        return (
            <Setting
                inputId={this.props.name}
                {...this.props}
            >
                {selectComponent}
                {validationError}
            </Setting>
        );
    }
}
