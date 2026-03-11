import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Divider } from '@/components/ui/divider'

describe('Divider', () => {
  it('renders a horizontal rule element', () => {
    render(<Divider />)
    expect(document.querySelector('hr')).toBeInTheDocument()
  })

  it('has gradient styling class', () => {
    render(<Divider data-testid="divider" />)
    expect(screen.getByTestId('divider')).toHaveClass('divider')
  })

  it('accepts additional className', () => {
    render(<Divider data-testid="divider" className="my-8" />)
    expect(screen.getByTestId('divider')).toHaveClass('my-8')
  })
})
