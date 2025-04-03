import 'react-image-crop/dist/ReactCrop.css'

import { User } from 'lucide-react'
import { type ChangeEvent, useRef, useState } from 'react'
import { type Crop, type PixelCrop, ReactCrop } from 'react-image-crop'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUploadAvatar } from '@/features/account/api/use-upload-avatar'
import { checkImageSize } from '@/features/account/utils/check-image-size'
import { useUser } from '@/lib/auth'

const defaultCrop: Crop = {
  height: 40,
  width: 40,
  unit: '%',
  x: 30,
  y: 30,
}

export const EditAvatarForm = () => {
  const [isModalShwon, setIsModalShown] = useState(false)
  const user = useUser()
  const [preview, setPreview] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>(defaultCrop)
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const uploadAvatarMutation = useUploadAvatar()

  if (user.isPending) {
    return null
  }

  const handleUploadedFile = async (event: ChangeEvent<HTMLInputElement>) => {
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
  }

  const handleCropComplete = (crop: PixelCrop) => {
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
  }

  const updateUserAvatar = () => {
    if (!croppedImage) {
      return
    }

    uploadAvatarMutation.mutate(
      { avatar: croppedImage },
      {
        onError: () => {
          toast.error('Error. Try again later.')
        },
        onSuccess: () => {
          setCroppedImage(null)
          setIsModalShown(false)
          toast.success('Success.')
        },
      },
    )
  }

  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-semibold">Avatar</h2>
        </CardTitle>
        <CardDescription className="flex items-center gap-6 text-balance">
          <p>
            This is your avatar. <br /> Click on the avatar to upload a custom
            one from your files.
          </p>
          <label className="ml-auto">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={`https://api-coincontrol.maciej-garncarski.pl/avatars/${user.data?.id}/avatar.jpg`}
              />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="h-[0px] w-[0px] opacity-0"
              onChange={handleUploadedFile}
            />
          </label>
        </CardDescription>
      </CardHeader>
      <CardFooter className="bg-muted rounded-b-xl border-t px-6 py-3">
        <p className="text-muted-foreground py-1 text-sm">
          An avatar is optional but strongly recommended.
        </p>
      </CardFooter>

      {preview ? (
        <Dialog open={isModalShwon} onOpenChange={setIsModalShown}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Crop avatar</DialogTitle>
            </DialogHeader>
            <ReactCrop
              aspect={1}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={handleCropComplete}>
              <img
                src={preview}
                ref={imageRef}
                className="object-fit aspect-square w-full"
              />
            </ReactCrop>

            <DialogFooter>
              <div className="flex w-full justify-between">
                <Button
                  type="button"
                  size={'sm'}
                  variant={'ghost'}
                  onClick={() => {
                    setPreview(null)
                    setIsModalShown(false)
                  }}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  size={'sm'}
                  variant={'default'}
                  onClick={updateUserAvatar}>
                  Save
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </Card>
  )
}
