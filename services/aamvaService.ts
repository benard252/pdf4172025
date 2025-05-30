
import { AAMVAData } from '../types';
import { AAMVA_DL_FIELD_ORDER } from '../constants';

// Helper to format date from YYYY-MM-DD to MMDDYYYY
const formatDateToMMDDYYYY = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[1]}${parts[2]}${parts[0]}`;
  }
  return dateString; // Return original if not in expected format
};

// Helper to format height from total inches to "0NN in" or "NNN in"
const formatHeight = (inchesStr: string): string => {
  if (!inchesStr) return '';
  const inches = parseInt(inchesStr, 10);
  if (isNaN(inches)) return inchesStr; // Return original if not a number

  if (inches < 0) return '000 in'; // Or handle error
  if (inches < 10) return `00${inches} in`;
  if (inches < 100) return `0${inches} in`;
  if (inches < 1000) return `${inches} in`; // For heights like 100+ inches, though unlikely for people
  return inchesStr; // Fallback
};

export const formatAAMVADataToString = (formData: AAMVAData): string => {
  const { IIN, AAMVAVersion, JurisdictionVersion, ZG_DATA } = formData;

  if (!IIN || !AAMVAVersion) {
    throw new Error("IIN and AAMVA Version are required.");
  }

  let dlElementsString = "";
  AAMVA_DL_FIELD_ORDER.forEach(id => {
    const originalValue = formData[id as keyof AAMVAData];
    const valueAsString = String(originalValue ?? ''); // Ensure value is string, default to empty string if null/undefined

    if (valueAsString.trim() !== "") {
      let processedValue = valueAsString.toUpperCase(); 

      if (['DBD', 'DBB', 'DBA', 'DDB'].includes(String(id))) {
        processedValue = formatDateToMMDDYYYY(valueAsString); 
      } else if (String(id) === 'DAU') {
        processedValue = formatHeight(valueAsString); 
      }
      dlElementsString += `${String(id).toUpperCase()}${processedValue}\n`;
    }
  });

  let zgElementsString = "";
  if (ZG_DATA) {
    const lines = ZG_DATA.split('\n');
    lines.forEach(line => {
      if (line.trim() !== '') {
        const parts = line.split('=');
        if (parts.length === 2) {
          zgElementsString += `${parts[0].toUpperCase().trim()}${parts[1].toUpperCase().trim()}\n`;
        } else {
          // Assuming the line is already in "IDVALUE" format if no "=" is present
          zgElementsString += `${line.toUpperCase().trim()}\n`; 
        }
      }
    });
  }
  
  const numEntries = (dlElementsString ? 1 : 0) + (zgElementsString ? 1 : 0);
  const numEntriesStr = String(numEntries).padStart(2, '0');

  const actualJurisdictionVersion = JurisdictionVersion || (AAMVAVersion >= "02" ? "00" : "");

  // Standard AAMVA header prefix
  const complianceIndicator = '@'; // Some specs might use different indicators, '@' is common for PDF417
  const dataElementSeparator = '\n'; // Line Feed (LF) often used as data element separator
  const recordSeparator = '\u001e'; // RS - Record Separator
  const segmentTerminator = '\r'; // CR - Carriage Return / Segment Terminator
  
  const fileHeader = `${complianceIndicator}${dataElementSeparator}${recordSeparator}${segmentTerminator}`;
  const ansiHeader = `ANSI ${IIN}${AAMVAVersion}${actualJurisdictionVersion}${numEntriesStr}`;
  
  let subfilesString = "";
  let currentOffset = 0;

  if (dlElementsString) {
    const dlLength = dlElementsString.length;
    const dlLengthStr = String(dlLength).padStart(4, '0');
    const dlOffsetStr = "0000"; // First subfile starts at offset 0
    subfilesString += `DL${dlOffsetStr}${dlLengthStr}${dlElementsString}`;
    currentOffset += dlLength; // Update offset with the length of DL data
  }

  if (zgElementsString) {
    const zgLength = zgElementsString.length;
    const zgLengthStr = String(zgLength).padStart(4, '0');
    // Offset for ZG is the length of the DL data, if DL exists. Otherwise, it's 0.
    const zgOffsetStr = String(currentOffset).padStart(4, '0'); 
    subfilesString += `ZG${zgOffsetStr}${zgLengthStr}${zgElementsString}`;
    // currentOffset += zgLength; // Not strictly needed if ZG is last
  }
  
  return fileHeader + ansiHeader + subfilesString;
};
