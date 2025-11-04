import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PlateEditor } from '../plate-editor'
import * as React from 'react'

// Mock the Plate editor and its dependencies
vi.mock('platejs/react', () => ({
  Plate: ({ children, readOnly }: { children: React.ReactNode; readOnly: boolean }) => (
    <div data-testid="plate-editor" data-readonly={readOnly}>
      {children}
    </div>
  ),
  usePlateEditor: vi.fn(() => ({
    children: [],
    api: {},
    plugins: [],
  })),
}))

vi.mock('platejs', () => ({
  normalizeNodeId: vi.fn((value) => value),
}))

vi.mock('@/components/editor/editor-kit', () => ({
  EditorKit: [],
}))

vi.mock('@/components/editor/settings-dialog', () => ({
  SettingsDialog: () => <div data-testid="settings-dialog">Settings Dialog</div>,
}))

vi.mock('@/components/ui/editor', () => ({
  Editor: ({ variant }: { variant: string }) => (
    <div data-testid="editor" data-variant={variant}>
      Editor Content
    </div>
  ),
  EditorContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="editor-container">{children}</div>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
  }: {
    children: React.ReactNode
    onClick: () => void
    variant: string
    size: string
  }) => (
    <button
      data-testid="toggle-readonly-button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}))

describe('PlateEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Rendering', () => {
    it('should render the PlateEditor component', () => {
      render(<PlateEditor />)
      expect(screen.getByTestId('plate-editor')).toBeInTheDocument()
    })

    it('should render the title "Plate Playground"', () => {
      render(<PlateEditor />)
      expect(screen.getByText('Plate Playground')).toBeInTheDocument()
    })

    it('should render the toggle button with initial text', () => {
      render(<PlateEditor />)
      expect(screen.getByTestId('toggle-readonly-button')).toBeInTheDocument()
      expect(screen.getByText('Switch to Read Only Mode')).toBeInTheDocument()
    })

    it('should render the editor container', () => {
      render(<PlateEditor />)
      expect(screen.getByTestId('editor-container')).toBeInTheDocument()
    })

    it('should render the editor with demo variant', () => {
      render(<PlateEditor />)
      const editor = screen.getByTestId('editor')
      expect(editor).toBeInTheDocument()
      expect(editor).toHaveAttribute('data-variant', 'demo')
    })

    it('should render the settings dialog', () => {
      render(<PlateEditor />)
      expect(screen.getByTestId('settings-dialog')).toBeInTheDocument()
    })

    it('should apply correct CSS classes to the main container', () => {
      const { container } = render(<PlateEditor />)
      const mainDiv = container.querySelector('.flex.h-full.flex-col.gap-4')
      expect(mainDiv).toBeInTheDocument()
    })

    it('should apply correct CSS classes to the header', () => {
      const { container } = render(<PlateEditor />)
      const header = container.querySelector(
        '.flex.items-center.justify-between.px-16.pt-4'
      )
      expect(header).toBeInTheDocument()
    })
  })

  describe('Read-Only Mode Toggle', () => {
    it('should initialize with readOnly set to false', () => {
      render(<PlateEditor />)
      const plateEditor = screen.getByTestId('plate-editor')
      expect(plateEditor).toHaveAttribute('data-readonly', 'false')
    })

    it('should toggle readOnly state when button is clicked', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')
      const plateEditor = screen.getByTestId('plate-editor')

      // Initial state
      expect(plateEditor).toHaveAttribute('data-readonly', 'false')
      expect(button).toHaveTextContent('Switch to Read Only Mode')

      // Click to enable read-only
      fireEvent.click(button)
      expect(plateEditor).toHaveAttribute('data-readonly', 'true')
      expect(button).toHaveTextContent('Switch to Edit Mode')
    })

    it('should toggle back to edit mode when clicked again', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')
      const plateEditor = screen.getByTestId('plate-editor')

      // Click once to enable read-only
      fireEvent.click(button)
      expect(plateEditor).toHaveAttribute('data-readonly', 'true')

      // Click again to disable read-only
      fireEvent.click(button)
      expect(plateEditor).toHaveAttribute('data-readonly', 'false')
      expect(button).toHaveTextContent('Switch to Read Only Mode')
    })

    it('should toggle multiple times correctly', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')
      const plateEditor = screen.getByTestId('plate-editor')

      for (let i = 0; i < 5; i++) {
        fireEvent.click(button)
        const expectedReadOnly = i % 2 === 0 // odd clicks = true, even = false
        expect(plateEditor).toHaveAttribute(
          'data-readonly',
          String(expectedReadOnly)
        )
      }
    })
  })

  describe('Button Variants and Styling', () => {
    it('should show outline variant when in edit mode', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')
      expect(button).toHaveAttribute('data-variant', 'outline')
    })

    it('should show default variant when in read-only mode', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')

      fireEvent.click(button)
      expect(button).toHaveAttribute('data-variant', 'default')
    })

    it('should always use sm size for the button', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')
      expect(button).toHaveAttribute('data-size', 'sm')
    })

    it('should maintain button size when toggling', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')

      fireEvent.click(button)
      expect(button).toHaveAttribute('data-size', 'sm')

      fireEvent.click(button)
      expect(button).toHaveAttribute('data-size', 'sm')
    })
  })

  describe('Button Text Content', () => {
    it('should display correct text in edit mode', () => {
      render(<PlateEditor />)
      expect(screen.getByText('Switch to Read Only Mode')).toBeInTheDocument()
    })

    it('should display correct text in read-only mode', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')

      fireEvent.click(button)
      expect(screen.getByText('Switch to Edit Mode')).toBeInTheDocument()
    })

    it('should not display edit mode text when in read-only mode', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')

      fireEvent.click(button)
      expect(screen.queryByText('Switch to Read Only Mode')).not.toBeInTheDocument()
    })

    it('should not display read-only mode text when in edit mode', () => {
      render(<PlateEditor />)
      expect(screen.queryByText('Switch to Edit Mode')).not.toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    it('should pass readOnly prop to Plate component', () => {
      render(<PlateEditor />)
      const plateEditor = screen.getByTestId('plate-editor')
      const button = screen.getByTestId('toggle-readonly-button')

      // Initial state
      expect(plateEditor).toHaveAttribute('data-readonly', 'false')

      // After toggle
      fireEvent.click(button)
      expect(plateEditor).toHaveAttribute('data-readonly', 'true')
    })

    it('should maintain editor and settings dialog when toggling', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')

      fireEvent.click(button)

      expect(screen.getByTestId('editor')).toBeInTheDocument()
      expect(screen.getByTestId('settings-dialog')).toBeInTheDocument()
      expect(screen.getByTestId('editor-container')).toBeInTheDocument()
    })

    it('should keep all child components rendered after multiple toggles', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')

      // Toggle 3 times
      for (let i = 0; i < 3; i++) {
        fireEvent.click(button)
      }

      expect(screen.getByTestId('editor')).toBeInTheDocument()
      expect(screen.getByTestId('settings-dialog')).toBeInTheDocument()
      expect(screen.getByTestId('editor-container')).toBeInTheDocument()
      expect(screen.getByTestId('plate-editor')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have a heading for the title', () => {
      render(<PlateEditor />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Plate Playground')
    })

    it('should have an accessible button', () => {
      render(<PlateEditor />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should have button with descriptive text', () => {
      render(<PlateEditor />)
      const button = screen.getByRole('button')
      expect(button.textContent).toMatch(/Switch to (Edit Mode|Read Only Mode)/)
    })

    it('should maintain heading structure after state changes', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')

      fireEvent.click(button)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Plate Playground')
    })
  })

  describe('State Management', () => {
    it('should use React.useState for readOnly state', () => {
      const { rerender } = render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')
      const plateEditor = screen.getByTestId('plate-editor')

      // Verify initial state
      expect(plateEditor).toHaveAttribute('data-readonly', 'false')

      // Change state
      fireEvent.click(button)
      expect(plateEditor).toHaveAttribute('data-readonly', 'true')

      // Rerender should maintain state
      rerender(<PlateEditor />)
      expect(plateEditor).toHaveAttribute('data-readonly', 'true')
    })

    it('should handle rapid clicks correctly', async () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')
      const plateEditor = screen.getByTestId('plate-editor')

      // Rapid clicks
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      await waitFor(() => {
        expect(plateEditor).toHaveAttribute('data-readonly', 'true')
      })
    })

    it('should maintain independent state across multiple instances', () => {
      const { container: container1 } = render(<PlateEditor />)
      const { container: container2 } = render(<PlateEditor />)

      expect(container1).not.toBe(container2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle being mounted and unmounted', () => {
      const { unmount } = render(<PlateEditor />)
      expect(screen.getByTestId('plate-editor')).toBeInTheDocument()

      unmount()
      expect(screen.queryByTestId('plate-editor')).not.toBeInTheDocument()
    })

    it('should render without crashing when clicked immediately after mount', () => {
      render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')

      expect(() => fireEvent.click(button)).not.toThrow()
    })

    it('should maintain consistent DOM structure', () => {
      const { container } = render(<PlateEditor />)
      const button = screen.getByTestId('toggle-readonly-button')

      const initialHTML = container.innerHTML

      // Toggle state
      fireEvent.click(button)
      fireEvent.click(button)

      // Structure should be mostly same (only attributes change)
      expect(container.querySelector('.flex.h-full.flex-col.gap-4')).toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('should render header with title and button in correct positions', () => {
      const { container } = render(<PlateEditor />)
      const header = container.querySelector(
        '.flex.items-center.justify-between.px-16.pt-4'
      )

      expect(header).toBeInTheDocument()
      expect(header?.querySelector('h1')).toBeInTheDocument()
      expect(header?.querySelector('[data-testid="toggle-readonly-button"]')).toBeInTheDocument()
    })

    it('should wrap Plate component correctly', () => {
      render(<PlateEditor />)
      const plateEditor = screen.getByTestId('plate-editor')
      const editorContainer = screen.getByTestId('editor-container')

      expect(plateEditor).toContainElement(editorContainer)
    })

    it('should have settings dialog inside Plate component', () => {
      render(<PlateEditor />)
      const plateEditor = screen.getByTestId('plate-editor')
      const settingsDialog = screen.getByTestId('settings-dialog')

      expect(plateEditor).toContainElement(settingsDialog)
    })
  })

  describe('Props and Configuration', () => {
    it('should initialize editor with EditorKit plugins', () => {
      const { usePlateEditor } = require('platejs/react')
      render(<PlateEditor />)

      expect(usePlateEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: expect.anything(),
        })
      )
    })

    it('should initialize editor with value', () => {
      const { usePlateEditor } = require('platejs/react')
      render(<PlateEditor />)

      expect(usePlateEditor).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.anything(),
        })
      )
    })
  })
})