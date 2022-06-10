// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import {Theme} from 'mattermost-redux/types/preferences';

import IssueAttributeSelector from '../issue_attribute_selector';

interface PropTypes{
    projectID: number;
    projectName: string;
    theme: Theme;
    selectedMilestone: Selection;
    onChange: (milestone: Selection) => void;
    actions: any;
};

interface Milestone{
    id: number;
    title: string;
}

interface Selection{
    value: number;
    label: string;
}

export default class GitlabMilestoneSelector extends PureComponent<PropTypes> {

    loadMilestones = async () => {
        if (this.props.projectName === '') {
            return [];
        }

        const options = await this.props.actions.getMilestoneOptions(this.props.projectID);

        if (options.error) {
            throw new Error('Failed to load milestones');
        }

        if (!options || !options.data) {
            return [];
        }

        return options.data.map((option: Milestone) => ({
            value: option.id,
            label: option.title,
        }));
    };

    render() {
        return (
            <div className='form-group margin-bottom x3'>
                <label className='control-label margin-bottom x2'>
                    {'Milestone'}
                </label>
                <IssueAttributeSelector
                    {...this.props}
                    isMulti={false}
                    selection={this.props.selectedMilestone}
                    loadOptions={this.loadMilestones}
                />
            </div>
        );
    }
}
