import { useState } from 'react';
import { Box } from '@mui/material';
import './DenialManagement.css';

interface ClaimStatus {
  date: string;
  status: string;
  carc: string[];
  era?: string; // Add ERA to the interface
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
    
    // Example data - in real app, this would come from API
    setCrossReferenceData([
      {
        eraInfo: `Claim ID: ${patient?.claims?.[0]?.claim_ID || 'N/A'}`,
        clinicalDetail: `Diagnosis: ${patient?.demographics?.diagnosis || 'N/A'}`,
        outcome: "Match confirmed - Clinical documentation supports claim"
      }
    ]);
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
                        <td>{row.eraInfo}</td>
                        <td>{row.clinicalDetail}</td>
                        <td>{row.outcome}</td>
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