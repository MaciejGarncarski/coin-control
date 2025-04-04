import {
  type ChangeEvent,
  type SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from 'react'
import {
  centerCrop,
  type Crop,
  makeAspectCrop,
  type PixelCrop,
} from 'react-image-crop'

import { checkImageSize } from '@/features/account/utils/check-image-size'

export const useAvatarCrop = () => {
  const [crop, setCrop] = useState<Crop>()
  const [preview, setPreview] = useState<string | null>(null)
  const [isModalShwon, setIsModalShown] = useState(false)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)

  const imageRef = useRef<HTMLImageElement>(null)

  const onImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      const { naturalWidth: width, naturalHeight: height } = e.currentTarget
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 80,
          },
          1,
          width,
          height,
        ),
        width,
        height,
      )

      setCrop(crop)
    },
    [],
  )

  const handleCropComplete = useCallback((crop: PixelCrop) => {
    if (imageRef.current && crop.width && crop.height) {
      const imageElement = imageRef.current
      const canvas = document.createElement('canvas')
      const scaleX = imageElement.naturalWidth / imageElement.width
      const scaleY = imageElement.naturalHeight / imageElement.height
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        return
      }

      const pixelCrop = {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
      }

      ctx.drawImage(
        imageElement,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        crop.width,
        crop.height,
      )

      canvas.toBlob((blob) => {
        if (!blob) {
          return
        }

        setCroppedImage(blob)
      }, 'image/jpeg')
    }
  }, [])

  const handleUploadedFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      const file = files ? files[0] : null

      if (!file) {
        return
      }

      const isImageValid = checkImageSize(file)

      if (!isImageValid) {
        return
      }

      const urlImage = URL.createObjectURL(file)

      setPreview(urlImage)
      setIsModalShown(true)
      if (crop) {
        handleCropComplete(crop as PixelCrop)
      }
    },
    [crop, handleCropComplete],
  )

  return {
    handleUploadedFile,
    handleCropComplete,
    onImageLoad,
    imageRef,
    croppedImage,
    setCroppedImage,
    preview,
    setPreview,
    isModalShwon,
    setIsModalShown,
  }
}
