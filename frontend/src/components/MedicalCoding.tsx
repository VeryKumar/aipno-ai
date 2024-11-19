import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import BillingOptimizer from './BillingOptimizer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-coding-tabpanel-${index}`}
      aria-labelledby={`medical-coding-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const MedicalCoding: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Code Selection" />
          <Tab label="Billing Optimizer" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* Your existing code selection content */}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <BillingOptimizer />
      </TabPanel>
    </Box>
  );
};

export default MedicalCoding;