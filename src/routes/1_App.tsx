import {
  useState,
  useEffect,
  createContext,
  ChangeEvent,
  FormEvent,
} from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import '../styles/1_App.css'
import '@fontsource/rubik/500.css'

/* import components */

import brand_icon from '../assets/kokan_icon_w.png'
import {
  MagnifyingGlassIcon,
  PersonIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import DropdownMenu from '../components/DropDownMenu.tsx'

/* import types */

import { UserInterface } from '../assets/mockUsers.tsx'

/* context */

export const UserContext = createContext({})

/* helpers */

const footerContent = [
  { name: 'How It Works', route: '/how-it-works' },
  { name: 'About', route: '/about' },
]

const navContent = [
  { name: 'Home', route: '/' },
  { name: 'Assets', route: '/assets' },
  { name: 'Kokans', route: '/kokans' },
]

function App(): JSX.Element {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [nav, setNav] = useState(navContent)
  const [footer, setFooter] = useState(footerContent)
  const [user, setUser] = useState<any>()

  /** fetch data */
  const getData = (): void => {
    setLoading(true)
  }

  useEffect(() => {
    getData()
  }, [])

  /* search */

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('search submitted')
    /* TD make a request to the server to get documents with condition x*/
    setSearchTerm('')
  }

  function handleChangeSearchTerm(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value)
  }

  return (
    <UserContext.Provider value={{user, setUser}}>
      <div className='page-container'>
        <NavLink to='/'>
          <h1 id='brand'>
            <img id='brand_icon' src={brand_icon} height='50' />
            okan
          </h1>
        </NavLink>

        <nav id='header'>
          <div className='navbar'>
            <form
              onSubmit={handleSubmit}
              className='navbar-element'
              style={{
                height: '100%',
                width: '40%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                className='search-bar'
                onChange={handleChangeSearchTerm}
                type='text'
                value={searchTerm}
                placeholder='Search assets'
              ></input>
              <button type='submit' className='search-submit'>
                <MagnifyingGlassIcon className='search-icon' />
              </button>
            </form>
            {user && (
              <div className='navbar-element'>
                <NavLink to='assets/new'>
                  <PlusIcon style={{ position: 'relative', top: '0.1rem' }} />
                  &nbsp;Asset
                </NavLink>
              </div>
            )}
            <div id='profile-link' className='navbar-element'>
              {!user && (
                <NavLink to='/login'>
                  <PersonIcon
                    className='login_icon'
                    style={{ top: '0.2rem', left: '0.1rem' }}
                  />
                </NavLink>
              )}
              {user && (
                <div className='profile-name'>
                  <DropdownMenu user={user} />
                </div>
              )}
            </div>
          </div>
        </nav>

        <div id='main-container'>
          <Outlet />
        </div>
      </div>

      <footer id='footer'>
        <div className='navbar'>
          {footer.map((item) => (
            <div>
              <NavLink
                style={({ isActive }) => ({
                  fontWeight: isActive ? 'bold' : '',
                  color: isActive ? 'black' : 'grey',
                  padding: isActive ? '0 0.8rem' : 0,
                  borderRadius: isActive ? 15 : 0,
                })}
                to={`${item.route}`}
              >
                {item.name}
              </NavLink>
            </div>
          ))}
          <div>
            <span>Kokan © 2023</span>
          </div>
        </div>
      </footer>
    </UserContext.Provider>
  )
}

export default App
