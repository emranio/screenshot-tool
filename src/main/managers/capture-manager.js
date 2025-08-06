import { desktopCapturer } from 'electron'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { tmpdir } from 'os'

export class CaptureManager {
    constructor() {
        this.tempDir = join(tmpdir(), 'screenshot-tool')
        this.ensureTempDir()
    }

    async ensureTempDir() {
        try {
            await mkdir(this.tempDir, { recursive: true })
        } catch (error) {
            console.error('Failed to create temp directory:', error)
        }
    }

    async captureDisplay(display) {
        try {
            const sources = await desktopCapturer.getSources({
                types: ['screen'],
                thumbnailSize: {
                    width: display.bounds.width,
                    height: display.bounds.height
                }
            })

            // Find the source for the specific display
            const source = sources.find(s => s.display_id === display.id.toString())
            if (!source) {
                throw new Error('Could not find display source')
            }

            return source.thumbnail.toPNG()
        } catch (error) {
            console.error('Failed to capture display:', error)
            throw error
        }
    }

    async captureFullscreen(display) {
        const screenshot = await this.captureDisplay(display)
        const filename = this.generateFilename('screenshot', 'png')

        return {
            buffer: screenshot,
            filename,
            dimensions: {
                width: display.bounds.width,
                height: display.bounds.height
            }
        }
    }

    async processSelection(selection) {
        const { screenshot, bounds, mode } = selection
        const screenshotBuffer = Buffer.from(screenshot, 'base64')

        // For now, we'll use Canvas API to crop the image
        // In a production app, you might want to use a more robust image processing library
        const filename = this.generateFilename('screenshot', 'png')

        const result = {
            buffer: screenshotBuffer, // For now, return the full screenshot
            filename,
            dimensions: {
                width: Math.round(bounds.width),
                height: Math.round(bounds.height)
            }
        }

        if (mode === 'screenshotWithEditor') {
            return await this.openEditor(screenshotBuffer, result)
        }

        return result
    }

    async openEditor(imageBuffer, existingResult = null) {
        // This would integrate with nashaofu/screenshots
        // For now, return the original image
        const filename = existingResult?.filename || this.generateFilename('screenshot', 'png')

        return {
            buffer: imageBuffer,
            filename,
            dimensions: existingResult?.dimensions || { width: 0, height: 0 }
        }
    }

    async saveLocally(buffer, savePath) {
        const filename = this.generateFilename('screenshot', 'png')
        const fullPath = join(savePath, filename)

        try {
            await mkdir(dirname(fullPath), { recursive: true })
            await writeFile(fullPath, buffer)
            return fullPath
        } catch (error) {
            console.error('Failed to save file locally:', error)
            throw error
        }
    }

    generateFilename(type, extension) {
        const now = new Date()
        const timestamp = now.toISOString()
            .replace(/:/g, '-')
            .replace(/\..+/, '')
            .replace('T', '_')

        return `${type}_${timestamp}.${extension}`
    }

    async startFullscreenRecording(display) {
        // This would implement screen recording functionality
        // For now, just log the action
        console.log('Starting fullscreen recording for display:', display.id)

        // Implementation would use MediaRecorder API or similar
        // to capture screen content as video
    }
}
