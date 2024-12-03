import React from 'react';
import './SoapSection.css';

const SoapSection = ({ title, content, section }) => {
    return (
        <div className={`soap-section ${section}`}>
            <div className="section-header">
                <h3>{title}</h3>
            </div>
            <div className="section-content">
                {content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
};

export default SoapSection;