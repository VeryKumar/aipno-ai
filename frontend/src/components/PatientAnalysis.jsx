import React, { useState } from 'react';
import patientsData from '../patients.json';
import './PatientAnalysis.css';

const PatientAnalysis = ({ onSelectPatient }) => {
    const [selectedPatient, setSelectedPatient] = useState(null);

    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
    };

    const handleProceedToNote = () => {
        onSelectPatient(selectedPatient);
    };

    const hasData = (obj) => obj && Object.keys(obj).length > 0;


    return (
        <div className="patient-analysis">
            {selectedPatient && (
                // In the selected-patient-header section
                <div className="selected-patient-header">
                    <h2>
                        Selected Patient: {selectedPatient.demographics.name}
                        <span className="patient-id"> (ID: {selectedPatient.case_id})</span>
                    </h2>
                    <button
                        className="note-gen-button"
                        onClick={handleProceedToNote}
                    >
                        <span>Note Generation</span>
                        <svg className="arrow" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="content-container">
                <div className="patient-list">
                    <h3 className="section-title">Patient List</h3>
                    {patientsData.patients.map((patient) => (
                        <div
                            key={patient.case_id}
                            className={`patient-card ${selectedPatient?.case_id === patient.case_id ? 'selected' : ''}`}
                            onClick={() => handlePatientClick(patient)}
                        >
                            <h3>{patient.demographics.name}</h3>
                            <p><strong>Case ID:</strong> {patient.case_id}</p>
                            <p><strong>Diagnosis:</strong> {patient.demographics.diagnosis}</p>
                        </div>
                    ))}
                </div>

                {selectedPatient && (
                    <div className="analysis-boxes">
                        <div className="analysis-box">
                            <h3>Patient Overview</h3>
                            {hasData(selectedPatient.demographics) && (
                                <>
                                    {selectedPatient.demographics.age && (
                                        <p><strong>Age:</strong> {selectedPatient.demographics.age}</p>
                                    )}
                                    {selectedPatient.demographics.gender && (
                                        <p><strong>Gender:</strong> {selectedPatient.demographics.gender}</p>
                                    )}
                                    {selectedPatient.demographics.diagnosis && (
                                        <p><strong>Diagnosis:</strong> {selectedPatient.demographics.diagnosis}</p>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="analysis-box">
                            <h3>Current Status</h3>
                            {hasData(selectedPatient.soap) && (
                                <>
                                    {selectedPatient.soap.subjective && (
                                        <div className="soap-section">
                                            <p><strong>Subjective:</strong></p>
                                            <p>{selectedPatient.soap.subjective}</p>
                                        </div>
                                    )}

                                    {selectedPatient.soap.objective && (
                                        <div className="soap-section">
                                            <p><strong>Objective:</strong></p>
                                            {selectedPatient.soap.objective.key_findings && (
                                                <ul>
                                                    {selectedPatient.soap.objective.key_findings.map((finding, index) => (
                                                        <li key={index}>{finding}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {selectedPatient.soap.objective.presentation && (
                                                <ul>
                                                    {selectedPatient.soap.objective.presentation.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {selectedPatient.soap.assessment && (
                                        <div className="soap-section">
                                            <p><strong>Assessment:</strong></p>
                                            <p>{selectedPatient.soap.assessment}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="analysis-box">
                            <h3>Treatment Plan</h3>
                            {selectedPatient.soap.plan && selectedPatient.soap.plan.length > 0 ? (
                                <ul>
                                    {selectedPatient.soap.plan.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No treatment plan specified</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientAnalysis;