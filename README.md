# Pomodoro Timer - Agentic AI Challenge

A modern Pomodoro timer application built entirely using AI agents following the **plan → build → test** workflow.

🔗 **Live Demo**: [To be deployed on Vercel]

## 🎯 Project Overview

This project is part of the **Agentic AI Challenge**, demonstrating how AI agents can autonomously handle the entire software development lifecycle - from planning to implementation to deployment.

### Key Features (To Be Implemented)
- ⏱️ Configurable Pomodoro timer (work/break intervals)
- ⏯️ Start, pause, and reset functionality
- 🔔 Audio/visual notifications when timer completes
- 📊 Session tracking and statistics
- 🎨 Dark mode toggle
- 💾 LocalStorage persistence
- 📱 Responsive design

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + LocalStorage
- **Build Tool**: Vite
- **Deployment**: Vercel
- **AI Development**: Claude Code CLI + Custom ADWs

## 🤖 Agentic Development Workflow

This project uses **AI Developer Workflows (ADWs)** to automate development:

1. **Create GitHub Issue** - Define what needs to be built
2. **ADW Processes Issue** - AI agent analyzes the requirement
3. **Generate Plan** - Creates detailed implementation spec in `specs/`
4. **Implement Solution** - AI writes the code
5. **Create Pull Request** - Automatically opens PR with changes

### ADW Structure

```
.claude/
├── commands/           # Slash commands (/feature, /chore, etc.)
│   ├── install.md      # Project setup and initialization
│   ├── prime.md        # Understand codebase
│   ├── start.md        # Start dev server
│   ├── test.md         # Run validation tests
│   ├── feature.md      # Plan new features
│   ├── bug.md          # Plan bug fixes
│   ├── patch.md        # Quick fixes
│   ├── implement.md    # Execute plans
│   ├── review.md       # Review implementations
│   ├── document.md     # Generate documentation
│   ├── commit.md       # Create git commits
│   ├── pull_request.md # Create PRs
│   ├── generate_branch_name.md
│   ├── classify_issue.md
│   └── conditional_docs.md
├── hooks/             # Git hooks (optional)
└── settings.json      # Permissions and configuration

adws/
├── adw_modules/       # Core ADW functionality
│   ├── agent.py       # Claude Code integration
│   ├── github.py      # GitHub API operations
│   ├── git_ops.py     # Git operations
│   └── workflow_ops.py # Workflow orchestration
├── adw_plan.py        # Planning phase
├── adw_build.py       # Implementation phase
└── adw_plan_build.py  # Combined workflow

specs/                 # Generated implementation plans
├── patch/            # Patch plans for quick fixes
└── *.md              # Feature and bug plans

app_docs/             # Generated feature documentation
└── assets/           # Screenshots and images
```

### Available Commands

Use these slash commands in Claude Code:

**Setup & Development:**
- `/install` - Initialize project and install dependencies
- `/prime` - Understand the codebase structure
- `/start` - Start the development server

**Planning:**
- `/feature` - Plan a new feature from GitHub issue
- `/bug` - Plan a bug fix from GitHub issue
- `/chore` - Plan maintenance tasks
- `/patch` - Create quick fix plan

**Implementation:**
- `/implement <plan-path>` - Execute an implementation plan
- `/test` - Run validation suite (TypeScript, ESLint, build)
- `/review <adw-id> <spec-path>` - Review implementation against spec

**Git Operations:**
- `/commit` - Create a git commit with proper message
- `/pull_request` - Create a pull request

**Documentation:**
- `/document <adw-id> <spec-path>` - Generate feature documentation

**Utilities:**
- `/classify_issue <issue-json>` - Classify GitHub issue type
- `/generate_branch_name <type> <adw-id> <issue-json>` - Generate branch name

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- Python 3.10+
- uv (Python package manager): `pip install uv` (Windows) or `curl -LsSf https://astral.sh/uv/install.sh | sh` (Mac/Linux)
- GitHub CLI: `winget install GitHub.cli` (Windows) or `brew install gh` (Mac), then `gh auth login`
- Claude Code CLI: [Installation Guide](https://docs.anthropic.com/en/docs/claude-code)

### Installation

1. **Clone the repository**
   ```bash
   git clone YOUR_REPO_URL
   cd pomodoro-challenge
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Setup ADWs environment**
   ```bash
   copy .env.sample .env
   # Edit .env with your API keys
   ```

4. **Install ADW dependencies**
   ```bash
   cd adws
   uv sync
   ```

### Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit [http://localhost:5173](http://localhost:5173)

## 🛠️ Using ADWs

### Process a GitHub Issue

```bash
cd adws/

# Set environment variables (Windows PowerShell)
$env:GITHUB_REPO_URL="YOUR_REPO_URL"
$env:ANTHROPIC_API_KEY="your-api-key"

# Or on Windows CMD
set GITHUB_REPO_URL=YOUR_REPO_URL
set ANTHROPIC_API_KEY=your-api-key

# Process an issue (plan + build)
uv run adw_plan_build.py <issue-number>

# Or run phases separately
uv run adw_plan.py <issue-number>  # Planning only
uv run adw_build.py <issue-number> <adw-id>  # Build only
```

### Example Workflow

1. Create issue #1: "Add basic Pomodoro timer functionality"
2. Run: `uv run adw_plan_build.py 1`
3. ADW will:
   - Analyze the issue
   - Generate implementation plan in `specs/`
   - Create feature branch
   - Implement the code
   - Create pull request
4. Review and merge the PR
5. Repeat for next issue!

## 📋 Planned Issues

Here are the issues to implement sequentially:

### Issue #1: Initial Project Setup ✅
**Type**: `/chore`
```markdown
Setup base project with Vite + React + TypeScript

- Initialize Vite project ✅ (completed)
- Configure TypeScript strict mode ✅
- Add Tailwind CSS for styling ✅
- Setup basic folder structure ✅
- Create base App component ✅
```

### Issue #2: Core Pomodoro Timer
**Type**: `/feature`
```markdown
Implement core Pomodoro timer functionality

- Create timer component with countdown display
- Add configurable work/break durations (default: 25/5 minutes)
- Implement start, pause, and reset controls
- Add visual progress indicator
- Persist timer state in localStorage
```

### Issue #3: Timer Notifications
**Type**: `/feature`
```markdown
Add notifications when timer completes

- Browser notification support
- Audio notification option
- Visual alerts when session ends
- Notification preferences in settings
```

### Issue #4: Session Tracking
**Type**: `/feature`
```markdown
Track and display Pomodoro sessions

- Count completed sessions
- Display session history
- Show daily/weekly statistics
- Export session data
```

### Issue #5: Customization & Settings
**Type**: `/feature`
```markdown
Add user customization options

- Customize work/break durations
- Choose notification sounds
- Configure auto-start behavior
- Theme preferences
```

### Issue #6: Dark Mode
**Type**: `/feature`
```markdown
Implement dark mode toggle

- Add theme context
- Create toggle button
- Update all styles for dark theme
- Persist preference in localStorage
```

### Issue #7: Deployment
**Type**: `/chore`
```markdown
Deploy to Vercel

- Connect GitHub repo to Vercel
- Configure build settings
- Test production deployment
- Add deployment URL to README
```

## 📁 Project Structure

```
pomodoro-challenge/
├── .claude/              # Claude Code configuration
│   ├── commands/         # Custom slash commands
│   └── hooks/           # Git hooks
├── adws/                # AI Developer Workflows
│   ├── adw_modules/     # Core modules
│   └── *.py            # Workflow scripts
├── specs/               # Implementation plans
├── src/                 # React application
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript types
├── public/             # Static assets
└── dist/               # Build output
```

## 🎓 Challenge Requirements

This project fulfills the **Agentic AI Challenge** requirements:

✅ **Development based on Issues**
- All features implemented via GitHub issues
- Each issue processed by ADWs
- Commit history shows agent-driven development

✅ **Demonstrable Agentic Layer**
- `.claude/commands/` - Custom slash commands
- `adws/` - AI Developer Workflows
- `specs/` - Generated implementation plans

✅ **Vercel Deployment**
- Configured for Vercel deployment
- Production-ready build
- Publicly accessible

## 📧 Submission

**Email to**: agentic.challenge@patagonian.com

**Subject**: Agentic AI Challenge - Pomodoro Timer

**Content**:
- GitHub Repository URL: `YOUR_REPO_URL`
- Vercel URL: `YOUR_VERCEL_URL`
- GitHub Issue demonstrating ADW workflow

## 🔒 Environment Variables

Create a `.env` file in the `adws/` directory (see `.env.sample`):

```bash
GITHUB_REPO_URL=YOUR_REPO_URL
GITHUB_PAT=your_github_token
ANTHROPIC_API_KEY=your_anthropic_key
```

## 📝 License

MIT License - Feel free to use this as a template for your own agentic projects!

## 🙏 Acknowledgments

Built with [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) and the AI Developer Workflow pattern learned in the TAC Agentic Coding course.

---

**Note**: This project demonstrates AI-driven development. Each feature is implemented by AI agents following the plan → build → test workflow, with human oversight for quality control.
