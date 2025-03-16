import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LockKeyhole } from 'lucide-react'

export const ResetPasswordPage = () => {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Card className="w-[20rem] items-center justify-center gap-8 md:w-[23rem]">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-center gap-2 pb-2">
              <LockKeyhole />
              <h1 className="text-center">Reset password</h1>
            </div>
          </CardTitle>
          <CardDescription className="text-center"></CardDescription>
        </CardHeader>
        <CardContent>
          <form>test</form>
        </CardContent>
      </Card>
    </main>
  )
}
