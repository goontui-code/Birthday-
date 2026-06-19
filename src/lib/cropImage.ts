export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  filter = 'none'
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return ''
  }

  // set canvas size to match the bounding box
  canvas.width = image.width
  canvas.height = image.height

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-canvas.width / 2, -canvas.height / 2)

  if (filter && filter !== 'none') {
    ctx.filter = filter;
  }

  ctx.drawImage(image, 0, 0)

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  // Max dimension 600px for smaller base64 footprint
  const maxDim = 600;
  let dstW = pixelCrop.width;
  let dstH = pixelCrop.height;
  if (dstW > maxDim || dstH > maxDim) {
    if (dstW > dstH) {
       dstH = Math.round(dstH * (maxDim / dstW));
       dstW = maxDim;
    } else {
       dstW = Math.round(dstW * (maxDim / dstH));
       dstH = maxDim;
    }
  }

  canvas.width = dstW;
  canvas.height = dstH;

  // We need to redraw the cropped region into the resized canvas
  // Create an offscreen canvas containing the cropped original content
  const offscreen = document.createElement('canvas')
  offscreen.width = pixelCrop.width
  offscreen.height = pixelCrop.height
  const offCtx = offscreen.getContext('2d')
  if(offCtx) offCtx.putImageData(data, 0, 0)

  // Draw into our target canvas with resizing
  ctx.filter = 'none';
  ctx.drawImage(offscreen, 0, 0, pixelCrop.width, pixelCrop.height, 0, 0, dstW, dstH)

  return new Promise((resolve) => {
    resolve(canvas.toDataURL('image/jpeg', 0.8));
  })
}
