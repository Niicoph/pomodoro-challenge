# Review

Follow the `Instructions` below to **review work done against a specification file** (spec/*.md) to ensure implemented features match requirements. Use the spec file to understand the requirements and then use the git diff if available to understand the changes made. If there are issues, report them if not then report success.

## Variables

adw_id: $1
spec_file: $2
agent_name: $3 if provided, otherwise use 'review_agent'

## Instructions

- Check current git branch using `git branch` to understand context
- Run `git diff origin/main` to see all changes made in current branch. Continue even if there are no changes related to the spec file.
- Find the spec file by looking for spec/*.md files in the diff that match the current branch name
- Read the identified spec file to understand requirements
- IMPORTANT: Compare the implementation against the spec requirements:
  - Review code changes to verify they match the spec
  - Check that all required functionality is implemented
  - Identify any deviations from the spec
  - Look for potential bugs or issues in the implementation
- IMPORTANT: Issue Severity Guidelines
  - Think hard about the impact of the issue on the feature and the user
  - Guidelines:
    - `skippable` - the issue is non-blocker for the work to be released but is still a problem
    - `tech_debt` - the issue is non-blocker for the work to be released but will create technical debt that should be addressed in the future
    - `blocker` - the issue is a blocker for the work to be released and should be addressed immediately. It will harm the user experience or will not function as expected.
- IMPORTANT: Return ONLY the JSON object with review results
  - IMPORTANT: Output your result in JSON format based on the `Report` section below.
  - IMPORTANT: Do not include any additional text, explanations, or markdown formatting
  - We'll immediately run JSON.parse() on the output, so make sure it's valid JSON
- Ultra think as you work through the review process. Focus on the critical functionality and the user experience. Don't report issues if they are not critical to the feature.
- IMPORTANT: Manual Testing Required
  - Since this project uses React with Vite, the reviewer should manually test the application in the browser at http://localhost:5173
  - Instruct the user to start the application with `npm run dev` if not already running
  - The user should manually verify the feature works as expected in the browser

## Report

- IMPORTANT: Return results exclusively as a JSON object based on the `Output Structure` section below.
- `success` should be `true` if there are NO BLOCKING issues (implementation matches spec for critical functionality)
- `success` should be `false` ONLY if there are BLOCKING issues that prevent the work from being released
- `review_issues` can contain issues of any severity (skippable, tech_debt, or blocker)
- `manual_testing_required` should be set to `true` and include instructions for the user to manually test
- This allows subsequent agents to quickly identify and resolve blocking errors while documenting all issues

### Output Structure

```json
{
    "success": "boolean - true if there are NO BLOCKING issues (can have skippable/tech_debt issues), false if there are BLOCKING issues",
    "review_summary": "string - 2-4 sentences describing what was built and whether it matches the spec. Written as if reporting during a standup meeting. Example: 'The task filtering feature has been implemented with All, Active, and Completed filters. The implementation matches the spec requirements and includes task count display. Minor UI improvements could be made but all core functionality is working as specified.'",
    "review_issues": [
        {
            "review_issue_number": "number - the issue number based on the index of this issue",
            "issue_description": "string - description of the issue",
            "issue_resolution": "string - description of the resolution",
            "issue_severity": "string - severity of the issue between 'skippable', 'tech_debt', 'blocker'"
        }
    ],
    "manual_testing_required": true,
    "manual_testing_instructions": "string - Instructions for the user to manually test the feature in the browser. Example: 'Start the application with `npm run dev` and navigate to http://localhost:5173. Test the following: 1) Click on the All/Active/Completed filter buttons and verify tasks are filtered correctly. 2) Create a new task and verify it appears in the list. 3) Mark a task as complete and verify it moves to the Completed filter.'"
}
```

### Example Output

```json
{
    "success": true,
    "review_summary": "The task filtering feature has been implemented with All, Active, and Completed filters. The implementation matches the spec requirements and includes task count display. All core functionality is working as specified in the code review.",
    "review_issues": [
        {
            "review_issue_number": 1,
            "issue_description": "Filter buttons could use more visual feedback when active",
            "issue_resolution": "Add hover and active states to filter buttons for better UX",
            "issue_severity": "skippable"
        }
    ],
    "manual_testing_required": true,
    "manual_testing_instructions": "Start the application with `npm run dev` and navigate to http://localhost:5173. Test the following: 1) Click on the All/Active/Completed filter buttons and verify tasks are filtered correctly. 2) Verify the task count updates correctly when filtering. 3) Create a new task and verify it appears under the All filter. 4) Mark a task as complete and verify it only appears under the Completed filter."
}
```
