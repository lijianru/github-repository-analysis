import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { Layout, Select, Table, Typography, Input, Tag, message, Button } from 'antd';
import './App.css';
import { getRepoListInfo, RepoInfoResponse } from './service';
import { ColumnsType } from 'antd/es/table';
import { format } from 'date-fns';

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
    {
      title: 'Open Issues(Date)',
      dataIndex: 'openIssue',
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
      title: 'Open Issues(Comment)',
      dataIndex: 'openIssue',
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
      title: 'Open Pull Request(Date)',
      dataIndex: 'openPullRequest',
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
      message.warning('输入不正确！');
    }
  };

  const handleQuery = () => {
    setLoading(true);
    getRepoListInfo(inputtedRepoNameList, perPage).then((res) => {
      setLoading(false);
      setRepoInfoDetailList(res);
    });
  };

  useEffect(() => {
    handleQuery();
  }, [perPage]);

  return (
    <Layout className="min-h-screen bg-white">
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
        />
        <div className="mb-2">
          {inputtedRepoNameList.map((repo) => (
            <Tag
              closable
              key={repo}
              onClose={() => {
                setInputtedRepoNameList([...inputtedRepoNameList.filter((item) => item !== repo)]);
                setRepoInfoDetailList([
                  ...repoInfoDetailList.filter(({ full_name }) => repo !== full_name),
                ]);
              }}
            >
              <b>{repo}</b>
            </Tag>
          ))}
        </div>
        <div>
          查询数量（由近及远）：
          <Select defaultValue={perPage} onChange={(val) => setPerPage(val)}>
            <Select.Option value={10}>10</Select.Option>
            <Select.Option value={30}>30</Select.Option>
            <Select.Option value={50}>50</Select.Option>
            <Select.Option value={100}>100</Select.Option>
          </Select>
          {!!inputtedRepoNameList.length && (
            <Button className="ml-3 bg-blue-500" type="primary" onClick={handleQuery}>
              查询
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
      <Footer>
        <a className="text-blue-500" href="lijianru.github.com">
          lijianru.github.com
        </a>
      </Footer>
    </Layout>
  );
}

export default App;
