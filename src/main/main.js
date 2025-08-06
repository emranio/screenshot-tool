import { app } from 'electron'
import { ScreenshotApp } from './app.js'

const screenshotApp = new ScreenshotApp()
screenshotApp.initialize().catch(console.error)
