// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import Scrollbars from 'react-custom-scrollbars';

import {RHSStates} from '../../constants';

import GitlabItems from './gitlab_items.tsx';

export function renderView(props) {
  return (
    <div
        {...props}
        className='scrollbar--view'
    />);
}

export function renderThumbHorizontal(props) {
    return (
    <div
        {...props}
        className='scrollbar--horizontal'
    />);
}

export function renderThumbVertical(props) {
    return (
    <div
        {...props}
        className='scrollbar--vertical'
    />);
}

function mapGithubItemListToPrList(gilist) {
  if (!gilist) {
      return [];
  }

  return gilist.map((pr) => {
      return {sha: pr.sha, project_id: pr.project_id, iid:pr.iid};
  });
}


export default class SidebarRight extends React.PureComponent {
  static propTypes = {
      username: PropTypes.string,
      org: PropTypes.string,
      enterpriseURL: PropTypes.string,
      reviews: PropTypes.arrayOf(PropTypes.object),
      unreads: PropTypes.arrayOf(PropTypes.object),
      yourPrs: PropTypes.arrayOf(PropTypes.object),
      yourAssignments: PropTypes.arrayOf(PropTypes.object),
      rhsState: PropTypes.string,
      yourLabels: PropTypes.arrayOf(PropTypes.object),
      theme: PropTypes.object.isRequired,
      actions: PropTypes.shape({
        getYourPrsDetails: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    if (this.props.yourPrs && this.props.rhsState === RHSStates.PRS) {
        this.props.actions.getYourPrsDetails(mapGithubItemListToPrList(this.props.yourPrs));
    }
}

  render() {
      const baseURL = this.props.enterpriseURL ?
          this.props.enterpriseURL :
          'https://gitlab.com';
      const orgQuery = this.props.org ? '+org%3A' + this.props.org : '';

      let title = '';
      let gitlabItems = [];
      let listUrl = '';

      switch (this.props.rhsState) {
      case RHSStates.PRS:
          gitlabItems = this.props.yourPrs;
          title = 'Your Open Merge Requests';
          listUrl =
          baseURL +
          '/dashboard/merge_requests?state=opened&scope=all&author_username=' +
          this.props.username +
          '&archived=false' +
          orgQuery;

          break;
      case RHSStates.REVIEWS:
          gitlabItems = this.props.reviews;
          listUrl =
          baseURL +
          '/dashboard/merge_requests?state=opened&scope=all&assignee_username=' +
          this.props.username +
          '&archived=false' +
          orgQuery;
          title = 'Merge Requests Needing Review';

          break;
      case RHSStates.UNREADS:
          gitlabItems = this.props.unreads;
          title = 'Unread Messages';
          listUrl = baseURL + '/dashboard/todos';
          break;
      case RHSStates.ASSIGNMENTS:
          gitlabItems = this.props.yourAssignments;
          title = 'Your Assignments';
          listUrl =
          baseURL +
          '/dashboard/issues?state=opened&scope=all&assignee_username=' +
          this.props.username +
          orgQuery;
          break;
      default:
          break;
      }
      return (
          <React.Fragment>
              <Scrollbars
                  autoHide={true}
                  autoHideTimeout={500}
                  autoHideDuration={500}
                  renderThumbHorizontal={renderThumbHorizontal}
                  renderThumbVertical={renderThumbVertical}
                  renderView={renderView}
              >
                  <div style={style.sectionHeader}>
                      <strong>
                          <a
                              href={listUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                          >
                              {title}
                          </a>
                      </strong>
                  </div>
                  <div>
                      <GitlabItems
                          items={gitlabItems}
                          theme={this.props.theme}
                      />
                  </div>
              </Scrollbars>
          </React.Fragment>
      );
  }
}

const style = {
    sectionHeader: {
        padding: '15px',
    },
};
