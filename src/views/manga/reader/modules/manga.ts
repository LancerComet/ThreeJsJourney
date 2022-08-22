import { computed, ref } from 'vue'
import blankImage from '../assets/blank.png'
import { twirpPost } from './twirp'

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
  return imagesWithToken.map(item => `${item.url}?token=${item.token}`)
}

const useMangaImages = () => {
  const imageUrlsRef = ref<string[]>([])
  const imageCount = computed(() => {
    return imageUrlsRef.value?.length ?? 0
  })
  const pageCount = computed(() => {
    return Math.ceil(imageCount.value / 2)
  })

  const mutate = async (episodeId: number, blank: number = -1) => {
    imageUrlsRef.value = []
    try {
      const imageUrls = await getMangaImages(episodeId)
      // Add blank pages by setting.
      if (blank > -1) {
        imageUrls.splice(blank, 0, blankImage)
      }
      // Add a blank page at end.
      imageUrls.push(blankImage)
      imageUrlsRef.value = imageUrls
    } catch (error) {
      console.error(error)
    }
  }

  return {
    imageUrlsRef,
    imageCount,
    pageCount,
    mutate
  }
}

export {
  useMangaImages
}
