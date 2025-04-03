import { toast } from 'sonner'

export const checkImageSize = (imageFile: File) => {
  if (imageFile.size > 5_000_000) {
    toast.error('Image file is too big. Max 5 MB.')
    return false
  }

  return true
}
