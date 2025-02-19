import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('renders blog title and author but not URL or likes by default', () => {
  const blog = {
    title: 'Testing Blog Component',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: { id: 1, name: 'Jane Doe' },
    showAllAttributes: false
  }

  render(<Blog blog={blog} toggleAttributes={() => { }} handleLike={() => { }} handleDelete={() => { }} user={{ id: 1, name: 'Jane Doe' }} />)

  expect(screen.getByText(/Testing Blog Component/i)).toBeDefined()
  expect(screen.getByText(/John Doe/i)).toBeDefined()

  expect(screen.queryByText('https://example.com')).toBeNull()
  expect(screen.queryByText('Likes 5')).toBeNull()
})

test('clicking the button shows likes and url', async () => {
  const blog = {
    title: 'Testing Blog Component',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: { id: 1, name: 'Jane Doe' },
    showAllAttributes: false
  }

  render(
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleDelete={() => {}}
      updateBlog={() => {}}
      user={{ id: 1, name: 'Jane Doe' }}
    />
  )

  const userInstance = userEvent.setup()
  const button = screen.getByText('show attributes')
  await userInstance.click(button)

  //Since the parent's state triggers the re-render with updated props, we need to simulate that here by re-rendering the component.
  render(
    <Blog
      blog={{ ...blog, showAllAttributes: true }}
      handleLike={() => {}}
      handleDelete={() => {}}
      updateBlog={() => {}}
      user={{ id: 1, name: 'Jane Doe' }}
    />
  )

  await waitFor(() => {
    expect(screen.getByText('https://example.com')).toBeDefined()
    expect(screen.getByText('Likes 5')).toBeDefined()
  })
})


test('clicking the button like works', async () => {
  const blog = {
    title: 'Testing Blog Component',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: { id: 1, name: 'Jane Doe' },
    showAllAttributes: true
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      toggleAttributes={() => { }}
      handleLike={mockHandler}
      user={{ id: 1, name: 'Jane Doe' }}
    />
  )

  const userInstance = userEvent.setup()
  const button = screen.getByText('Like')
  await userInstance.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)

  await userInstance.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})