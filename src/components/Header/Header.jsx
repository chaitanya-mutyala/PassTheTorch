import React from 'react'
import { LogoutBtn,Logo,Container } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: true,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]


  return (
    <>
    {/* Primary Navigation Bar */}
    <header className='py-3 shadow bg-indigo-500 text-white'>
      <Container>
        <nav className='flex items-center'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                className='inline-block px-6 py-2 duration-200 hover:bg-indigo-700 rounded-full text-white font-medium'
                >{item.name}</button>
              </li>
            ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
        </Container>
    </header>
    
    {/* 💡 Title Header (Pass the Torch) - MODIFIED SECTION */}
    <div className='bg-white shadow-md border-b-2 border-indigo-200 py-4'>
      <h1 className='text-3xl font-extrabold text-indigo-700 text-center'>
        <span className='inline-block p-2 border-indigo-500'>
           Pass the Torch 🔥
        </span>
      </h1>
    </div>
    </>
  )
}

export default Header
