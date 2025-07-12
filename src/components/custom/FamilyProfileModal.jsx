import React from "react";
import { useNavigate } from "react-router-dom";

const FamilyProfileModal = ({ familyData, mobileNumber, onClose, role }) => {
  const navigate = useNavigate();

  const getFamilyMemberType = () => {
    if (role) return role;
    const f = familyData.family_details;
    if (f.father_mobile === mobileNumber) return "Father";
    if (f.mother_mobile === mobileNumber) return "Mother";
    if (f.spouse_mobile === mobileNumber) return "Spouse";
    const sibling = f?.siblingDetails?.find(
      (s) => s.phone_number === mobileNumber
    );
    if (sibling) return `Sibling (${s.sibling_relation})`;
    return "Family Member";
  };

  const p = familyData.personal_information || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Existing Profile Found
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Role Alert */}
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-red-700 font-medium mb-2">
            Registered as: {getFamilyMemberType()}
          </p>
          <p className="text-gray-600 text-sm">
            This mobile number is already part of a registered family profile
          </p>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-50 rounded p-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Profile Details</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {p.full_name || "Not provided"}
            </p>
            <p>
              <span className="font-medium">Mobile:</span>{" "}
              {p.mobile_number || "Not provided"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => {
              onClose?.();
              navigate("/");
            }}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Go to Home
          </button>
          <button
            onClick={() => {
              onClose?.();
              navigate(`/profile/document/${familyData.documentId}`);
            }}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyProfileModal;

