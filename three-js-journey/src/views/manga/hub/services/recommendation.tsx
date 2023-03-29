import { deserialize } from '@vert/serializer'
import { MangaSeason } from '../model/manga-season'
import { IApiResponse } from '../type'

const getRecommendationList = async (): Promise<MangaSeason[]> => {
  const json = await import('../data/recommendation.json') as IApiResponse
  return (json.data as unknown[]).map(item => deserialize(item, MangaSeason))
}

export {
  getRecommendationList
}
