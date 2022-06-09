import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getPost} from 'mattermost-redux/selectors/entities/posts';

import {id as pluginId} from 'manifest';
import {closeCreateIssueModal, createIssue} from 'actions';

import CreateIssueModal from './create_issue';

const mapStateToProps = (state) => {
    const {postId, title, channelId} = state[`plugins-${pluginId}`].createIssueModal;
    const post = (postId) ? getPost(state, postId) : null;
    return {
        visible: state[`plugins-${pluginId}`].isCreateIssueModalVisible,
        post,
        title,
        channelId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            close: closeCreateIssueModal,
            create: createIssue,
        }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateIssueModal);
