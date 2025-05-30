
import React, { useEffect, useRef } from 'react';
import bwipjs from 'bwip-js'; // Named import

interface BarcodeDisplayProps {
  data: string; // The raw string for PDF417
  onGenerationError?: (error: Error) => void;
}

export const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({ data, onGenerationError }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      try {
        // bwip-js options for AAMVA PDF417
        // The `parse` option is key for AAMVA data.
        // We also need to ensure the data string itself is correctly formatted.
        bwipjs.toCanvas(canvasRef.current, {
          bcid: 'pdf417', // Barcode type
          text: data, // Data to encode
          scale: 2, // Scaling factor for barcode size
          height: 50, // Approximate height in mm (bwip-js uses 1/72 inch units internally, this is a guide)
          includetext: false, // Do not include human-readable text below barcode
          textxalign: 'center',
          parse: true, // Crucial for AAMVA: interprets data beginning with "@" as AAMVA format
          // columns: 10, // Removed to allow automatic column sizing
          // Add more PDF417 specific options if needed, e.g., error correction level
          // eclevel: '2', // Error correction level (0-8 for PDF417)
        });
      } catch (e: any) {
        console.error('Barcode generation error:', e);
        if (onGenerationError) {
            onGenerationError(e instanceof Error ? e : new Error(String(e)));
        }
      }
    }
  }, [data, onGenerationError]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const pngUrl = canvasRef.current.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'aamva_barcode.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-xl flex flex-col items-center">
      <h3 className="text-xl font-semibold text-teal-400 mb-4">Generated PDF417 Barcode</h3>
      <div className="bg-white p-4 rounded-md inline-block shadow-inner max-w-full overflow-x-auto">
        <canvas ref={canvasRef} id="pdf417Canvas" className="block"></canvas>
      </div>
      <button
        onClick={handleDownload}
        disabled={!canvasRef.current} // Disable if canvas not ready or error
        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:bg-gray-500"
      >
        Download as PNG
      </button>
       <p className="mt-4 text-xs text-gray-400">
        Note: Ensure the generated barcode is scannable and meets all specific requirements for your use case.
        This generator is for demonstration and may require adjustments for production AAMVA compliance.
      </p>
    </div>
  );
};
