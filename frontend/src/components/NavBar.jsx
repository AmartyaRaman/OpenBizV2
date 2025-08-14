import { useState } from 'react'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = [
    { name: 'Home', href: '#' },
    { name: 'NIC Code', href: '#' },
    { name: 'Useful Documents', href: '#', hasDropdown: true },
    { name: 'Print / Verify', href: '#', hasDropdown: true },
    { name: 'Update Details', href: '#', hasDropdown: true },
    { name: 'Login', href: '#', hasDropdown: true }
  ]

  return (
    <nav className='bg-[rgba(24,6,185,0.8)] w-full h-17 flex items-center px-4 fixed top-0 left-0 z-50'>
      <img className='p-1.5 h-full' src='MINISTRY_NAME.webp' alt='Ministry_logo'/>
      
      <div className='ml-auto hidden md:flex items-center gap-6'>
        {menuItems.map((item, index) => (
          <div key={index} className='group'>
            <a 
              href={item.href} 
              className='text-white hover:text-gray-200 transition-colors duration-200 flex items-center gap-1 py-2'
            >
              {item.name}
              {item.hasDropdown && (
                <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              )}
            </a>
          </div>
        ))}
      </div>

      <button 
        className='ml-auto md:hidden text-white focus:outline-none'
        onClick={toggleMenu}
        aria-label='Toggle menu'
      >
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          {isMenuOpen ? (
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          ) : (
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          )}
        </svg>
      </button>

      {isMenuOpen && (
        <div className='absolute top-full left-0 w-full bg-[rgba(24,6,185,0.95)] md:hidden z-50'>
          <div className='flex flex-col py-2'>
            {menuItems.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className='text-white hover:bg-[rgba(255,255,255,0.1)] px-4 py-3 transition-colors duration-200 flex items-center justify-between'
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
                {item.hasDropdown && (
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar
