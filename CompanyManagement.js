import React, { useState, useContext } from 'react';
import { CompanyContext } from '../CompanyContext'; // Update the path as necessary
import '../../styles/Admin.css'; // Import the Admin CSS

const CompanyManagement = () => {
  const { companies, addCompany, editCompany, deleteCompany, addCommunicationMethod, editCommunicationMethod, deleteCommunicationMethod } =
    useContext(CompanyContext);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    linkedInProfile: '',
    emails: '',
    phoneNumbers: '',
    comments: '',
    communicationPeriodicity: '',
  });

  const [methodFormData, setMethodFormData] = useState({
    name: '',
    description: '',
    sequence: '',
    mandatory: false,
  });

  const [editingMethodId, setEditingMethodId] = useState(null);
  const [methodToEdit, setMethodToEdit] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showMethodForm, setShowMethodForm] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMethodFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddOrEditCompany = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.communicationPeriodicity) {
      alert('Please fill in all required fields.');
      return;
    }

    if (isEditing) {
      editCompany(editId, {
        ...formData,
        emails: formData.emails.split(',').map((email) => email.trim()),
        phoneNumbers: formData.phoneNumbers.split(',').map((number) => number.trim()),
      });
      setIsEditing(false);
      setEditId(null);
    } else {
      const newCompany = {
        id: Date.now(),
        ...formData,
        emails: formData.emails.split(',').map((email) => email.trim()),
        phoneNumbers: formData.phoneNumbers.split(',').map((number) => number.trim()),
        communicationMethods: [],
      };
      addCompany(newCompany);
    }

    setFormData({
      name: '',
      location: '',
      linkedInProfile: '',
      emails: '',
      phoneNumbers: '',
      comments: '',
      communicationPeriodicity: '',
    });
  };

  const handleAddMethod = (companyId) => {
    if (!methodFormData.name || !methodFormData.description || !methodFormData.sequence) {
      alert('Please fill in all required fields.');
      return;
    }

    addCommunicationMethod(companyId, {
      ...methodFormData,
      sequence: parseInt(methodFormData.sequence),
    });

    setShowMethodForm(null);
    setMethodFormData({
      name: '',
      description: '',
      sequence: '',
      mandatory: false,
    });
  };

  const handleEditMethod = (companyId, methodId) => {
    const methodToEdit = companies
      .find(company => company.id === companyId)
      .communicationMethods
      .find(method => method.id === methodId);

    setMethodFormData(methodToEdit);
    setEditingMethodId(methodId);
    setShowMethodForm(companyId);  // Stay in the same company form
  };

  const handleDeleteMethod = (companyId, methodId) => {
    if (window.confirm('Are you sure you want to delete this communication method?')) {
      deleteCommunicationMethod(companyId, methodId);
    }
  };

  const handleEditCompany = (company) => {
    setFormData({
      name: company.name,
      location: company.location,
      linkedInProfile: company.linkedInProfile,
      emails: company.emails.join(', '),
      phoneNumbers: company.phoneNumbers.join(', '),
      comments: company.comments,
      communicationPeriodicity: company.communicationPeriodicity,
    });
    setIsEditing(true);
    setEditId(company.id);
  };

  const handleDeleteCompany = (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany(id);
    }
  };

  return (
    <div className="company-management">
      <h2>Company Management</h2>

      {/* Company Form */}
      <form onSubmit={handleAddOrEditCompany} className="add-company-form">
        <h3>{isEditing ? 'Edit Company' : 'Add New Company'}</h3>
        <div className="form-group">
          <label htmlFor="name">Company Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedInProfile">LinkedIn Profile:</label>
          <input
            type="url"
            id="linkedInProfile"
            name="linkedInProfile"
            placeholder="https://www.linkedin.com/company/..."
            value={formData.linkedInProfile}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="emails">Emails (comma-separated):</label>
          <input
            type="text"
            id="emails"
            name="emails"
            placeholder="contact@companya.com, sales@companya.com"
            value={formData.emails}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumbers">Phone Numbers (comma-separated):</label>
          <input
            type="text"
            id="phoneNumbers"
            name="phoneNumbers"
            placeholder="+1-234-567-8900, +1-987-654-3210"
            value={formData.phoneNumbers}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            placeholder="Additional information about the company."
            value={formData.comments}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="communicationPeriodicity">Communication Periodicity:</label>
          <input
            type="text"
            id="communicationPeriodicity"
            name="communicationPeriodicity"
            placeholder="e.g., Every 2 weeks"
            value={formData.communicationPeriodicity}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          {isEditing ? 'Update Company' : 'Add Company'}
        </button>
      </form>

      {/* Company List */}
      <div className="company-list">
        <h3>Existing Companies</h3>
        {companies.length === 0 ? (
          <p className="no-companies">No companies added yet.</p>
        ) : (
          <table className="company-item-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>LinkedIn</th>
                <th>Emails</th>
                <th>Phone Numbers</th>
                <th>Comments</th>
                <th>Communication Periodicity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <React.Fragment key={company.id}>
                  <tr>
                    <td>{company.name}</td>
                    <td>{company.location}</td>
                    <td>
                      {company.linkedInProfile ? (
                        <a
                          href={company.linkedInProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Profile
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{company.emails.join(', ')}</td>
                    <td>{company.phoneNumbers.join(', ')}</td>
                    <td>{company.comments}</td>
                    <td>{company.communicationPeriodicity}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditCompany(company)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteCompany(company.id)}>
                        Delete
                      </button>
                      <button className="add-method-btn" onClick={() => setShowMethodForm(company.id)}>
                        Add Method
                      </button>
                    </td>
                  </tr>

                  {/* Communication Methods Table */}
                  {company.communicationMethods.length > 0 && (
                    <tr>
                      <td colSpan="8">
                        <h4>Communication Methods for {company.name}</h4>
                        <table className="methods-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Description</th>
                              <th>Sequence</th>
                              <th>Mandatory</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {company.communicationMethods.map((method) => (
                              <tr key={method.id}>
                                <td>{method.name}</td>
                                <td>{method.description}</td>
                                <td>{method.sequence}</td>
                                <td>{method.mandatory ? 'Yes' : 'No'}</td>
                                <td>
                                  <button
                                    onClick={() => handleEditMethod(company.id, method.id)}
                                    className="edit-btn"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMethod(company.id, method.id)}
                                    className="delete-btn"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}

                  {/* Communication Method Form */}
                  {showMethodForm === company.id && (
                    <tr>
                      <td colSpan="8">
                        <div className="method-form">
                          <h4>{editingMethodId ? 'Edit Communication Method' : 'Add Communication Method'} for {company.name}</h4>
                          <input
                            type="text"
                            name="name"
                            placeholder="Method Name"
                            value={methodFormData.name}
                            onChange={handleMethodInputChange}
                          />
                          <input
                            type="text"
                            name="description"
                            placeholder="Method Description"
                            value={methodFormData.description}
                            onChange={handleMethodInputChange}
                          />
                          <input
                            type="number"
                            name="sequence"
                            placeholder="Sequence"
                            value={methodFormData.sequence}
                            onChange={handleMethodInputChange}
                          />
                          <label>
                            Mandatory:
                            <input
                              type="checkbox"
                              name="mandatory"
                              checked={methodFormData.mandatory}
                              onChange={handleMethodInputChange}
                            />
                          </label>
                          <div className="method-form-actions">
                            <button
                              onClick={() => {
                                editingMethodId
                                  ? editCommunicationMethod(company.id, methodFormData)
                                  : handleAddMethod(company.id);
                                setEditingMethodId(null);
                                setMethodFormData({
                                  name: '',
                                  description: '',
                                  sequence: '',
                                  mandatory: false,
                                });
                              }}
                              className="submit-btn"
                            >
                              {editingMethodId ? 'Update Method' : 'Add Method'}
                            </button>
                            <button
                              onClick={() => setShowMethodForm(null)}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CompanyManagement;
