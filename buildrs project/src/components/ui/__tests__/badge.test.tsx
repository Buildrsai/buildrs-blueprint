import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Free</Badge>)
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('has border by default', () => {
    render(<Badge data-testid="badge">Tag</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('border-border-default')
  })

  it('has text-muted color by default', () => {
    render(<Badge data-testid="badge">Tag</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('text-text-muted')
  })

  it('applies success variant', () => {
    render(<Badge data-testid="badge" variant="success">Active</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('border-success/30')
  })

  it('applies error variant', () => {
    render(<Badge data-testid="badge" variant="error">Error</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('border-error/30')
  })

  it('accepts additional className', () => {
    render(<Badge className="ml-2" data-testid="badge">Tag</Badge>)
    expect(screen.getByTestId('badge')).toHaveClass('ml-2')
  })
})
