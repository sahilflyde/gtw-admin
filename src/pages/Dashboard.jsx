import { Heading } from '../components/heading.jsx'
import { Stat } from '../components/stat.jsx'
import { Divider } from '../components/divider.jsx'
import { Button } from '../components/button.jsx'
import { Badge } from '../components/badge.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table.jsx'
import { DashboardSkeletonLoader } from '../components/skeleton-loader.jsx'
import { useEffect, useState } from 'react'
import api from '../utils/api.js'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalGetStarted: 0,
    totalJoinTeam: 0,
    totalAgencyPartnership: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [getStartedRes, joinTeamRes, agencyRes] = await Promise.allSettled([
        api.get('/form'),
        api.get('/join-team'),
        api.get('/agency-partnership')
      ])

      setStats({
        totalGetStarted: getStartedRes.status === 'fulfilled' ? (getStartedRes.value.data.data || []).length : 0,
        totalJoinTeam: joinTeamRes.status === 'fulfilled' ? (joinTeamRes.value.data.data || []).length : 0,
        totalAgencyPartnership: agencyRes.status === 'fulfilled' ? (agencyRes.value.data.data || []).length : 0
      })

      // Combine recent activity from all sources
      const recentItems = []
      
      if (getStartedRes.status === 'fulfilled') {
        (getStartedRes.value.data.data || []).slice(0, 5).forEach(item => {
          recentItems.push({
            id: item._id,
            type: 'Get Started',
            name: item.name || 'N/A',
            email: item.email || 'N/A',
            date: item.createdAt,
            color: 'blue'
          })
        })
      }

      if (joinTeamRes.status === 'fulfilled') {
        (joinTeamRes.value.data.data || []).slice(0, 5).forEach(item => {
          recentItems.push({
            id: item._id,
            type: 'Join Team',
            name: item.name || 'N/A',
            email: item.email || 'N/A',
            date: item.createdAt,
            color: 'green'
          })
        })
      }

      if (agencyRes.status === 'fulfilled') {
        (agencyRes.value.data.data || []).slice(0, 5).forEach(item => {
          recentItems.push({
            id: item._id,
            type: 'Agency',
            name: item.agencyName || 'N/A',
            email: item.websiteUrl || 'N/A',
            date: item.createdAt,
            color: 'purple'
          })
        })
      }

      // Sort by date and take most recent 10
      recentItems.sort((a, b) => new Date(b.date) - new Date(a.date))
      setRecentActivity(recentItems.slice(0, 10))
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="space-y-8">
        <Heading>GTW Admin Dashboard</Heading>
        <DashboardSkeletonLoader />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Heading>GTW Admin Dashboard</Heading>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <Stat title="Get Started Forms" value={stats.totalGetStarted.toLocaleString()} />
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <Stat title="Join Team Applications" value={stats.totalJoinTeam.toLocaleString()} />
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow">
          <Stat title="Agency Partnerships" value={stats.totalAgencyPartnership.toLocaleString()} />
        </div>
      </div>

      <Divider />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading level={2}>Recent Activity</Heading>
          <div className="flex gap-2">
            <Button color="blue" href="/get-started-forms" size="sm">
              View Forms
            </Button>
            <Button color="green" href="/join-team" size="sm">
              View Applications
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Type</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Date</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentActivity.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                    No recent activity found
                  </TableCell>
                </TableRow>
              ) : (
                recentActivity.map((activity) => (
                  <TableRow key={`${activity.type}-${activity.id}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <TableCell>
                      <Badge color={activity.color}>
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                      {activity.name}
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-300">
                      {activity.email}
                    </TableCell>
                    <TableCell className="text-zinc-500 dark:text-zinc-400 text-sm">
                      {formatDate(activity.date)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
