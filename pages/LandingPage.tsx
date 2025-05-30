
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Barcode, ChevronRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="text-center py-12 px-4">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-4">
          AAMVA PDF417 Barcode Generator
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Securely generate AAMVA-compliant PDF417 barcodes from driver's license data.
          Credit-based system with easy top-up options.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-teal-500/30 transition-shadow">
          <ShieldCheck size={48} className="mx-auto mb-4 text-teal-400" />
          <h2 className="text-2xl font-semibold text-white mb-2">Secure & Private</h2>
          <p className="text-gray-400 text-sm">
            Your data is processed client-side. hCaptcha protection ensures secure access.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-teal-500/30 transition-shadow">
          <CreditCard size={48} className="mx-auto mb-4 text-teal-400" />
          <h2 className="text-2xl font-semibold text-white mb-2">Credit System</h2>
          <p className="text-gray-400 text-sm">
            Pay-as-you-go. Top up your balance using mock cryptocurrency payments. One barcode costs $5.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-teal-500/30 transition-shadow">
          <Barcode size={48} className="mx-auto mb-4 text-teal-400" />
          <h2 className="text-2xl font-semibold text-white mb-2">AAMVA Compliant</h2>
          <p className="text-gray-400 text-sm">
            Manually input data to generate PDF417 barcodes based on AAMVA standards. Download as PNG.
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
        <Link
          to="/signup"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-lg hover:shadow-teal-500/50"
        >
          Get Started <ChevronRight size={20} className="ml-2" />
        </Link>
        <Link
          to="/login"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-teal-500 text-base font-medium rounded-md text-teal-400 bg-transparent hover:bg-gray-800 transition-colors shadow-lg hover:shadow-teal-500/30"
        >
          Login
        </Link>
      </div>
      <p className="mt-10 text-xs text-gray-500">
        This application is for demonstration purposes only. Verify all generated barcodes for compliance before use.
      </p>
    </div>
  );
};
