import React, { createContext, useState } from 'react';

export const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [overdueCommunications, setOverdueCommunications] = useState([]);
  const [todaysCommunications, setTodaysCommunications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const today = new Date().setHours(0, 0, 0, 0);

  // Function to add a new company
  const addCompany = (company) => {
    setCompanies((prevCompanies) => [...prevCompanies, company]);
  };

  // Function to edit a company
  const editCompany = (id, updatedCompany) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === id ? { ...company, ...updatedCompany } : company
      )
    );
  };

  // Function to delete a company
  const deleteCompany = (id) => {
    setCompanies((prevCompanies) =>
      prevCompanies.filter((company) => company.id !== id)
    );
  };

  // Function to add a communication method
  const addCommunicationMethod = (companyId, method) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => {
        if (company.id === companyId) {
          return {
            ...company,
            communicationMethods: [
              ...(company.communicationMethods || []),
              { id: Date.now(), ...method },
            ],
          };
        }
        return company;
      })
    );
  };

  // Function to edit a communication method
  const editCommunicationMethod = (companyId, method) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => {
        if (company.id === companyId) {
          return {
            ...company,
            communicationMethods: company.communicationMethods.map((m) =>
              m.id === method.id ? { ...m, ...method } : m
            ),
          };
        }
        return company;
      })
    );
  };

  // Function to delete a communication method
  const deleteCommunicationMethod = (companyId, methodId) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => {
        if (company.id === companyId) {
          return {
            ...company,
            communicationMethods: company.communicationMethods.filter(
              (m) => m.id !== methodId
            ),
          };
        }
        return company;
      })
    );
  };

   // Function to log a new communication
   const logCommunication = (companyId, communication) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => {
        if (company.id === companyId) {
          const updatedCompany = {
            ...company,
            communications: [
              ...(company.communications || []),
              { id: Date.now(), ...communication }, // Add the new communication
            ],
          };

          // Update nextScheduledCommunications if `nextCommunication` is provided
          if (communication.nextCommunication?.date) {
            updatedCompany.nextScheduledCommunications = [
              ...(updatedCompany.nextScheduledCommunications || []),
              {
                id: Date.now(),
                type: communication.nextCommunication.type,
                date: communication.nextCommunication.date,
              },
            ].sort(
              (a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime() // Sort by date
            );
          }

          return updatedCompany;
        }
        return company;
      })
    );
  };

  // Function to update an existing communication
  const updateCommunication = (companyId, communicationId, updatedCommunication) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => {
        if (company.id === companyId) {
          return {
            ...company,
            communications: company.communications.map((comm) =>
              comm.id === communicationId ? { ...comm, ...updatedCommunication } : comm
            ),
          };
        }
        return company;
      })
    );
  };

  // Function to delete a communication
  const deleteCommunication = (companyId, communicationId) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => {
        if (company.id === companyId) {
          return {
            ...company,
            communications: company.communications.filter((comm) => comm.id !== communicationId),
          };
        }
        return company;
      })
    );
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        addCompany,
        editCompany,
        deleteCompany,
        addCommunicationMethod,
        editCommunicationMethod,
        deleteCommunicationMethod,
        logCommunication, // Newly added
        updateCommunication, // Newly added
        deleteCommunication, // Newly added
        overdueCommunications,
        todaysCommunications,
        notificationCount,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
