# Pomodoro Timer - Agentic AI Challenge

A modern Pomodoro timer application built entirely using AI agents following the **plan → build → test** workflow.




## 🎯 Project Overview

This project is part of the **Agentic AI Challenge**, demonstrating how AI agents can autonomously handle the entire software development lifecycle - from planning to implementation to deployment.

**Current Status**: 5 major features implemented | Production-ready

The application is a fully functional Pomodoro timer with advanced features including customizable timer durations, multiple themes, focus statistics tracking, and comprehensive notification system. All features were implemented through an AI-driven workflow using GitHub issues, automated planning, and Claude Code CLI.

### Key Features
- ⏱️ Configurable Pomodoro timer with work/short break/long break cycles
- ⏯️ Start, pause, and reset functionality
- 🔔 Audio and visual notifications with browser notification support
- 📊 Session tracking with focus statistics and daily charts
- 🎨 Theme customization (Dark, Light, Ocean)
- ⚙️ Customizable timer durations for work and break periods
- 💾 LocalStorage persistence for all settings and session history
- 📱 Responsive design with smooth animations

### Feature Details

**Pomodoro Timer**
- Three cycle types: Work (default 25min), Short Break (5min), Long Break (15min)
- Animated circular progress indicator
- Easy cycle switching during sessions
- Automatic progression through cycles

**Notifications**
- Visual notification banners with cycle-specific messages
- Browser notifications with permission handling
- Audio notifications with multiple sound options
- Customizable notification preferences per notification type
- Settings panel for granular control

**Focus Statistics**
- Track all completed sessions (work, short break, long break)
- View total focus time, session counts, and averages
- Daily focus chart showing work sessions over time
- Statistics modal with comprehensive metrics
- Historical data preserved across sessions

**Theme System**
- Three built-in themes optimized for different environments
- Smooth transitions between themes
- Cycle-specific gradient backgrounds
- Consistent design system with CSS custom properties
- Theme preference persisted automatically

**Timer Customization**
- Adjust work session duration (1-60 minutes)
- Adjust short break duration (1-30 minutes)
- Adjust long break duration (1-60 minutes)
- Settings integrated in notification panel
- Changes take effect on next timer start

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

**E2E Testing:**
- `/e2e:test_pomodoro_timer` - Test core timer functionality
- `/e2e:test_notifications` - Test audio and visual notifications
- `/e2e:test_focus_statistics` - Test statistics and session tracking
- `/e2e:test_theme_customization` - Test theme switching
- `/e2e:test_task_management` - Test task management features
- `/e2e:test_task_categories` - Test task categorization
- `/e2e:test_task_filtering` - Test task filtering
- `/e2e:test_dark_mode` - Test dark mode toggle

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

# Lint code
npm run lint

# Format code
npm run format
```

Visit [http://localhost:5173](http://localhost:5173)


## 🛠️ Using ADWs

### Process a GitHub Issue

The ADW system automates the entire development workflow from issue to pull request.

**Setup Environment Variables**:

```bash
cd adws/

# Windows PowerShell
$env:GITHUB_REPO_URL="https://github.com/YOUR_USERNAME/pomodoro-challenge"
$env:ANTHROPIC_API_KEY="your-api-key"

# Windows CMD
set GITHUB_REPO_URL=https://github.com/YOUR_USERNAME/pomodoro-challenge
set ANTHROPIC_API_KEY=your-api-key

# macOS/Linux
export GITHUB_REPO_URL="https://github.com/YOUR_USERNAME/pomodoro-challenge"
export ANTHROPIC_API_KEY="your-api-key"
```

**Run the ADW Workflow**:

```bash
# Complete workflow (recommended): plan + build + PR
uv run adw_plan_build.py <issue-number>

# Separate phases:
uv run adw_plan.py <issue-number>              # 1. Planning only
uv run adw_build.py <issue-number> <adw-id>    # 2. Build only (after planning)
```




**Note**: This project demonstrates AI-driven development where each feature was implemented by AI agents following the **plan → build → test workflow**, with human oversight for quality control. The commit history, implementation plans, and pull requests provide full transparency into the agentic development process.
