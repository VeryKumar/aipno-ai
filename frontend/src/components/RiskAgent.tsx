import { useState } from 'react';
import { Box } from '@mui/material';
import './RiskAgent.css';

interface RiskAgentProps {
  patient: {
    claims: any[];
    soap?: any;
    demographics?: any;
    hpi?: any;
    ros?: any;
    medical_history?: any;
  };
}

const RiskAgent = ({ patient }: RiskAgentProps) => {
    const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [canWorkOnIt, setCanWorkOnIt] = useState(false);
    const [workPlan, setWorkPlan] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState(false);
  
    const handleAnalysis = async (type: string) => {
      setIsLoading(true);
      setActiveAnalysis(type);
      setCanWorkOnIt(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysisResult({
        type,
        findings: generateFindings(type)
      });
      
      setIsLoading(false);
    };

  const generateFindings = (type: string) => {
    switch(type) {
      case 'risk':
        return {
          title: 'Risk Areas Identified',
          items: [
            {
              severity: 'high',
              area: 'Documentation Gaps',
              details: 'Missing specific treatment justification in SOAP notes',
              impact: 'High risk of claim denial'
            },
            {
              severity: 'medium',
              area: 'Coding Patterns',
              details: 'Frequent use of high-level E/M codes',
              impact: 'Potential audit trigger'
            }
          ]
        };
      case 'compliance':
        return {
          title: 'Compliance Review Results',
          items: [
            {
              status: 'warning',
              area: 'Documentation Standards',
              finding: 'Medical necessity criteria partially met',
              action: 'Update documentation templates'
            },
            {
              status: 'success',
              area: 'Billing Practices',
              finding: 'Timely filing requirements met',
              action: 'Continue current practices'
            }
          ]
        };
      case 'audit':
        return {
          title: 'Documentation Audit Results',
          items: [
            {
              score: 85,
              section: 'SOAP Documentation',
              findings: ['Incomplete assessment section', 'Missing follow-up plans'],
              recommendations: 'Enhance documentation completeness'
            },
            {
              score: 92,
              section: 'Coding Accuracy',
              findings: ['Minor specificity gaps'],
              recommendations: 'Review coding guidelines'
            }
          ]
        };
      default:
        return null;
    }
  };

  const processAnalysisResults = () => {
    const allFindings = {
      risks: generateFindings('risk').items,
      compliance: generateFindings('compliance').items,
      audit: generateFindings('audit').items
    };

    const improvements = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };

    // Process risk findings
    allFindings.risks.forEach(item => {
      improvements[item.severity || 'medium'].push({
        area: item.area,
        action: item.impact,
        type: 'risk'
      });
    });

    // Process compliance findings
    allFindings.compliance.forEach(item => {
      const severity = item.status === 'warning' ? 'high' : 'medium';
      improvements[severity].push({
        area: item.area,
        action: item.action,
        type: 'compliance'
      });
    });

    // Process audit findings
    allFindings.audit.forEach(item => {
      const severity = item.score < 85 ? 'high' : 'medium';
      improvements[severity].push({
        area: item.section,
        action: item.recommendations,
        type: 'audit'
      });
    });

    return improvements;
  };

  const generateActionPlan = (improvements: any) => {
    const quickWins = [];
    const longTermTasks = [];

    Object.entries(improvements).forEach(([severity, items]) => {
      items.forEach((item: any) => {
        const task = {
          ...item,
          severity,
          timeframe: severity === 'critical' || severity === 'high' ? 'immediate' : 'planned'
        };
        
        if (task.timeframe === 'immediate') {
          quickWins.push(task);
        } else {
          longTermTasks.push(task);
        }
      });
    });

    return {
      quickWins,
      longTermTasks,
      totalTasks: quickWins.length + longTermTasks.length,
      immediateActions: quickWins.length
    };
  };

  const handleWorkOnIt = async () => {
    setIsExecuting(true);
    const improvements = processAnalysisResults();
    const actionPlan = generateActionPlan(improvements);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setWorkPlan(actionPlan);
    setIsExecuting(false);
  };

  return (
    <div className="risk-agent">
      <div className="risk-buttons">
        <button
          className={`generate-button risk ${activeAnalysis === 'risk' ? 'active' : ''}`}
          onClick={() => handleAnalysis('risk')}
          disabled={isLoading}
        >
          <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53216 19 5.07183 19Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
          <span>Identify Risk Areas</span>
        </button>

        <button
          className={`generate-button compliance ${activeAnalysis === 'compliance' ? 'active' : ''}`}
          onClick={() => handleAnalysis('compliance')}
          disabled={isLoading}
        >
          <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
          <span>Compliance Review</span>
        </button>

        <button
          className={`generate-button audit ${activeAnalysis === 'audit' ? 'active' : ''}`}
          onClick={() => handleAnalysis('audit')}
          disabled={isLoading}
        >
          <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
          <span>Documentation Audit</span>
        </button>
      </div>

      {isLoading && (
        <div className="analysis-loading">
          <div className="loader"></div>
          <span>Analyzing...</span>
        </div>
      )}

{analysisResult && !isLoading && (
        <>
          <div className="analysis-result">
            <h3>{analysisResult.findings.title}</h3>
            <div className="findings-grid">
              {analysisResult.findings.items.map((item: any, index: number) => (
                <div key={index} className={`finding-card ${item.severity || item.status || ''}`}>
                  <div className="finding-header">
                    <h4>{item.area || item.section}</h4>
                    {item.score && (
                      <div className="score-badge">
                        Score: {item.score}%
                      </div>
                    )}
                  </div>
                  <div className="finding-content">
                    {item.details && <p>{item.details}</p>}
                    {item.impact && <p className="impact">Impact: {item.impact}</p>}
                    {item.finding && <p>{item.finding}</p>}
                    {item.findings && (
                      <ul className="findings-list">
                        {item.findings.map((finding: string, i: number) => (
                          <li key={i}>{finding}</li>
                        ))}
                      </ul>
                    )}
                    <div className="recommendation">
                      {item.action || item.recommendations}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={`generate-button work-on-it ${isExecuting ? 'loading' : ''}`}
            onClick={handleWorkOnIt}
            disabled={isExecuting || !canWorkOnIt}
          >
            {isExecuting ? (
              <>
                <div className="loader"></div>
                <span>Creating Action Plan...</span>
              </>
            ) : (
              <>
                <svg className="ai-icon" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Work on It</span>
              </>
            )}
          </button>
        </>
      )}
      {workPlan && !isExecuting && (
        <div className="work-plan-result">
          <h3>Action Plan Generated</h3>
          <div className="plan-summary">
            <div className="metric">
              <span>Total Improvements Needed</span>
              <strong>{workPlan.totalTasks}</strong>
            </div>
            <div className="metric">
              <span>Quick Wins Available</span>
              <strong>{workPlan.immediateActions}</strong>
            </div>
          </div>
          
          <div className="quick-wins">
            <h4>Immediate Actions</h4>
            {workPlan.quickWins.map((task: any, index: number) => (
              <div key={index} className={`task-card ${task.severity}`}>
                <div className="task-header">
                  <span className="task-type">{task.type}</span>
                  <span className="task-severity">{task.severity}</span>
                </div>
                <h5>{task.area}</h5>
                <p>{task.action}</p>
              </div>
            ))}
          </div>

          <div className="planned-tasks">
            <h4>Planned Improvements</h4>
            {workPlan.longTermTasks.map((task: any, index: number) => (
              <div key={index} className={`task-card ${task.severity}`}>
                <div className="task-header">
                  <span className="task-type">{task.type}</span>
                  <span className="task-severity">{task.severity}</span>
                </div>
                <h5>{task.area}</h5>
                <p>{task.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAgent;