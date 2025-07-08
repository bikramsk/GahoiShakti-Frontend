import React from 'react';
import ReactDOM from 'react-dom';

const ResumeDialog = ({ show, onResume, onStartNew }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Resume Registration?</h3>
        <p className="mb-6">We found your previously saved progress. Would you like to continue where you left off?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onStartNew}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Start New
          </button>
          <button
            onClick={onResume}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Resume
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ResumeDialog; 