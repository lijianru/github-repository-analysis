import React, { useEffect, useState } from 'react';
import { Layout, Select, Table } from 'antd';
import './App.css';
import { getRepoListInfo, RepoInfoResponse } from './service';
import { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';

const { Header, Footer, Content } = Layout;

function App() {
  const [loading, setLoading] = useState(false);
  const [repoListDetails, setRepoListDetails] = useState<RepoInfoResponse[]>([]);
  const [perPage, setPerPage] = useState(30);

  useEffect(() => {
    setLoading(true);
    getRepoListInfo(
      [
        {
          owner: 'react-native-elements',
          repo: 'react-native-elements',
          org: 'react-native-elements',
        },
        {
          owner: 'GeekyAnts',
          repo: 'NativeBase',
          org: 'GeekyAnts',
        },
        {
          owner: 'callstack',
          repo: 'react-native-paper',
          org: 'callstack',
        },
        {
          owner: 'wix',
          repo: 'react-native-ui-lib',
          org: 'wix',
        },
      ],
      perPage
    ).then((res) => {
      setLoading(false);
      setRepoListDetails(res);
    });
  }, [perPage]);

  const columns: ColumnsType<RepoInfoResponse> = [
    {
      title: '仓库地址',
      dataIndex: 'html_url',
      width: 150,
      render: (html_url) => <a>{html_url}</a>,
    },
    {
      title: 'Star',
      dataIndex: 'stargazers_count',
    },
    {
      title: '创建时间',
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
            <div>最大值：{date.max}天</div>
            <div>最小值：{date.min}天</div>
            <div>80百分位值：{date.percentile80}天</div>
            <div>90百分位值：{date.percentile90}天</div>
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
            <div>最大值：{comment.max}条</div>
            <div>最小值：{comment.min}条</div>
            <div>80百分位值：{comment.percentile80}条</div>
            <div>90百分位值：{comment.percentile90}条</div>
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
            <div>最大值：{date.max}天</div>
            <div>最小值：{date.min}天</div>
            <div>80百分位值：{date.percentile80}天</div>
            <div>90百分位值：{date.percentile90}天</div>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <Header className="header">
        <h1>Github repository analysis</h1>
      </Header>
      <Content className="content">
        <div>
          查询条数：
          <Select defaultValue={perPage} onChange={(val) => setPerPage(val)}>
            <Select.Option value={30}>30</Select.Option>
            <Select.Option value={50}>50</Select.Option>
            <Select.Option value={100}>100</Select.Option>
          </Select>
        </div>
        <Table
          loading={loading}
          scroll={{ x: 1200 }}
          dataSource={repoListDetails}
          columns={columns}
          rowKey={({ id }) => id}
        />
      </Content>
      <Footer>
        <a href="lijianru.github.com">lijianru.github.com</a>
      </Footer>
    </Layout>
  );
}

export default App;
