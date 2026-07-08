import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import usersService from '../services/users'
import { useNotify } from './useNotification'
import { useNavigate } from 'react-router-dom'

export const useUsers = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()
  const navigation = useNavigate()

  const result = useQuery({
    queryKey: ['users'],
    queryFn: usersService.users,
    refetchOnWindowFocus: false,
  })

  //TODO : createUser to be implemented at a later stage (probably)
  const newUserMutation = useMutation({
    mutationFn: usersService.createUser,
    onSuccess: (newUser) => {
      notify(`User created with username : ${newUser.username}`)
      navigation('/')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    users: result.data ?? [],
    isPending: result.isPending,
    addUser: (newUser) => newUserMutation.mutate(newUser),
  }
}
