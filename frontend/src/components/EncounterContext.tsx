interface EncounterContextType {
    encounter: {
      soapNote: {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
      };
      selectedCodes: Array<{
        code: string;
        description: string;
        price: number;
      }>;
    };
  }