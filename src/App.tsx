import React, { useEffect } from 'react';
import logo from './logo.svg';
import { Octokit } from 'octokit';

const octokit = new Octokit();
function App() {
  useEffect(() => {
    octokit.request('GET /repos/{owner}/{repo}/contributors', {
      owner: 'octocat',
      repo: 'hello-world',
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
