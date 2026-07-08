import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'

const UsersList = () => {
  const { users } = useUsers()
  return (
    <div>
      <h2>Users</h2>

      <TableContainer>
        <Table
          sx={{ minWidth: 500 }}
          size="small"
          aria-label="a table of users"
        >
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow key={row.name} sx={{ '&  .MuiTableCell-root': { py: 1.4 } }}>
                <TableCell component="th" scope="row">
                  <Link to={`/users/${row.id}`}>
                {row.name}
              </Link>
                </TableCell>
                                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                                <TableCell component="th" scope="row">
                  {row.blogs.length}
                </TableCell>
              </TableRow>
            ))}
            {/* {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UsersList
