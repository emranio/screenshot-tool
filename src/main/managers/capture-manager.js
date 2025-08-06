import { desktopCapturer } from 'electron'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { tmpdir } from 'os'
import sharp from 'sharp'

export class CaptureManager {
    constructor() {
        this.tempDir = join(tmpdir(), 'screenshot-tool')
        this.isRecording = false
        this.mediaRecorder = null
        this.recordedChunks = []
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

        // Crop the image based on selection bounds
        const croppedImageBuffer = await this.cropImage(screenshotBuffer, bounds)
        const filename = this.generateFilename('screenshot', 'png')

        const result = {
            buffer: croppedImageBuffer,
            filename,
            dimensions: {
                width: Math.round(bounds.width),
                height: Math.round(bounds.height)
            }
        }

        if (mode === 'screenshotWithEditor') {
            return await this.openEditor(croppedImageBuffer, result)
        }

        return result
    }

    async cropImage(imageBuffer, bounds) {
        try {
            const { x, y, width, height } = bounds

            // Use sharp to crop the image
            const croppedBuffer = await sharp(imageBuffer)
                .extract({
                    left: Math.round(x),
                    top: Math.round(y),
                    width: Math.round(width),
                    height: Math.round(height)
                })
                .png()
                .toBuffer()

            return croppedBuffer
        } catch (error) {
            console.error('Failed to crop image:', error)
            // Return original buffer if cropping fails
            return imageBuffer
        }
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
        if (this.isRecording) {
            console.warn('Recording already in progress')
            return
        }

        console.log('Starting fullscreen recording for display:', display.id)
        this.isRecording = true

        // This would implement screen recording functionality
        // For now, simulate recording and return after a delay
        setTimeout(() => {
            this.stopRecording()
        }, 10000) // Stop after 10 seconds for demo
    }

    async startSelectionRecording(bounds, display) {
        if (this.isRecording) {
            console.warn('Recording already in progress')
            return
        }

        console.log('Starting selection recording:', { bounds, display: display.id })
        this.isRecording = true

        // Implementation would use MediaRecorder with screen capture
        // For now, simulate recording
        setTimeout(() => {
            this.stopRecording()
        }, 10000) // Stop after 10 seconds for demo
    }

    stopRecording() {
        if (!this.isRecording) {
            console.warn('No recording in progress')
            return null
        }

        this.isRecording = false
        console.log('Recording stopped')

        // Return a mock video result for now
        const filename = this.generateFilename('recording', 'mp4')
        return {
            buffer: Buffer.from('mock-video-data'), // This would be actual video data
            filename,
            dimensions: { width: 1920, height: 1080 }
        }
    }
}
