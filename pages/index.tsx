import type { NextPage } from 'next';
import { Octokit } from 'octokit';
import { useEffect } from 'react';

const octokit = new Octokit();

const Home: NextPage = () => {
  useEffect(() => {
    octokit.request('GET /repos/{owner}/{repo}/contributors', {
      owner: 'octocat',
      repo: 'hello-world',
    });
  }, []);

  return <div>test</div>;
};

export default Home;
