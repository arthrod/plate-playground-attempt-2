# Testing Documentation

## Overview

This project uses **Vitest** as the testing framework along with **React Testing Library** for component testing. The test suite provides comprehensive coverage for the PlateEditor component's read-only mode functionality.

## Test Setup

### Configuration Files

- **`vitest.config.ts`**: Main Vitest configuration with jsdom environment and path aliases
- **`vitest.setup.ts`**: Test setup file that configures jest-dom matchers and cleanup
- **`package.json`**: Updated with test scripts and testing dependencies

### Dependencies

The following testing dependencies have been added:

- `vitest`: Fast unit test framework
- `@testing-library/react`: React component testing utilities
- `@testing-library/jest-dom`: Custom jest matchers for DOM assertions
- `@testing-library/user-event`: User interaction simulation
- `@vitejs/plugin-react`: Vite React plugin for JSX support
- `@vitest/ui`: UI for running and viewing tests
- `@vitest/coverage-v8`: Code coverage reporting
- `jsdom`: DOM environment for Node.js

## Running Tests

### Install Dependencies

First, install the testing dependencies:

```bash
npm install
```

### Available Commands

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### PlateEditor Component Tests

Location: `src/components/editor/__tests__/plate-editor.test.tsx`

The test suite includes **48 comprehensive test cases** organized into the following categories:

#### 1. Initial Rendering (7 tests)
- Verifies all components render without crashing
- Checks presence of title, button, editor, and dialog components

#### 2. Initial State - Read-Only Mode (4 tests)
- Confirms default state is edit mode (readOnly = false)
- Validates initial button text and styling
- Checks button variant and size properties

#### 3. Toggle Read-Only Functionality (6 tests)
- Tests state toggling on button click
- Verifies button text changes between modes
- Checks button variant changes (outline ↔ default)
- Tests multiple toggles to ensure state consistency
- Validates readOnly prop propagation to Plate component

#### 4. Component Structure (6 tests)
- Validates component hierarchy and nesting
- Checks CSS class application
- Verifies proper layout structure
- Tests component containment relationships

#### 5. Editor Configuration (3 tests)
- Confirms EditorKit plugins are passed to usePlateEditor
- Validates value prop configuration
- Checks editor instance propagation

#### 6. Accessibility (3 tests)
- Tests heading accessibility
- Validates button accessibility and labeling
- Ensures interactive elements remain functional

#### 7. Edge Cases (3 tests)
- Tests rapid clicking behavior
- Validates multiple re-renders don't cause errors
- Checks state independence across multiple instances

#### 8. Button Text Content (3 tests)
- Verifies correct text display in each mode
- Ensures only one text variant displays at a time

#### 9. Button Visual State (3 tests)
- Tests button variant in edit mode (outline)
- Tests button variant in read-only mode (default)
- Validates variant alternation on toggle

#### 10. Plate Component Props (3 tests)
- Confirms initial readOnly prop value
- Tests readOnly prop updates on toggle
- Validates dynamic prop changes

#### 11. State Management (2 tests)
- Verifies React.useState usage
- Tests state persistence across re-renders

#### 12. Integration with usePlateEditor (3 tests)
- Confirms hook is called
- Validates hook configuration
- Checks call frequency

#### 13. Editor Variant (1 test)
- Verifies demo variant is passed to Editor component

#### 14. Component Layout (2 tests)
- Tests header positioning above editor
- Validates spacing between components

## Code Coverage

The test suite aims for comprehensive coverage of the PlateEditor component, specifically focusing on:

- **Branches**: All conditional logic paths (readOnly toggle, button variants)
- **Functions**: All event handlers and component functions
- **Lines**: All executable code lines
- **Statements**: All JavaScript statements

To view coverage report:

```bash
npm run test:coverage
```

Coverage reports are generated in:
- **Console**: Text format in terminal
- **HTML**: `coverage/index.html` (open in browser)
- **JSON**: `coverage/coverage.json` (for CI/CD)

## Mocking Strategy

### External Dependencies

The tests mock the following external dependencies:

1. **`platejs`**: Mocks `normalizeNodeId` to avoid dependency on actual implementation
2. **`platejs/react`**: Mocks `Plate` and `usePlateEditor` with test-friendly implementations
3. **`@/components/editor/editor-kit`**: Mocks with simple plugin array
4. **`@/components/editor/settings-dialog`**: Mocks with test ID for verification
5. **`@/components/ui/button`**: Mocks to expose variant and size as data attributes
6. **`@/components/ui/editor`**: Mocks Editor and EditorContainer with test IDs

### Mock Benefits

- **Isolation**: Tests focus only on PlateEditor logic
- **Speed**: No heavy dependencies to load
- **Reliability**: Consistent behavior across test runs
- **Simplicity**: Easy to verify component interactions

## Test Best Practices

### Followed in This Suite

1. **Descriptive Test Names**: Each test clearly states what it validates
2. **Arrange-Act-Assert**: Tests follow AAA pattern
3. **One Assertion Focus**: Each test validates a specific behavior
4. **Mock Isolation**: External dependencies are mocked
5. **Async Handling**: Proper use of `waitFor` for state updates
6. **Cleanup**: Automatic cleanup after each test
7. **Type Safety**: TypeScript throughout test code
8. **Accessibility**: Tests include accessibility checks

### Guidelines

- Always run tests before committing changes
- Add tests for new features immediately
- Update tests when refactoring components
- Maintain test coverage above 80%
- Use descriptive test names that explain the "should"
- Mock external dependencies to isolate units
- Test edge cases and error conditions
- Verify accessibility in component tests

## CI/CD Integration

### Running in CI

The test suite is designed to run in CI environments:

```bash
# For CI pipelines
npm run test:run
```

### Coverage Thresholds

Consider adding coverage thresholds to `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80
  }
}
```

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Ensure `@` alias is configured in both `tsconfig.json` and `vitest.config.ts`
   - Check that all paths are relative to the repository root

2. **Mock Not Working**
   - Verify mock is defined before component import
   - Use `vi.clearAllMocks()` in `beforeEach` to reset mocks

3. **Async Test Failures**
   - Use `waitFor` for state updates
   - Increase timeout if needed: `{ timeout: 5000 }`

4. **JSDOM Errors**
   - Ensure jsdom environment is set in vitest.config.ts
   - Some browser APIs may need additional polyfills

### Getting Help

- Check Vitest documentation: <https://vitest.dev/>
- React Testing Library docs: <https://testing-library.com/react>
- Review existing test patterns in this file

## Future Enhancements

### Potential Additions

1. **Integration Tests**: Test PlateEditor with real Plate components
2. **E2E Tests**: Add Playwright tests for full user flows
3. **Visual Regression**: Add visual testing with Percy or Chromatic
4. **Performance Tests**: Measure component render performance
5. **Snapshot Tests**: Add snapshots for complex UI states

### New Features to Test

When adding new features to PlateEditor, ensure tests cover:

- All user interactions
- State management and side effects
- Error handling and edge cases
- Accessibility requirements
- Integration with existing features

## Summary

This comprehensive test suite provides:

- ✅ **48 test cases** covering all PlateEditor functionality
- ✅ **Complete coverage** of the new read-only toggle feature
- ✅ **Mock isolation** for reliable, fast tests
- ✅ **Accessibility checks** for better UX
- ✅ **Edge case handling** for robustness
- ✅ **Clear documentation** for maintainability

The tests ensure that the PlateEditor component's read-only mode functionality works correctly and remains stable as the codebase evolves.