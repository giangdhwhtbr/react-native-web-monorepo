import { AppRegistry } from 'react-native'

import { App } from '@myprj/components/src/App'

AppRegistry.registerComponent('myprj', () => App)
AppRegistry.runApplication('myprj', {
  rootTag: document.getElementById('root'),
})
