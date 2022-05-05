// Import the Spinner component into this file and test
import Spinner from './Spinner'
import {render, screen} from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom/extend-expect'

const expectedLoadingMessage = 'Please wait...'

// that it renders what it should for the different props it can take.
test('sanity', () => {
  expect(true).toBe(true)
})

test("renders nothing if false passed in as props", () => {
  render(<Spinner on={false}/>)
  const loadingText = screen.queryByText(expectedLoadingMessage)
  expect(loadingText).not.toBeInTheDocument()
})

test("renders loading message if true passed in as props", () => {
  render(<Spinner on={true}/>)
  const loadingText = screen.queryByText(expectedLoadingMessage)
  expect(loadingText).toBeVisible()
})
