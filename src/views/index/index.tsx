import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import { pageConfig } from '../../config'

const IndexPage = defineComponent({
  name: 'IndexPage',

  setup () {
    return () => (
      <div style={{ margin: '0 20px' }}>{
        Object.keys(pageConfig).map(sectionName => {
          const configItem = pageConfig[sectionName]
          return (
            <section>
              <h2>{ sectionName }</h2>
              <ul>{
                configItem.map(item => (
                  <li><RouterLink to={{
                    name: `${sectionName}.${item.name}`
                  }}>{item.name}</RouterLink></li>
                ))
              }</ul>
            </section>
          )
        })
      }</div>
    )
  }
})

export {
  IndexPage
}
