// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';

import {getYourPrsDetails, getReviewsDetails} from '../../actions';
import {id as pluginId} from '../../manifest';

import SidebarRight from './sidebar_right.jsx';

function mapPrsToDetails(prs, details) {
    if (!prs) {
        return [];
    }

    return prs.map((pr) => {
        let foundDetails;
        if (details) {
            foundDetails = details.find((prDetails) => {
                return (pr.project_id === prDetails.project_id) && (pr.sha === prDetails.sha);
            });
        }
        if (!foundDetails) {
            return pr;
        }

        return {
            ...pr,
            status: foundDetails.status,
            approvers: foundDetails.approvers,
            total_reviewers: pr.reviewers.length,
        };
    });
}

function mapStateToProps(state) {
    return {
        username: state[`plugins-${pluginId}`].username,
        reviews: mapPrsToDetails(state[`plugins-${pluginId}`].yourPrs, state[`plugins-${pluginId}`].reviewsDetails),
        yourPrs: mapPrsToDetails(state[`plugins-${pluginId}`].yourPrs, state[`plugins-${pluginId}`].yourPrsDetails),
        yourAssignments: state[`plugins-${pluginId}`].yourAssignments,
        unreads: state[`plugins-${pluginId}`].unreads,
        enterpriseURL: state[`plugins-${pluginId}`].enterpriseURL,
        org: state[`plugins-${pluginId}`].organization,
        rhsState: state[`plugins-${pluginId}`].rhsState,
    };
}

<<<<<<< HEAD
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getYourPrsDetails,
            getReviewsDetails,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRight);
=======
export default connect(mapStateToProps)(SidebarRight);
>>>>>>> 2863e15f39f16217924de067368db630c2446701
