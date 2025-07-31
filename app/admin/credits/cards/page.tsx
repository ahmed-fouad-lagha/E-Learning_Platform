
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Copy, Download, Plus, RefreshCw } from 'lucide-react'

interface RechargeCard {
  id: string
  card_code: string
  credit_amount: number
  status: 'UNUSED' | 'USED' | 'EXPIRED'
  created_at: string
  expires_at: string
  used_at?: string
  batch_name?: string
  notes?: string
  creator?: { name: string; email: string }
  user?: { name: string; email: string }
}

export default function RechargeCardsPage() {
  const [cards, setCards] = useState<RechargeCard[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [formData, setFormData] = useState({
    credit_amount: '',
    quantity: '1',
    expires_in_days: '365',
    batch_name: '',
    notes: ''
  })
  const [filters, setFilters] = useState({
    status: 'all',
    batch_name: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  })

  const { toast } = useToast()

  const fetchCards = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      if (filters.status !== 'all') {
        params.append('status', filters.status)
      }
      if (filters.batch_name) {
        params.append('batch_name', filters.batch_name)
      }

      const response = await fetch(`/api/credits/cards/list?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cards')
      }

      setCards(data.cards)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch cards",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [pagination.page, filters])

  const generateCards = async () => {
    if (!formData.credit_amount || parseInt(formData.credit_amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid credit amount",
        variant: "destructive"
      })
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/credits/cards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credit_amount: parseInt(formData.credit_amount),
          quantity: parseInt(formData.quantity),
          expires_in_days: parseInt(formData.expires_in_days),
          batch_name: formData.batch_name || undefined,
          notes: formData.notes || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cards')
      }

      toast({
        title: "Success",
        description: data.message
      })

      // Reset form
      setFormData({
        credit_amount: '',
        quantity: '1',
        expires_in_days: '365',
        batch_name: '',
        notes: ''
      })

      // Refresh cards list
      fetchCards()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate cards",
        variant: "destructive"
      })
    } finally {
      setGenerating(false)
    }
  }

  const copyCardCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied",
      description: "Card code copied to clipboard"
    })
  }

  const exportCards = () => {
    const csvContent = [
      ['Card Code', 'Credit Amount', 'Status', 'Batch Name', 'Created At', 'Expires At'],
      ...cards.map(card => [
        card.card_code,
        card.credit_amount.toString(),
        card.status,
        card.batch_name || '',
        new Date(card.created_at).toLocaleDateString(),
        new Date(card.expires_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recharge-cards-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNUSED':
        return <Badge variant="secondary">Unused</Badge>
      case 'USED':
        return <Badge variant="default">Used</Badge>
      case 'EXPIRED':
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recharge Cards Management</h1>
        <div className="flex gap-2">
          <Button onClick={exportCards} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={fetchCards} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Generate Cards Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Recharge Cards</CardTitle>
          <CardDescription>
            Create new prepaid cards with specified credit amounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="credit_amount">Credit Amount *</Label>
              <Input
                id="credit_amount"
                type="number"
                placeholder="100"
                value={formData.credit_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, credit_amount: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity (1-100)</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="expires_in_days">Expires in Days</Label>
              <Input
                id="expires_in_days"
                type="number"
                min="1"
                value={formData.expires_in_days}
                onChange={(e) => setFormData(prev => ({ ...prev, expires_in_days: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="batch_name">Batch Name (Optional)</Label>
              <Input
                id="batch_name"
                placeholder="e.g., School-2024-Q1"
                value={formData.batch_name}
                onChange={(e) => setFormData(prev => ({ ...prev, batch_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={generateCards} disabled={generating} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Generate Cards'}
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="UNUSED">Unused</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="batch-filter">Filter by Batch</Label>
              <Input
                id="batch-filter"
                placeholder="Batch name..."
                value={filters.batch_name}
                onChange={(e) => setFilters(prev => ({ ...prev, batch_name: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recharge Cards ({pagination.total} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading cards...</div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card Code</TableHead>
                    <TableHead>Credit Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Used By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-mono">{card.card_code}</TableCell>
                      <TableCell>{card.credit_amount} credits</TableCell>
                      <TableCell>{getStatusBadge(card.status)}</TableCell>
                      <TableCell>{card.batch_name || '-'}</TableCell>
                      <TableCell>{new Date(card.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(card.expires_at).toLocaleDateString()}</TableCell>
                      <TableCell>{card.user?.name || '-'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyCardCode(card.card_code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
