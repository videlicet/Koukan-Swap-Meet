import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import '../styles/1.1_Login.css'

/* context */
import { UserContext } from './1_App'

function Login(): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { user, setUser } = useContext<any>(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const codeParam = urlParams.get('code')
    if (codeParam && localStorage.getItem('accessToken') === null) {
      // TD send http only cookie
      console.log(
        `${import.meta.env.VITE_SERVER_URL}auth/gitHub?code=${codeParam}`,
      )
      getAccessToken()
      async function getAccessToken() {
        let res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}auth/gitHub?code=${codeParam}`,
        )
        let accessToken = await res.json()
        console.log('accessToken: ')
        console.log(accessToken)
        if (accessToken.access_token) {
          localStorage.setItem('accessToken', accessToken.access_token) // TD send http only cookie
        }
      }
    }
  }, [])

  async function handleFormSubmit(data: any) {
    setLoading(true)
    const { username, password } = data

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}auth`, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      if (res.status === 200) {
        const user = await res.json()
        setUser(user)
        setLoading(false)
        navigate(`/user/${user?.username}/assets`)
      } else {
        setLoading(false)
        setError(true)
      }
    } catch (error) {
      // td
      console.log('error')
    }
  }

  /* GitHub */
  function loginWithGithub() {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${
        import.meta.env.VITE_GITHUB_CLIENT_ID
      }&scope=repo`, // scope: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#requested-scopes-and-granted-scopes
    )
  }

  async function addCollaborator() { // TD wrap in try/catch
    let res = await fetch(`${import.meta.env.VITE_SERVER_URL}auth/gitHub/addCollaborator`,{
      method: "POST",
      body: JSON.stringify({
        access_token: localStorage.getItem('accessToken')
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',      
    })
    if (res.status === 200) {
      console.log('add successful')
      const collaborators = await res.json()
      console.log(collaborators)
    } else console.log('add failed') // TD else action
  }

  return (
    <div id='login-container'>
      {!loading ? (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
            <div className='text-input'>
              <label htmlFor='username'>Username</label>
              <input
                {...register('username', {
                  required: true,
                  minLength: 4,
                  maxLength: 15,
                })}
                name='username'
                type='text'
              ></input>
              {errors.username && (
                <p className='validation-error'>Username invalid.</p>
              )}

              <label htmlFor='password'>Password</label>
              <input
                {...register('password', {
                  required: true,
                  minLength: 7,
                  maxLength: 50,
                })}
                name='password'
                type='password'
              ></input>
              {errors.password && (
                <p className='validation-error'>Password invalid.</p>
              )}
            </div>
            {error && (
              <p className='validation-error'>
                Username or Password incorrect.
              </p>
            )}
            <br />
            <input type='submit' value='login'></input>
            <span> &nbsp; &nbsp;OR &nbsp; &nbsp;</span>
            <NavLink className='button-like' to='/sign-up'>
              sing up
            </NavLink>
          </form>
        </>
      ) : (
        <span>Loading</span>
      )}

      <div>
        <h3>Authenticate</h3>
        <button onClick={loginWithGithub}>GitHub AUTHENTICATION</button>
      </div>

      <div>
        <h3>Add to repo</h3>
        <button onClick={addCollaborator}>Add to Repo</button>
      </div>
    </div>
  )
}

export default Login
