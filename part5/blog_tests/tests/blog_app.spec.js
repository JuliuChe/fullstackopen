import { test, expect } from '@playwright/test'
import { routerLogin, routerCreateBlog } from './helper'
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
    await page.goto('/login')
    const form = page.getByRole('form', {name: 'login form'})
    await expect(form).toBeVisible()
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
      
      await routerLogin(page, 'jcheval', 'myPassword')

      await expect(page.getByText('logged in as Julien Chevalley')).toBeVisible()

    })

     test('fails with wrong credentials', async ({ page }) => {
      await routerLogin(page, 'jcheval', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong login credentials')

      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('logged in as Julien Chevalley')).not.toBeVisible()
    })
   })
  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
        await routerLogin(page, 'jcheval', 'myPassword')
        await expect(page.getByText('logged in as Julien Chevalley')).toBeVisible()
    })
    
    test('a new blog can be created', async ({ page }) => {
      await routerCreateBlog(page, 'A new space odyssey', 'Spawn of S.Kubrick', 'www.kubrickisalive.com')
      await expect(page.getByRole('link', { name: /A new space odyssey/ })).toBeVisible()
      await expect(page.getByRole('link', { name: /Spawn of S\.Kubrick/ })).toBeVisible()

    })
    test.describe('and there is only one blog in the list', () => {
      test.beforeEach(async ({ page }) => {
        await routerCreateBlog(page, 'The mission of Artemis was a great success', 'Nasa express', 'www.nasa-blog.com')
        const notification = page.getByText('a new blog The mission of Artemis was a great success by Nasa express added')
        await expect(notification).toBeVisible()
  
        // await expect(notification).not.toBeVisible({ timeout: 7000 })
      })
      test('that can be liked', async ({ page }) => {
        await page.getByRole('link', { name: /The mission of Artemis was a great success/ }).click()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByTestId('likes')).toHaveText('1')
      })
      test('that can be removed by the user', async ({ page }) => {
        await page.getByRole('link', { name: /The mission of Artemis was a great success/ }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        
        const infoDiv = page.locator('.info')
        await expect(infoDiv).toContainText('Blog The mission of Artemis was a great success Nasa express successfully deleted from DB')
        await expect(infoDiv).toHaveCSS('border-style', 'solid')
        await expect(infoDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
        await expect(page.getByRole('list').getByText(/The mission of Artemis was a great success/)).not.toBeVisible()

        
       })
     })
  })
  test.describe('there is more than one user who adds a blog', () => {
    test.beforeEach(async ({ page }) => {
      await routerLogin(page, 'jcheval', 'myPassword')
      await routerCreateBlog(page, 'Blog added by first user', 'JC', 'www.JC.com')
      const notifOne = page.getByText('a new blog')
      await expect(notifOne).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await routerLogin(page, 'secondUser', 'hisPassword')
      await routerCreateBlog(page, 'Blog added by second user', 'UT', 'www.UT.com')
      const notifTwo = page.getByText('a new blog')
      await expect(notifTwo).toBeVisible()

    })
    
    test('User two can not remove blog added by first user', async ({ page }) => {
      const blogsList = page.getByRole('list', { name : 'blog list' }).getByRole('link')
      const count = await blogsList.count()
      console.log(count)
      const nameOfUser = 'User Two'
      const urls = []
      for (let i = 0; i < count; i++) { 
        urls.push(await blogsList.nth(i).getAttribute('href'))
      }

     
      for (const url of urls) { 
        await page.goto(url)
        await expect(page.locator('.details')).toBeVisible()
        const isOwnedByCurrentUser = (await page.getByText(nameOfUser).count()) > 0
        console.log('Is owned by user', isOwnedByCurrentUser)
        if (isOwnedByCurrentUser) {
          console.log('is owned')
          await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        } else { 
          console.log('is not owned')
          await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        }
      }

     })

  })
})