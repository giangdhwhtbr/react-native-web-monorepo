import {
    app,
    BrowserWindow,
    BrowserWindowConstructorOptions,
  } from 'electron'
import * as constants from './constants'
import * as screen from './screen'
import { __DEV__ } from './libs/electron-is-dev'
import { WindowState, windowStateKeeper } from './libs/electron-window-state'

let mainWindow: BrowserWindow | undefined
let mainWindowState: WindowState
let menubarWindowState: WindowState

export function getMainWindow() {
    return mainWindow
}
  
export function init() {
    const display = screen.getDisplayFromCursor()
  
    mainWindowState = windowStateKeeper({
      defaultWidth: display.workAreaSize.width,
      defaultHeight:
        display.workAreaSize.height - (process.platform === 'linux' ? 28 : 0),
      file: `main-window-display-${display.id}.json`,
      fullScreen: false,
    })
  
    menubarWindowState = windowStateKeeper({
      defaultWidth: 416,
      defaultHeight: 700,
      file: `menubar-window-display-${display.id}.json`,
      fullScreen: false,
    })
  
    mainWindow = createWindow()
}

let mainWindowReadyToShowCount = 0
let screenId: number

export function createWindow() {
    const win = new BrowserWindow(getBrowserWindowOptions())

    win.loadURL(constants.START_URL)

    win.once('ready-to-show', () => {
        mainWindowReadyToShowCount++
        if (
        mainWindowReadyToShowCount === 1 &&
        (__DEV__ || app.getLoginItemSettings().wasOpenedAsHidden)
        )
        return

        win.show()
    })

    win.on('close', e => {
        if (process.platform === 'darwin') {
        e.preventDefault()
        win.hide()
        return
        }
    })

    win.on('closed', () => {
        win.destroy()
        mainWindow = undefined
    })

    win.on('move', () => {
        screenId = screen.getDisplayFromWindow(win).id
    })

    return win
}
  
export function getBrowserWindowOptions() {
    const options: BrowserWindowConstructorOptions = {
      titleBarStyle: 'default',
      minWidth: 320,
      minHeight: 450,
      backgroundColor: '#fff',
      darkTheme: true,
      icon: undefined,
      resizable: true,
      show: !!(getMainWindow() && getMainWindow()!.isVisible()),
      title: 'myprj',
      webPreferences: {
        affinity: 'main-window',
        backgroundThrottling: false,
        contextIsolation: false,
        nativeWindowOpen: true,
        nodeIntegration: false,
      },
    }
  
    return options
}