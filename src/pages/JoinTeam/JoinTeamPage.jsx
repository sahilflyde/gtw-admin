import { useState, useEffect } from 'react';
import { Heading } from '../../components/heading.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/table.jsx';
import { Badge } from '../../components/badge.jsx';
import { Button } from '../../components/button.jsx';
import { Dialog } from '../../components/dialog.jsx';
import { Text } from '../../components/text.jsx';
import api from '../../utils/api.js';
import { toast } from 'react-toastify';

export default function JoinTeamPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/join-team');
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch join team applications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openResume = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      toast.info('No resume uploaded');
    }
  };

  const getStepBadgeColor = (currentStep) => {
    if (currentStep === 5) return 'green';
    if (currentStep >= 3) return 'blue';
    return 'yellow';
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : filter === 'completed' 
      ? applications.filter(a => a.isCompleted) 
      : applications.filter(a => !a.isCompleted);

  if (loading) {
    return (
      <div className="space-y-6">
        <Heading>Join Team Applications</Heading>
        <div className="animate-pulse">
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Join Team Applications</Heading>
        <div className="flex gap-2">
          <Button 
            color={filter === 'all' ? 'blue' : 'zinc'} 
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({applications.length})
          </Button>
          <Button 
            color={filter === 'completed' ? 'green' : 'zinc'} 
            onClick={() => setFilter('completed')}
            size="sm"
          >
            Completed ({applications.filter(a => a.isCompleted).length})
          </Button>
          <Button 
            color={filter === 'incomplete' ? 'yellow' : 'zinc'} 
            onClick={() => setFilter('incomplete')}
            size="sm"
          >
            In Progress ({applications.filter(a => !a.isCompleted).length})
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Experience</TableHeader>
              <TableHeader>Resume</TableHeader>
              <TableHeader>Current Step</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((app) => (
                <TableRow key={app._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <TableCell className="font-medium">{app.name || 'N/A'}</TableCell>
                  <TableCell>{app.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge color="purple">{app.role || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>{app.experience || 'N/A'}</TableCell>
                  <TableCell>
                    {app.resumeUrl ? (
                      <Button 
                        size="sm" 
                        color="blue"
                        onClick={() => openResume(app.resumeUrl)}
                      >
                        View Resume
                      </Button>
                    ) : (
                      <span className="text-zinc-400 text-sm">No resume</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge color={getStepBadgeColor(app.currentStep)}>
                      Step {app.currentStep}/5
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={app.isCompleted ? 'green' : 'yellow'}>
                      {app.isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(app.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" color="blue" onClick={() => handleViewDetails(app)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Details Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} size="4xl">
        <div className="space-y-6">
          <Heading level={2}>Application Details</Heading>
          
          {selectedApplication && (
            <div className="space-y-4">
              {/* Personal Details */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Personal Details</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Name</Text>
                    <Text className="mt-1">{selectedApplication.name || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</Text>
                    <Text className="mt-1">{selectedApplication.email || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Phone</Text>
                    <Text className="mt-1">{selectedApplication.phone || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Location</Text>
                    <Text className="mt-1">{selectedApplication.currentLocation || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Willing to Relocate</Text>
                    <Text className="mt-1">{selectedApplication.willingToRelocate || 'N/A'}</Text>
                  </div>
                  {selectedApplication.linkedinProfile && (
                    <div>
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">LinkedIn Profile</Text>
                      <a 
                        href={selectedApplication.linkedinProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-1 block text-sm"
                      >
                        View Profile
                      </a>
                    </div>
                  )}
                  {selectedApplication.portfolioOrGithub && (
                    <div>
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Portfolio/GitHub</Text>
                      <a 
                        href={selectedApplication.portfolioOrGithub} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-1 block text-sm"
                      >
                        View Link
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Role & Skills */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Role & Skills</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Role</Text>
                    <Badge color="purple" className="mt-1">{selectedApplication.role || 'N/A'}</Badge>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Experience</Text>
                    <Text className="mt-1">{selectedApplication.experience || 'N/A'} years</Text>
                  </div>
                </div>
                {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                  <div className="mt-3">
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Skills</Text>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedApplication.skills.map((skill, index) => (
                        <Badge key={index} color="zinc">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedApplication.resumeUrl && (
                  <div className="mt-3">
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Resume</Text>
                    <Button 
                      size="sm" 
                      color="blue" 
                      className="mt-2"
                      onClick={() => window.open(selectedApplication.resumeUrl, '_blank')}
                    >
                      View Resume
                    </Button>
                  </div>
                )}
              </div>

              {/* Intent & Fit */}
              {(selectedApplication.whyJoinGTW || selectedApplication.proudProject) && (
                <div>
                  <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Intent & Fit</Text>
                  {selectedApplication.whyJoinGTW && (
                    <div className="mb-3">
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Why Join GTW?</Text>
                      <Text className="mt-1 text-zinc-600 dark:text-zinc-300">{selectedApplication.whyJoinGTW}</Text>
                    </div>
                  )}
                  {selectedApplication.proudProject && (
                    <div>
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Project You're Proud Of</Text>
                      <Text className="mt-1 text-zinc-600 dark:text-zinc-300">{selectedApplication.proudProject}</Text>
                    </div>
                  )}
                </div>
              )}

              {/* Availability */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Availability</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Start Time</Text>
                    <Text className="mt-1">{selectedApplication.startTime || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Open to Freelance</Text>
                    <Text className="mt-1">{selectedApplication.openToFreelance || 'N/A'}</Text>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Status Information</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Step</Text>
                    <Badge color={getStepBadgeColor(selectedApplication.currentStep)} className="mt-1">
                      Step {selectedApplication.currentStep}/5
                    </Badge>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</Text>
                    <Badge color={selectedApplication.isCompleted ? 'green' : 'yellow'} className="mt-1">
                      {selectedApplication.isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Applied At</Text>
                    <Text className="mt-1">{formatDate(selectedApplication.createdAt)}</Text>
                  </div>
                  {selectedApplication.submittedAt && (
                    <div>
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Submitted At</Text>
                      <Text className="mt-1">{formatDate(selectedApplication.submittedAt)}</Text>
                    </div>
                  )}
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Agreed to Terms</Text>
                    <Badge color={selectedApplication.agreedToTerms ? 'green' : 'red'} className="mt-1">
                      {selectedApplication.agreedToTerms ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <Button color="zinc" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
