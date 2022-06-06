// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import GitLabIcon from '../icon';

interface PropTypes{
    show: boolean;
    open: any;
    postId: string;
}

export default class CreateIssuePostMenuAction extends React.PureComponent<PropTypes> {

    handleClick = (e:any) => {        
        const {open, postId} = this.props;
        e.preventDefault();
        open(postId);
    };

    render() {
        if (!this.props.show) {
            return null;
        }

        const content = (
            <button
                className='style--none'
                role='presentation'
                onClick={this.handleClick}
            >
                <GitLabIcon type='menu'/>
                {'Create GitLab Issue'}
            </button>
        );

        return (
            <li
                className='MenuItem'
                role='menuitem'
            >
                {content}
            </li>
        );
    }
}
