import { gql } from "@apollo/client";

export const REPORT_TEMPLATE_FRAGMENT = gql`
  fragment ReportTemplateFields on ReportTemplate {
    id
    variant
    version
    scope
    kind
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

export const REPORT_TEMPLATE_STATS_BREAKDOWN_ROW_FRAGMENT = gql`
  fragment ReportTemplateStatsBreakdownRowFields on ReportTemplateStatsBreakdownRow {
    templateId
    version
    scope
    kind
    experimentKey
    isActive
    isEnabled
    trafficWeight
    feedbackCount
    avgRating
    avgJudgeScore
    judgeHumanCorrelation
    correlationWarning
  }
`;
