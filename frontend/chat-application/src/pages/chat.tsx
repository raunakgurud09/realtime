import React from 'react'
import { useAuth } from '../context/AuthContext'

export const Chat = () => {

  const { user } = useAuth()
  return (
    <div>
      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  )
}
