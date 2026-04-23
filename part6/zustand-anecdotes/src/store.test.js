import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./service/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from './service/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '', notification:'' })
  vi.clearAllMocks()
})

describe('useAnecdoteeActions', () => {
  it('initialize loads anecdotes from service', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Test', votes: 1 }
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('retrieved list of anmecdotes is sorted by descending order', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Test1', votes: 1 },
      { id: 2, content: 'Test2', votes: 3 },
      { id: 3, content: 'Test3', votes: 2 },
      { id: 4, content: 'Test4', votes: 5 },
      { id: 5, content: 'Test5', votes: 4 }
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    await act(async () => {
      await useAnecdoteStore.getState().actions.initialize()
    })

    const expectedOrder = [5,4,3,2,1]
    
    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current.map(anec => anec.votes)).toEqual(expectedOrder)
  })


  it('correct React component receives a properly filtered list', async () => { 
    const mockAnecdotes = [
      { id: 1, content: 'Jonas', votes: 1 },
      { id: 2, content: 'Olaf', votes: 3 },
      { id: 3, content: 'Laf', votes: 2 },
      { id: 4, content: 'Bjorn', votes: 5 },
      { id: 5, content: 'Gunnar', votes: 4 }
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    //const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await useAnecdoteStore.getState().actions.initialize()
      useAnecdoteStore.getState().actions.setFilter('na')
    })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([{ id: 5, content: 'Gunnar', votes: 4 }, { id: 1, content: 'Jonas', votes: 1 }])

  })

    it('voting increases the number of votes for an anecdote', async () => { 
    const mockAnecdotes = [
      { id: 1, content: 'Jonas', votes: 1 },
      { id: 2, content: 'Olaf', votes: 3 },
      { id: 3, content: 'Laf', votes: 2 },
      { id: 4, content: 'Bjorn', votes: 5 },
      { id: 5, content: 'Gunnar', votes: 4 }
    ]
      const id = 3
      const anecdoteToVote = mockAnecdotes.find(a => a.id === id)
      const votedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
      anecdoteService.update.mockResolvedValue(votedAnecdote)
      anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
      
    //const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await useAnecdoteStore.getState().actions.initialize()
      await useAnecdoteStore.getState().actions.vote(id)
    })
      const { result } = renderHook(() => useAnecdotes())
      const updatedAnecdote = result.current.find(a => a.id === id)
    expect(updatedAnecdote).toEqual(votedAnecdote)

  })
})