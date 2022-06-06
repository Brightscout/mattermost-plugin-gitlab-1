// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import ReactSelectSetting from 'components/react_select_setting';

const initialState = {
    invalid: false,
    error: null,
};

export default class GitlabProjectSelector extends PureComponent {
    static propTypes = {
        yourProjects: PropTypes.array.isRequired,
        theme: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
        // addValidate: PropTypes.func,
        // removeValidate: PropTypes.func,
        actions: PropTypes.shape({
            getProjects: PropTypes.func.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.props.actions.getProjects();
    }

    onChange = (_, name) => {
        const project = this.props.yourProjects.find((p) => p.path_with_namespace === name);
        this.props.onChange({name, permissions: project.permissions,project_id: project.id});
    }

    render() {
        const projectOptions = this.props.yourProjects.map((item) => ({value: item.path_with_namespace, label: item.path_with_namespace}));
        return (
            <div className={'form-group margin-bottom x3'}>
                <ReactSelectSetting
                    name={'project'}
                    label={'Project'}
                    limitOptions={true}
                    required={true}
                    onChange={this.onChange}
                    options={projectOptions}
                    isMulti={false}
                    key={'project'}
                    theme={this.props.theme}
                    // addValidate={this.props.addValidate}
                    // removeValidate={this.props.removeValidate}
                    value={projectOptions.find((option) => option.value === this.props.value)}
                />
                <div className={'help-text'}>
                    {'Returns GitLab projects connected to the user account'} <br/>
                </div>
            </div>
        );
    }
}
