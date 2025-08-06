// Canvas drawing utilities for overlay
export const drawScreenshotWithOverlay = (canvas, overlayData, selectionRect, isSelecting) => {
    const ctx = canvas.getContext('2d')

    if (!canvas || !ctx) return

    if (overlayData?.display) {
        canvas.width = overlayData.display.bounds.width
        canvas.height = overlayData.display.bounds.height
    }

    const img = new Image()
    img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw the screenshot
        ctx.drawImage(img, 0, 0)

        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Clear selection area to show original image
        if (isSelecting || (selectionRect.width > 0 && selectionRect.height > 0)) {
            const rect = getSelectionRect(selectionRect)
            ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
            ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, rect.x, rect.y, rect.width, rect.height)

            // Draw selection border
            ctx.strokeStyle = '#3b82f6'
            ctx.lineWidth = 2
            ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)

            // Draw corner handles
            drawCornerHandles(ctx, rect)
        }
    }
    img.src = `data:image/png;base64,${overlayData.screenshot}`
}

export const getSelectionRect = (selection) => {
    const { start, end } = selection
    const x = Math.min(start.x, end.x)
    const y = Math.min(start.y, end.y)
    const width = Math.abs(end.x - start.x)
    const height = Math.abs(end.y - start.y)

    return { x, y, width, height }
}

const drawCornerHandles = (ctx, rect) => {
    const handleSize = 8
    const handles = [
        { x: rect.x - handleSize / 2, y: rect.y - handleSize / 2 }, // top-left
        { x: rect.x + rect.width - handleSize / 2, y: rect.y - handleSize / 2 }, // top-right
        { x: rect.x - handleSize / 2, y: rect.y + rect.height - handleSize / 2 }, // bottom-left
        { x: rect.x + rect.width - handleSize / 2, y: rect.y + rect.height - handleSize / 2 } // bottom-right
    ]

    ctx.fillStyle = '#3b82f6'
    handles.forEach(handle => {
        ctx.fillRect(handle.x, handle.y, handleSize, handleSize)
    })
}
