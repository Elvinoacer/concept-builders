'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function ImportPage() {
  const { data: session } = useSession();
  const [docUrl, setDocUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [importedHtml, setImportedHtml] = useState('');

  const handleImport = async () => {
    setLoading(true);
    setImportedHtml('');

    try {
      const response = await fetch('/api/import-gdoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ docUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setImportedHtml(data.html);
      } else {
        const errorText = await response.text();
        alert(`Error importing document: ${errorText}`);
      }
    } catch (error) {
      console.error('Error importing document:', error);
      alert('An error occurred while importing the document.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Import from Google Docs</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">Please sign in to continue.</p>
        <button 
          onClick={() => signIn('google')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Import Content from Google Docs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Paste the URL of a public Google Doc to import its content directly into the editor.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
            placeholder="Enter Google Doc URL"
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <button 
            onClick={handleImport} 
            disabled={loading}
            className="bg-blue-600 dark:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-500 transition-colors"
          >
            {loading ? 'Importing...' : 'Import'}
          </button>
        </div>

        {importedHtml && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Imported Content Preview</h2>
            <div 
              className="prose max-w-none p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: importedHtml }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}