// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import {Theme} from 'mattermost-redux/types/preferences';

import IssueAttributeSelector from '../issue_attribute_selector';

interface PropTypes{
    projectID: number;
    projectName: string;
    theme: Theme;
    selectedAssignees: string[];
    onChange: any;
    actions: any;
};

export default class GitlabAssigneeSelector extends PureComponent<PropTypes> {

    loadAssignees = async () => {
        if (this.props.projectName === '') {
            return [];
        }

        const options = await this.props.actions.getAssigneeOptions(this.props.projectID);

        if (options.error) {
            throw new Error('Failed to load assignees');
        }

        if (!options || !options.data) {
            return [];
        }
        return options.data.map((option:any) => ({
            value: option.id,
            label: option.username,
        }));
    };

    // onChange = (selection:any) => this.props.onChange(selection.map((s:any) => s.value));
    onChange = (selection:any) => this.props.onChange(selection);

    render() {
        return (
            <div className='form-group margin-bottom x3'>
                <label className='control-label margin-bottom x2'>
                    {'Assignees'}
                </label>
                <IssueAttributeSelector
                    {...this.props}
                    isMulti={true}
                    onChange={this.onChange}
                    selection={this.props.selectedAssignees}
                    loadOptions={this.loadAssignees}
                />
            </div>
        );
    }
}
