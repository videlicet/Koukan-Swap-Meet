import { useState, useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/2_User.css'

/* import components */
import Asset from '../components/Asset.tsx'

/* context */
import { UserContext } from './1_App'

/* function component */
function UserAssets(): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, setUser } = useContext<any>(UserContext)
  const [userAssets, setUserAssets] = useState<any>([])

  async function getData() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}users/${user.username}/assets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ owner: user._id }),
        },
      )
      if (res.status == 200) {
        const userAssets = await res.json()
        setUserAssets(userAssets)
      }
    } catch (error) {
      //errorHandling
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div id='user-assets'>
      {userAssets?.length !== 0 ? (
        userAssets.map((item: any, index: number) => (
          <Asset
            assetProps={item}
            index={index}
            user_kokans={user?.kokans}
          ></Asset>
        ))
      ) : (
        <div className='asset'>
          <div style={{ marginLeft: '1rem' }}>
            <p>No assets yet.</p>
            <NavLink to={`/assets/new`} className='unstyledLink'>
              <p>Link your first GitHub asset.</p>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserAssets
