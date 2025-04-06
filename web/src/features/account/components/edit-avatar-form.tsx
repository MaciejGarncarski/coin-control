import 'react-image-crop/dist/ReactCrop.css'

import { User } from 'lucide-react'
import { useRef } from 'react'
import { ReactCrop } from 'react-image-crop'
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
import { useAvatarCrop } from '@/features/account/hooks/use-avatar-crop'
import { useUser } from '@/lib/auth'

export const EditAvatarForm = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const user = useUser()
  const {
    croppedImage,
    imageRef,
    handleCropComplete,
    handleUploadedFile,
    preview,
    setCroppedImage,
    setPreview,
    isModalShwon,
    setIsModalShown,
    onImageLoad,
    crop,
    setCrop,
  } = useAvatarCrop()

  const uploadAvatarMutation = useUploadAvatar()

  if (user.isPending) {
    return null
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
          resetForm()
          toast.success('Success.')
        },
      },
    )
  }

  const resetForm = () => {
    if (inputRef.current) {
      inputRef.current.files = null
      inputRef.current.value = ''
    }

    setPreview(null)
    setIsModalShown(false)
    setCrop(undefined)
    setCroppedImage(null)
  }

  const closeModal = (open: boolean) => {
    setIsModalShown(open)
    resetForm()
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
          <label className="ml-auto cursor-pointer">
            <Avatar className="h-20 w-20">
              {user.data?.avatarURL ? (
                <AvatarImage src={user.data?.avatarURL} />
              ) : null}
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="h-[0px] w-[0px] opacity-0"
              ref={inputRef}
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
        <Dialog open={isModalShwon} onOpenChange={closeModal}>
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Crop avatar</DialogTitle>
            </DialogHeader>
            <div className="mx-auto">
              <ReactCrop
                aspect={1}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}>
                <img
                  src={preview}
                  ref={imageRef}
                  className="mx-auto"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>

            <DialogFooter>
              <div className="flex w-full justify-between">
                <Button
                  type="button"
                  size={'sm'}
                  variant={'ghost'}
                  onClick={resetForm}>
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
