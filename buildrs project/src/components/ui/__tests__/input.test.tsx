import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('has bg-bg-surface background', () => {
    render(<Input data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass('bg-bg-surface')
  })

  it('has border-border-default border', () => {
    render(<Input data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass('border-border-default')
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text..." />)
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument()
  })

  it('accepts typed input', async () => {
    const user = userEvent.setup()
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    await user.type(input, 'Hello')
    expect(input).toHaveValue('Hello')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('accepts additional className', () => {
    render(<Input className="w-full" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass('w-full')
  })
})
