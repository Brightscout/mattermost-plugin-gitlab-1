// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getLabelOptions} from '../../actions';

import GitlabLabelSelector from './gitlab_label_selector.tsx';

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({getLabelOptions}, dispatch),
});

export default connect(null, mapDispatchToProps)(GitlabLabelSelector);
