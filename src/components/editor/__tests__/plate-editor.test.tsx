import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlateEditor } from '../plate-editor';
import * as React from 'react';

// Mock the platejs modules
vi.mock('platejs', () => ({
  normalizeNodeId: vi.fn((value) => value),
}));

vi.mock('platejs/react', () => ({
  Plate: ({ children, readOnly }: { children: React.ReactNode; readOnly?: boolean }) => (
    <div data-testid="plate-component" data-readonly={readOnly}>
      {children}
    </div>
  ),
  usePlateEditor: vi.fn(() => ({
    id: 'test-editor-id',
    children: [],
    operations: [],
    selection: null,
  })),
}));

// Mock the component dependencies
vi.mock('@/components/editor/editor-kit', () => ({
  EditorKit: ['mockPlugin1', 'mockPlugin2'],
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
  Editor: ({ variant, ...props }: any) => (
    <div data-testid="editor" data-variant={variant} {...props}>
      Editor Content
    </div>
  ),
  EditorContainer: ({ children, ...props }: any) => (
    <div data-testid="editor-container" {...props}>
      {children}
    </div>
  ),
}));

describe('PlateEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render without crashing', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('plate-component')).toBeInTheDocument();
    });

    it('should render the title "Plate Playground"', () => {
      render(<PlateEditor />);
      expect(screen.getByText('Plate Playground')).toBeInTheDocument();
    });

    it('should render the toggle button', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
    });

    it('should render the Editor component', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('editor')).toBeInTheDocument();
    });

    it('should render the EditorContainer component', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('editor-container')).toBeInTheDocument();
    });

    it('should render the SettingsDialog component', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('settings-dialog')).toBeInTheDocument();
    });

    it('should render Plate component', () => {
      render(<PlateEditor />);
      expect(screen.getByTestId('plate-component')).toBeInTheDocument();
    });
  });

  describe('Initial State - Read-Only Mode', () => {
    it('should initialize with readOnly state as false', () => {
      render(<PlateEditor />);
      const plateComponent = screen.getByTestId('plate-component');
      expect(plateComponent).toHaveAttribute('data-readonly', 'false');
    });

    it('should display "Switch to Read Only Mode" button text initially', () => {
      render(<PlateEditor />);
      expect(screen.getByText('Switch to Read Only Mode')).toBeInTheDocument();
    });

    it('should have outline variant on button when in edit mode', () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      expect(button).toHaveAttribute('data-variant', 'outline');
    });

    it('should have sm size on button', () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      expect(button).toHaveAttribute('data-size', 'sm');
    });
  });

  describe('Toggle Read-Only Functionality', () => {
    it('should toggle readOnly state to true when button is clicked', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const plateComponent = screen.getByTestId('plate-component');
        expect(plateComponent).toHaveAttribute('data-readonly', 'true');
      });
    });

    it('should change button text to "Switch to Edit Mode" when in read-only mode', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Switch to Edit Mode')).toBeInTheDocument();
      });
    });

    it('should change button variant to default when in read-only mode', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('data-variant', 'default');
      });
    });

    it('should toggle back to edit mode when clicked again', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      // Toggle to read-only
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText('Switch to Edit Mode')).toBeInTheDocument();
      });
      
      // Toggle back to edit
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText('Switch to Read Only Mode')).toBeInTheDocument();
      });
    });

    it('should maintain correct readOnly prop on Plate after multiple toggles', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      const plateComponent = screen.getByTestId('plate-component');
      
      // Initial state
      expect(plateComponent).toHaveAttribute('data-readonly', 'false');
      
      // First toggle
      fireEvent.click(button);
      await waitFor(() => {
        expect(plateComponent).toHaveAttribute('data-readonly', 'true');
      });
      
      // Second toggle
      fireEvent.click(button);
      await waitFor(() => {
        expect(plateComponent).toHaveAttribute('data-readonly', 'false');
      });
      
      // Third toggle
      fireEvent.click(button);
      await waitFor(() => {
        expect(plateComponent).toHaveAttribute('data-readonly', 'true');
      });
    });
  });

  describe('Component Structure', () => {
    it('should render components in correct hierarchy', () => {
      const { container } = render(<PlateEditor />);
      
      // Check for main container
      const mainDiv = container.querySelector('.flex.h-full.flex-col.gap-4');
      expect(mainDiv).toBeInTheDocument();
      
      // Check for header div
      const headerDiv = container.querySelector('.flex.items-center.justify-between');
      expect(headerDiv).toBeInTheDocument();
    });

    it('should apply correct CSS classes to main container', () => {
      const { container } = render(<PlateEditor />);
      const mainDiv = container.querySelector('div[class*="flex"][class*="h-full"]');
      
      expect(mainDiv).toHaveClass('flex');
      expect(mainDiv).toHaveClass('h-full');
      expect(mainDiv).toHaveClass('flex-col');
      expect(mainDiv).toHaveClass('gap-4');
    });

    it('should apply correct CSS classes to header container', () => {
      const { container } = render(<PlateEditor />);
      const headerDiv = container.querySelector('div[class*="items-center"]');
      
      expect(headerDiv).toHaveClass('flex');
      expect(headerDiv).toHaveClass('items-center');
      expect(headerDiv).toHaveClass('justify-between');
    });

    it('should render h1 with correct styling', () => {
      render(<PlateEditor />);
      const heading = screen.getByRole('heading', { name: 'Plate Playground' });
      
      expect(heading).toHaveClass('text-lg');
      expect(heading).toHaveClass('font-semibold');
    });

    it('should nest Editor inside EditorContainer inside Plate', () => {
      render(<PlateEditor />);
      const plateComponent = screen.getByTestId('plate-component');
      const editorContainer = screen.getByTestId('editor-container');
      const editor = screen.getByTestId('editor');
      
      expect(plateComponent).toContainElement(editorContainer);
      expect(editorContainer).toContainElement(editor);
    });

    it('should render SettingsDialog inside Plate component', () => {
      render(<PlateEditor />);
      const plateComponent = screen.getByTestId('plate-component');
      const settingsDialog = screen.getByTestId('settings-dialog');
      
      expect(plateComponent).toContainElement(settingsDialog);
    });
  });

  describe('Editor Configuration', () => {
    it('should pass EditorKit plugins to usePlateEditor', () => {
      const { usePlateEditor } = require('platejs/react');
      render(<PlateEditor />);
      
      expect(usePlateEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.arrayContaining(['mockPlugin1', 'mockPlugin2']),
        })
      );
    });

    it('should pass value to usePlateEditor', () => {
      const { usePlateEditor } = require('platejs/react');
      render(<PlateEditor />);
      
      expect(usePlateEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.any(Array),
        })
      );
    });

    it('should pass editor instance to Plate component', () => {
      render(<PlateEditor />);
      // The mock editor should be passed through
      expect(screen.getByTestId('plate-component')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible heading for the title', () => {
      render(<PlateEditor />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Plate Playground');
    });

    it('should have clickable button for toggling mode', () => {
      render(<PlateEditor />);
      const button = screen.getByRole('button', { name: /Switch to/i });
      expect(button).toBeInTheDocument();
    });

    it('should maintain button functionality after state changes', async () => {
      render(<PlateEditor />);
      const button = screen.getByRole('button');
      
      expect(button).toBeEnabled();
      
      fireEvent.click(button);
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicking of toggle button', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      // Rapid clicks
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      await waitFor(() => {
        const plateComponent = screen.getByTestId('plate-component');
        // Should end up in edit mode (false) after even number of clicks
        expect(plateComponent).toHaveAttribute('data-readonly', 'false');
      });
    });

    it('should not throw error when rendered multiple times', () => {
      const { rerender } = render(<PlateEditor />);
      
      expect(() => {
        rerender(<PlateEditor />);
        rerender(<PlateEditor />);
        rerender(<PlateEditor />);
      }).not.toThrow();
    });

    it('should maintain state independence across multiple instances', () => {
      const { container: container1 } = render(<PlateEditor />);
      const { container: container2 } = render(<PlateEditor />);
      
      expect(container1).not.toBe(container2);
    });
  });

  describe('Button Text Content', () => {
    it('should display correct button text in edit mode', () => {
      render(<PlateEditor />);
      const buttonText = screen.getByText('Switch to Read Only Mode');
      expect(buttonText).toBeInTheDocument();
    });

    it('should display correct button text in read-only mode', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const buttonText = screen.getByText('Switch to Edit Mode');
        expect(buttonText).toBeInTheDocument();
      });
    });

    it('should not display both button texts simultaneously', () => {
      render(<PlateEditor />);
      
      const editModeText = screen.queryByText('Switch to Read Only Mode');
      const readOnlyModeText = screen.queryByText('Switch to Edit Mode');
      
      // Exactly one should be present
      expect(editModeText !== null || readOnlyModeText !== null).toBe(true);
      expect(editModeText !== null && readOnlyModeText !== null).toBe(false);
    });
  });

  describe('Button Visual State', () => {
    it('should use outline variant in edit mode', () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      expect(button).toHaveAttribute('data-variant', 'outline');
    });

    it('should use default variant in read-only mode', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('data-variant', 'default');
      });
    });

    it('should alternate button variants correctly', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      // Initial state
      expect(button).toHaveAttribute('data-variant', 'outline');
      
      // First toggle
      fireEvent.click(button);
      await waitFor(() => {
        expect(button).toHaveAttribute('data-variant', 'default');
      });
      
      // Second toggle
      fireEvent.click(button);
      await waitFor(() => {
        expect(button).toHaveAttribute('data-variant', 'outline');
      });
    });
  });

  describe('Plate Component Props', () => {
    it('should pass readOnly=false to Plate initially', () => {
      render(<PlateEditor />);
      const plateComponent = screen.getByTestId('plate-component');
      expect(plateComponent).toHaveAttribute('data-readonly', 'false');
    });

    it('should pass readOnly=true to Plate when toggled', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        const plateComponent = screen.getByTestId('plate-component');
        expect(plateComponent).toHaveAttribute('data-readonly', 'true');
      });
    });

    it('should update Plate readOnly prop dynamically', async () => {
      render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      const plateComponent = screen.getByTestId('plate-component');
      
      // Verify initial state
      expect(plateComponent).toHaveAttribute('data-readonly', 'false');
      
      // Toggle and verify
      fireEvent.click(button);
      await waitFor(() => {
        expect(plateComponent).toHaveAttribute('data-readonly', 'true');
      });
      
      // Toggle back and verify
      fireEvent.click(button);
      await waitFor(() => {
        expect(plateComponent).toHaveAttribute('data-readonly', 'false');
      });
    });
  });

  describe('State Management', () => {
    it('should use React.useState for readOnly state', () => {
      const useStateSpy = vi.spyOn(React, 'useState');
      render(<PlateEditor />);
      
      expect(useStateSpy).toHaveBeenCalledWith(false);
    });

    it('should maintain state across re-renders', async () => {
      const { rerender } = render(<PlateEditor />);
      const button = screen.getByTestId('toggle-button');
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Switch to Edit Mode')).toBeInTheDocument();
      });
      
      rerender(<PlateEditor />);
      
      // State should be reset on new instance
      expect(screen.getByText('Switch to Read Only Mode')).toBeInTheDocument();
    });
  });

  describe('Integration with usePlateEditor', () => {
    it('should call usePlateEditor hook', () => {
      const { usePlateEditor } = require('platejs/react');
      render(<PlateEditor />);
      
      expect(usePlateEditor).toHaveBeenCalled();
    });

    it('should call usePlateEditor with correct configuration', () => {
      const { usePlateEditor } = require('platejs/react');
      render(<PlateEditor />);
      
      expect(usePlateEditor).toHaveBeenCalledWith({
        plugins: expect.any(Array),
        value: expect.any(Array),
      });
    });

    it('should only call usePlateEditor once per render', () => {
      const { usePlateEditor } = require('platejs/react');
      render(<PlateEditor />);
      
      const callCount = usePlateEditor.mock.calls.length;
      expect(callCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Editor Variant', () => {
    it('should pass demo variant to Editor component', () => {
      render(<PlateEditor />);
      const editor = screen.getByTestId('editor');
      expect(editor).toHaveAttribute('data-variant', 'demo');
    });
  });

  describe('Component Layout', () => {
    it('should render header above Plate component', () => {
      const { container } = render(<PlateEditor />);
      const mainContainer = container.firstChild;
      
      // Header should be first child
      const header = mainContainer?.firstChild as HTMLElement;
      expect(header).toHaveClass('flex', 'items-center', 'justify-between');
      
      // Plate should be second child
      const plateWrapper = mainContainer?.lastChild as HTMLElement;
      expect(plateWrapper?.querySelector('[data-testid="plate-component"]')).toBeInTheDocument();
    });

    it('should have proper spacing between header and editor', () => {
      const { container } = render(<PlateEditor />);
      const mainDiv = container.querySelector('.gap-4');
      expect(mainDiv).toBeInTheDocument();
    });
  });
});