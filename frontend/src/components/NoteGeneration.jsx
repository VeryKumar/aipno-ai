import React, { useState, useEffect } from 'react';
import './NoteGeneration.css';

const NoteGeneration = ({ patient, onBack }) => {
    const [activeTab, setActiveTab] = useState('soap');
    const [expandedSections, setExpandedSections] = useState({
        subjective: true,
        objective: true,
        assessment: true,
        plan: true
    });
    const [isLoadingICD, setIsLoadingICD] = useState(false);
    const [isLoadingCPT, setIsLoadingCPT] = useState(false);
    const [suggestedICDCodes, setSuggestedICDCodes] = useState([]);
    const [suggestedCPTCodes, setSuggestedCPTCodes] = useState([]);
    const [showICDCodes, setShowICDCodes] = useState(false);
    const [showCPTCodes, setShowCPTCodes] = useState(false);
    const [showOptimizedCodes, setShowOptimizedCodes] = useState(false);
    const [optimizedCodes, setOptimizedCodes] = useState([]);
    const [isLoadingOptimized, setIsLoadingOptimized] = useState(false);
    const [totalAdditionalRevenue, setTotalAdditionalRevenue] = useState(0);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const generateICDCodes = (patientData) => {
        const suggestions = [];

        if (patientData.demographics.diagnosis) {
            suggestions.push({
                code: 'F32.2',
                description: patientData.demographics.diagnosis,
                confidence: 0.95
            });
        }

        if (patientData.soap?.subjective?.includes('anxiety')) {
            suggestions.push({
                code: 'F41.1',
                description: 'Generalized Anxiety Disorder',
                confidence: 0.85
            });
        }

        if (patientData.soap?.objective?.presentation?.some(item =>
            item.toLowerCase().includes('insomnia'))) {
            suggestions.push({
                code: 'G47.00',
                description: 'Insomnia, Unspecified',
                confidence: 0.75
            });
        }

        if (patientData.demographics.name.toLowerCase().includes('sarah martinez')) {
            suggestions.push({
                code: 'E11.9',
                description: 'Type 2 diabetes mellitus without complications',
                confidence: 0.35
            });
        }

        return suggestions;
    };

    const generateCPTCodes = (patientData) => {
        const suggestions = [];

        if (patientData.visitType === 'follow_up') {
            suggestions.push({
                code: '99214',
                description: 'Office Visit, Established Patient - Moderate Complexity',
                confidence: 0.90
            });
        } else {
            suggestions.push({
                code: '99204',
                description: 'Office Visit, New Patient - Moderate Complexity',
                confidence: 0.85
            });
        }

        if (patientData.services?.includes('psychotherapy')) {
            suggestions.push({
                code: '90834',
                description: 'Psychotherapy, 45 minutes',
                confidence: 0.95
            });
        }

        return suggestions;
    };

    const generateOptimizedCodes = (patientData) => {
        const suggestions = [];

        // William Thompson (Parkinson's Disease)
        if (patientData.case_id === 'PD001') {
            suggestions.push({
                code: 'R27.8',
                description: 'Other lack of coordination',
                additionalRevenue: 175,
                confidence: 0.85
            });
            suggestions.push({
                code: 'G47.61',
                description: 'REM sleep behavior disorder',
                additionalRevenue: 225,
                confidence: 0.90
            });
            suggestions.push({
                code: 'K59.00',
                description: 'Constipation, unspecified',
                additionalRevenue: 150,
                confidence: 0.75
            });
        }

        // Sarah Martinez (Major Depressive Disorder)
        if (patientData.case_id === 'MDD001') {
            suggestions.push({
                code: 'F41.1',
                description: 'Generalized anxiety disorder',
                additionalRevenue: 200,
                confidence: 0.88
            });
            suggestions.push({
                code: 'G47.00',
                description: 'Insomnia disorder',
                additionalRevenue: 175,
                confidence: 0.82
            });
            suggestions.push({
                code: 'R63.4',
                description: 'Abnormal weight loss',
                additionalRevenue: 150,
                confidence: 0.78
            });
        }

        // Linda Chen (Rheumatoid Arthritis)
        if (patientData.case_id === 'RA001') {
            suggestions.push({
                code: 'R53.82',
                description: 'Chronic fatigue, unspecified',
                additionalRevenue: 165,
                confidence: 0.80
            });
            suggestions.push({
                code: 'M25.50',
                description: 'Pain in unspecified joint',
                additionalRevenue: 185,
                confidence: 0.85
            });
            suggestions.push({
                code: 'R50.9',
                description: 'Fever, unspecified',
                additionalRevenue: 145,
                confidence: 0.75
            });
        }

        return suggestions;
    };

    const handleGenerateCodes = async (type) => {
        if (type === 'ICD') {
            setIsLoadingICD(true);
            setShowICDCodes(false);
            await new Promise(resolve => setTimeout(resolve, 500));
            const codes = generateICDCodes(patient);
            setSuggestedICDCodes(codes);
            setIsLoadingICD(false);
            setShowICDCodes(true);
        } else {
            setIsLoadingCPT(true);
            setShowCPTCodes(false);
            await new Promise(resolve => setTimeout(resolve, 500));
            const codes = generateCPTCodes(patient);
            setSuggestedCPTCodes(codes);
            setIsLoadingCPT(false);
            setShowCPTCodes(true);
        }
    };

    const handleOptimizeCodes = async () => {
        setIsLoadingOptimized(true);
        setShowOptimizedCodes(false);
        await new Promise(resolve => setTimeout(resolve, 500));
        const codes = generateOptimizedCodes(patient);
        setOptimizedCodes(codes);
        const initialRevenue = codes.reduce((sum, code) => sum + code.additionalRevenue, 0);
        setTotalAdditionalRevenue(initialRevenue);
        setIsLoadingOptimized(false);
        setShowOptimizedCodes(true);
    };

    const renderCodeSuggestions = (codes, type) => {

        const handleApprove = (codeItem, index) => {
            const element = document.querySelector(`#code-${type}-${index}`);
            element.classList.add('approved');

            // Remove buttons after animation
            setTimeout(() => {
                const actions = element.querySelector('.code-actions');
                if (actions) {
                    actions.style.display = 'none';
                }
            }, 500);
        };

        const handleReject = (codeItem, index) => {
            const element = document.querySelector(`#code-${type}-${index}`);
            element.classList.add('rejected');

            // Update total revenue by subtracting the rejected code's revenue
            if (codeItem.additionalRevenue) {
                setTotalAdditionalRevenue(prev => prev - codeItem.additionalRevenue);
            }

            // Remove element after animation
            setTimeout(() => {
                element.style.display = 'none';
            }, 500);
        };
        return codes.map((code, index) => (
            <div
                className="code-item"
                key={`${type}-${code.code}-${index}`}
                id={`code-${type}-${index}`}
                style={{ animationDelay: `${index * 0.1}s` }}
            >
                <div className="code-info">
                    <span className="code">{code.code}</span>
                    <span className="description">{code.description}</span>
                    {code.additionalRevenue && (
                        <span className="revenue">+${code.additionalRevenue}</span>
                    )}
                </div>
                <div className="code-actions">
                    <div className="confidence-meter">
                        <div
                            className="confidence-bar"
                            style={{ width: `${code.confidence * 100}%` }}
                        />
                        <span className="confidence-text">
                            {Math.round(code.confidence * 100)}% match
                        </span>
                    </div>
                    <div className="code-buttons">
                        <button
                            className="code-button approve"
                            title="Approve"
                            onClick={() => handleApprove(code, index)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            className="code-button reject"
                            title="Reject"
                            onClick={() => handleReject(code, index)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
                <svg className="checkmark-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        ));
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
                    <div className="soap-content-inner">
                        <textarea
                            placeholder={`Enter ${title.toLowerCase()} information...`}
                            defaultValue={content}
                        />
                    </div>
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
                            <path d="M19 12H5M5 12L12 19M5 12L12 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
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
                                <button
                                    className={`generate-button ${isLoadingICD ? 'loading' : ''}`}
                                    onClick={() => handleGenerateCodes('ICD')}
                                    disabled={isLoadingICD}
                                >
                                    {isLoadingICD ? (
                                        <>
                                            <div className="loader"></div>
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path d="M2 17L12 22L22 17"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path d="M2 12L12 17L22 12"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>Generate with AI</span>
                                        </>
                                    )}
                                </button>
                                {showICDCodes && (
                                    <div className="code-suggestions">
                                        {renderCodeSuggestions(suggestedICDCodes, 'ICD')}
                                    </div>
                                )}
                            </div>

                            <div className="coding-box">
                                <h3>Suggested CPT Codes</h3>
                                <button
                                    className={`generate-button ${isLoadingCPT ? 'loading' : ''}`}
                                    onClick={() => handleGenerateCodes('CPT')}
                                    disabled={isLoadingCPT}
                                >
                                    {isLoadingCPT ? (
                                        <>
                                            <div className="loader"></div>
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path d="M2 17L12 22L22 17"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path d="M2 12L12 17L22 12"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>Generate with AI</span>
                                        </>
                                    )}
                                </button>
                                {showCPTCodes && (
                                    <div className="code-suggestions">
                                        {renderCodeSuggestions(suggestedCPTCodes, 'CPT')}
                                    </div>
                                )}
                            </div>

                            <div className="coding-box optimization-box">
                                <h3>Billing Optimization</h3>
                                <button
                                    className={`generate-button optimize ${isLoadingOptimized ? 'loading' : ''}`}
                                    onClick={handleOptimizeCodes}
                                    disabled={isLoadingOptimized}
                                >
                                    {isLoadingOptimized ? (
                                        <>
                                            <div className="loader"></div>
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>Enable Revenue Optimization Agent</span>
                                        </>
                                    )}
                                </button>
                                {showOptimizedCodes && (
                                    <div className="code-suggestions">
                                        <div className="total-revenue">
                                            <span>Potential Additional Revenue: </span>
                                            <strong>${totalAdditionalRevenue}</strong>
                                        </div>
                                        {renderCodeSuggestions(optimizedCodes, 'OPT')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteGeneration;