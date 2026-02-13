# E2E Test: Task Filtering Capabilities

## Instructions
Run these validation steps in order to verify the task filtering feature works correctly.

## Prerequisites
- Start the dev server with `npm run dev`
- Open `http://localhost:5173` in the browser

## Test Steps

### 1. Setup — Add Tasks
- Add 3 tasks: "Task A", "Task B", "Task C"
- Mark "Task A" and "Task C" as completed
- Take a screenshot

### 2. Verify Default "All" Filter
- Verify all 3 tasks are visible (default "All" filter)
- Verify task count shows "1 task remaining"
- Take a screenshot

### 3. Test "Active" Filter
- Click "Active" filter button
- Verify only "Task B" is visible
- Verify "Active" button is highlighted
- Take a screenshot

### 4. Test "Completed" Filter
- Click "Completed" filter button
- Verify only "Task A" and "Task C" are visible
- Verify "Completed" button is highlighted
- Take a screenshot

### 5. Test "All" Filter Again
- Click "All" filter button
- Verify all 3 tasks are visible again
- Verify "All" button is highlighted
- Take a screenshot

### 6. Test "Clear Completed" Button
- Click "Clear completed" button
- Verify "Task A" and "Task C" are removed
- Verify task count shows "1 task remaining"
- Verify "Clear completed" button is no longer visible (no completed tasks left)
- Take a screenshot

### 7. Test Filter Persistence
- Select "Active" filter
- Refresh the page
- Verify filter selection persists after refresh (should still be "Active")
- Take a screenshot

### 8. Edge Case — No Tasks
- Delete all remaining tasks
- Verify the filter bar is hidden when there are no tasks at all
- Take a screenshot

## Expected Results
- All filter buttons work correctly (All, Active, Completed)
- Active filter button is visually highlighted
- Task count updates dynamically with correct singular/plural form
- "Clear completed" button appears only when completed tasks exist
- Filter selection persists to localStorage across page refreshes
- Filter bar is hidden when no tasks exist
- No regressions in existing task CRUD functionality
