'use client';

import { displayDuration, displayName } from "../utils";

/**
 * Activity type from GraphQL
 */
export interface GqlActivity {
  id: string;
  description: string;
  remark: string | null;
  startsAt: string;
  endsAt: string;
  isPublic: boolean;
  event?: {
    id: string;
    description: string;
  } | null;
  user?: {
    id: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
  } | null;
  organization?: {
    id: string;
    name: string;
  } | null;
}

/**
 * Activity type for application use
 */
export interface Activity {
  id: string;
  description: string;
  remark: string | null;
  startsAt: Date;
  endsAt: Date;
  isPublic: boolean;
  event: {
    id: string;
    description: string;
  } | null;
  user: {
    id: string;
    name: string;
  } | null;
  organization: {
    id: string;
    name: string;
  } | null;
  displayDuration: string;
}

/**
 * Transform activity data from GraphQL to application format
 */
export const transformActivity = (activity: GqlActivity): Activity => {
  return {
    id: activity.id,
    description: activity.description,
    remark: activity.remark,
    startsAt: new Date(activity.startsAt),
    endsAt: new Date(activity.endsAt),
    isPublic: activity.isPublic,
    event: activity.event ? {
      id: activity.event.id,
      description: activity.event.description
    } : null,
    user: activity.user ? {
      id: activity.user.id,
      name: displayName(activity.user),
    } : null,
    organization: activity.organization ? {
      id: activity.organization.id,
      name: activity.organization.name
    } : null,
    displayDuration: displayDuration(activity.startsAt, activity.endsAt)
  };
};

/**
 * Transform activity edge data from GraphQL to application format
 */
export const transformActivityEdge = (edge: { node: GqlActivity }): Activity => {
  return transformActivity(edge.node);
};
