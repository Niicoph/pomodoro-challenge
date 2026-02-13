# Install & Prime

## Read
.env.sample (never read .env)

## Read and Execute
.claude/commands/prime.md

## Run
- Think through each of these steps to make sure you don't miss anything.
- Remove the existing git remote: `git remote remove origin`
- Initialize a new git repository: `git init`
- Install frontend dependencies with npm: `npm install`
- Install ADW dependencies: `cd adws && uv sync && cd ..`
- Copy the .env file: `cp .env.sample .env`

## Report
- Output the work you've just done in a concise bullet point list.
- Instruct the user to fill out the root level `./.env` based on `.env.sample` with their API keys:
  - `GITHUB_REPO_URL` - Your GitHub repository URL
  - `ANTHROPIC_API_KEY` - Your Anthropic API key
  - `GITHUB_PAT` - (Optional) GitHub Personal Access Token
- Mention the url of the frontend application: `http://localhost:5173`
- Mention: 'To setup your AFK Agent, be sure to update the remote repo url and push to a new repo so you have access to git issues and git prs:
  ```
  git remote add origin <your-new-repo-url>
  git push -u origin main
  ```'
- Mention: 'To start the development server, run: `/start` or `npm run dev`'
