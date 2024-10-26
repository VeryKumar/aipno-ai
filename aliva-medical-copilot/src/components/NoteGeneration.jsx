import React, { useState } from 'react';
import './NoteGeneration.css';

const NoteGeneration = ({ patient, onBack }) => {
    const [activeTab, setActiveTab] = useState('soap');
    const [expandedSections, setExpandedSections] = useState({
        subjective: true,
        objective: true,
        assessment: true,
        plan: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const SoapSection = ({ title, content, section }) => {
        const isExpanded = expandedSections[section];
        return (
            <div className={`soap-section ${isExpanded ? 'expanded' : ''}`}>
                <div
                    className="soap-header"
                    onClick={() => toggleSection(section)}
                >
                    <h3>{title}</h3>
                    <svg
                        className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M19 9L12 16L5 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <div className={`soap-content ${isExpanded ? 'expanded' : ''}`}>
                    <textarea
                        placeholder={`Enter ${title.toLowerCase()} information...`}
                        defaultValue={content}
                    />
                </div>
            </div>
        );
    };


    return (
        <div className="note-generation">
            <div className="note-header">
                <div className="header-content">
                    <button className="back-button" onClick={onBack}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Back to Overview</span>
                    </button>
                    <div className="patient-info">
                        <h2>{patient.demographics.name}</h2>
                        <p>
                            {patient.demographics.age} years old •
                            {patient.demographics.gender} •
                            {patient.demographics.diagnosis}
                        </p>
                    </div>
                </div>
            </div>

            <div className="note-container">
                <div className="note-tabs">
                    <button
                        className={`tab-button ${activeTab === 'soap' ? 'active' : ''}`}
                        onClick={() => setActiveTab('soap')}
                    >
                        SOAP Note
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'coding' ? 'active' : ''}`}
                        onClick={() => setActiveTab('coding')}
                    >
                        Medical Coding
                    </button>
                </div>

                <div className="note-content">
                    {activeTab === 'soap' && (
                        <div className="soap-form">
                            <SoapSection
                                title="Subjective"
                                content={patient.soap?.subjective || ''}
                                section="subjective"
                            />
                            <SoapSection
                                title="Objective"
                                content={patient.soap?.objective?.presentation?.join('\n') || ''}
                                section="objective"
                            />
                            <SoapSection
                                title="Assessment"
                                content={patient.soap?.assessment || ''}
                                section="assessment"
                            />
                            <SoapSection
                                title="Plan"
                                content={patient.soap?.plan?.join('\n') || ''}
                                section="plan"
                            />
                        </div>
                    )}

                    {activeTab === 'coding' && (
                        <div className="coding-section">
                            <div className="coding-box">
                                <h3>Suggested ICD-10 Codes</h3>
                                <div className="code-suggestions">
                                    <div className="code-item">
                                        <span className="code">F32.2</span>
                                        <span className="description">Major Depressive Disorder, Severe</span>
                                        <button className="select-code">Select</button>
                                    </div>
                                    {/* Add more code suggestions */}
                                </div>
                            </div>

                            <div className="coding-box">
                                <h3>Suggested CPT Codes</h3>
                                <div className="code-suggestions">
                                    <div className="code-item">
                                        <span className="code">99214</span>
                                        <span className="description">Office Visit, Established Patient</span>
                                        <button className="select-code">Select</button>
                                    </div>
                                    {/* Add more code suggestions */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteGeneration;