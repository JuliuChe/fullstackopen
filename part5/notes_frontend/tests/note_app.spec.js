import { test, expect } from '@playwright/test'
import { loginWith, createNote }  from './helper'


//While developping a new test, you can use only as test.only('test under development'...)
//Another possibility is to run npm test '--' '-g' "test under development"

test.describe('Note app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users/', {
      data: {
        name: 'Julien Chevalley',
        username: 'jcheval',
        password: 'yourPassword'
      }
    })
    await page.goto('/')
  })


  test('front page can be opened', async ({ page }) => {
    await page.goto('/')

    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025'))
      .toBeVisible()
  })

  test('User can log in', async ({ page }) => {
    await loginWith(page, 'jcheval', 'yourPassword')
    // await page.getByRole('button', { name: 'log in' }).click()
    // // const textboxes = await page.getByRole('textbox').all()
    // // await textboxes[0].fill('jcheval')
    // // await textboxes[1].fill('yourPassword')
    // await page.getByLabel('username').fill('jcheval')
    // await page.getByLabel('password').fill('yourPassword')
    // await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('logged in as Julien Chevalley')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'jcheval', 'wrongPassword')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')

    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('logged in as Julien Chevalley')).not.toBeVisible()
  })


  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'jcheval', 'yourPassword')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
    test.describe('and a note exists', () => {
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'another note created by playwright')
      })
      test('important can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })

    test.describe('and several notes exists', () => {
      test.beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause()
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..')//.. is looking for the parent element
        await otherNoteElement
          .getByRole('button', { name: 'make not important' })
          .click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()

      })

    })
  })
})
