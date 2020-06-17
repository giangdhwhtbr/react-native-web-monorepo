import { app, BrowserWindow } from 'electron'
import * as window from './window'
import { __DEV__ } from './libs/electron-is-dev'

function setupBrowserExtensions() {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer') // tslint:disable-line no-var-requires
  
    installExtension(REACT_DEVELOPER_TOOLS).catch(console.error)
    installExtension(REDUX_DEVTOOLS).catch(console.error)
}

function init() {
    app.setName('myprj')
    app.whenReady().then(window.createWindow)

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.addListener('open-url', (_event, uri) => {
        const mainWindow = window.getMainWindow()
        if (!mainWindow) return
        mainWindow.webContents.send('open-url', uri)
        mainWindow.show()
    })
    
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            window.createWindow()
        }
    })

    app.addListener('ready', () => {
        window.init()
        if (__DEV__) {
          setupBrowserExtensions()
        }
    })
}

init()