import { Client } from 'basic-ftp'
import { join } from 'path'

export class FTPManager {
    constructor() {
        this.client = null
    }

    async testConnection(ftpSettings) {
        try {
            const client = new Client()

            await client.access({
                host: ftpSettings.host,
                port: ftpSettings.port || 21,
                user: ftpSettings.username,
                password: ftpSettings.password,
                secure: ftpSettings.secure || false
            })

            client.close()
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    async upload(buffer, filename, ftpSettings) {
        try {
            const client = new Client()

            await client.access({
                host: ftpSettings.host,
                port: ftpSettings.port || 21,
                user: ftpSettings.username,
                password: ftpSettings.password,
                secure: ftpSettings.secure || false
            })

            // Change to remote directory if specified
            if (ftpSettings.remotePath) {
                await client.ensureDir(ftpSettings.remotePath)
                await client.cd(ftpSettings.remotePath)
            }

            // Upload the file
            await client.uploadFrom(buffer, filename)

            client.close()

            // Generate the remote URL
            const protocol = ftpSettings.secure ? 'https' : 'http'
            const baseUrl = ftpSettings.baseUrl || `${protocol}://${ftpSettings.host}`
            const remotePath = ftpSettings.remotePath ? `/${ftpSettings.remotePath}` : ''

            return `${baseUrl}${remotePath}/${filename}`
        } catch (error) {
            console.error('FTP upload failed:', error)
            throw error
        }
    }
}
