import { defineComponent, PropType } from 'vue'
import { IEpisodeOption } from '../../types'

const ActionBar = defineComponent({
  name: 'ActionBar',

  props: {
    episodeList: {
      type: Array as PropType<IEpisodeOption[]>,
      default: () => []
    }
  },

  emits: [
    'goPrev', 'goNext', 'toTheStart', 'toTheEnd',
    'selectEpisode',
    'lockCamera', 'releaseCamera'
  ],

  setup (props, { emit }) {
    return () => (
      <div>
        <button onClick={() => emit('goPrev')}>Prev page</button>
        <button onClick={() => emit('goNext')}>Next page</button>
        <button onClick={() => emit('toTheStart')}>The Start</button>
        <button onClick={() => emit('toTheEnd')}>The End</button>
        <select onChange={event => {
          const target = event.target as HTMLOptionElement
          const index = parseInt(target.value)
          emit('selectEpisode', index)
          ;(event.target as HTMLSelectElement).blur()
        }}>{
          props.episodeList.map((item, index) => (
            <option value={index}>{item.label}</option>
          ))
        }</select>
        <button onClick={() => emit('lockCamera')}>正交视图</button>
        <button onClick={() => emit('releaseCamera')}>自由控制</button>
      </div>
    )
  }
})

export {
  ActionBar
}
