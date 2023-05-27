import { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate, Outlet, useParams } from 'react-router-dom'
import '../styles/2_User.css'

/* import components */
import UserInfo from '../components/UserInfo'
import Loading from '../components/Loading'

/* import modules */
import { authenticate } from '../modules/Authenticator'

/* import context */
import { UserContext } from './1_App'

/* import modules */
import { fetchOtherUser } from '../modules/Authenticator'

function User(): JSX.Element | undefined {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, setUser } = useContext<any>(UserContext)
  const [otherUser, setOtherUser] = useState()
  const [auth, setAuth] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams<string>() //as any // throws error without

  useEffect(() => {
    setLoading(true)
    authenticate()
      .then((res) => {
        setAuth(res.status)
        if (res.status === false) {
          navigate('/login')
        }
        /* fetch info about other user if 
        url param (id) and username differs */
        if (id !== user?.username) {
          fetchOtherUser(id).then((res) => {
            const [userD] = res
            setOtherUser(userD)
            navigate(`assets`)
          })
        }
      })
      .catch((err) => {
        console.log(err)
        navigate('/login')
      })
    setLoading(false)
  }, [])

  if (auth === true)
    return (
      <div id='user-container'>
        {!loading ? (
          <>
            <div id='user-outlet'>
                <Outlet />
            </div>
            {id === user?.username ? ( // TD can't his be combined?
              <UserInfo />
            ) : (
              <UserInfo otherUser={otherUser} />
            )}
          </>
        ) : <Loading/>}
      </div>
    )
}

export default User
