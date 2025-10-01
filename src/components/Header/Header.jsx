import React, { useState } from 'react' // 💡 ADDED useState
import { LogoutBtn,Logo,Container } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react' // 💡 ADDED Icons for mobile toggle

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 💡 State to control mobile menu visibility

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
  
  const handleNavigation = (slug) => {
      navigate(slug);
      setIsMobileMenuOpen(false); // Close menu after selection
  }


  return (
    <>
    {/* Primary Navigation Bar */}
    <header className='py-3 shadow bg-indigo-500 text-white'>
      <Container>
        <nav className='flex items-center justify-between'> {/* 💡 Use justify-between for logo/menu spacing */}
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>
          
          {/* Desktop Navigation (Visible on md and up) */}
          <ul className='hidden md:flex ml-auto items-center'>
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                onClick={() => navigate(item.slug)}
                className='inline-block px-4 py-2 duration-200 hover:bg-indigo-700 rounded-full text-white font-medium'
                >{item.name}</button>
              </li>
            ) : null
            )}
            {authStatus && (
              <li className='ml-4'>
                <LogoutBtn />
              </li>
            )}
          </ul>
          
          {/* Mobile Toggle Button (Visible only on mobile) */}
          <button 
              className='md:hidden p-2 text-white'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
          >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        </Container>
    </header>
    
    {/* 💡 MOBILE MENU CONTENT (Fixed position, full screen takeover) */}
    {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-indigo-700 z-40 pt-20">
            <ul className='flex flex-col items-center space-y-2 py-8'> 
                 {navItems.map((item) => 
                    item.active ? (
                        <li key={item.name} className="w-full text-center">
                            <button
                                onClick={() => handleNavigation(item.slug)}
                                className='block w-full px-6 py-3 text-lg duration-200 hover:bg-indigo-600 text-white font-medium'
                            >
                                {item.name}
                            </button>
                        </li>
                    ) : null
                    )}
                 {authStatus && (
                    <li className='w-full text-center mt-4'>
                        <LogoutBtn mobile={true} />
                    </li>
                 )}
            </ul>
        </div>
    )}

    
    {/* Title Header (Pass the Torch) */}
    <div className='bg-white shadow-md border-b-2 border-indigo-200 py-4'>
      <h1 className='text-3xl font-extrabold text-indigo-700 text-center'>
        <span className='inline-block p-2 border-b-4 border-indigo-500'>
           Pass the Torch 🔥
        </span>
      </h1>
    </div>
    </>
  )
}

export default Header
