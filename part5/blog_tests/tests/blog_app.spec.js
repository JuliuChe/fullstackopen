import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper'
test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'jcheval',
        name: 'Julien Chevalley',
        password:'myPassword'
      }
    })
    await request.post('/api/users', {
      data: {
        username: 'secondUser',
        name: 'User Two',
        password:'hisPassword'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const form = page.getByRole('form', {name: 'login form'})
    expect(form).toBeVisible()
    const title = form.getByRole('heading', { name: 'log in to application' })
    await expect(title).toBeVisible()
    const username = form.getByRole('textbox', { name: 'username' })
    await expect(username).toBeVisible()
    const password = form.getByLabel('password')
    await expect(password).toBeVisible()
    const loginBtn = form.getByRole('button', { name: 'login' })
    await expect(loginBtn).toBeVisible()
  })
   test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      
      await loginWith(page, 'jcheval', 'myPassword')

      await expect(page.getByText('logged in as Julien Chevalley')).toBeVisible()

    })

     test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'jcheval', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong login credentials')

      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('logged in as Julien Chevalley')).not.toBeVisible()
    })
   })
  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
        await loginWith(page, 'jcheval', 'myPassword')
        await expect(page.getByText('logged in as Julien Chevalley')).toBeVisible()
    })
    
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'A new space odyssey', 'Spawn of S.Kubrick', 'www.kubrickisalive.com')
      await expect(page.getByTestId('title_base').getByText('A new space odyssey')).toBeVisible()
      await expect(page.getByTestId('author_base').getByText('Spawn of S.Kubrick')).toBeVisible()

    })
    test.describe('and there is only one blog in the list', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(page, 'The mission of Artemis was a great success', 'Nasa express', 'www.nasa-blog.com')
        const notification = page.getByText('a new blog')
        await expect(notification).toBeVisible()
        await expect(notification).toHaveCount(0, { timeout: 7000 })
      })
      test('that can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByTestId('likes')).toHaveText('1')
      })
      test('that can be removed by the user', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        
        const infoDiv = page.locator('.info')
        await expect(infoDiv).toContainText('Blog The mission of Artemis was a great success Nasa express successfully deleted from DB')
        await expect(infoDiv).toHaveCSS('border-style', 'solid')
        await expect(infoDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
        await expect(page.getByTestId('title_base').getByText('The mission of Artemis was a great success')).not.toBeVisible()

        
       })
     })
  })
  test.describe('there is more than one user who adds a blog', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'jcheval', 'myPassword')
      await createBlog(page, 'Blog added by first user', 'JC', 'www.JC.com')
      const notifOne = page.getByText('a new blog')
      await expect(notifOne).toBeVisible()
      await expect(notifOne).toHaveCount(0, { timeout: 6000 })
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'secondUser', 'hisPassword')
      await createBlog(page, 'Blog added by second user', 'UT', 'www.UT.com')
      const notifTwo = page.getByText('a new blog')
      await expect(notifTwo).toBeVisible()
      await expect(notifTwo).toHaveCount(0, { timeout: 6000 })
    })
    
    test('User two can not remove blog added by first user', async ({ page }) => {
      const blogsSummary = page.locator('.highlights')
      const count = await blogsSummary.count()
      console.log(count)
      const nameOfUser = 'User Two'
      for (let i = 0; i < count; i++) { 
        await blogsSummary.nth(i).getByRole('button', { name: 'view' }).click()
      }

      const blogsDetail = page.locator('.details')

      for (let i = 0; i < count; i++) { 
        const userLocator = blogsDetail.nth(i).getByText(nameOfUser)
        if ( await userLocator.count() > 0) {
          await expect(blogsDetail.nth(i).getByRole('button', {name: 'remove'})).toBeVisible()
        } else {
          await expect(blogsDetail.nth(i).getByRole('button', {name: 'remove'})).not.toBeVisible()
         }

      }

     })

  })

  test.describe('Add 10 blogs to the app and click likes a random times on each', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'jcheval', 'myPassword')
      const nbBlogs=10
      for (let i = 0; i < nbBlogs; i++) { 
          await createBlog(page, `This is blog ${i}` , 'JC', 'www.JC.com')
      }
      const blogsSummary = page.locator('.highlights')
      for (let i = 0; i < nbBlogs; i++) {
           await blogsSummary.nth(i).getByRole('button', { name: 'view' }).click()
      }

      const blogsDetail = page.locator('.details')
      const maxLikes = 50
      for (let i = 0; i < nbBlogs; i++) { 
        const curentTitle=`This is blog ${i}`
        const likeBtn = blogsDetail.filter({ hasText: curentTitle }).getByRole('button', { name: 'like' })
        const likesLocator = blogsDetail.filter({ hasText: curentTitle }).getByTestId('likes')

        for (let j = 0; j < i; j++) {
          const before = Number((await likesLocator.textContent())?.trim())
          await likeBtn.click()
          await expect(likesLocator).toHaveText(String(before + 1))
         }
      }
    })
    test('Check that list of blogs is ordered by likes', async ({ page }) => {
      const blogsDetail = page.locator('.details')
      const nbBlogs = await blogsDetail.count()
      let prevLikesText = await blogsDetail.first().getByTestId('likes').textContent()
      let prevLikes = Number(prevLikesText)
      for (let i = 1; i < nbBlogs; i++) {
        const currentLikesText = await blogsDetail.nth(i).getByTestId('likes').textContent()
        const currentLikes = Number(currentLikesText)
        expect(currentLikes).toBeLessThanOrEqual(prevLikes)
        prevLikes = currentLikes
      }
     })
   })

})