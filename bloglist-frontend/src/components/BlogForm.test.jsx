import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(
    <BlogForm
      createBlog={createBlog}
      title=""
      onChangeTitle={() => { }}
      author=""
      onChangeAuthor={() => { }}
      url=""
      onChangeUrl={() => { }}
    />
  )

  const inputs = screen.getAllByRole('textbox')
  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]
  const sendButton = screen.getByText('save')

  await user.type(titleInput, 'New Blog Title')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'http://example.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('New Blog Title')
  expect(createBlog.mock.calls[0][0].author).toBe('John Doe')
  expect(createBlog.mock.calls[0][0].url).toBe('http://example.com')
})
