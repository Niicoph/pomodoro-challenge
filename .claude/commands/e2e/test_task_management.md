# E2E Test: Core Task Management

## Prerequisites
- Development server running at http://localhost:5173 (`npm run dev`)

## Test Steps

### 1. Initial State
- Open http://localhost:5173 in the browser
- Verify the task creation form is visible (input field + "Add" button)
- Verify empty state message is displayed: "No tasks yet. Add one above!"
- Take screenshot of initial state

### 2. Task Creation (Button Click)
- Type "Buy groceries" in the input field
- Click the "Add" button
- Verify the task "Buy groceries" appears in the list
- Verify the input field is cleared after submission
- Take screenshot after first task creation

### 3. Task Creation (Enter Key)
- Type "Walk the dog" in the input field
- Press Enter
- Verify the task "Walk the dog" appears in the list
- Verify both tasks are now visible
- Take screenshot after second task creation

### 4. Empty Input Validation
- Leave the input field empty and click "Add"
- Verify no new task is created
- Type only spaces in the input field and click "Add"
- Verify no new task is created (whitespace-only rejected)

### 5. Task Completion Toggle
- Click the checkbox on "Buy groceries"
- Verify it toggles to completed (strikethrough styling applied)
- Take screenshot of completed task
- Click the checkbox on "Buy groceries" again
- Verify it toggles back to incomplete (strikethrough removed)

### 6. Task Deletion
- Click the delete button on "Walk the dog"
- Verify it is removed from the list
- Verify "Buy groceries" still exists
- Take screenshot after deletion

### 7. Persistence (Page Refresh)
- Refresh the page (Cmd+R / Ctrl+R)
- Verify "Buy groceries" task persists after refresh
- Verify its completion state is preserved
- Take screenshot after refresh

### 8. Empty State Recovery
- Delete all remaining tasks
- Verify empty state message reappears: "No tasks yet. Add one above!"
- Take screenshot of restored empty state

## Expected Results
- All CRUD operations work correctly (Create, Read, Update completion, Delete)
- localStorage persistence survives page refresh
- Empty state message displays when no tasks exist
- Input validation prevents empty/whitespace tasks
- UI styling is consistent with Tailwind CSS design
