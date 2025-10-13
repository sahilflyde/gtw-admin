import { useState, useEffect } from 'react';
import { Heading } from '../../components/heading.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/table.jsx';
import { Badge } from '../../components/badge.jsx';
import { Button } from '../../components/button.jsx';
import { Dialog } from '../../components/dialog.jsx';
import { Text } from '../../components/text.jsx';
import api from '../../utils/api.js';
import { toast } from 'react-toastify';

export default function GetStartedFormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedForm, setSelectedForm] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/form');
      setForms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to fetch get started forms');
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

  const getStepBadgeColor = (currentStep) => {
    if (currentStep === 5) return 'green';
    if (currentStep >= 3) return 'blue';
    return 'yellow';
  };

  const handleViewDetails = (form) => {
    setSelectedForm(form);
    setIsDialogOpen(true);
  };

  const filteredForms = filter === 'all' 
    ? forms 
    : filter === 'completed' 
      ? forms.filter(f => f.isCompleted) 
      : forms.filter(f => !f.isCompleted);

  if (loading) {
    return (
      <div className="space-y-6">
        <Heading>Get Started Forms</Heading>
        <div className="animate-pulse">
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Get Started Forms</Heading>
        <div className="flex gap-2">
          <Button 
            color={filter === 'all' ? 'blue' : 'zinc'} 
            onClick={() => setFilter('all')}
            size="sm"
          >
            All ({forms.length})
          </Button>
          <Button 
            color={filter === 'completed' ? 'green' : 'zinc'} 
            onClick={() => setFilter('completed')}
            size="sm"
          >
            Completed ({forms.filter(f => f.isCompleted).length})
          </Button>
          <Button 
            color={filter === 'incomplete' ? 'yellow' : 'zinc'} 
            onClick={() => setFilter('incomplete')}
            size="sm"
          >
            In Progress ({forms.filter(f => !f.isCompleted).length})
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Project Type</TableHeader>
              <TableHeader>Company</TableHeader>
              <TableHeader>Current Step</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredForms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                  No forms found
                </TableCell>
              </TableRow>
            ) : (
              filteredForms.map((form) => (
                <TableRow key={form._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <TableCell className="font-medium">{form.name || 'N/A'}</TableCell>
                  <TableCell>{form.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge color="blue">{form.projectType || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>{form.companyName || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge color={getStepBadgeColor(form.currentStep)}>
                      Step {form.currentStep}/5
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={form.isCompleted ? 'green' : 'yellow'}>
                      {form.isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatDate(form.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" color="blue" onClick={() => handleViewDetails(form)}>
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
          <Heading level={2}>Form Details</Heading>
          
          {selectedForm && (
            <div className="space-y-4">
              {/* Basic Information */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Basic Information</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Name</Text>
                    <Text className="mt-1">{selectedForm.name || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</Text>
                    <Text className="mt-1">{selectedForm.email || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Company Name</Text>
                    <Text className="mt-1">{selectedForm.companyName || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Company Type</Text>
                    <Text className="mt-1">{selectedForm.companyType || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Project Type</Text>
                    <Badge color="blue" className="mt-1">{selectedForm.projectType || 'N/A'}</Badge>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Start Time</Text>
                    <Text className="mt-1">{selectedForm.startTime || 'N/A'}</Text>
                  </div>
                </div>
              </div>

              {/* Track Specific Answers */}
              {selectedForm.trackSpecificAnswers && Object.keys(selectedForm.trackSpecificAnswers).some(key => selectedForm.trackSpecificAnswers[key]) && (
                <div>
                  <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Project Details</Text>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedForm.trackSpecificAnswers.siteType && (
                      <div>
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Site Type</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.siteType}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.brandDesignStatus && (
                      <div>
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Brand Design Status</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.brandDesignStatus}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.admiredSites && (
                      <div className="col-span-2">
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Admired Sites</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.admiredSites}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.platformType && (
                      <div>
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Platform Type</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.platformType}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.appFeatures && (
                      <div className="col-span-2">
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">App Features</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.appFeatures}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.saasType && (
                      <div>
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">SaaS Type</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.saasType}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.targetUsers && (
                      <div>
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Target Users</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.targetUsers}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.infraType && (
                      <div>
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Infrastructure Type</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.infraType}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.scalingNeeds && (
                      <div>
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Scaling Needs</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.scalingNeeds}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.consultArea && (
                      <div>
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Consulting Area</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.consultArea}</Text>
                      </div>
                    )}
                    {selectedForm.trackSpecificAnswers.currentChallenges && (
                      <div className="col-span-2">
                        <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Challenges</Text>
                        <Text className="mt-1">{selectedForm.trackSpecificAnswers.currentChallenges}</Text>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Budget & Scope */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Budget & Scope</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Budget Range</Text>
                    <Text className="mt-1">{selectedForm.budgetRange || 'N/A'}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Post Launch Support</Text>
                    <Text className="mt-1">{selectedForm.postLaunchSupport || 'N/A'}</Text>
                  </div>
                  {selectedForm.documents && (
                    <div className="col-span-2">
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Documents</Text>
                      <Button 
                        size="sm" 
                        color="blue" 
                        className="mt-2"
                        onClick={() => window.open(selectedForm.documents, '_blank')}
                      >
                        View Documents
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedForm.additionalNotes && (
                <div>
                  <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Additional Notes</Text>
                  <Text className="mt-1 text-zinc-600 dark:text-zinc-300">{selectedForm.additionalNotes}</Text>
                </div>
              )}

              {/* Status Information */}
              <div>
                <Text className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Status Information</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Current Step</Text>
                    <Badge color={getStepBadgeColor(selectedForm.currentStep)} className="mt-1">
                      Step {selectedForm.currentStep}/5
                    </Badge>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</Text>
                    <Badge color={selectedForm.isCompleted ? 'green' : 'yellow'} className="mt-1">
                      {selectedForm.isCompleted ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Created At</Text>
                    <Text className="mt-1">{formatDate(selectedForm.createdAt)}</Text>
                  </div>
                  {selectedForm.submittedAt && (
                    <div>
                      <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Submitted At</Text>
                      <Text className="mt-1">{formatDate(selectedForm.submittedAt)}</Text>
                    </div>
                  )}
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
