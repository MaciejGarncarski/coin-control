import type { Category } from '@shared/schemas'
import {
  ArrowUp,
  Car,
  Coffee,
  House,
  InfoIcon,
  ShoppingBag,
  ShoppingCart,
  Zap,
} from 'lucide-react'
import type { ReactNode } from 'react'

const categoryIcons: Record<Category, ReactNode> = {
  foodAndDrink: <Coffee className="h-4 w-4 text-orange-600" />,
  groceries: <ShoppingCart className="h-4 w-4 text-pink-600" />,
  income: <ArrowUp className="h-4 w-4 text-green-600" />,
  utilities: <Zap className="h-4 w-4 text-blue-600" />,
  housing: <House className="h-4 w-4 text-purple-600" />,
  shopping: <ShoppingBag className="h-4 w-4 text-yellow-600" />,
  transportation: <Car className="h-4 w-4" />,
  other: <InfoIcon className="h-4 w-4 text-gray-600" />,
}

type Props = {
  category: Category
}

export const TransactionCategoryIcon = ({ category }: Props) => {
  return (
    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full border shadow">
      {categoryIcons[category]}
    </div>
  )
}
