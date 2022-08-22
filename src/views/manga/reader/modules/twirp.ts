import { ref } from 'vue'

const twirpPost = <T>(url: string, payload?: Record<string, unknown>): Promise<{
  data: T,
  code: number,
  msg: string
}> => {
  const baseUrl = 'https://manga.bilibili.com/twirp'
  return fetch(`${baseUrl}${url}?device=pc&platform=web`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload ? JSON.stringify(payload) : undefined
  }).then(item => item.json())
}

const useTwirpPost = <T>(url: string, payload?: Record<string, unknown>) => {
  const dataRef = ref<T>()
  const errorRef = ref<Error>()
  const codeRef = ref<number>(0)

  const mutate = async () => {
    try {
      const { code, data } = await twirpPost<T>(url, payload)
      codeRef.value = code
      if (code === 0) {
        dataRef.value = data
      }
    } catch (error) {
      errorRef.value = error as Error
    }
  }

  mutate()

  return {
    data: dataRef,
    error: errorRef,
    code: codeRef,
    mutate
  }
}

export {
  twirpPost,
  useTwirpPost
}
