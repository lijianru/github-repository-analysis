import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { Layout, Select, Table, Typography, Input, Tag, message, Button } from 'antd';
import './App.css';
import { getRepoListInfo, RepoInfoResponse } from './service';
import { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';
import { GithubCorners } from './GithubCorners';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

function App() {
  const [inputtedRepoName, setInputtedRepoName] = useState<string>('');
  const [inputtedRepoNameList, setInputtedRepoNameList] = useState<string[]>([]);
  const [perPage, setPerPage] = useState(30);

  const [loading, setLoading] = useState(false);
  const [repoInfoDetailList, setRepoInfoDetailList] = useState<RepoInfoResponse[]>([]);

  const columns: ColumnsType<RepoInfoResponse> = [
    {
      title: 'Repository URL',
      dataIndex: 'html_url',
      width: 150,
      render: (html_url) => <a>{html_url}</a>,
    },
    {
      title: 'Star',
      dataIndex: 'stargazers_count',
    },
    {
      title: 'Create Date',
      dataIndex: 'created_at',
      render: (created_at) => <b>{format(new Date(created_at), 'yyyy/M/d')}</b>,
    },
    {
      title: 'Fork',
      dataIndex: 'forks_count',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 200,
    },
    {
      title: 'Closed Issues(Date)',
      dataIndex: 'closedIssue',
      render: ({ date }) => {
        return (
          <div>
            <div>Max: {date.max} day(s)</div>
            <div>Min: {date.min} day(s)</div>
            <div>80th percentile value: {date.percentile80} day(s)</div>
            <div>90th percentile value: {date.percentile90} day(s)</div>
          </div>
        );
      },
    },
    {
      title: 'Closed Issues(Comment)',
      dataIndex: 'closedIssue',
      render: ({ comment }) => {
        return (
          <div>
            <div>Max: {comment.max} comment(s)/PR</div>
            <div>Min: {comment.min} comment(s)/PR</div>
            <div>80th percentile value: {comment.percentile80} comment(s)/PR</div>
            <div>90th percentile value: {comment.percentile90} comment(s)/PR</div>
          </div>
        );
      },
    },
    {
      title: 'Closed Pull Request(Date)',
      dataIndex: 'closedPullRequest',
      render: ({ date }) => {
        return (
          <div>
            <div>Max: {date.max} day(s)</div>
            <div>Min: {date.min} day(s)</div>
            <div>80th percentile value: {date.percentile80} day(s)</div>
            <div>90th percentile value: {date.percentile90} day(s)</div>
          </div>
        );
      },
    },
    {
      title: 'Open Issues(Date)',
      dataIndex: 'openIssue',
      render: ({ date }) => {
        return (
          <div>
            <div>Max: {date.max} day(s)</div>
            <div>Min: {date.min} day(s)</div>
            <div>80th percentile value: {date.percentile80} day(s)</div>
            <div>90th percentile value: {date.percentile90} day(s)</div>
          </div>
        );
      },
    },
    {
      title: 'Open Issues(Comment)',
      dataIndex: 'openIssue',
      render: ({ comment }) => {
        return (
          <div>
            <div>Max: {comment.max} comment(s)/PR</div>
            <div>Min: {comment.min} comment(s)/PR</div>
            <div>80th percentile value: {comment.percentile80} comment(s)/PR</div>
            <div>90th percentile value: {comment.percentile90} comment(s)/PR</div>
          </div>
        );
      },
    },
    {
      title: 'Open Pull Request(Date)',
      dataIndex: 'openPullRequest',
      render: ({ date }) => {
        return (
          <div>
            <div>Max: {date.max} day(s)</div>
            <div>Min: {date.min} day(s)</div>
            <div>80th percentile value: {date.percentile80} day(s)</div>
            <div>90th percentile value: {date.percentile90} day(s)</div>
          </div>
        );
      },
    },
  ];

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputtedRepoName(e.target.value);
  };

  const handleInputPressEnter = () => {
    if (inputtedRepoNameList.includes(inputtedRepoName)) {
      setInputtedRepoName('');
    } else if (/\w+\/\w+/.test(inputtedRepoName)) {
      setInputtedRepoNameList([...inputtedRepoNameList, inputtedRepoName]);
      setInputtedRepoName('');
    } else {
      message.warning('Incorrect input!');
    }
  };

  const handleQuery = async () => {
    setLoading(true);
    const result = await getRepoListInfo(inputtedRepoNameList, perPage);
    setLoading(false);
    setRepoInfoDetailList(result);
  };

  useEffect(() => {
    handleQuery();
  }, [perPage]);

  return (
    <Layout className="min-h-screen bg-white">
      <GithubCorners />
      <Header className="bg-white pt-4">
        <Title>Github repository analysis</Title>
      </Header>
      <Content className="bg-white p-8 pt-3">
        <Input
          className="mb-1"
          size="large"
          value={inputtedRepoName}
          onChange={handleInputChange}
          onPressEnter={handleInputPressEnter}
          placeholder="Please enter the full repository name (eg: facebook/react, spring-projects/spring-boot) and press enter"
        />
        <div className="mb-2">
          {inputtedRepoNameList.map((repo) => (
            <Tag
              closable
              key={repo}
              onClose={() => {
                setInputtedRepoNameList([
                  ...inputtedRepoNameList.filter(
                    (item) => item.toLowerCase() !== repo.toLowerCase()
                  ),
                ]);
                setRepoInfoDetailList([
                  ...repoInfoDetailList.filter(
                    ({ full_name }) => repo.toLowerCase() !== full_name.toLowerCase()
                  ),
                ]);
              }}
            >
              <b>{repo}</b>
            </Tag>
          ))}
        </div>
        <div>
          Number of queries (from near to far):&nbsp;
          <Select defaultValue={perPage} onChange={(val) => setPerPage(val)}>
            <Select.Option value={10}>10</Select.Option>
            <Select.Option value={30}>30</Select.Option>
            <Select.Option value={50}>50</Select.Option>
            <Select.Option value={100}>100</Select.Option>
          </Select>
          {!!inputtedRepoNameList.length && (
            <Button className="ml-3 bg-blue-500" type="primary" onClick={handleQuery}>
              Search
            </Button>
          )}
        </div>
        <Table
          loading={loading}
          scroll={{ x: 1200 }}
          dataSource={repoInfoDetailList}
          columns={columns}
          rowKey={({ id }) => id}
        />
      </Content>
      <Footer className="text-center">
        Copyright © 2021-present{' '}
        <a className="text-blue-500" href="https://github.com/lijianru">
          lijianru
        </a>
      </Footer>
    </Layout>
  );
}

export default App;
