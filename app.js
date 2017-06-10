// Packages
const electron = require('electron')
const path = require('path')
const url = require('url')

// Init App
const app = electron.app

// Browser Window
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

app.on('ready', createWindow)
