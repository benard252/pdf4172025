
import { CryptoCurrency, AAMVAFieldDefinition, AAMVAData } from './types';

export const HCAPTCHA_SITE_KEY = 'ES_dfae760884344547a715ad03fb20a66e'; // Test key, always passes

export const BARCODE_COST = 5; // in USD

export const CRYPTO_CURRENCIES: CryptoCurrency[] = [
  { name: 'Bitcoin', symbol: 'BTC', address: 'bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', rateToUSD: 60000 },
  { name: 'Ethereum', symbol: 'ETH', address: '0xYourEthereumAddressXXXXXXXXXXXXXXXXXXXXX', rateToUSD: 3000 },
  { name: 'Tether (USDT ERC20)', symbol: 'USDT', address: '0xYourERC20USDTAddressXXXXXXXXXXXXXXXXX', rateToUSD: 1 },
  { name: 'TRON (TRX)', symbol: 'TRX', address: 'TYourTRONAddressXXXXXXXXXXXXXXXXXXXXXX', rateToUSD: 0.12 },
  { name: 'Litecoin (LTC)', symbol: 'LTC', address: 'ltc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', rateToUSD: 70 },
];

// Simplified AAMVA field definitions based on the example.
// Users will input data, and aamvaService will format it (e.g., dates, height).
// AAMVA Version '09' is assumed for formatting rules (MMDDYYYY dates, '0NN in' height).
export const AAMVA_FIELDS: AAMVAFieldDefinition[] = [
  // Header Group
  { id: 'IIN', label: 'Issuer Identification Number (IIN)', group: 'Header', required: true, maxLength: 6, placeholder: '636055', tooltip: '6-digit number identifying the issuer.' },
  { id: 'AAMVAVersion', label: 'AAMVA Version Number', group: 'Header', required: true, maxLength: 2, placeholder: '09', tooltip: '2-digit AAMVA standard version (e.g., 09).' },
  { id: 'JurisdictionVersion', label: 'Jurisdiction Version Number', group: 'Header', required: false, maxLength: 2, placeholder: '01', tooltip: '2-digit jurisdiction-specific version (optional for AAMVA versions < 02).' },
  
  // Personal Information Group
  { id: 'DCS', label: 'Family Name (Last Name)', group: 'Personal Information', required: true, placeholder: 'WEAVER', tooltip: 'As it appears on the document.' },
  { id: 'DAC', label: 'First Name', group: 'Personal Information', required: true, placeholder: 'JESSICA', tooltip: 'As it appears on the document.' },
  { id: 'DAD', label: 'Middle Name(s) or Initial', group: 'Personal Information', placeholder: 'LOUISE', tooltip: 'Optional. As it appears on the document.' },
  { id: 'DBB', label: 'Date of Birth', group: 'Personal Information', type: 'date', required: true, tooltip: 'Select date. Will be formatted to MMDDYYYY for AAMVA v09.' },
  { id: 'DBC', label: 'Sex', group: 'Personal Information', type: 'select', options: [{value: '1', label: 'Male'}, {value: '2', label: 'Female'}, {value: '9', label: 'Not Specified'}], required: true, placeholder: 'Select Sex', tooltip: '1 for Male, 2 for Female.' },

  // Address Group
  { id: 'DAG', label: 'Street Address', group: 'Address', required: true, placeholder: '14023 TRIBUTARY LN', tooltip: 'Street name and number.' },
  { id: 'DAI', label: 'City', group: 'Address', required: true, placeholder: 'VILLA RICA', tooltip: 'City name.' },
  { id: 'DAJ', label: 'State/Jurisdiction', group: 'Address', required: true, maxLength: 2, placeholder: 'GA', tooltip: '2-letter state/jurisdiction code.' },
  { id: 'DAK', label: 'Postal Code', group: 'Address', required: true, placeholder: '30180-4199', tooltip: 'e.g. 12345 or 12345-6789' },
  { id: 'DCG', label: 'Country', group: 'Address', required: true, maxLength: 3, placeholder: 'USA', tooltip: '3-letter country code (e.g., USA, CAN).' },

  // Document Details Group
  { id: 'DAQ', label: 'Customer ID / License Number', group: 'Document Details', required: true, placeholder: '061651368', tooltip: 'Driver license or ID card number.' },
  { id: 'DBD', label: 'Document Issue Date', group: 'Document Details', type: 'date', required: true, tooltip: 'Date the document was issued. Will be formatted to MMDDYYYY for AAMVA v09.' },
  { id: 'DBA', label: 'Document Expiration Date', group: 'Document Details', type: 'date', required: true, tooltip: 'Date the document expires. Will be formatted to MMDDYYYY for AAMVA v09.' },
  { id: 'DCF', label: 'Document Discriminator', group: 'Document Details', placeholder: '394647701140030775', tooltip: 'Optional. Unique identifier for the document, often an inventory control number.' },

  // Physical Description Group
  { id: 'DAY', label: 'Eye Color', group: 'Physical Description', required: true, maxLength: 3, placeholder: 'GRN', tooltip: '3-letter eye color code (e.g., BLK, BLU, GRN, HAZ).' },
  { id: 'DAU', label: 'Height (Total Inches)', group: 'Physical Description', type: 'number', required: true, placeholder: '69', tooltip: 'Enter total height in inches (e.g., 69 for 5\'9"). Will be formatted e.g. "069 in".' },
  { id: 'DAW', label: 'Weight (lbs)', group: 'Physical Description', type: 'number', placeholder: '170', tooltip: 'Weight in pounds.' },
  
  // Optional DL Fields Group
  { id: 'DDE', label: 'Family Name Truncation', group: 'Optional DL Fields', type: 'select', options: [{value: '', label: 'N/A'}, {value: 'T', label: 'Truncated'}, {value: 'N', label: 'Not Truncated'}, {value: 'U', label: 'Unknown'}], placeholder: 'Select Truncation', tooltip: 'Indicates if family name was truncated.' },
  { id: 'DDF', label: 'First Name Truncation', group: 'Optional DL Fields', type: 'select', options: [{value: '', label: 'N/A'}, {value: 'T', label: 'Truncated'}, {value: 'N', label: 'Not Truncated'}, {value: 'U', label: 'Unknown'}], placeholder: 'Select Truncation', tooltip: 'Indicates if first name was truncated.' },
  { id: 'DDG', label: 'Middle Name Truncation', group: 'Optional DL Fields', type: 'select', options: [{value: '', label: 'N/A'}, {value: 'T', label: 'Truncated'}, {value: 'N', label: 'Not Truncated'}, {value: 'U', label: 'Unknown'}], placeholder: 'Select Truncation', tooltip: 'Indicates if middle name was truncated.' },
  { id: 'DCA', label: 'Vehicle Class', group: 'Optional DL Fields', placeholder: 'C', tooltip: 'Jurisdiction-specific vehicle class (e.g., C, D, M).' },
  { id: 'DCB', label: 'Restriction Codes', group: 'Optional DL Fields', placeholder: 'B', tooltip: 'Jurisdiction-specific restriction codes.' },
  { id: 'DCD', label: 'Endorsement Codes', group: 'Optional DL Fields', placeholder: 'NONE', tooltip: 'Jurisdiction-specific endorsement codes.' },
  { id: 'DDB', label: 'Card Revision Date', group: 'Optional DL Fields', type: 'date', tooltip: 'Date the card design was revised. Formatted to MMDDYYYY for AAMVA v09.' },
  { id: 'DDK', label: 'Organ Donor', group: 'Optional DL Fields', type: 'select', options: [{value: '', label: 'N/A'}, {value: '1', label: 'Yes'}], placeholder: 'Select', tooltip: 'Organ donor indicator (1 for Yes).' },
  { id: 'DCK', label: 'Inventory Control Number', group: 'Optional DL Fields', placeholder: '10000576974', tooltip: 'Another inventory control number if applicable.' },
  { id: 'DDA', label: 'Compliance Type', group: 'Optional DL Fields', placeholder: 'F', tooltip: 'REAL ID Compliance type (e.g., F for Full Compliance).' },

  // Jurisdiction Specific (ZG) Group
  { id: 'ZG_DATA', label: 'Jurisdiction Specific (ZG) Data', group: 'Jurisdiction Specific (ZG)', type: 'textarea', placeholder: 'Enter ZG subfile data, one element per line (e.g., ZGA=VALUE1\\nZGB=VALUE2). Or paste pre-formatted elements for ZG subfile.', tooltip: 'Optional. For ZG subfile elements. Each element on a new line: ID=VALUE.' }
];

// Helper to get field definition by ID
export const getAAMVAFieldById = (id: keyof AAMVAData): AAMVAFieldDefinition | undefined => {
  return AAMVA_FIELDS.find(field => field.id === id);
};

export const AAMVA_DL_FIELD_ORDER: (keyof AAMVAData)[] = [
  'DAQ', 'DCS', 'DAC', 'DAD', 'DBD', 'DBB', 'DBA', 'DBC', 'DAU', 'DAY', 'DAG', 
  'DAI', 'DAJ', 'DAK', 'DCG', 'DCF', 'DDE', 'DDF', 'DDG', 'DCA', 'DCB', 'DCD', 
  'DCK', 'DDA', 'DDB', 'DAW', 'DDK'
]; // Defines order for building DL subfile string

export const AAMVA_HEADER_FIELD_IDS: (keyof AAMVAData)[] = ['IIN', 'AAMVAVersion', 'JurisdictionVersion'];
