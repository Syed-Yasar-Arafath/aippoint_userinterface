import React, { useState } from 'react'
import { auth } from './firebase-config' // Path to your Firebase config file
import { deleteUser } from 'firebase/auth'

function DeleteAccount() {
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This cannot be undone.',
      )
    ) {
      //   @ts-ignore
      deleteUser(auth.currentUser)
        .then(() => {
          console.log('User deleted successfully')
          // Redirect to sign-in page or display a message
          // after successful deletion.
        })
        .catch((error) => {
          console.error(error)
          setError('Failed to delete user account: ' + error.message)
        })
    }
  }

  return (
    <div>
      <button onClick={handleDelete}>Delete Account</button>
      {error && <p>{error}</p>}
    </div>
  )
}

export default DeleteAccount
