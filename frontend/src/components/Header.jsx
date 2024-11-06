import React from 'react';

const Header = () => {
    return (
        <header>
            <h1>Aliva Medical Copilot</h1>
            <nav>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#icd10">ICD-10 Lookup</a></li>
                    <li><a href="#cpt">CPT Codes</a></li>
                    <li><a href="#modifiers">Modifiers</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;