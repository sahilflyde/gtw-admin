import { Heading } from '../../components/heading.jsx'
import { Button } from '../../components/button.jsx'
import { Badge } from '../../components/badge.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/table.jsx'
import { DashboardSkeletonLoader } from '../../components/skeleton-loader.jsx'
import { useEffect, useState } from 'react'
import api from '../../utils/api.js'
import { toast } from 'react-toastify'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../../components/dialog.jsx'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [filter, setFilter] = useState('all') // 'all', 'active', 'inactive'
  const [unsubscribeDialog, setUnsubscribeDialog] = useState({ open: false, email: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, email: null })

  useEffect(() => {
    fetchSubscriptions()
  }, [pagination.page, filter])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit
      }
      
      if (filter !== 'all') {
        params.isActive = filter === 'active'
      }

      const response = await api.get('/subscriptions', { params })
      
      if (response.data.success) {
        setSubscriptions(response.data.data || [])
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }))
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast.error('Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async (email) => {
    try {
      const response = await api.post('/subscriptions/unsubscribe', { email })
      
      if (response.data.success) {
        toast.success(response.data.message || 'Successfully unsubscribed')
        fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error unsubscribing:', error)
      toast.error(error.response?.data?.message || 'Failed to unsubscribe')
    } finally {
      setUnsubscribeDialog({ open: false, email: null })
    }
  }

  const handleDelete = async (email) => {
    try {
      const response = await api.delete(`/subscriptions/${email}`)
      
      if (response.data.success) {
        toast.success('Subscription deleted successfully')
        fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error deleting subscription:', error)
      toast.error(error.response?.data?.message || 'Failed to delete subscription')
    } finally {
      setDeleteDialog({ open: false, email: null })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed At', 'Unsubscribed At', 'Source'],
      ...subscriptions.map(sub => [
        sub.email,
        sub.isActive ? 'Active' : 'Inactive',
        formatDate(sub.subscribedAt),
        sub.unsubscribedAt ? formatDate(sub.unsubscribedAt) : 'N/A',
        sub.source || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading && subscriptions.length === 0) {
    return (
      <div className="space-y-8">
        <Heading>Newsletter Subscriptions</Heading>
        <DashboardSkeletonLoader />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Heading>Newsletter Subscriptions</Heading>
        <div className="flex gap-2">
          <Button color="zinc" onClick={exportToCSV}>
            Export CSV
          </Button>
          <Button color="blue" onClick={fetchSubscriptions}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Subscriptions</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">{pagination.total}</div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active</div>
          <div className="mt-2 text-3xl font-semibold text-green-600 dark:text-green-400">
            {subscriptions.filter(s => s.isActive).length}
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Inactive</div>
          <div className="mt-2 text-3xl font-semibold text-red-600 dark:text-red-400">
            {subscriptions.filter(s => !s.isActive).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          color={filter === 'all' ? 'blue' : 'zinc'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          color={filter === 'active' ? 'green' : 'zinc'}
          onClick={() => setFilter('active')}
        >
          Active
        </Button>
        <Button
          color={filter === 'inactive' ? 'red' : 'zinc'}
          onClick={() => setFilter('inactive')}
        >
          Inactive
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Email</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Subscribed At</TableHeader>
              <TableHeader>Unsubscribed At</TableHeader>
              <TableHeader>Source</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                  No subscriptions found
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => (
                <TableRow key={subscription._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                    {subscription.email}
                  </TableCell>
                  <TableCell>
                    <Badge color={subscription.isActive ? 'green' : 'red'}>
                      {subscription.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-300 text-sm">
                    {formatDate(subscription.subscribedAt)}
                  </TableCell>
                  <TableCell className="text-zinc-600 dark:text-zinc-300 text-sm">
                    {subscription.unsubscribedAt ? formatDate(subscription.unsubscribedAt) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-zinc-500 dark:text-zinc-400 text-sm">
                    {subscription.source || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {subscription.isActive && (
                        <Button
                          color="amber"
                          size="sm"
                          onClick={() => setUnsubscribeDialog({ open: true, email: subscription.email })}
                        >
                          Unsubscribe
                        </Button>
                      )}
                      <Button
                        color="red"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, email: subscription.email })}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </div>
          <div className="flex gap-2">
            <Button
              color="zinc"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              color="zinc"
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Unsubscribe Confirmation Dialog */}
      <Dialog open={unsubscribeDialog.open} onClose={() => setUnsubscribeDialog({ open: false, email: null })}>
        <DialogTitle>Unsubscribe User</DialogTitle>
        <DialogDescription>
          Are you sure you want to unsubscribe <strong>{unsubscribeDialog.email}</strong> from the newsletter?
        </DialogDescription>
        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This will mark the subscription as inactive. The user can resubscribe later.
          </p>
        </DialogBody>
        <DialogActions>
          <Button color="zinc" onClick={() => setUnsubscribeDialog({ open: false, email: null })}>
            Cancel
          </Button>
          <Button color="amber" onClick={() => handleUnsubscribe(unsubscribeDialog.email)}>
            Unsubscribe
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, email: null })}>
        <DialogTitle>Delete Subscription</DialogTitle>
        <DialogDescription>
          Are you sure you want to permanently delete the subscription for <strong>{deleteDialog.email}</strong>?
        </DialogDescription>
        <DialogBody>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This action cannot be undone. The subscription will be permanently removed from the database.
          </p>
        </DialogBody>
        <DialogActions>
          <Button color="zinc" onClick={() => setDeleteDialog({ open: false, email: null })}>
            Cancel
          </Button>
          <Button color="red" onClick={() => handleDelete(deleteDialog.email)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
