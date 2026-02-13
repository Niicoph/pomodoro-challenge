# E2E Test: Task Categories

## Instructions
Run these validation steps in order to verify the task categories feature works correctly.

## Prerequisites
- Start the dev server with `npm run dev`
- Open `http://localhost:5173` in the browser

## Test Steps

### 1. Test Category Selector in Form
- Verify the category selector dropdown is visible in the task creation form
- Verify the default selected category is "Other"
- Verify all 5 categories are available in the dropdown: Work, Personal, Shopping, Health, Other
- Take a screenshot of the form with category selector

### 2. Test Task Creation with Categories
- Add a task "Finish report" with category "Work"
- Add a task "Buy milk" with category "Shopping"
- Add a task "Go for a run" with category "Health"
- Add a task "Call mom" with category "Personal"
- Add a task "Misc errand" with default category "Other"
- Verify all 5 tasks appear in the list
- Take a screenshot showing all tasks with category badges

### 3. Test Category Badges
- Verify each task displays a colored badge matching its category
- Verify "Finish report" has a "Work" badge (blue color)
- Verify "Buy milk" has a "Shopping" badge (green color)
- Verify "Go for a run" has a "Health" badge (rose/red color)
- Verify "Call mom" has a "Personal" badge (purple color)
- Verify "Misc errand" has an "Other" badge (gray color)
- Take a screenshot highlighting category badges

### 4. Test Category Filter
- Verify the category filter bar is visible with "All" and all 5 category buttons
- Click "Work" category filter — verify only "Finish report" is visible
- Click "Shopping" category filter — verify only "Buy milk" is visible
- Click "All" category filter — verify all 5 tasks are visible again
- Take a screenshot of filtered view

### 5. Test Category Filter Combined with Status Filter
- Mark "Finish report" and "Buy milk" as completed
- Set category filter to "Work" and status filter to "Completed"
- Verify only "Finish report" is visible
- Reset both filters to "All"
- Verify all 5 tasks are visible
- Take a screenshot

### 6. Test Persistence
- Refresh the page
- Verify all tasks retain their categories
- Verify category badges are still displayed correctly
- Take a screenshot after refresh

### 7. Test Edge Case — No Tasks in Category
- Click "Health" category filter
- Delete "Go for a run"
- Verify empty state message is shown for the filtered category
- Take a screenshot

## Expected Results
- Category selector dropdown is visible in the task creation form with all 5 options
- Default category selection is "Other"
- Tasks display their category as a colored badge (pill-shaped, color-coded)
- Each category has a distinct color: Work (blue), Personal (purple), Shopping (green), Health (rose), Other (gray)
- Category filter bar displays "All" and each category as filter options
- Category filtering works correctly alone and in combination with status filtering
- Category filter and task categories persist across page refreshes via localStorage
- Empty state messages are contextual when filters yield no results
- No regressions in existing task CRUD and status filtering functionality
