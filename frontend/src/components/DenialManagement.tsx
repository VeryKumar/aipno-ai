import { useState } from 'react';
import { Box } from '@mui/material';
import './DenialManagement.css';

interface ClaimStatus {
  date: string;
  status: string;
  carc: string[];
  era?: string;
}

interface PatientClaim {
  claim_ID: string;
  ERA: string;
  CARC_category: {
    status: string;
    code: string;
    description: string;
  };
}

interface PatientProps {
  patient: {
    claims: PatientClaim[];
    soap?: any;
    demographics?: any;
    hpi?: any;
    ros?: any;
    medical_history?: any;
  };
}

interface CrossReferenceData {
  eraInfo: string;
  clinicalDetail: string;
  outcome: string;
}

const DenialManagement = ({ patient }: PatientProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [claimResult, setClaimResult] = useState<ClaimStatus | null>(null);
  const [showERA, setShowERA] = useState(false);
  const [showCrossReference, setShowCrossReference] = useState(false);
  const [crossReferenceData, setCrossReferenceData] = useState<CrossReferenceData[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [appealSent, setAppealSent] = useState(false);

  const handleSendClaim = async () => {
    setIsLoading(true);
    setShowERA(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (patient?.claims?.[0]) {
      const claim = patient.claims[0];
      setClaimResult({
        date: new Date().toLocaleDateString(),
        status: claim.CARC_category.status,
        carc: [`CARC ${claim.CARC_category.code}: ${claim.CARC_category.description}`],
        era: claim.ERA
      });
    }
    
    setIsLoading(false);
  };

  const handleViewERA = () => {
    setShowERA(!showERA);
  };

  const handleCrossReference = async () => {
    setShowCrossReference(true);
    
    setCrossReferenceData([
      {
        eraInfo: `
<strong>Claim Details</strong>
<div class="info-pair">
  <span class="label">Claim ID:</span>
  <span class="value">${patient?.claims?.[0]?.claim_ID || 'N/A'}</span>
</div>
<div class="info-pair">
  <span class="label">Status:</span>
  <span class="value">
    <span class="status-indicator ${getStatusClass(patient?.claims?.[0]?.CARC_category?.status)}">
      ${patient?.claims?.[0]?.CARC_category?.status || 'N/A'}
    </span>
  </span>
</div>
<div class="section-divider"></div>
<strong>CARC Information</strong>
<div class="info-pair">
  <span class="label">Code:</span>
  <span class="value"><span class="code-block">${patient?.claims?.[0]?.CARC_category?.code}</span></span>
</div>
<div class="info-pair">
  <span class="label">Description:</span>
  <span class="value">${patient?.claims?.[0]?.CARC_category?.description}</span>
</div>`,
        clinicalDetail: `
<strong>SOAP Documentation</strong>
<ul>
  <li><b>Subjective:</b> ${patient?.soap?.subjective || 'N/A'}</li>
  <li><b>Objective:</b> ${patient?.soap?.objective?.key_findings?.join(', ') || 'N/A'}</li>
  <li><b>Assessment:</b> ${patient?.soap?.assessment || 'N/A'}</li>
  <li><b>Plan:</b> ${patient?.soap?.plan?.join(', ') || 'N/A'}</li>
</ul>
<div class="section-divider"></div>
<strong>Supporting Documentation</strong>
<ul>
  <li>Diagnosis Code: <span class="code-block">${patient?.demographics?.icd_code}</span></li>
  <li>Documented Diagnosis: ${patient?.demographics?.diagnosis}</li>
  <li>Onset: ${patient?.hpi?.onset || 'N/A'}</li>
  <li>ROS Findings: ${patient?.ros?.neurological?.join(', ') || 'N/A'}</li>
</ul>`,
        outcome: `
<strong>Analysis Results</strong>
<div class="status-indicator ${getAnalysisStatusClass(patient)}">
  ${determineRecommendation(patient)}
</div>
<ul>
  <li><b>Documentation Quality:</b> ${assessDocumentationCompleteness(patient)}</li>
  <li><b>Clinical Alignment:</b> Documentation ${assessClinicalAlignment(patient)}</li>
  <li><b>Medical Necessity:</b> ${assessMedicalNecessity(patient)}</li>
</ul>
<div class="section-divider"></div>
<strong>Recommended Actions</strong>
<ul>
  ${generateRecommendedActions(patient).map(action => `<li>${action}</li>`).join('')}
</ul>`
      }
    ]);
  };

  const handleSendAppeal = async () => {
    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAppealSent(true);
    
    // Reset after showing success state
    setTimeout(() => {
      setIsSending(false);
      setAppealSent(false);
    }, 3000);
  };

  // Helper functions
  const determineRecommendation = (patient: any) => {
    const status = patient?.claims?.[0]?.CARC_category?.status;
    if (status === 'Denied') {
      return 'Appeal recommended based on documented medical necessity';
    } else if (status === 'Pending') {
      return 'Submit additional documentation to support medical necessity';
    }
    return 'Monitor claim status and maintain documentation';
  };

  const formatSocialHistory = (socialHistory: any) => {
    if (!socialHistory) return 'Not documented';
    return Object.entries(socialHistory)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const assessDocumentationCompleteness = (patient: any) => {
    const requiredFields = ['soap', 'hpi', 'ros', 'medical_history'];
    const completedFields = requiredFields.filter(field => patient?.[field]);
    const completeness = (completedFields.length / requiredFields.length) * 100;
    
    if (completeness === 100) return 'Complete documentation';
    if (completeness >= 75) return 'Mostly complete - minor gaps identified';
    if (completeness >= 50) return 'Partial documentation - significant gaps';
    return 'Incomplete documentation - immediate attention required';
  };

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'paid':
        return 'positive';
      case 'denied':
      case 'requires-action':
        return 'negative';
      case 'pending':
      case 'partially-paid':
        return 'warning';
      default:
        return '';
    }
  };

  const getAnalysisStatusClass = (patient: any) => {
    const completeness = assessDocumentationCompleteness(patient);
    if (completeness.includes('Complete')) return 'positive';
    if (completeness.includes('Mostly')) return 'warning';
    return 'negative';
  };

  const assessClinicalAlignment = (patient: any) => {
    return 'shows strong correlation with reported symptoms and diagnosis';
  };

  const assessMedicalNecessity = (patient: any) => {
    return 'Established through documented severity and progression';
  };

  const generateRecommendedActions = (patient: any) => {
    return [
      'Submit complete SOAP documentation',
      'Include relevant diagnostic codes',
      'Attach supporting clinical evidence',
      'Reference medical necessity criteria'
    ];
  };

  return (
    <div className="denial-management">
      <div className="coding-box">
        <h3>Claims Processing</h3>
        {!claimResult && (
          <button
            className={`generate-button ${isLoading ? 'loading' : ''}`}
            onClick={handleSendClaim}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loader"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  />
                  <path 
                    d="M12 7V12L15 15" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
                <span>Send Claim</span>
              </>
            )}
          </button>
        )}

        {claimResult && (
          <div className="claim-result">
            <div className={`status-button ${claimResult.status.toLowerCase().replace(' ', '-')}`}>
              {claimResult.date} | {claimResult.status}
            </div>
            <div className="carc-codes">
              {claimResult.carc.map((code, index) => (
                <div key={index} className="carc-item">
                  {code}
                </div>
              ))}
            </div>
            <div className="action-buttons">
              <button
                className="generate-button view-era"
                onClick={handleViewERA}
              >
                <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21Z" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  />
                  <path 
                    d="M7 7H17M7 12H17M7 17H13" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
                <span>View Full ERA</span>
              </button>
              <button
                className="generate-button cross-reference"
                onClick={handleCrossReference}
              >
                <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M9 3H15M3 9V15M21 9V15M9 21H15" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
                <span>Cross-Reference</span>
              </button>
              <button
                className="generate-button send-appeal"
                onClick={handleSendAppeal}
                disabled={isSending || appealSent}
              >
                {!isSending && !appealSent && (
                  <>
                    <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M21.7 4.3L16.7 19.3C16.4 20.3 15 20.3 14.6 19.4L11.6 12.4L4.6 9.4C3.7 9 3.7 7.6 4.7 7.3L19.7 2.3C20.6 2 21.4 2.8 21.7 4.3Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Send Appeal</span>
                  </>
                )}
                {isSending && !appealSent && (
                  <div className="send-animation">
                    <svg className="ai-icon paper-plane" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M21.7 4.3L16.7 19.3C16.4 20.3 15 20.3 14.6 19.4L11.6 12.4L4.6 9.4C3.7 9 3.7 7.6 4.7 7.3L19.7 2.3C20.6 2 21.4 2.8 21.7 4.3Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                {appealSent && (
                  <div className="send-animation">
                    <svg className="ai-icon success-check" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M20 6L9 17L4 12" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </div>
            {showERA && claimResult.era && (
              <div className="era-content">
                <pre>{claimResult.era}</pre>
              </div>
            )}
            {showCrossReference && (
              <div className="cross-reference-content">
                <table className="cross-reference-table">
                  <thead>
                    <tr>
                      <th>ERA Information</th>
                      <th>Clinical Encounter Detail</th>
                      <th>Cross-Reference Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crossReferenceData.map((row, index) => (
                      <tr key={index}>
                        <td dangerouslySetInnerHTML={{ __html: row.eraInfo }}></td>
                        <td dangerouslySetInnerHTML={{ __html: row.clinicalDetail }}></td>
                        <td dangerouslySetInnerHTML={{ __html: row.outcome }}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DenialManagement;