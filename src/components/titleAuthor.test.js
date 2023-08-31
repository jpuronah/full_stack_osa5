import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
	title: 'Testi Blogi',
	author: 'Blogin Testaaja',
	url: 'www.testiblogi.se',
	likes: 5
  }
  
  render(<Blog blog={blog} />)
  console.log('BLOGI', blog)

  const element = screen.getByText('Testi Blogi Blogin Testaaja')
  
  expect(element).toBeDefined() 
  expect(element).not.toContainHTML('www.testiblogi.se')
  expect(element).not.toContainHTML('5')
})
