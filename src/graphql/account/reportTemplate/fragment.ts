import { gql } from "@apollo/client";

export const REPORT_TEMPLATE_FRAGMENT = gql`
  fragment ReportTemplateFields on ReportTemplate {
    id
    variant
    version
    scope
    model
    maxTokens
    temperature
    systemPrompt
    userPromptTemplate
    stopSequences
    trafficWeight
    isActive
    isEnabled
    experimentKey
    communityContext
    createdAt
    updatedAt
    community {
      id
      name
    }
    updatedByUser {
      id
      name
    }
  }
`;

export const REPORT_TEMPLATE_STATS_FRAGMENT = gql`
  fragment ReportTemplateStatsFields on ReportTemplateStats {
    variant
    version
    feedbackCount
    avgRating
    avgJudgeScore
    judgeHumanCorrelation
    correlationWarning
  }
`;
