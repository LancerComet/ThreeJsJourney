const twirpPost = <T>(url: string, payload?: Record<string, any>): Promise<{
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

const getBlankPageIndex = () => {
  const query = window.location.search
  const search = new URLSearchParams(query)
  const value = parseInt(search.get('addBlank') || '', 10)
  return isNaN(value) ? -1 : value
}

const getEpisodeId = (): string | null => {
  const query = window.location.search
  const search = new URLSearchParams(query)
  return search.get('episodeId')
}

const getIndexContent = async (episodeId: string | number) => {
  const response = await twirpPost<{
    images: { path: string }[]
    host: string
  }>('/comic.v1.Comic/GetImageIndex', {
    ep_id: episodeId
  })
  if (response.code !== 0) {
    throw new Error('Server response with code ' + response.code)
  }
  const host = response?.data?.host ?? ''
  const images: string[] = (response?.data?.images ?? [])
    .map(item => item.path + '@700w.jpg')
  return {
    host,
    images
  }
}

const getImageTokens = async (images: string[]) => {
  const response = await twirpPost<{token: string, url: string}[]>('/comic.v1.Comic/ImageToken', {
    urls: JSON.stringify(images)
  })
  if (response.code !== 0) {
    throw new Error('Server response with code ' + response.code)
  }
  return response.data
}

const getMangaImages = async (episodeId: number | string): Promise<string[]> => {
  const { images } = await getIndexContent(episodeId)
  const imagesWithToken = await getImageTokens(images)
  const imageUrls = imagesWithToken.map(item => `${item.url}?token=${item.token}`)
  return imageUrls
}

export {
  getEpisodeId,
  getBlankPageIndex,
  getMangaImages
}
