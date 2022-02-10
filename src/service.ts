import { message } from 'antd';
import { max, min } from 'lodash';
import {
  getRepoBaseInfo,
  getRepoClosedIssues,
  getRepoClosedPullRequests,
  getRepoContributors,
  getRepoOrgMembers,
  RepoBaseInfoParameter,
  RepoBaseInfoResponse,
  RepoContributorsResponse,
  RepoOrgMembersParameter,
  RepoOrgMembersResponse,
} from './api';
import { calculationInterval, percentile } from './helpers';

export type RepoInfoParameter = Pick<RepoBaseInfoParameter, 'owner' | 'repo'> &
  Pick<RepoOrgMembersParameter, 'org' | 'per_page'>;

export type Statistics = {
  max: number;
  min: number;
  percentile80: number;
  percentile90: number;
};
export type RepoInfoResponse = Pick<
  RepoBaseInfoResponse['data'],
  'id' | 'html_url' | 'stargazers_count' | 'forks_count' | 'description' | 'created_at'
> & {
  orgMemberList: RepoOrgMembersResponse['data'];
  contributorList: RepoContributorsResponse['data'];
  closedIssue: {
    date: Statistics;
    comment: Statistics;
  };
  closedPullRequest: {
    date: Statistics;
  };
};

async function getRepoInfo({
  owner,
  repo,
  org,
  per_page,
}: RepoInfoParameter): Promise<RepoInfoResponse> {
  const [repoBaseInfo, repoOrgMembers, repoContributors, repoClosedIssues, repoClosedPullRequests] =
    await Promise.all([
      getRepoBaseInfo({ owner, repo }),
      getRepoOrgMembers({ org }),
      getRepoContributors({ owner, repo, per_page }),
      getRepoClosedIssues({ owner, repo, per_page }),
      getRepoClosedPullRequests({ owner, repo, per_page }),
    ]);

  const { id, html_url, stargazers_count, forks_count, description, created_at } =
    repoBaseInfo.data;

  const repoClosedIssuesIntervalList = repoClosedIssues.data.map(({ created_at, closed_at }) =>
    calculationInterval(created_at, closed_at!)
  );
  const repoClosedIssuesCommentCountList = repoClosedIssues.data.map(({ comments }) => comments);

  const repoClosedPullRequestIntervalList = repoClosedPullRequests.data.map(
    ({ created_at, closed_at }) => calculationInterval(created_at, closed_at!)
  );

  return {
    id,
    created_at,
    html_url,
    stargazers_count,
    forks_count,
    description,
    orgMemberList: repoOrgMembers.data,
    contributorList: repoContributors.data,
    closedIssue: {
      date: {
        max: max(repoClosedIssuesIntervalList)!,
        min: min(repoClosedIssuesIntervalList)!,
        percentile80: percentile(repoClosedIssuesIntervalList)!,
        percentile90: percentile(repoClosedIssuesIntervalList)!,
      },
      comment: {
        max: max(repoClosedIssuesCommentCountList)!,
        min: min(repoClosedIssuesCommentCountList)!,
        percentile80: percentile(repoClosedIssuesCommentCountList)!,
        percentile90: percentile(repoClosedIssuesCommentCountList)!,
      },
    },
    closedPullRequest: {
      date: {
        max: max(repoClosedPullRequestIntervalList)!,
        min: min(repoClosedPullRequestIntervalList)!,
        percentile80: percentile(repoClosedPullRequestIntervalList)!,
        percentile90: percentile(repoClosedPullRequestIntervalList)!,
      },
    },
  };
}

export async function getRepoListInfo(
  repoNameList: string[],
  perPage: number
): Promise<RepoInfoResponse[]> {
  try {
    const repoListInfo = await Promise.all(
      repoNameList.map((repoName) => {
        const repoNameArray = repoName.split('/');
        return getRepoInfo({
          repo: repoNameArray[1],
          org: repoNameArray[0],
          owner: repoNameArray[0],
          per_page: perPage,
        });
      })
    );

    return repoListInfo;
  } catch {
    message.warn('似乎发生了一些错误，请重试！');
    return [];
  }
}
