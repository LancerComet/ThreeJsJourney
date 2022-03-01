import { JsonProperty, Serializable } from '@vert/serializer'

@Serializable()
class MangaSeason {
  @JsonProperty('id')
  private readonly _id: number = 0

  @JsonProperty('season_id')
  private readonly _seasonId: number = 0

  get id (): number {
    return this._id || this._seasonId
  }

  @JsonProperty('title')
  readonly title: string = ''

  @JsonProperty('styles')
  readonly styles: string[] = []

  @JsonProperty('vertical_cover')
  readonly verticalCover: string = ''
}

export {
  MangaSeason
}
