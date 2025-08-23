import React from 'react';

const PrintProfile = ({ userData }) => {
  if (!userData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const renderSection = (title, data, fields) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
      <div className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-red-700">{title}</h2>
        <div className="border rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {fields.map(([key, label]) => {
              if (!data[key]) return null;
              return (
                <div key={key} className="grid grid-cols-2 px-4 py-3">
                  <div className="text-gray-600">{label}</div>
                  <div className="text-gray-900">
                    {key.includes('date') ? formatDate(data[key]) : data[key]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderChildren = () => {
    if (!userData.child_name || userData.child_name.length === 0) return null;

    return (
      <div className="mb-8 page-break-inside-avoid">
        <h3 className="text-xl font-semibold mb-4">Children</h3>
        <div className="space-y-4">
          {userData.child_name.map((child, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Name: </span>
                  <span>{child.child_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Gender: </span>
                  <span>{child.gender || 'N/A'}</span>
                </div>
                {child.phone_number && (
                  <div>
                    <span className="text-gray-600">Phone: </span>
                    <span>{child.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPreviousMarriageInfo = () => {
    if (!userData.previous_marriage_info) return null;
    const info = userData.previous_marriage_info;

    return (
      <div className="mb-8 page-break-inside-avoid">
        <h2 className="text-2xl font-bold mb-4 text-red-700">Previous Marriage Information</h2>
        <div className="border rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="grid grid-cols-2 px-4 py-3">
              <div className="text-gray-600">Spouse Name</div>
              <div className="text-gray-900">{info.spouse_name || 'N/A'}</div>
            </div>
            <div className="grid grid-cols-2 px-4 py-3">
              <div className="text-gray-600">Spouse Date of Birth</div>
              <div className="text-gray-900">{formatDate(info.spouse_dob)}</div>
            </div>
            {info.spouse_gotra && (
              <div className="grid grid-cols-2 px-4 py-3">
                <div className="text-gray-600">Spouse Gotra</div>
                <div className="text-gray-900">{info.spouse_gotra}</div>
              </div>
            )}
            {info.spouse_akna && (
              <div className="grid grid-cols-2 px-4 py-3">
                <div className="text-gray-600">Spouse Akna</div>
                <div className="text-gray-900">{info.spouse_akna}</div>
              </div>
            )}
            {info.children_living_with && (
              <div className="grid grid-cols-2 px-4 py-3">
                <div className="text-gray-600">Children Living With</div>
                <div className="text-gray-900">{info.children_living_with}</div>
              </div>
            )}
            {info.has_children && (
              <div className="grid grid-cols-2 px-4 py-3">
                <div className="text-gray-600">Have Children</div>
                <div className="text-gray-900">{info.has_children}</div>
              </div>
            )}
            {info.children && info.children.length > 0 && (
              <div className="px-4 py-3">
                <div className="text-gray-600 mb-2">Children:</div>
                <div className="space-y-2">
                  {info.children.map((child, index) => (
                    <div key={index} className="ml-4 grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-500">Name: </span>
                        <span>{child.child_name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Gender: </span>
                        <span>{child.gender}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Age: </span>
                        <span>{child.age}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSiblings = () => {
    if (!userData.family_details?.siblingDetails?.length) return null;

    return (
      <div className="mb-8 page-break-inside-avoid">
        <h3 className="text-xl font-semibold mb-4 text-red-700">Siblings</h3>
        <div className="space-y-4">
          {userData.family_details.siblingDetails.map((sibling, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Name: </span>
                  <span>{sibling.sibling_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Gender: </span>
                  <span>{sibling.gender || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Age: </span>
                  <span>{sibling.age || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Relation: </span>
                  <span>{sibling.sibling_relation || 'N/A'}</span>
                </div>
                {sibling.marital_status && (
                  <div>
                    <span className="text-gray-600">Marital Status: </span>
                    <span>{sibling.marital_status}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // family and biographical
  const mergedFamilyBio = {
    ...userData.family_details,
    ...userData.biographical_details,
  };

  return (
    <div className="p-8 bg-white">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center">
          <img
            src={
              import.meta.env.VITE_PUBLIC_URL
                ? `${import.meta.env.VITE_PUBLIC_URL}/gahoi-logo.png`
                : '/gahoi-logo.png'
            }
            alt="Gahoi Logo"
            className="h-16 w-16 mr-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userData.personal_information.full_name}
            </h1>
            <p className="text-gray-500">Gahoi Code: {userData.gahoi_code}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      {renderSection('Personal Information', userData.personal_information, [
        ['full_name', 'Full Name'],
        ['mobile_number', 'Mobile Number'],
        ['email_address', 'Email Address'],
        ['Gender', 'Gender'],
        ['nationality', 'Nationality'],
        ['is_gahoi', 'Is Gahoi'],
      ])}

       {/* Additional Details */}
      {renderSection('Additional Details', userData.additional_details, [
        ['blood_group', 'Blood Group'],
        ['date_of_birth', 'Date of Birth'],
        ['date_of_marriage', 'Date of Marriage'],
        ['higher_education', 'Higher Education'],
        ['current_address', 'Current Address'],
      ])}

      {/* Merged Family and Biographical Details */}
      {renderSection('Family Details', mergedFamilyBio, [
         ['gotra', 'Gotra'],
        ['aakna', 'Aakna'],
        ['is_married', 'Marital Status'],
        ['marriage_to_another_caste', 'Marriage To Another Caste'],
        ['manglik_status', 'Manglik Status'],
        ['Handicap', 'Handicap'],
        ['father_name', "Father's Name"],
        ['father_mobile', "Father's Mobile"],
        ['mother_name', "Mother's Name"],
        ['mother_mobile', "Mother's Mobile"],
        ['spouse_name', "Spouse's Name"],
        ['spouse_mobile', "Spouse's Mobile"],
        ['spouse_gotra', "Spouse's Gotra"],
        ['spouse_aakna', "Spouse's Aakna"],
       
      ])}

      {/* Children */}
      {renderChildren()}

      {/* Siblings */}
      {renderSiblings()}

     

      {/* Previous Marriage Info */}
      {renderPreviousMarriageInfo()}

      {/* Regional Information */}
      {renderSection('Regional Information', userData.additional_details?.regional_information, [
        ['State', 'State'],
        ['District', 'District'],
        ['local_body', 'Local Body'],
        ['gram_panchayat', 'Gram Panchayat'],
        ['RegionalAssembly', 'Regional Assembly'],
        ['LocalPanchayatName', 'Local Panchayat Name'],
        ['LocalPanchayat', 'Local Panchayat'],
        ['SubLocalPanchayat', 'Sub Local Panchayat'],
      ])}

      {/* Work Information */}
      {renderSection('Work Information', userData.work_information, [
        ['workType', 'Work Type'],
        ['industrySector', 'Industry Sector'],
        ['employmentType', 'Employment Type'],
        ['businessSize', 'Business Size'],
        ['businessType', 'Business Type'],
        ['businessYears', 'Business Years'],
      ])}
    </div>
  );
};

export default PrintProfile;
