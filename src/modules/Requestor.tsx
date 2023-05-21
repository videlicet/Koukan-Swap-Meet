export async function getRequestsIncoming(user: any, setRequests: any) {
  // TD typing
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}users/${user.username}/requests`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'requestee', user: { _id: user._id } }),
      },
    )
    if (res.status == 200) {
      const userRequest = await res.json()

      /* get requesters from requester ids */
      const requesters = await Promise.all(
        userRequest.map(async (request: any) => {
          const user = await fetch(
            `${import.meta.env.VITE_SERVER_URL}users/${request.requester}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user: { _id: request.requester } }),
            },
          )
          return await user.json()
        }),
      )

      /* get assets from asset ids*/
      const assets = await Promise.all(
        userRequest.map(async (request: any) => {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER_URL}assets/${request.asset_id}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ asset: { _id: request.asset_id } }),
            },
          )
          const asset = await res.json()
          return asset
        }),
      )

      userRequest.forEach((request: any, index: number) => {
        userRequest[index].requester = requesters[index] // QQ is there a way to aggregate the results or should i store the entire info on the value
        userRequest[index].requestee = user
        userRequest[index].asset_id = assets[index]
      })
      setRequests(userRequest)
    }
  } catch (error) {
    //errorHandling
  }
}

export async function getRequestsOutgoing(user: any, setRequests: any, setLoading?: any) {
  // TD typing
  setLoading(true)
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SERVER_URL}users/${user.username}/requests`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'requester', user: { _id: user._id } }),
      },
    )
    if (res.status == 200) {
      const userRequest = await res.json()

      /* get username from requestee id */
      const requestees = await Promise.all(
        userRequest.map(async (request: any) => {
          const user = await fetch(
            `${import.meta.env.VITE_SERVER_URL}users/${request.requestee}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user: { _id: request.requestee } }),
            },
          )
          return await user.json()
        }),
      )

      /* get assets from asset ids*/
      const assets = await Promise.all(
        userRequest.map(async (request: any) => {
          const res = await fetch(
            `${import.meta.env.VITE_SERVER_URL}assets/${request.asset_id}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ asset: { _id: request.asset_id } }),
            },
          )
          const asset = await res.json()
          return asset
        }),
      )

      userRequest.forEach((request: any, index: number) => {
        userRequest[index].requestee = requestees[0] // QQ is there a way to aggregate the results or should i store the entire info on the value
        userRequest[index].asset_id = assets[index]
      })
      setRequests(userRequest)
      setLoading(false)
    }
  } catch (error) {
    //errorHandling
  }
}
