import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import Home from '..'

describe('<Home />', () => {
  it('Should render the heading', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', { name: /Home/i })
    ).toBeInTheDocument()
  })
})
