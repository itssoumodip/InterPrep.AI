import AuthForm from '@/components/AuthForm'
import React from 'react'

function page() {
  return (
    <AuthForm type = 'sign-in' /> // Pass the type prop to AuthForm
  )
}

export default page