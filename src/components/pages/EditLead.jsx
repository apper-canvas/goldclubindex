import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { leadService } from '@/services/api/leadService';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const TEAM_SIZE_OPTIONS = [
  { value: "1-3", label: "1-3" },
  { value: "4-10", label: "4-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "500+", label: "500+" }
];

const STATUS_OPTIONS = [
  { value: "Connected", label: "Connected" },
  { value: "Locked", label: "Locked" },
  { value: "Meeting Booked", label: "Meeting Booked" },
  { value: "Pitched", label: "Pitched" },
  { value: "Demo Scheduled", label: "Demo Scheduled" },
  { value: "Proposal Sent", label: "Proposal Sent" },
  { value: "Follow-up", label: "Follow-up" },
  { value: "Qualified", label: "Qualified" },
  { value: "Not Interested", label: "Not Interested" },
  { value: "Unqualified", label: "Unqualified" },
  { value: "Do Not Contact", label: "Do Not Contact" },
  { value: "Hotlist", label: "Hotlist" }
];

const FUNDING_TYPE_OPTIONS = [
  { value: "Bootstrapped", label: "Bootstrapped" },
  { value: "Pre-seed", label: "Pre-seed" },
  { value: "Y Combinator", label: "Y Combinator" },
  { value: "Seed", label: "Seed" },
  { value: "Series A", label: "Series A" },
  { value: "Series B", label: "Series B" },
  { value: "Series C+", label: "Series C+" }
];

const EDITION_OPTIONS = [
  { value: "Black Edition", label: "Black Edition" },
  { value: "Collector's Edition", label: "Collector's Edition" },
  { value: "Standard Edition", label: "Standard Edition" }
];

const SALES_REP_OPTIONS = [
  { value: "Sarah Johnson", label: "Sarah Johnson" },
  { value: "Mike Chen", label: "Mike Chen" },
  { value: "Alex Rivera", label: "Alex Rivera" },
  { value: "Emma Davis", label: "Emma Davis" },
  { value: "Chris Park", label: "Chris Park" },
  { value: "Jessica Wilson", label: "Jessica Wilson" },
  { value: "David Kim", label: "David Kim" }
];

function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    ProductName: '',
    Category: '',
    TeamSize: '',
    FundingType: '',
    WebsiteURL: '',
    LinkedInURL: '',
    PhoneNumber: '',
    Email: '',
    Status: 'Connected',
    Edition: '',
    SalesRep: '',
    Notes: '',
    FollowUpDate: ''
  });

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    try {
      setLoading(true);
      const lead = await leadService.getById(id);
      setFormData({
        Name: lead.Name || '',
        ProductName: lead.ProductName || '',
        Category: lead.Category || '',
        TeamSize: lead.TeamSize || '',
        FundingType: lead.FundingType || '',
        WebsiteURL: lead.WebsiteURL || '',
        LinkedInURL: lead.LinkedInURL || '',
        PhoneNumber: lead.PhoneNumber || '',
        Email: lead.Email || '',
        Status: lead.Status || 'Connected',
        Edition: lead.Edition || '',
        SalesRep: lead.SalesRep || '',
        Notes: lead.Notes || '',
        FollowUpDate: lead.FollowUpDate ? lead.FollowUpDate.split('T')[0] : ''
      });
    } catch (err) {
      console.error('Error loading lead:', err);
      setError(err.message);
      toast.error('Failed to load lead details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.Name.trim() || !formData.ProductName.trim()) {
      toast.error('Company name and product name are required');
      return;
    }

    try {
      setSaving(true);
      await leadService.update(id, formData);
      toast.success('Lead updated successfully');
      navigate('/hotlist');
    } catch (err) {
      console.error('Error updating lead:', err);
      toast.error('Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/hotlist');
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLead} />;

  return (
    <div className="space-y-6">
      <Header 
        title="Edit Lead"
        subtitle="Update lead information and contact details"
      />

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Company Name"
                value={formData.Name}
                onChange={(e) => handleChange('Name', e.target.value)}
                required
                placeholder="Enter company name"
              />
              
              <Input
                label="Product Name"
                value={formData.ProductName}
                onChange={(e) => handleChange('ProductName', e.target.value)}
                required
                placeholder="Enter product name"
              />
              
              <Input
                label="Category"
                value={formData.Category}
                onChange={(e) => handleChange('Category', e.target.value)}
                placeholder="e.g., SaaS, E-commerce"
              />
              
              <Select
                label="Team Size"
                value={formData.TeamSize}
                onChange={(value) => handleChange('TeamSize', value)}
                options={TEAM_SIZE_OPTIONS}
                placeholder="Select team size"
              />
              
              <Select
                label="Funding Type"
                value={formData.FundingType}
                onChange={(value) => handleChange('FundingType', value)}
                options={FUNDING_TYPE_OPTIONS}
                placeholder="Select funding type"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Website URL"
                type="url"
                value={formData.WebsiteURL}
                onChange={(e) => handleChange('WebsiteURL', e.target.value)}
                placeholder="https://company.com"
              />
              
              <Input
                label="LinkedIn URL"
                type="url"
                value={formData.LinkedInURL}
                onChange={(e) => handleChange('LinkedInURL', e.target.value)}
                placeholder="https://linkedin.com/company/..."
              />
              
              <Input
                label="Phone Number"
                type="tel"
                value={formData.PhoneNumber}
                onChange={(e) => handleChange('PhoneNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.Email}
                onChange={(e) => handleChange('Email', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
          </div>

          {/* Sales Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Status"
                value={formData.Status}
                onChange={(value) => handleChange('Status', value)}
                options={STATUS_OPTIONS}
                required
              />
              
              <Select
                label="Edition"
                value={formData.Edition}
                onChange={(value) => handleChange('Edition', value)}
                options={EDITION_OPTIONS}
                placeholder="Select edition"
              />
              
              <Select
                label="Sales Rep"
                value={formData.SalesRep}
                onChange={(value) => handleChange('SalesRep', value)}
                options={SALES_REP_OPTIONS}
                placeholder="Assign sales rep"
              />
              
              <Input
                label="Follow-up Date"
                type="date"
                value={formData.FollowUpDate}
                onChange={(e) => handleChange('FollowUpDate', e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Notes</h3>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.Notes}
                onChange={(e) => handleChange('Notes', e.target.value)}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white resize-none"
                placeholder="Add any notes about this lead..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLead;