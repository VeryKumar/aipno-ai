import React, { useState } from 'react';
import './App.css';
import PatientAnalysis from './components/PatientAnalysis';
import NoteGeneration from './components/NoteGeneration';


const App = () => {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleGetStarted = () => {
    setCurrentPage('patientAnalysis');
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setCurrentPage('noteGeneration');
  };

  const handleBackToOverview = () => {
    setCurrentPage('patientAnalysis');
  };

  return (
    <div className="App">
      {currentPage === 'welcome' && (
        <header className="App-header">
          <div className="icon-container">
            <svg className="medical-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="3" width="4" height="18" rx="2" fill="currentColor" />
              <rect x="3" y="10" width="18" height="4" rx="2" fill="currentColor" />
            </svg>
          </div>
          <h1>Aliva Medical Copilot</h1>
          <h2>Reduce clinician burnout, increase patient satisfaction, and ensure best practices in patient care</h2>
          <button className="cta-button" onClick={handleGetStarted}>
            <span>Get Started</span>
            <svg className="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>
      )}

      {currentPage === 'patientAnalysis' && (
        <PatientAnalysis onSelectPatient={handlePatientSelect} />
      )}

      {currentPage === 'noteGeneration' && (
        <NoteGeneration
          patient={selectedPatient}
          onBack={handleBackToOverview}
        />
      )}
    </div>
  );
};

export default App;