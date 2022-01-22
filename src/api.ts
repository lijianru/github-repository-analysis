import { Octokit } from 'octokit';
import { Endpoints } from '@octokit/types';

const octokit = new Octokit();

// 获取仓库的基础信息
export type RepoBaseInfoParameter = Endpoints['GET /repos/{owner}/{repo}']['parameters'];
export type RepoBaseInfoResponse = Endpoints['GET /repos/{owner}/{repo}']['response'];
export async function getRepoBaseInfo({
  owner,
  repo,
}: RepoBaseInfoParameter): Promise<RepoBaseInfoResponse> {
  return await octokit.request('GET /repos/{owner}/{repo}', {
    owner,
    repo,
  });
}

// 获取仓库组织的成员信息
export type RepoOrgMembersParameter = Endpoints['GET /orgs/{org}/members']['parameters'];
export type RepoOrgMembersResponse = Endpoints['GET /orgs/{org}/members']['response'];
export async function getRepoOrgMembers({
  org,
}: RepoOrgMembersParameter): Promise<RepoOrgMembersResponse> {
  return await octokit.request('GET /orgs/{org}/members', {
    org,
  });
}

// 获取仓库的contributors信息，默认按每个贡献者的提交次数降序对它们进行排序
export type RepoContributorsParameter =
  Endpoints['GET /repos/{owner}/{repo}/contributors']['parameters'];
export type RepoContributorsResponse =
  Endpoints['GET /repos/{owner}/{repo}/contributors']['response'];
export async function getRepoContributors({
  owner,
  repo,
  per_page,
}: RepoContributorsParameter): Promise<RepoContributorsResponse> {
  return await octokit.request('GET /repos/{owner}/{repo}/contributors', {
    owner,
    repo,
    page: 1,
    per_page,
  });
}

// 获取仓库最近关闭的30个issues
export type RepoClosedIssuesParameter = Endpoints['GET /repos/{owner}/{repo}/issues']['parameters'];
export type RepoClosedIssuesResponse = Endpoints['GET /repos/{owner}/{repo}/issues']['response'];
export async function getRepoClosedIssues({
  owner,
  repo,
  per_page,
}: RepoClosedIssuesParameter): Promise<RepoClosedIssuesResponse> {
  return await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner,
    repo,
    state: 'closed',
    page: 1,
    per_page,
  });
}

// 获取仓库最近关闭的30个PR
export type RepoClosedPullRequestsParameter =
  Endpoints['GET /repos/{owner}/{repo}/pulls']['parameters'];
export type RepoClosedPullRequestsResponse =
  Endpoints['GET /repos/{owner}/{repo}/pulls']['response'];
export async function getRepoClosedPullRequests({
  owner,
  repo,
  per_page,
}: RepoClosedPullRequestsParameter): Promise<RepoClosedPullRequestsResponse> {
  return await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    state: 'closed',
    page: 1,
    per_page,
  });
}
