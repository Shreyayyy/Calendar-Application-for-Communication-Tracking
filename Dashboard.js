import React, { useContext, useState, useEffect } from 'react';
import { CompanyContext } from '../CompanyContext';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const { companies, logCommunication, updateCommunication, deleteCommunication } = useContext(CompanyContext);
  const [showForm, setShowForm] = useState(null); // Track which company's form is visible
  const [formData, setFormData] = useState({
    type: '',
    communicationDate: '',
    notes: '',
    nextCommunicationDate: '', // Optional field for next communication date
    nextCommunicationType: '', // Optional field for next communication type
    communicationId: null, // Track the id of the communication being edited
  });

  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today + 86400000); // Day after today

  // Calculate overdue and today's communications dynamically
  const [overdueCommunications, setOverdueCommunications] = useState([]);
  const [todaysCommunications, setTodaysCommunications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const calculateCommunications = () => {
    const overdue = [];
    const todayDue = [];
    const newNotifications = [];

    companies.forEach((company) => {
      if (company.nextScheduledCommunications) {
        company.nextScheduledCommunications.forEach((comm) => {
          const commDate = new Date(comm.date).setHours(0, 0, 0, 0); // Normalize time
          const nextCommDate = comm.nextCommunication ? new Date(comm.nextCommunication.date).setHours(0, 0, 0, 0) : null;

          console.log(`Checking communication for ${company.name}`);
          console.log(`Communication date: ${commDate}, Today's date: ${today}`);

          // If communication is overdue (before today)
          if (commDate < today) {
            console.log(`Overdue communication detected for ${company.name}`);
            overdue.push({
              companyName: company.name,
              type: comm.type,
              date: comm.date,
              nextCommunicationType: comm.nextCommunication ? comm.nextCommunication.type : 'None',
              nextCommunicationDate: comm.nextCommunication ? comm.nextCommunication.date : 'None',
            });
            newNotifications.push(
              `Overdue: ${comm.type} for ${company.name} on ${formatDate(comm.date)}`
            );
          }

          // If communication is scheduled for today
          else if (commDate === today) {
            console.log(`Today's communication detected for ${company.name}`);
            todayDue.push({
              companyName: company.name,
              type: comm.type,
              date: comm.date,
            });
            newNotifications.push(
              `Today's Communication: ${comm.type} for ${company.name} on ${formatDate(comm.date)}`
            );
          }

          // If the next communication is scheduled after today or a future date (like 31st from 29th), add to overdue communications
          if (nextCommDate && nextCommDate > today) {
            console.log(`Future communication detected for ${company.name}`);
            overdue.push({
              companyName: company.name,
              type: comm.type,
              date: comm.date,
              nextCommunicationType: comm.nextCommunication ? comm.nextCommunication.type : 'None',
              nextCommunicationDate: comm.nextCommunication ? comm.nextCommunication.date : 'None',
            });
            newNotifications.push(
              `Next communication scheduled: ${comm.nextCommunication ? comm.nextCommunication.type : 'None'} for ${company.name} on ${formatDate(nextCommDate)}`
            );
          }
        });
      }
    });

    console.log('Overdue communications:', overdue);

    setOverdueCommunications(overdue);
    setTodaysCommunications(todayDue);
    setNotificationCount(newNotifications.length); // Update notification count
  };

  useEffect(() => {
    calculateCommunications(); // Recalculate communications whenever companies change
  }, [companies]); // Dependency on companies

  // Handle input change for the communication log form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for logging a new communication
  const handleFormSubmit = (e, companyId) => {
    e.preventDefault();

    const communication = {
      type: formData.type,
      date: formData.communicationDate,
      notes: formData.notes,
      nextCommunication: {
        type: formData.nextCommunicationType,
        date: formData.nextCommunicationDate || null, // If no date is provided, set it to null
      }
    };

    if (formData.communicationId) {
      // Editing an existing communication
      updateCommunication(companyId, formData.communicationId, communication);
    } else {
      // Logging a new communication
      logCommunication(companyId, communication);
    }

    // Recalculate communications after submit
    calculateCommunications();

    // Reset form data and close the form
    setShowForm(null);
    setFormData({
      type: '',
      communicationDate: '',
      notes: '',
      nextCommunicationDate: '', // Reset optional field
      nextCommunicationType: '', // Reset optional field
      communicationId: null, // Reset the communication ID
    });
  };

  // Handle delete communication
  const handleDeleteCommunication = (companyId, communicationId, isNextScheduled = false) => {
    deleteCommunication(companyId, communicationId, isNextScheduled);

    // Recalculate communications after delete
    calculateCommunications();
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <h3>Company List</h3>

      {/* Notification Icon with Badge */}
      <div className="notification-badge">
        <span className="badge">{notificationCount}</span> Notifications
      </div>

      {/* Overdue Communications Grid */}
      <div className="communications-grid-container">
        <div className="communications-grid">
          <h3>Overdue Communications</h3>
          {overdueCommunications.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Next Scheduled Communication</th>
                </tr>
              </thead>
              <tbody>
                {overdueCommunications.map(({ companyName, type, date, nextCommunicationType, nextCommunicationDate }, index) => (
                  <tr key={index} className="highlight-red">
                    <td>{companyName}</td>
                    <td>{type} - {formatDate(date)}<br />Next: {nextCommunicationType} on {nextCommunicationDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No overdue communications</p>
          )}
        </div>

        {/* Today's Communications Grid */}
        <div className="communications-grid">
          <h3>Today's Communications</h3>
          {todaysCommunications.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Next Scheduled Communication</th>
                </tr>
              </thead>
              <tbody>
                {todaysCommunications.map(({ companyName, type, date }, index) => (
                  <tr key={index} className="highlight-yellow">
                    <td>{companyName}</td>
                    <td>{type} - {formatDate(date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No communications due today</p>
          )}
        </div>
      </div>

      {/* Company Table */}
      {companies.length === 0 ? (
        <p>No companies available</p>
      ) : (
        <table className="company-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Last 5 Communications</th>
              <th>Next Scheduled Communications</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>

                {/* Last 5 Communications */}
                <td>
                  <ul>
                    {company.communications && company.communications.length > 0 ? (
                      company.communications.slice(0, 5).map((comm, index) => (
                        <li
                          key={index}
                          className="communication-item"
                          title={comm.notes} // Tooltip for hover
                        >
                          {comm.type} on {formatDate(comm.date)}
                        </li>
                      ))
                    ) : (
                      <p>No communications found</p>
                    )}
                  </ul>
                </td>

                {/* Next Scheduled Communications */}
                <td>
                  {company.nextScheduledCommunications && company.nextScheduledCommunications.length > 0 ? (
                    company.nextScheduledCommunications.map((comm, index) => (
                      <p key={index}>
                        {comm.type} on {formatDate(comm.date)}
                      </p>
                    ))
                  ) : (
                    <p>None</p>
                  )}
                </td>

                {/* Actions */}
                <td>
                  <button
                    className="log-comm-btn"
                    onClick={() => setShowForm(company.id)}
                  >
                    Log Communication
                  </button>

                  <button
                    className="edit-comm-btn"
                    onClick={() => setShowForm(company.id)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-comm-btn"
                    onClick={() => handleDeleteCommunication(company.id, company.communicationId)}
                  >
                    Delete
                  </button>

                  {/* Communication Log Form */}
                  {showForm === company.id && (
                    <form
                      className="communication-form"
                      onSubmit={(e) => handleFormSubmit(e, company.id)}
                    >
                      <h4>Log Communication for {company.name}</h4>
                      <div className="form-group">
                        <label>Communication Type:</label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Phone Call">Phone Call</option>
                          <option value="Email">Email</option>
                          <option value="LinkedIn Post">LinkedIn Post</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Communication Date:</label>
                        <input
                          type="date"
                          name="communicationDate"
                          value={formData.communicationDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Notes:</label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label>Next Communication Type:</label>
                        <select
                          name="nextCommunicationType"
                          value={formData.nextCommunicationType}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Type</option>
                          <option value="Phone Call">Phone Call</option>
                          <option value="Email">Email</option>
                          <option value="LinkedIn Post">LinkedIn Post</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Next Communication Date:</label>
                        <input
                          type="date"
                          name="nextCommunicationDate"
                          value={formData.nextCommunicationDate}
                          onChange={handleInputChange}
                        />
                      </div>

                      <button type="submit" className="submit-btn">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setShowForm(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
