import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'
import useNotify from "./useNotify"




export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { setNotification } = useNotify()
  
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || []
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (err) => { 
      setNotification(err.message)
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError:result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate({ content }),
    addVote: (anecdote) => updateAnecdoteMutation.mutate({ 
      ...anecdote, votes: anecdote.votes+1 
    }),
  }
}