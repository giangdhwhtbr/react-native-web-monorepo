import path from 'path'
import { __DEV__ } from './libs/electron-is-dev'

export const START_URL = __DEV__
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, 'web/index.html')}`
