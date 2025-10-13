import { useState, useEffect } from 'react';
import { Heading } from '../../components/heading.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/table.jsx';
import { Badge } from '../../components/badge.jsx';
import { Button } from '../../components/button.jsx';
import { Dialog } from '../../components/dialog.jsx';
import { Text } from '../../components/text.jsx';
import api from '../../utils/api.js';
import { toast } from 'react-toastify';

export default function AgencyPartnershipPage() {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      setLoading(true);
      const response = await api.get('/agency-partnership');
      setPartnerships(response.data.data || []);
    } catch (error) {
      console.error('Error fetching partnerships:', error);
      toast.error('Failed to fetch agency partnerships');
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

  const openPortfolio = (portfolioUrl) => {
    if (portfolioUrl) {
      window.open(portfolioUrl, '_blank');
    } else {
      toast.info('No portfolio uploaded');
    }
  };

  const getStepBadgeColor = (currentStep) => {
    if (currentStep === 5) return 'green';
    if (currentStep >= 3) return 'blue';
    return 'yellow';
  };

  const handleViewDetails = (partnership) => {
    setSelectedPartnership(partnership);
    setIsDialogOpen(true);
  };

  const filteredPartnerships = filter === 'all' 
    ? partnerships 
    : filter === 'completed' 
      ? partnerships.filter(p => p.isCompleted) 
      : partnerships.filter(p => !p.isCompleted);

  if (loading) {
    return (
      <div className="space-y-6">
        <Heading>Agency Partnerships</Heading>
        <div className="animate-pulse">
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Agency Partnerships</Heading>
        <div className="flex gap-2">
          <Button 
            color={filter === 'all' ? 'blue' : 'zinc'} 
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({partnerships.length})
          </Button>
          <Button 
            color={filter === 'completed' ? 'green' : 'zinc'} 
            onClick={() => setFilter('completed')}
            size="sm"
          >
            Completed ({partnerships.filter(p => p.isCompleted).length})
          </Button>
          <Button 
            color={filter === 'incomplete' ? 'yellow' : 'zinc'} 
            onClick={() => setFilter('incomplete')}
            size="sm"
          >
            In Progress ({partnerships.filter(p => !p.isCompleted).length})
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Agency Name</TableHeader>
              <TableHeader>Website</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Team Size</TableHeader>
              <TableHeader>Portfolio</TableHeader>
              <TableHeader>Current Step</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPartnerships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                  No partnerships found
                </TableCell>
              </TableRow>
            ) : (
              filteredPartnerships.map((partnership) => (
                <TableRow key={partnership._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <TableCell className="font-medium">{partnership.agencyName || 'N/A'}</TableCell>
                  <TableCell>
                    {partnership.websiteUrl ? (
                      <a 
                        href={partnership.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit
                      </a>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{partnership.location || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge color="zinc">{partnership.teamSize || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>
                    {partnership.portfolioUrl ? (
                      <Button 
                        size="sm" 
                        color="blue"
                        onClick={() => openPortfolio(partnership.portfolioUrl)}
                      >
                        View Portfolio
                      </Button>
                    ) : (
                      <span className="text-zinc-400 text-sm">No portfolio</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge color={getStepBadgeColor(partnership.currentStep)}>
                      Step {partnership.currentStep}/5
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={partnership.isCompleted ? 'green' : 'yellow'}>
                      {partnership.isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(partnership.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" color="blue" onClick={() => handleViewDetails(partnership)}>
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
          <Heading level={2}>Partnership Details</Heading>
          
          {selectedPartnership && (
            <div className="space-y-4">
              {/* Basic Information */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Basic Information</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Agency Name</Text>
                    <Text className="mt-1">{selectedPartnership.agencyName || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Website</Text>
                    {selectedPartnership.websiteUrl ? (
                      <a 
                        href={selectedPartnership.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-1 block text-sm"
                      >
                        {selectedPartnership.websiteUrl}
                      </a>
                    ) : (
                      <Text className="mt-1">N/A</Text>
                    )}
                  </div>
                  {selectedPartnership.socialMedia && (
                    <div>
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Social Media</Text>
                      <Text className="mt-1">{selectedPartnership.socialMedia}</Text>
                    </div>
                  )}
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Location</Text>
                    <Text className="mt-1">{selectedPartnership.location || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Team Size</Text>
                    <Badge color="zinc" className="mt-1">{selectedPartnership.teamSize || 'N/A'}</Badge>
                  </div>
                  {selectedPartnership.timeZone && (
                    <div>
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Time Zone</Text>
                      <Text className="mt-1">{selectedPartnership.timeZone}</Text>
                    </div>
                  )}
                </div>
              </div>

              {/* Specializations & Services */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Specializations & Services</Text>
                {selectedPartnership.specializations && selectedPartnership.specializations.length > 0 && (
                  <div className="mb-3">
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Specializations</Text>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPartnership.specializations.map((spec, index) => (
                        <Badge key={index} color="blue">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedPartnership.whatNotDo && (
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">What We Don't Do</Text>
                    <Text className="mt-1 text-zinc-600 dark:text-zinc-300">{selectedPartnership.whatNotDo}</Text>
                  </div>
                )}
              </div>

              {/* Collaboration Experience */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Collaboration Experience</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Worked with Dev Partners</Text>
                    <Text className="mt-1">{selectedPartnership.workedWithDevPartners || 'N/A'}</Text>
                  </div>
                  {selectedPartnership.collaborationType && (
                    <div>
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Collaboration Type</Text>
                      <Text className="mt-1">{selectedPartnership.collaborationType}</Text>
                    </div>
                  )}
                </div>
              </div>

              {/* Projects & Portfolio */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Projects & Portfolio</Text>
                {selectedPartnership.recentProjects && (
                  <div className="mb-3">
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Recent Projects</Text>
                    <Text className="mt-1 text-zinc-600 dark:text-zinc-300">{selectedPartnership.recentProjects}</Text>
                  </div>
                )}
                {selectedPartnership.portfolioUrl && (
                  <div className="mb-3">
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Portfolio</Text>
                    <Button 
                      size="sm" 
                      color="blue" 
                      className="mt-2"
                      onClick={() => window.open(selectedPartnership.portfolioUrl, '_blank')}
                    >
                      View Portfolio
                    </Button>
                  </div>
                )}
                {selectedPartnership.engagementModels && selectedPartnership.engagementModels.length > 0 && (
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Engagement Models</Text>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPartnership.engagementModels.map((model, index) => (
                        <Badge key={index} color="zinc">{model}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              {selectedPartnership.howFoundUs && (
                <div>
                  <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Additional Information</Text>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">How Found Us</Text>
                    <Text className="mt-1">{selectedPartnership.howFoundUs}</Text>
                  </div>
                </div>
              )}

              {/* Status Information */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Status Information</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Step</Text>
                    <Badge color={getStepBadgeColor(selectedPartnership.currentStep)} className="mt-1">
                      Step {selectedPartnership.currentStep}/5
                    </Badge>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</Text>
                    <Badge color={selectedPartnership.isCompleted ? 'green' : 'yellow'} className="mt-1">
                      {selectedPartnership.isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Created At</Text>
                    <Text className="mt-1">{formatDate(selectedPartnership.createdAt)}</Text>
                  </div>
                  {selectedPartnership.submittedAt && (
                    <div>
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Submitted At</Text>
                      <Text className="mt-1">{formatDate(selectedPartnership.submittedAt)}</Text>
                    </div>
                  )}
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Agreed to Terms</Text>
                    <Badge color={selectedPartnership.agreedToTerms ? 'green' : 'red'} className="mt-1">
                      {selectedPartnership.agreedToTerms ? 'Yes' : 'No'}
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
