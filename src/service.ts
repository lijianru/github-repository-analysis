import { message } from 'antd';
import { max, min } from 'lodash';
import {
  getRepoBaseInfo,
  getRepoIssues,
  getRepoPullRequests,
  getRepoContributors,
  getRepoOrgMembers,
  RepoBaseInfoParameter,
  RepoBaseInfoResponse,
  RepoContributorsResponse,
  RepoOrgMembersParameter,
  RepoOrgMembersResponse,
} from './api';
import { calculationInterval, percentile } from './helpers';
import { formatISO } from 'date-fns';

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
  openIssue: {
    date: Statistics;
    comment: Statistics;
  };
  openPullRequest: {
    date: Statistics;
  };
};

async function getRepoInfo({
  owner,
  repo,
  org,
  per_page,
}: RepoInfoParameter): Promise<RepoInfoResponse> {
  const [
    repoBaseInfo,
    repoOrgMembers,
    repoContributors,
    repoClosedIssues,
    repoClosedPullRequests,
    repoOpenIssues,
    repoOpenPullRequests,
  ] = await Promise.all([
    getRepoBaseInfo({ owner, repo }),
    getRepoOrgMembers({ org }),
    getRepoContributors({ owner, repo, per_page }),
    getRepoIssues({ owner, repo, per_page, state: 'closed' }),
    getRepoPullRequests({ owner, repo, per_page, state: 'closed' }),
    getRepoIssues({ owner, repo, per_page, state: 'open' }),
    getRepoPullRequests({ owner, repo, per_page, state: 'open' }),
  ]);

  const { id, html_url, stargazers_count, forks_count, description, created_at } =
    repoBaseInfo.data;

  const currentTime = formatISO(new Date());
  const repoClosedIssuesIntervalList = repoClosedIssues.data.map(({ created_at, closed_at }) =>
    calculationInterval(created_at, closed_at!)
  );
  const repoOpenIssuesIntervalList = repoOpenIssues.data.map(({ created_at, closed_at }) =>
    calculationInterval(created_at, closed_at || currentTime)
  );
  const repoClosedIssuesCommentCountList = repoClosedIssues.data.map(({ comments }) => comments);
  const repoOpenIssuesCommentCountList = repoOpenIssues.data.map(({ comments }) => comments);

  const repoClosedPullRequestIntervalList = repoClosedPullRequests.data.map(
    ({ created_at, closed_at }) => calculationInterval(created_at, closed_at!)
  );
  const repoOpenPullRequestIntervalList = repoOpenPullRequests.data.map(
    ({ created_at, closed_at }) => calculationInterval(created_at, closed_at || currentTime)
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
    openIssue: {
      date: {
        max: max(repoOpenIssuesIntervalList)!,
        min: min(repoOpenIssuesIntervalList)!,
        percentile80: percentile(repoOpenIssuesIntervalList)!,
        percentile90: percentile(repoOpenIssuesIntervalList)!,
      },
      comment: {
        max: max(repoOpenIssuesCommentCountList)!,
        min: min(repoClosedIssuesCommentCountList)!,
        percentile80: percentile(repoOpenIssuesCommentCountList)!,
        percentile90: percentile(repoOpenIssuesCommentCountList)!,
      },
    },
    openPullRequest: {
      date: {
        max: max(repoOpenPullRequestIntervalList)!,
        min: min(repoOpenPullRequestIntervalList)!,
        percentile80: percentile(repoOpenPullRequestIntervalList)!,
        percentile90: percentile(repoOpenPullRequestIntervalList)!,
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
