import {Theme} from 'mattermost-redux/types/preferences';
import * as CSS from 'csstype';

export const notificationReasons: Record<string, string> = {
    assigned: 'You were assigned to the issue',
    review_requested: 'You were requested to review a merge request.',
    mentioned: 'You were specifically @mentioned in the content.',
    build_failed: 'Gitlab build was failed.',
    marked: 'Task is marked as done.',
    approval_required: 'Your approval is required on this issue.',
    unmergeable: 'This merge request can not be merged.',
    directly_addressed: 'You were directly addressed.',
    merge_train_removed: 'A merge train was removed.',
    attention_required: 'Your attention is required on the issue.',
  };

export interface Label {
    id: number;
    name: string;
    color: CSS.Properties;
    text_color: CSS.Properties;
  }
  
  export interface User {
    username: string;
  }
  
  export interface References {
    full: string;
  }
  
  export interface Project {
    path_with_namespace: string;
  }
  
  export interface Target {
    title: string;
  }
  
  export interface Item {
    url: string;
    iid: number;
    has_conflicts:boolean;
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    action_name: keyof typeof notificationReasons;
    web_url: string;
    target_url: string;
    repository_url?: string;
    author: User;
    references: References;
    project: Project;
    merge_status: string;
    merge_error: string;
    owner?: User;
    milestone?: {
      title: string;
    };
    repository?: {
      full_name: string;
    };
    labels?: Label[];
    target: Target;
  }
  
  export interface GitlabItemsProps {
    items: Item[];
    theme: Theme;
  }