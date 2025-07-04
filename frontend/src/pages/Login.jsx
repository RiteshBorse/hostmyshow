import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='pt-12 px-24 mx-auto h-screen'>
      <div className='glass rounded-md p-8 flex flex-col h-1/2 justify-center items-center'>
        <h1 className='text-white text-3xl font-bold mb-4'>Log In</h1>
        <form action='' className='flex flex-col gap-5 py-4 w-1/2 justify-center items-center'>
          <Input className="text-white h-12 placeholder:text-white/60 text-lg placeholder:text-lg w-full border-white/60" placeholder="Email" />
          <Input className="text-white h-12 placeholder:text-white/60 text-lg placeholder:text-lg w-full border-white/60" placeholder="Password" />
          <Button className="bg-blue-700 hover:bg-blue-800text-white font-semibold py-2 rounded-lg transition-colors shadow glow-blue w-1/2">Log In</Button>
        </form>
        <div className="mt-4 text-white/80 text-sm">
          Don't have an account? <Link to="/sign-up" className="text-blue-300 hover:underline font-semibold">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login 