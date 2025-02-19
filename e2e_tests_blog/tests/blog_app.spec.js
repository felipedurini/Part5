const { test, describe, expect, beforeEach } = require('@playwright/test')


describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Prueba',
                username: 'prueba',
                password: 'pruebacontra'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({ page }) => {

        const locator = await page.getByText('blogs')
        await expect(locator).toBeVisible()
    })

    describe('Login', () => {

        test('succeeds with correct credentials', async ({ page }) => {

            await page.getByRole('button', { name: 'log in' }).click()
            await page.getByTestId('username').fill('prueba')
            await page.getByTestId('password').fill('pruebacontra')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Prueba logged-in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('button', { name: 'log in' }).click()
            await page.getByTestId('username').fill('asfddfa')
            await page.getByTestId('password').fill('wrong')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('wrong credentials')).toBeVisible()
        })
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByRole('button', { name: 'log in' }).click()
            await page.getByTestId('username').fill('prueba')
            await page.getByTestId('password').fill('pruebacontra')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'New Blog' }).click()
            await page.getByTestId('title').fill('another blog by playwright')
            await page.getByTestId('author').fill('Juan Perez')
            await page.getByTestId('url').fill('example.com')
            await page.getByRole('button', { name: 'save' }).click()
            await expect(page.getByText('another blog by playwright')).toBeVisible()
        })
        describe('and a blog exists', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'New Blog' }).click()
                await page.getByTestId('title').fill('another blog by playwright')
                await page.getByTestId('author').fill('Juan Perez')
                await page.getByTestId('url').fill('example.com')
                await page.getByRole('button', { name: 'save' }).click()
            })

            test('a blog can be edited (show attributes and likes work)', async ({ page }) => {
                await page.getByRole('button', { name: 'show attributes' }).click()
                await expect(page.getByText('Like')).toBeVisible()
                await expect(page.getByTestId('likes')).toHaveText(/0/)
                await page.getByRole('button', { name: 'Like' }).click()
                await expect(page.getByTestId('likes')).toHaveText(/1/)
            })

            test('a blog can be deleted', async ({ page }) => {
                await expect(page.getByText('another blog by playwright')).toBeVisible()

                await page.evaluate(() => {
                    window.confirm = () => true
                })

                await page.getByRole('button', { name: 'Delete' }).click()

                await expect(page.getByText('another blog by playwright')).not.toBeVisible()
            })

            test('only creator can see Delete button', async ({ page, request }) => {
                await request.post('http://localhost:3001/api/users', {
                    data: {
                        name: 'PruebaDelete',
                        username: 'pruebaDel',
                        password: 'pruebacontra'
                    }
                })
                await page.getByRole('button', { name: 'logout' }).click()
                await page.getByTestId('username').fill('pruebaDel')
                await page.getByTestId('password').fill('pruebacontra')
                await page.getByRole('button', { name: 'login' }).click()
                await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
            })

            test.only('blogs are ordered by likes', async ({ page, request }) => {
                await page.getByRole('button', { name: 'New Blog' }).click()
                await page.getByTestId('title').fill('blog 2')
                await page.getByTestId('author').fill('Juan Perez')
                await page.getByTestId('url').fill('example.com')
                await page.getByRole('button', { name: 'save' }).click()

                await page.getByRole('button', { name: 'New Blog' }).click()
                await page.getByTestId('title').fill('blog 3')
                await page.getByTestId('author').fill('Juan Perez')
                await page.getByTestId('url').fill('example.com')
                await page.getByRole('button', { name: 'save' }).click()

                const blog2 = page.getByTestId('blog', { hasText: 'blog 2' })
                await blog2.getByRole('button', { name: 'show attributes' }).click()
                await blog2.getByRole('button', { name: 'Like' }).click()
                await blog2.getByRole('button', { name: 'hide attributes' }).click()


                const blog3 = page.getByTestId('blog', { hasText: 'blog 3' })
                await blog3.getByRole('button', { name: 'show attributes' }).click()
                await blog3.getByRole('button', { name: 'Like' }).click()
                await blog3.getByRole('button', { name: 'Like' }).click()
                await blog3.getByRole('button', { name: 'hide attributes' }).click()


                const blogs = page.getByTestId('blog')
                const count = await blogs.count()
                const likes = []
                for (let i = 0; i < count; i++) {
                    const blog = blogs.nth(i)
                    await blog.getByRole('button', { name: 'show attributes' }).click()
                    const text = await blog.textContent()
                    const match = text.match(/Likes\s*(\d+)/)
                    likes.push(match ? Number(match[1]) : 0)
                }
                const sortedLikes = [...likes].sort((a, b) => b - a)
                expect(likes).toEqual(sortedLikes)
            })

        })
    })


})