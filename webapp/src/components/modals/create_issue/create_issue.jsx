import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap';

import GitlabLabelSelector from 'components/gitlab_label_selector';
import GitlabAssigneeSelector from 'components/gitlab_assignee_selector';
import GitlabMilestoneSelector from 'components/gitlab_milestone_selector';
import GitlabProjectSelector from 'components/gitlab_project_selector';
import Validator from 'components/validator';
import FormButton from 'components/form_button';
import Input from 'components/input';
import {getErrorMessage} from 'utils/user_utils';

const MAX_TITLE_LENGTH = 256;

const initialState = {
    submitting: false,
    error: null,
    project: null,
    issueTitle: '',
    issueDescription: '',
    labels: [],
    assignees: [],
    milestone: null,
    showErrors: false,
    issueTitleValid: true,
};

export default class CreateIssueModal extends PureComponent {
    static propTypes = {
        post: PropTypes.object,
        title: PropTypes.string,
        channelId: PropTypes.string,
        theme: PropTypes.object.isRequired,
        visible: PropTypes.bool.isRequired,
        actions: PropTypes.shape({
            close: PropTypes.func.isRequired,
            create: PropTypes.func.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);
        this.state = initialState;
        this.validator = new Validator();
    }

    componentDidUpdate(prevProps) {
        if (this.props.post && !prevProps.post) {
            this.setState({issueDescription: this.props.post.message}); //eslint-disable-line react/no-did-update-set-state
        } else if (this.props.channelId && (this.props.channelId !== prevProps.channelId || this.props.title !== prevProps.title)) {
            const title = this.props.title.substring(0, MAX_TITLE_LENGTH);
            this.setState({issueTitle: title}); // eslint-disable-line react/no-did-update-set-state
        }
    }

    // handle issue creation after form is populated
    handleCreate = async (e) => {
        e.preventDefault();

        if (!this.validator.validate() || !this.state.issueTitle) {
            this.setState({
                issueTitleValid: Boolean(this.state.issueTitle),
                showErrors: true,
            });
            return;
        }

        const {post} = this.props;
        const postId = post?.id ?? '';

        const issue = {
            title: this.state.issueTitle,
            description: this.state.issueDescription,
            project_id: this.state.project?.project_id,
            labels: this.state.labels.map((label) => label.value),
            assignees: this.state.assignees.map((assignee) => assignee.value),
            milestone: this.state.milestone?.value,
            post_id: postId,
            channel_id: this.props.channelId,
        };

        this.setState({submitting: true});

        const created = await this.props.actions.create(issue);
        if (created.error) {
            const errMessage = getErrorMessage(created.error.message);
            this.setState({
                error: errMessage,
                showErrors: true,
                submitting: false,
            });
            return;
        }
        this.handleClose(e);
    };

    handleClose = (e) => {
        e.preventDefault();
        this.setState(initialState, this.props.actions.close);
    };

    handleProjectChange = (project) => this.setState({project});

    handleLabelsChange = (labels) => this.setState({labels});

    handleAssigneesChange = (assignees) => this.setState({assignees});

    handleMilestoneChange = (milestone) => this.setState({milestone});

    handleIssueTitleChange = (issueTitle) => {
        this.setState({issueTitle});
        if (issueTitle && !this.state.issueTitleValid) {
            this.setState({issueTitleValid: true});
        }
    };

    handleIssueDescriptionChange = (issueDescription) => this.setState({issueDescription});

    renderIssueAttributeSelectors = () => {
        if (!this.state.project) {
            return null;
        }

        return (
            <>
                <GitlabLabelSelector
                    projectID={this.state.project?.project_id}
                    projectName={this.state.project.name}
                    theme={this.props.theme}
                    selectedLabels={this.state.labels}
                    onChange={this.handleLabelsChange}
                />

                <GitlabAssigneeSelector
                    projectID={this.state.project?.project_id}
                    projectName={this.state.project.name}
                    theme={this.props.theme}
                    selectedAssignees={this.state.assignees}
                    onChange={this.handleAssigneesChange}
                />

                <GitlabMilestoneSelector
                    projectID={this.state.project?.project_id}
                    projectName={this.state.project.name}
                    theme={this.props.theme}
                    selectedMilestone={this.state.milestone}
                    onChange={this.handleMilestoneChange}
                />
            </>
        );
    }

    render() {
        if (!this.props.visible) {
            return null;
        }

        const theme = this.props.theme;
        const {error, submitting} = this.state;
        const style = getStyle(theme);

        const requiredMsg = 'This field is required.';
        let issueTitleValidationError = null;
        if (this.state.showErrors && !this.state.issueTitleValid) {
            issueTitleValidationError = (
                <p className='help-text error-text'>
                    <span>{requiredMsg}</span>
                </p>
            );
        }

        let submitError = null;
        if (error) {
            submitError = (
                <p className='help-text error-text'>
                    <span>{error}</span>
                </p>
            );
        }

        const component = (
            <div>
                <GitlabProjectSelector
                    onChange={this.handleProjectChange}
                    value={this.state.project && this.state.project.name}
                    required={true}
                    theme={theme}
                    addValidate={this.validator.addComponent}
                    removeValidate={this.validator.removeComponent}
                />

                <Input
                    id={'title'}
                    label='Title for the GitLab Issue'
                    type='input'
                    required={true}
                    disabled={false}
                    maxLength={MAX_TITLE_LENGTH}
                    value={this.state.issueTitle}
                    onChange={this.handleIssueTitleChange}
                />
                {issueTitleValidationError}

                {this.renderIssueAttributeSelectors()}

                <Input
                    label='Description for the GitLab Issue'
                    type='textarea'
                    value={this.state.issueDescription}
                    onChange={this.handleIssueDescriptionChange}
                />
            </div>
        );

        return (
            <Modal
                dialogClassName='modal--scroll'
                show={true}
                onHide={this.handleClose}
                onExited={this.handleClose}
                bsSize='large'
                backdrop='static'
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        {'Create GitLab Issue'}
                    </Modal.Title>
                </Modal.Header>
                <form
                    role='form'
                    onSubmit={this.handleCreate}
                >
                    <Modal.Body
                        style={style.modal}
                        ref='modalBody'
                    >
                        {component}
                    </Modal.Body>
                    <Modal.Footer>
                        {submitError}
                        <FormButton
                            btnClass='btn-link'
                            defaultMessage='Cancel'
                            onClick={this.handleClose}
                        />
                        <FormButton
                            btnClass='btn btn-primary'
                            saving={submitting}
                            defaultMessage='Submit'
                            savingMessage='Submitting'
                        >
                            {'Submit'}
                        </FormButton>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

const getStyle = (theme) => ({
    modal: {
        padding: '2em 2em 3em',
        color: theme.centerChannelColor,
        backgroundColor: theme.centerChannelBg,
    },
});
