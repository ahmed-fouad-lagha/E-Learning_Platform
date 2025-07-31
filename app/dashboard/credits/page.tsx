
'use client'

import { useAuth } from '@/lib/auth-context'
import CreditWallet from '@/components/credits/credit-wallet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Gift, ShoppingCart, Wallet } from 'lucide-react'

export default function CreditsPage() {
  const { user } = useAuth()

  if (!user) {
    return <div className="text-center py-8">Please sign in to view your credits</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">My Credits</h1>
          <p className="text-muted-foreground">Manage your credit balance and transaction history</p>
        </div>
      </div>

      {/* How Credits Work */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            How Credits Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <CreditCard className="h-12 w-12 mx-auto text-blue-500" />
              <h3 className="font-semibold">Get Prepaid Cards</h3>
              <p className="text-sm text-muted-foreground">
                Purchase prepaid cards from authorized vendors or your school
              </p>
            </div>
            <div className="text-center space-y-2">
              <Wallet className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="font-semibold">Redeem Cards</h3>
              <p className="text-sm text-muted-foreground">
                Enter your card code below to add credits to your account
              </p>
            </div>
            <div className="text-center space-y-2">
              <ShoppingCart className="h-12 w-12 mx-auto text-purple-500" />
              <h3 className="font-semibold">Purchase Courses</h3>
              <p className="text-sm text-muted-foreground">
                Use credits to enroll in premium courses and unlock content
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Wallet Component */}
      <CreditWallet userId={user.id} />
    </div>
  )
}
