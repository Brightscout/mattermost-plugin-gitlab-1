// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {id as pluginId} from 'manifest';
import {getProjects} from '../../actions';

import GithubProjectSelector from './gitlab_project_selector.tsx';

function mapStateToProps(state) {
    return {
        yourProjects: state[`plugins-${pluginId}`].yourProjects,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getProjects,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GithubProjectSelector);
