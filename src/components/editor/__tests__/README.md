# PlateEditor Tests

This directory contains comprehensive unit tests for the PlateEditor component.

## Test File

- **`plate-editor.test.tsx`**: 48 test cases covering all functionality

## Coverage

The test suite provides comprehensive coverage for:

- Component rendering
- Read-only mode toggle functionality
- State management
- User interactions
- Accessibility
- Edge cases

## Running Tests

From the project root:

```bash
# Run all tests
npm test

# Run only PlateEditor tests
npm test plate-editor

# Run with coverage
npm run test:coverage
```

## Test Categories

1. **Initial Rendering**: Verify all components render correctly
2. **Initial State**: Confirm default read-only state
3. **Toggle Functionality**: Test read-only mode switching
4. **Component Structure**: Validate component hierarchy
5. **Editor Configuration**: Check editor setup
6. **Accessibility**: Ensure accessible interactions
7. **Edge Cases**: Handle unusual scenarios
8. **Button States**: Verify button text and variants
9. **Plate Props**: Validate prop passing
10. **State Management**: Test React state handling
11. **Integration**: Check hook usage
12. **Layout**: Verify component positioning

## Adding New Tests

When modifying PlateEditor:

1. Add tests for new features
2. Update existing tests if behavior changes
3. Ensure coverage remains high
4. Follow existing test patterns
5. Use descriptive test names

## Mocking

All external dependencies are mocked to:
- Isolate component logic
- Speed up test execution
- Ensure consistent behavior
- Simplify test assertions

See the main test file for mock implementations.