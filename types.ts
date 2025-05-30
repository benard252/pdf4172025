
export interface User {
  id: string;
  email: string; // Using email as username
}

export interface AAMVAData extends Record<string, string> {
  // Header
  IIN: string; // Issuer Identification Number
  AAMVAVersion: string;
  JurisdictionVersion: string;

  // DL Subfile Elements from example
  DAQ: string; // Customer ID Number
  DCS: string; // Customer Family Name
  DAC: string; // Driver First Name
  DAD?: string; // Driver Middle Name or Initial (optional)
  DBD: string; // Document Issue Date (YYYY-MM-DD from input, convert to MMDDYYYY)
  DBB: string; // Date of Birth (YYYY-MM-DD from input, convert to MMDDYYYY)
  DBA: string; // Document Expiration Date (YYYY-MM-DD from input, convert to MMDDYYYY)
  DBC: string; // Sex (1: Male, 2: Female)
  DAU: string; // Height (in inches, e.g., "69" for 5'9")
  DAY: string; // Eye Color (e.g., GRN, BLU)
  DAG: string; // Address - Street 1
  DAI: string; // Address - City
  DAJ: string; // Address - Jurisdiction Code (State)
  DAK: string; // Address - Postal Code (e.g. 12345 or 12345-6789)
  DCG: string; // Country Identification (e.g., USA)
  DCF?: string; // Document Discriminator

  // Optional Name Truncation Fields
  DDE?: string; // Family name truncation (N, T, U)
  DDF?: string; // First name truncation (N, T, U)
  DDG?: string; // Middle name truncation (N, T, U)
  
  // Other DL fields from example
  DCA?: string; // Jurisdiction-specific vehicle class
  DCB?: string; // Jurisdiction-specific restriction codes
  DCD?: string; // Jurisdiction-specific endorsement codes
  DCK?: string; // Inventory control number
  DDA?: string; // Compliance Type
  DDB?: string; // Card Revision Date (YYYY-MM-DD from input, convert to MMDDYYYY)
  DAW?: string; // Weight (lbs)
  DDK?: string; // Organ Donor Indicator (1 for Yes)

  // ZG Subfile - simplified as a single string of pre-formatted elements
  ZG_DATA?: string; // e.g., "A=N\nB=N\nD=CARROLL..."
}

export interface CryptoCurrency {
  name: string;
  symbol: string;
  address: string;
  qrData?: string; // Usually same as address
  rateToUSD: number; // Mock rate: 1 unit of crypto = X USD
}

export interface AAMVAFieldDefinition {
  id: keyof AAMVAData;
  label: string;
  placeholder?: string;
  group: 'Header' | 'Personal Information' | 'Address' | 'Document Details' | 'Physical Description' | 'Optional DL Fields' | 'Jurisdiction Specific (ZG)';
  type?: 'text' | 'date' | 'number' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  required?: boolean;
  maxLength?: number;
  pattern?: string; // regex pattern for validation
  tooltip?: string;
  note?: string; // Additional formatting notes
}
