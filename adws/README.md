# AI Developer Workflows (ADWs)

This directory contains the automation scripts that enable AI-driven development for the Task Manager Challenge project.

## Quick Start

### Prerequisites

1. **Install uv** (Python package manager)
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Install GitHub CLI**
   ```bash
   brew install gh
   gh auth login
   ```

3. **Install Claude Code CLI**
   Follow instructions at [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code)

### Setup

1. **Install dependencies**
   ```bash
   cd adws
   uv sync
   ```

2. **Configure environment variables**
   ```bash
   cp ../.env.sample .env
   # Edit .env with your credentials
   ```

3. **Set environment variables** (or add to your shell profile)
   ```bash
   export GITHUB_REPO_URL="https://github.com/emmanuelnest/Agentic-AI-Challenge-"
   export ANTHROPIC_API_KEY="your-api-key"
   export GITHUB_PAT="your-github-token"  # Optional
   ```

## Usage

### Process a GitHub Issue

The main workflow combines planning and building:

```bash
uv run adw_plan_build.py <issue-number>
```

This will:
1. Fetch the GitHub issue
2. Classify it (feature/bug/chore)
3. Create a feature branch
4. Generate an implementation plan in `specs/`
5. Implement the solution
6. Create a pull request

### Individual Phases

You can also run phases separately:

```bash
# Planning only
uv run adw_plan.py <issue-number>

# Building only (requires existing plan)
uv run adw_build.py <issue-number> <adw-id>
```

## Workflow Scripts

- **adw_plan.py** - Creates implementation plans from GitHub issues
- **adw_build.py** - Implements solutions based on plans
- **adw_plan_build.py** - Combined plan + build workflow (recommended)

## Modules

- **adw_modules/agent.py** - Claude Code CLI integration
- **adw_modules/github.py** - GitHub API operations
- **adw_modules/git_ops.py** - Git operations (branch, commit, PR)
- **adw_modules/workflow_ops.py** - Core workflow orchestration
- **adw_modules/data_types.py** - Pydantic models for type safety
- **adw_modules/utils.py** - Utility functions

## Example Workflow

1. **Create a GitHub issue**
   ```
   Title: Add task filtering functionality
   Body:
   - Filter by All, Active, Completed
   - Show task count
   - Clear completed button
   ```

2. **Run ADW**
   ```bash
   cd adws
   uv run adw_plan_build.py 2
   ```

3. **Review the output**
   - Plan created in `specs/issue-2-adw-xxxxxxxx-sdlc_planner-task-filtering.md`
   - Code implemented in feature branch
   - PR created automatically

4. **Review and merge PR**

5. **Repeat for next issue**

## Troubleshooting

### "Claude Code CLI is not installed"
```bash
which claude  # Check if installed
# Follow https://docs.anthropic.com/en/docs/claude-code
```

### "Missing GITHUB_PAT"
```bash
# Optional - only if using different account than 'gh auth login'
export GITHUB_PAT=$(gh auth token)
```

### "Agent execution failed"
Check the agent output in the `agents/` directory:
```bash
cat agents/*/sdlc_planner/raw_output.jsonl | tail -1 | jq .
```

## Environment Variables

Required:
- `GITHUB_REPO_URL` - Your GitHub repository URL
- `ANTHROPIC_API_KEY` - Your Anthropic API key

Optional:
- `GITHUB_PAT` - GitHub Personal Access Token (only if using different account than gh CLI)
- `CLAUDE_CODE_PATH` - Path to Claude Code CLI (defaults to "claude")

## Output Structure

Each ADW run creates an isolated workspace:

```
agents/
└── {adw_id}/                     # Unique 8-character ID
    ├── adw_state.json            # Workflow state
    ├── {adw_id}_plan_spec.md     # Implementation plan
    ├── planner/                  # Planning agent output
    │   └── raw_output.jsonl
    └── implementor/              # Implementation agent output
        └── raw_output.jsonl

specs/                            # Implementation plans
└── issue-{N}-adw-{id}-sdlc_planner-{name}.md
```

## Tips

- Start with small, well-defined issues
- Review generated plans before implementation
- Keep issues focused on single features
- Use descriptive issue titles and descriptions
- Check PR diffs before merging

## More Information

For detailed documentation about the ADW pattern and architecture, see the main [README.md](../README.md).
