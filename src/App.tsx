import React, { useEffect } from 'react';
import { Octokit } from 'octokit';
import { Button } from 'antd';
import './App.css';

const octokit = new Octokit();
function App() {
  useEffect(() => {
    octokit.request('GET /repos/{owner}/{repo}/contributors', {
      owner: 'octocat',
      repo: 'hello-world',
    });
  }, []);
  return (
    <div>
      <Button>test</Button>
    </div>
  );
}

export default App;
