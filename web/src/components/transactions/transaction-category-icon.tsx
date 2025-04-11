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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatTransactionCategory } from '@/utils/format-transaction-category'

const categoryIconsBig: Record<Category, ReactNode> = {
  foodAndDrink: <Coffee className="text-primary h-6 w-6" />,
  groceries: <ShoppingCart className="text-primary h-6 w-6" />,
  income: <ArrowUp className="text-primary h-6 w-6" />,
  utilities: <Zap className="text-primary h-6 w-6" />,
  housing: <House className="text-primary h-6 w-6" />,
  shopping: <ShoppingBag className="text-primary h-6 w-6" />,
  transportation: <Car className="text-primary h-6 w-6" />,
  other: <InfoIcon className="text-primary h-6 w-6" />,
}

const categoryIcons: Record<Category, ReactNode> = {
  foodAndDrink: <Coffee className="h-4 w-4 text-orange-600" />,
  groceries: <ShoppingCart className="h-4 w-4 text-pink-600" />,
  income: <ArrowUp className="h-4 w-4 text-green-600" />,
  utilities: <Zap className="h-4 w-4 text-blue-600" />,
  housing: <House className="h-4 w-4 text-purple-600" />,
  shopping: <ShoppingBag className="h-4 w-4 text-yellow-600" />,
  transportation: <Car className="h-4 w-4 text-gray-600" />,
  other: <InfoIcon className="h-4 w-4 text-orange-600" />,
}

const categoryIconsSmall: Record<Category, ReactNode> = {
  foodAndDrink: <Coffee className="h-4 w-4 text-orange-600" />,
  groceries: <ShoppingCart className="h-4 w-4 text-pink-600" />,
  income: <ArrowUp className="h-4 w-4 text-green-600" />,
  utilities: <Zap className="h-4 w-4 text-blue-600" />,
  housing: <House className="h-4 w-4 text-purple-600" />,
  shopping: <ShoppingBag className="h-4 w-4 text-yellow-600" />,
  transportation: <Car className="h-4 w-4 text-gray-600" />,
  other: <InfoIcon className="h-4 w-4 text-orange-600" />,
}

type Props = {
  category: Category
  tooltipEnabled?: boolean
  variant?: 'small' | 'big'
}

export const TransactionCategoryIcon = ({
  category,
  variant,
  tooltipEnabled = false,
}: Props) => {
  if (variant === 'big') {
    return <div>{categoryIconsBig[category]}</div>
  }

  if (variant === 'small') {
    return <div>{categoryIconsSmall[category]}</div>
  }

  if (tooltipEnabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-muted/20 flex h-8 w-8 items-center justify-center rounded-full border p-1">
              {categoryIcons[category]}
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{formatTransactionCategory(category)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="bg-muted/20 flex h-8 w-8 items-center justify-center rounded-full border p-1">
      {categoryIcons[category]}
    </div>
  )
}
