
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, History, Plus, Wallet } from 'lucide-react'

interface Wallet {
  current_balance: number
  total_earned: number
  total_spent: number
  created_at: string
  updated_at: string
}

interface Transaction {
  id: string
  transaction_type: 'RECHARGE' | 'COURSE_PURCHASE' | 'REFUND' | 'ADMIN_ADJUSTMENT'
  amount: number
  balance_before: number
  balance_after: number
  description: string
  notes?: string
  created_at: string
  course?: { title: string; title_ar: string }
}

interface CreditWalletProps {
  userId?: string
}

export default function CreditWallet({ userId }: CreditWalletProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState(false)
  const [cardCode, setCardCode] = useState('')
  const [showRedeemForm, setShowRedeemForm] = useState(false)

  const { toast } = useToast()

  const fetchWalletData = async () => {
    try {
      const response = await fetch('/api/credits/wallet')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch wallet data')
      }

      setWallet(data.wallet)
      setTransactions(data.transactions)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch wallet data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWalletData()
  }, [])

  const redeemCard = async () => {
    if (!cardCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a card code",
        variant: "destructive"
      })
      return
    }

    setRedeeming(true)
    try {
      const response = await fetch('/api/credits/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_code: cardCode })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to redeem card')
      }

      toast({
        title: "Success",
        description: `Card redeemed! +${data.credit_amount} credits added to your account`
      })

      setCardCode('')
      setShowRedeemForm(false)
      
      // Refresh wallet data
      fetchWalletData()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to redeem card",
        variant: "destructive"
      })
    } finally {
      setRedeeming(false)
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'RECHARGE':
        return 'Card Recharge'
      case 'COURSE_PURCHASE':
        return 'Course Purchase'
      case 'REFUND':
        return 'Refund'
      case 'ADMIN_ADJUSTMENT':
        return 'Admin Adjustment'
      default:
        return type
    }
  }

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'RECHARGE':
        return <Badge variant="secondary">Recharge</Badge>
      case 'COURSE_PURCHASE':
        return <Badge variant="destructive">Purchase</Badge>
      case 'REFUND':
        return <Badge variant="default">Refund</Badge>
      case 'ADMIN_ADJUSTMENT':
        return <Badge variant="outline">Adjustment</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading wallet...</div>
  }

  if (!wallet) {
    return <div className="text-center py-8 text-red-500">Failed to load wallet</div>
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallet.current_balance} Credits</div>
            <p className="text-xs text-muted-foreground">
              Available for course purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallet.total_earned} Credits</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallet.total_spent} Credits</div>
            <p className="text-xs text-muted-foreground">
              All time spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Redeem Card Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recharge Account</CardTitle>
          <CardDescription>
            Enter your prepaid card code to add credits to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showRedeemForm ? (
            <Button onClick={() => setShowRedeemForm(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Redeem Card
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardCode">Card Code</Label>
                <Input
                  id="cardCode"
                  placeholder="XXXX-XXXX-XXXX"
                  value={cardCode}
                  onChange={(e) => setCardCode(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={redeemCard} disabled={redeeming}>
                  {redeeming ? 'Redeeming...' : 'Redeem Card'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowRedeemForm(false)
                    setCardCode('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getTransactionBadge(transaction.transaction_type)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{transaction.description}</div>
                        {transaction.course && (
                          <div className="text-sm text-gray-500">
                            Course: {transaction.course.title}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                      </span>
                    </TableCell>
                    <TableCell>{transaction.balance_after} credits</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
