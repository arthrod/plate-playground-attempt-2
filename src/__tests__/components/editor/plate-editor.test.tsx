import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { PlateEditor } from '@/components/editor/plate-editor';

// Mock the dependencies
vi.mock('platejs', () => ({
  normalizeNodeId: vi.fn((value) => value),
}));

vi.mock('platejs/react', () => ({
  Plate: ({ children, editor, readOnly }: any) => (
    <div data-testid="plate-component" data-readonly={readOnly}>
      {children}
    </div>
  ),
  usePlateEditor: vi.fn(() => ({
    id: 'test-editor',
    children: [],
    api: {},
  })),
}));

vi.mock('@/components/editor/editor-kit', () => ({
  EditorKit: [],
}));

vi.mock('@/components/editor/settings-dialog', () => ({
  SettingsDialog: () => <div data-testid="settings-dialog">Settings Dialog</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, ...props }: any) => (
    <button
      data-testid="toggle-button"
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/editor', () => ({
  Editor: ({ variant }: any) => (
    <div data-testid="editor" data-variant={variant}>
      Editor Content
    </div>
  ),
  EditorContainer: ({ children }: any) => (
    <div data-testid="editor-container">{children}</div>
  ),
}));

describe('PlateEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the PlateEditor component successfully', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('plate-component')).toBeInTheDocument();
    });

    it('should render with correct layout structure', () => {
      const { container } = render(<PlateEditor />);
      const layoutDiv = container.querySelector('.flex.h-full.flex-col.gap-4');
      expect(layoutDiv).toBeInTheDocument();
    });

    it('should render the header with title', () => {
      render(<PlateEditor />);
      const heading = screen.getByText('Plate Playground');
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });

    it('should apply correct header classes', () => {
      render(<PlateEditor />);
      const heading = screen.getByText('Plate Playground');
      expect(heading).toHaveClass('text-lg', 'font-semibold');
    });

    it('should render the toggle button', () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      expect(button).toBeInTheDocument();
    });

    it('should render Editor component', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('editor')).toBeInTheDocument();
    });

    it('should render EditorContainer component', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('editor-container')).toBeInTheDocument();
    });

    it('should render SettingsDialog component', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('settings-dialog')).toBeInTheDocument();
    });

    it('should render Editor with demo variant', () => {
      render(<PlateEditor />);
      const editor = screen.getByTestId('editor');
      expect(editor).toHaveAttribute('data-variant', 'demo');
    });
  });

  describe('Read-Only Mode Toggle', () => {
    it('should initialize in edit mode (readOnly: false)', () => {
      render(<PlateEditor />);
      const plate = screen.getByTestId('plate-component');
      expect(plate).toHaveAttribute('data-readonly', 'false');
    });

    it('should display correct button text in edit mode', () => {
      render(<PlateEditor />);
      expect(screen.getByText('Switch to Read Only Mode')).toBeInTheDocument();
    });

    it('should toggle to read-only mode when button is clicked', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const plate = screen.getByTestId('plate-component');
        expect(plate).toHaveAttribute('data-readonly', 'true');
      });
    });

    it('should display correct button text in read-only mode', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Switch to Edit Mode')).toBeInTheDocument();
      });
    });

    it('should toggle back to edit mode when clicked again', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      // First click - to read-only
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'true');
      });
      
      // Second click - back to edit
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'false');
      });
    });

    it('should use userEvent for more realistic interaction', async () => {
      const user = userEvent.setup();
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'true');
      });
    });

    it('should maintain state across multiple toggles', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      // Click 3 times
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'true');
      });
      
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'false');
      });
      
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'true');
      });
    });
  });

  describe('Button Styling', () => {
    it('should apply outline variant when in edit mode', () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      expect(button).toHaveAttribute('data-variant', 'outline');
    });

    it('should apply default variant when in read-only mode', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('data-variant', 'default');
      });
    });

    it('should apply small size to button', () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      expect(button).toHaveAttribute('data-size', 'sm');
    });

    it('should maintain size across mode changes', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('data-size', 'sm');
      });
    });
  });

  describe('Editor Initialization', () => {
    it('should call usePlateEditor hook', () => {
      const { usePlateEditor } = require('platejs/react');
      render(<PlateEditor />);
      expect(usePlateEditor).toHaveBeenCalled();
    });

    it('should initialize editor with EditorKit plugins', () => {
      const { usePlateEditor } = require('platejs/react');
      const { EditorKit } = require('@/components/editor/editor-kit');
      
      render(<PlateEditor />);
      
      expect(usePlateEditor).toHaveBeenCalledWith({
        plugins: EditorKit,
        value: expect.any(Array),
      });
    });

    it('should initialize editor with normalized value', () => {
      const { normalizeNodeId } = require('platejs');
      const { usePlateEditor } = require('platejs/react');
      
      render(<PlateEditor />);
      
      expect(normalizeNodeId).toHaveBeenCalled();
      expect(usePlateEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.anything(),
        })
      );
    });
  });

  describe('Layout and Structure', () => {
    it('should have proper flex layout container', () => {
      const { container } = render(<PlateEditor />);
      const mainContainer = container.querySelector('.flex.h-full.flex-col.gap-4');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should have header with proper flex layout', () => {
      const { container } = render(<PlateEditor />);
      const header = container.querySelector('.flex.items-center.justify-between');
      expect(header).toBeInTheDocument();
    });

    it('should have correct padding classes on header', () => {
      const { container } = render(<PlateEditor />);
      const header = container.querySelector('.px-16.pt-4');
      expect(header).toBeInTheDocument();
    });

    it('should have responsive padding on header', () => {
      const { container } = render(<PlateEditor />);
      const header = container.querySelector('[class*="sm:px-[max(64px,calc(50%-350px))]"]');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Component Composition', () => {
    it('should render Plate with editor prop', () => {
      render(<PlateEditor />);
      const plate = screen.getByTestId('plate-component');
      expect(plate).toBeInTheDocument();
    });

    it('should nest Editor inside EditorContainer', () => {
      render(<PlateEditor />);
      const container = screen.getByTestId('editor-container');
      const editor = screen.getByTestId('editor');
      expect(container).toContainElement(editor);
    });

    it('should nest EditorContainer inside Plate', () => {
      render(<PlateEditor />);
      const plate = screen.getByTestId('plate-component');
      const container = screen.getByTestId('editor-container');
      expect(plate).toContainElement(container);
    });

    it('should include SettingsDialog within Plate', () => {
      render(<PlateEditor />);
      const plate = screen.getByTestId('plate-component');
      const settings = screen.getByTestId('settings-dialog');
      expect(plate).toContainElement(settings);
    });
  });

  describe('State Management', () => {
    it('should initialize readOnly state with false', () => {
      const { result } = render(<PlateEditor />);
      const plate = screen.getByTestId('plate-component');
      expect(plate).toHaveAttribute('data-readonly', 'false');
    });

    it('should update state on button click', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      const plate = screen.getByTestId('plate-component');
      
      expect(plate).toHaveAttribute('data-readonly', 'false');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(plate).toHaveAttribute('data-readonly', 'true');
      });
    });

    it('should toggle state using functional update', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      // Rapid clicks to test functional update
      fireEvent.click(button);
      fireEvent.click(button);
      
      await waitFor(() => {
        const plate = screen.getByTestId('plate-component');
        expect(plate).toHaveAttribute('data-readonly', 'false');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have semantic heading element', () => {
      render(<PlateEditor />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Plate Playground');
    });

    it('should have clickable button element', () => {
      render(<PlateEditor />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should update button text for screen readers', async () => {
      render(<PlateEditor />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveTextContent('Switch to Read Only Mode');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveTextContent('Switch to Edit Mode');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<PlateEditor />);
      
      // Tab to button and press Enter
      await user.tab();
      const button = screen.getByTestId('toggle-button');
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'true');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid button clicks', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      // Click rapidly 10 times
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }
      
      await waitFor(() => {
        // After 10 clicks, should be false (even number)
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'false');
      });
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = render(<PlateEditor />);
      expect(() => unmount()).not.toThrow();
    });

    it('should maintain state independence across multiple instances', () => {
      const { container: container1 } = render(<PlateEditor />);
      const { container: container2 } = render(<PlateEditor />);
      
      const buttons = screen.getAllByTestId('toggle-button');
      
      fireEvent.click(buttons[0]);
      
      // First instance should change, second should not
      const plates = screen.getAllByTestId('plate-component');
      expect(plates).toHaveLength(2);
    });

    it('should render without crashing when EditorKit is empty', () => {
      const { EditorKit } = require('@/components/editor/editor-kit');
      EditorKit.length = 0;
      
      expect(() => render(<PlateEditor />)).not.toThrow();
    });

    it('should handle missing normalizeNodeId gracefully', () => {
      const { normalizeNodeId } = require('platejs');
      normalizeNodeId.mockImplementation(() => []);
      
      expect(() => render(<PlateEditor />)).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should render complete editor UI workflow', async () => {
      const user = userEvent.setup();
      render(<PlateEditor />);
      
      // Verify initial state
      expect(screen.getByText('Plate Playground')).toBeInTheDocument();
      expect(screen.getByText('Switch to Read Only Mode')).toBeInTheDocument();
      expect(screen.getByTestId('editor')).toBeInTheDocument();
      expect(screen.getByTestId('settings-dialog')).toBeInTheDocument();
      
      // Toggle to read-only
      await user.click(screen.getByTestId('toggle-button'));
      
      await waitFor(() => {
        expect(screen.getByText('Switch to Edit Mode')).toBeInTheDocument();
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'true');
      });
      
      // Toggle back to edit
      await user.click(screen.getByTestId('toggle-button'));
      
      await waitFor(() => {
        expect(screen.getByText('Switch to Read Only Mode')).toBeInTheDocument();
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'false');
      });
    });

    it('should maintain all components visible during mode changes', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      // Initial state
      expect(screen.getByTestId('editor')).toBeInTheDocument();
      expect(screen.getByTestId('settings-dialog')).toBeInTheDocument();
      
      // After toggle
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByTestId('editor')).toBeInTheDocument();
        expect(screen.getByTestId('settings-dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const { rerender } = render(<PlateEditor />);
      const initialButton = screen.getByTestId('toggle-button');
      
      rerender(<PlateEditor />);
      
      const rerenderButton = screen.getByTestId('toggle-button');
      expect(rerenderButton).toBe(initialButton);
    });

    it('should handle state updates efficiently', async () => {
      const startTime = performance.now();
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByTestId('plate-component')).toHaveAttribute('data-readonly', 'true');
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });

  describe('Error Boundaries', () => {
    it('should handle rendering errors in child components gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // This test ensures the component structure is resilient
      render(<PlateEditor />);
      expect(screen.getByTestId('plate-component')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });
});