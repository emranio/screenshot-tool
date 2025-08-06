// Memory management utilities for Electron app
export class MemoryManager {
    constructor() {
        this.intervalId = null
        this.isMonitoring = false
    }

    startMonitoring(intervalMs = 30000) {
        if (this.isMonitoring) return

        this.isMonitoring = true
        this.intervalId = setInterval(() => {
            this.logMemoryUsage()
            this.forceGarbageCollection()
        }, intervalMs)
    }

    stopMonitoring() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
        this.isMonitoring = false
    }

    logMemoryUsage() {
        const usage = process.memoryUsage()
        console.log('Memory Usage:', {
            rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
            heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
            heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`,
            external: `${Math.round(usage.external / 1024 / 1024)} MB`
        })
    }

    forceGarbageCollection() {
        if (global.gc) {
            global.gc()
        }
    }

    cleanupResources() {
        // Force garbage collection
        this.forceGarbageCollection()

        // Stop monitoring
        this.stopMonitoring()
    }
}
