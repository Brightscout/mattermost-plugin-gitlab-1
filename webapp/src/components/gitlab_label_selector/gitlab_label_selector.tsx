// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import {Theme} from 'mattermost-redux/types/preferences';

import IssueAttributeSelector from '../issue_attribute_selector';

interface PropTypes{
    projectID: number;
    projectName: string;
    theme: Theme;
    selectedLabels: any;
    onChange: any;
    actions: any;
};

interface Label{
    name: string;
}

interface Selection{
    value: string;
    label: string;
}

export default class GitlabLabelSelector extends PureComponent<PropTypes> {
   
    loadLabels = async () => {
        if (this.props.projectName === '') {
            return [];
        }
        const options = await this.props.actions.getLabelOptions(this.props.projectID);

        if (options.error) {
            throw new Error('Failed to load labels');
        }

        if (!options || !options.data) {
            return [];
        }
        return options.data.map((option: Label) => ({
            value: option.name,
            label: option.name,
        }));
    };

    onChange = (selection: Selection) => this.props.onChange(selection);

    render() {
        return (
            <div className='form-group margin-bottom x3'>
                <label className='control-label margin-bottom x2'>
                    {'Labels'}
                </label>
                <IssueAttributeSelector
                    {...this.props}
                    isMulti={true}
                    onChange={this.onChange}
                    selection={this.props.selectedLabels}
                    loadOptions={this.loadLabels}
                />
            </div>
        );
    }
}
