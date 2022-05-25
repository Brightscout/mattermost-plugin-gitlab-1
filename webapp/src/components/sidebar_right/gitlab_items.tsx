import React from "react";
import {
  makeStyleFromTheme,
  changeOpacity,
} from "mattermost-redux/utils/theme_utils";
import { Badge } from "react-bootstrap";
import * as CSS from "csstype";
import { Theme } from "mattermost-redux/types/preferences";
import {
  GitPullRequestIcon,
  IssueOpenedIcon,
  IconProps,
} from "@primer/octicons-react";
import SignIcon from "../../images/icons/sign";
import { formatTimeSince } from "../../utils/date_utils";

const notificationReasons = {
  assigned: "You were assigned to the issue",
  author: "You created the thread.",
  comment: "You commented on the thread.",
  invitation: "You accepted an invitation to contribute to the repository.",
  manual: "You subscribed to the thread (via an issue or pull request).",
  mentioned: "You were specifically @mentioned in the content.",
  review_requested: "You were requested to review a pull request.",
  security_alert:
    "GitHub discovered a security vulnerability in your repository.",
  state_change: "You changed the thread state.",
  subscribed: "You are watching the repository.",
  team_mention: "You were on a team that was mentioned.",
};

interface Label {
  id: number;
  name: string;
  color: CSS.Properties;
  text_color: CSS.Properties;
}

interface User {
  username: string;
}

interface References {
  full: string;
}

interface Project {
  path_with_namespace: string;
}

interface Target {
  title: string;
}

interface Item {
  url: string;
  iid: number;

  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  action_name: string;
  web_url: string;
  target_url: string;
  repository_url?: string;
  author: User;
  references: References;
  project: Project;
  mergeStatus: string;
  mergeError: string;
  owner?: User;
  milestone?: {
    title: string;
  };
  repository?: {
    full_name: string;
  };
  labels?: Label[];

  Notifications;
  target: Target;
  subject?: {
    title: string;
  };
  reason?: keyof typeof notificationReasons;
}

interface GithubItemsProps {
  items: Item[];
  theme: Theme;
}

function GitlabItems({ items, theme }: GithubItemsProps) {
  const style = getStyle(theme);
  // console.log(items);
  return items.length > 0 ? (
    items.map((item) => {
      let repoName = "";
      if (item.references) {
        repoName = item.references.full;
      } else if (item.project?.path_with_namespace) {
        repoName = item.project.path_with_namespace;
      }

      let userName = "";
      if (item.author?.username) {
        userName = item.author.username;
      }

      let number: JSX.Element | null = null;
      if (item.iid) {
        const iconProps: IconProps = {
          size: "small",
          verticalAlign: "text-bottom",
        };

        let icon;
        if (item.mergeStatus) {
          // item is a pull request
          icon = <GitPullRequestIcon {...iconProps} />;
        } else {
          icon = <IssueOpenedIcon {...iconProps} />;
        }
        number = (
          <strong>
            <span style={{ ...style.icon }}>{icon}</span>
            {"#" + item.iid}
          </strong>
        );
      }

      let titleText = "";
      if (item.title) {
        titleText = item.title;
      } else if (item.target?.title) {
        titleText = item.target.title;
      }

      let title: JSX.Element | null = <>{titleText}</>;
      if (item.web_url || item.target_url) {
        title = (
          <a
            href={item.web_url || item.target_url}
            target="_blank"
            rel="noopener noreferrer"
            style={style.itemTitle}
          >
            {titleText}
          </a>
        );
        if (item.iid) {
          number = (
            <strong>
              <a href={item.web_url} target="_blank" rel="noopener noreferrer">
                {number}
              </a>
            </strong>
          );
        }
      }

      // let status = null;
      // if (item.mergeStatus) {
      //   switch (item.mergeStatus) {
      //     case "success":
      //       status = (
      //         <span style={{ ...style.icon, ...style.iconSucess }}>
      //           <TickIcon />
      //         </span>
      //       );
      //       break;
      //     case "can_be_merged":
      //       status = (
      //         <span style={{ ...style.icon, ...style.iconPending }}>
      //           <DotIcon />
      //         </span>
      //       );
      //       break;
      //     default:
      //       status = (
      //         <span style={{ ...style.icon, ...style.iconFailed }}>
      //           <CrossIcon />
      //         </span>
      //       );
      //   }
      // }

      let milestone: JSX.Element | null = null;
      if (item.milestone) {
        milestone = (
          <span
            style={{
              ...style.milestoneIcon,
              ...style.icon,
              ...((item.created_at || userName) && {
                paddingLeft: 10,
              }),
            }}
          >
            <SignIcon />
            {item.milestone.title}
          </span>
        );
      }

      let labels: JSX.Element[] | null = null;
      if (item.labels) {
        labels = getGithubLabels(item.labels);
      }

      return (
        <div key={item.id} style={style.container}>
          <div>
            <strong>
              {title}
              {/* {status} */}
            </strong>
          </div>
          <div>
            {number}
            <span className="light">{"(" + repoName + ")"}</span>
          </div>
          {labels}
          <div className="light" style={style.subtitle}>
            {item.created_at &&
              "Opened " + formatTimeSince(item.created_at) + " ago"}
            {userName && " by " + userName}
            {(item.created_at || userName) && "."}
            {milestone}
            {item.action_name ? (
              <>
                {(item.created_at || userName || milestone) && <br />}
                {item.updated_at && formatTimeSince(item.updated_at) + " ago"}
                {<br />}
                {notificationReasons[item.action_name]}
              </>
            ) : null}
          </div>
        </div>
      );
    })
  ) : (
    <div style={style.container}>{"You have no active items"}</div>
  );
}
const getStyle = makeStyleFromTheme((theme) => {
  return {
    container: {
      padding: "15px",
      borderTop: `1px solid ${changeOpacity(theme.centerChannelColor, 0.2)}`,
    },
    itemTitle: {
      color: theme.centerChannelColor,
      lineHeight: 1.7,
      fontWeight: "bold",
    },
    subtitle: {
      margin: "5px 0 0 0",
      fontSize: "13px",
    },
    subtitleSecondLine: {
      fontSize: "13px",
    },
    icon: {
      top: 3,
      position: "relative",
      left: 3,
      height: 18,
      display: "inline-flex",
      alignItems: "center",
      marginRight: "6px",
    },
    iconSucess: {
      color: theme.onlineIndicator,
    },
    iconPending: {
      color: theme.awayIndicator,
    },
    iconFailed: {
      color: theme.dndIndicator,
    },
    iconChangesRequested: {
      color: theme.dndIndicator,
    },
    conflictIcon: {
      color: theme.dndIndicator,
    },
    milestoneIcon: {
      top: 3,
      position: "relative",
      height: 18,
      display: "inline-flex",
      alignItems: "center",
      color: theme.centerChannelColor,
    },
  };
});
function getGithubLabels(labels: Label[]) {
  return labels.map((label) => {
    return (
      <Badge
        key={label.id}
        style={{
          ...itemStyle,
          ...{
            backgroundColor: label.color,
            color: label.text_color,
          },
        }}
      >
        {label.name}
      </Badge>
    );
  });
}

const itemStyle: CSS.Properties = {
  margin: "4px 5px 0 0",
  padding: "3px 8px",
  display: "inline-flex",
  borderRadius: "3px",
  position: "relative",
};

export default GitlabItems;
