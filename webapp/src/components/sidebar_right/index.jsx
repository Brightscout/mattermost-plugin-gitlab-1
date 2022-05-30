// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';

import {getYourPrsDetails} from '../../actions';
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
              return (pr.project_id === prDetails.project_id) && (pr.sha === prDetails.id);
          });
      }
      if (!foundDetails) {
          return pr;
      }

      return {
          ...pr,
          status: foundDetails.status,
      };
  });
}

function mapStateToProps(state) {
    return {
        username: state[`plugins-${pluginId}`].username,
        reviews: state[`plugins-${pluginId}`].reviews,
        yourPrs: mapPrsToDetails(state[`plugins-${pluginId}`].yourPrs, state[`plugins-${pluginId}`].yourPrsDetails),
        yourAssignments: state[`plugins-${pluginId}`].yourAssignments,
        unreads: state[`plugins-${pluginId}`].unreads,
        enterpriseURL: state[`plugins-${pluginId}`].enterpriseURL,
        org: state[`plugins-${pluginId}`].organization,
        rhsState: state[`plugins-${pluginId}`].rhsState,
    };
}


function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
          getYourPrsDetails,
      }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRight);
