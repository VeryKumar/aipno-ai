import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
// import { useEncounterContext } from '../contexts/EncounterContext';

interface OptimizationResult {
  combination: string[];
  totalPrice: number;
  description: string;
}

const BillingOptimizer: React.FC = () => {
  // const { encounter } = useEncounterContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationResults, setOptimizationResults] = useState<{
    highest: OptimizationResult | null;
    lowest: OptimizationResult | null;
  }>({
    highest: null,
    lowest: null,
  });

  const runOptimization = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/optimize-billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soapNote: encounter.soapNote,
          selectedCodes: encounter.selectedCodes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize billing codes');
      }

      const data = await response.json();
      setOptimizationResults({
        highest: data.highest,
        lowest: data.lowest,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Billing Code Optimizer
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={runOptimization}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Optimizing...' : 'Run Optimization'}
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="success.main">
              Highest Revenue Combination
            </Typography>
            {optimizationResults.highest ? (
              <List>
                <ListItem>
                  <ListItemText 
                    primary={`Total: $${optimizationResults.highest.totalPrice.toFixed(2)}`}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Codes: {optimizationResults.highest.combination.join(', ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {optimizationResults.highest.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </List>
            ) : (
              <Typography color="text.secondary">
                Run optimization to see results
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="error.main">
              Lowest Revenue Combination
            </Typography>
            {optimizationResults.lowest ? (
              <List>
                <ListItem>
                  <ListItemText 
                    primary={`Total: $${optimizationResults.lowest.totalPrice.toFixed(2)}`}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Codes: {optimizationResults.lowest.combination.join(', ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {optimizationResults.lowest.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </List>
            ) : (
              <Typography color="text.secondary">
                Run optimization to see results
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BillingOptimizer;