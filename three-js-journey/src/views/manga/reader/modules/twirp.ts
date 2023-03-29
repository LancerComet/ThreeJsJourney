const twirpPost = <T>(url: string, payload?: Record<string, unknown>): Promise<{
  data: T,
  code: number,
  msg: string
}> => {
  const baseUrl = '/twirp'
  return fetch(`${baseUrl}${url}?device=pc&platform=web`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload ? JSON.stringify(payload) : undefined
  }).then(item => item.json())
}

export {
  twirpPost
}
