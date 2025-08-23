  // import React, { useMemo } from 'react';

  // const RegionalDropdowns = ({ value, onChange, data, disabled }) => {
  //   const { STATES, STATE_TO_DISTRICTS, DISTRICT_TO_CITIES, DISTRICT_LOCAL_BODIES_MAP, DISTRICT_GRAM_PANCHAYATS_MAP } = data;
  //   const selectedState = value.State || '';
  //   const selectedDistrict = value.District || '';
  //   const selectedLocalBody = value.local_body || '';
  //   const selectedGramPanchayat = value.gram_panchayat || '';

    
  //   const stateOptions = useMemo(() => STATES || [], [STATES]);
  //   const districtOptions = useMemo(() => selectedState ? (STATE_TO_DISTRICTS[selectedState] || []) : [], [selectedState, STATE_TO_DISTRICTS]);


  //   const localBodyOptions = useMemo(() => {
  //     if (!selectedDistrict) return [];
  //     const lbMap = DISTRICT_LOCAL_BODIES_MAP[selectedDistrict];
  //     if (lbMap) {
  //       return [
  //         ...(lbMap.NAGAR_PALIKA || []),
  //         ...(lbMap.JANPAD_PANCHAYAT || [])
  //       ];
  //     }
  //     // fallback to DISTRICT_TO_CITIES
  //     return Array.isArray(DISTRICT_TO_CITIES[selectedDistrict]) ? DISTRICT_TO_CITIES[selectedDistrict] : [];
  //   }, [selectedDistrict, DISTRICT_LOCAL_BODIES_MAP, DISTRICT_TO_CITIES]);

  //   // Gram Panchayat options: per-district, per-local-body
  //   const gramPanchayatOptions = useMemo(() => {
  //     if (!selectedDistrict || !selectedLocalBody) return [];
  //     const gpMap = DISTRICT_GRAM_PANCHAYATS_MAP[selectedDistrict];
  //     if (gpMap && Array.isArray(gpMap[selectedLocalBody])) {
  //       return gpMap[selectedLocalBody];
  //     }
  //     return [];
  //   }, [selectedDistrict, selectedLocalBody, DISTRICT_GRAM_PANCHAYATS_MAP]);

  //   // Handlers
  //   const handleStateChange = e => {
  //     onChange({ State: e.target.value, District: '', local_body: '', gram_panchayat: '' });
  //   };
  //   const handleDistrictChange = e => {
  //     onChange({ ...value, District: e.target.value, local_body: '', gram_panchayat: '' });
  //   };
  //   const handleLocalBodyChange = e => {
  //     onChange({ ...value, local_body: e.target.value, gram_panchayat: '' });
  //   };
  //   const handleGramPanchayatChange = e => {
  //     onChange({ ...value, gram_panchayat: e.target.value });
  //   };

  //   return (
  //     <>
  //       {/* State Dropdown */}
  //       <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
  //         <dt className="text-sm font-medium text-gray-500">State</dt>
  //         <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
  //           <select
  //             value={selectedState}
  //             onChange={handleStateChange}
  //             className="border border-gray-300 px-2 py-1 rounded w-full"
  //             disabled={disabled}
  //           >
  //             <option value="">Select State</option>
  //             {stateOptions.map(option => (
  //               <option key={option} value={option}>{option}</option>
  //             ))}
  //           </select>
  //         </dd>
  //       </div>
  //       {/* District Dropdown */}
  //       <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
  //         <dt className="text-sm font-medium text-gray-500">District</dt>
  //         <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
  //           <select
  //             value={selectedDistrict}
  //             onChange={handleDistrictChange}
  //             className="border border-gray-300 px-2 py-1 rounded w-full"
  //             disabled={!selectedState || disabled}
  //           >
  //             <option value="">Select District</option>
  //             {districtOptions.map(option => (
  //               <option key={option} value={option}>{option}</option>
  //             ))}
  //           </select>
  //         </dd>
  //       </div>
  //       {/* Local Body Dropdown */}
  //       <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
  //         <dt className="text-sm font-medium text-gray-500">Local Body</dt>
  //         <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
  //           <select
  //             value={selectedLocalBody}
  //             onChange={handleLocalBodyChange}
  //             className="border border-gray-300 px-2 py-1 rounded w-full"
  //             disabled={!selectedDistrict || disabled}
  //           >
  //             <option value="">Select Local Body</option>
  //             {localBodyOptions.map(option => (
  //               <option key={option} value={option}>{option}</option>
  //             ))}
  //           </select>
  //         </dd>
  //       </div>
  //       {/* Gram Panchayat Dropdown */}
  //       <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
  //         <dt className="text-sm font-medium text-gray-500">Gram Panchayat</dt>
  //         <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
  //           <select
  //             value={selectedGramPanchayat}
  //             onChange={handleGramPanchayatChange}
  //             className="border border-gray-300 px-2 py-1 rounded w-full"
  //             disabled={!selectedLocalBody || disabled}
  //           >
  //             <option value="">Select Gram Panchayat</option>
  //             {gramPanchayatOptions.map(option => (
  //               <option key={option} value={option}>{option}</option>
  //             ))}
  //           </select>
  //         </dd>
  //       </div>
  //     </>
  //   );
  // };

  // export default RegionalDropdowns;

  import React, { useMemo } from "react";

const RegionalDropdowns = ({ value, onChange, data, disabled }) => {
  const {
    STATES,
    STATE_TO_DISTRICTS,
    DISTRICT_TO_CITIES,
    DISTRICT_LOCAL_BODIES_MAP,
    DISTRICT_GRAM_PANCHAYATS_MAP,
  } = data;

  const selectedState = value.State || "";
  const selectedDistrict = value.District || "";
  const selectedLocalBody = value.local_body || "";
  const selectedGramPanchayat = value.gram_panchayat || "";

  // State & District options
  const stateOptions = useMemo(() => STATES || [], [STATES]);
  const districtOptions = useMemo(
    () =>
      selectedState ? STATE_TO_DISTRICTS[selectedState] || [] : [],
    [selectedState, STATE_TO_DISTRICTS]
  );

  // Local Body options
  const localBodyOptions = useMemo(() => {
    if (!selectedDistrict || !selectedState) return [];

    if (selectedState === "Madhya Pradesh") {
      // Use MP's dedicated mapping
      const lbMap = DISTRICT_LOCAL_BODIES_MAP[selectedDistrict];
      if (lbMap) {
        return [
          ...(lbMap.NAGAR_PALIKA || []),
          ...(lbMap.JANPAD_PANCHAYAT || []),
        ];
      }
      return [];
    }

    // Other states → use DISTRICT_TO_CITIES
    const stateData = DISTRICT_TO_CITIES[selectedState];
    if (stateData && Array.isArray(stateData[selectedDistrict])) {
      return stateData[selectedDistrict];
    }
    return [];
  }, [
    selectedState,
    selectedDistrict,
    DISTRICT_LOCAL_BODIES_MAP,
    DISTRICT_TO_CITIES,
  ]);

  // Gram Panchayat options
  const gramPanchayatOptions = useMemo(() => {
    if (!selectedDistrict || !selectedLocalBody || !selectedState) return [];

    if (selectedState === "Madhya Pradesh") {
      const gpMap = DISTRICT_GRAM_PANCHAYATS_MAP[selectedDistrict];
      if (gpMap && Array.isArray(gpMap[selectedLocalBody])) {
        return gpMap[selectedLocalBody];
      }
      return [];
    }

    // Other states → Gram Panchayats = same as cities list for now
    const stateData = DISTRICT_TO_CITIES[selectedState];
    if (stateData && Array.isArray(stateData[selectedDistrict])) {
      return stateData[selectedDistrict];
    }
    return [];
  }, [
    selectedState,
    selectedDistrict,
    selectedLocalBody,
    DISTRICT_TO_CITIES,
    DISTRICT_GRAM_PANCHAYATS_MAP,
  ]);

  // Handlers
  const handleStateChange = (e) => {
    onChange({
      State: e.target.value,
      District: "",
      local_body: "",
      gram_panchayat: "",
    });
  };
  const handleDistrictChange = (e) => {
    onChange({
      ...value,
      District: e.target.value,
      local_body: "",
      gram_panchayat: "",
    });
  };
  const handleLocalBodyChange = (e) => {
    onChange({ ...value, local_body: e.target.value, gram_panchayat: "" });
  };
  const handleGramPanchayatChange = (e) => {
    onChange({ ...value, gram_panchayat: e.target.value });
  };

  return (
    <>
      {/* State Dropdown */}
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
        <dt className="text-sm font-medium text-gray-500">State</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="border border-gray-300 px-2 py-1 rounded w-full"
            disabled={disabled}
          >
            <option value="">Select State</option>
            {stateOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </dd>
      </div>

      {/* District Dropdown */}
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
        <dt className="text-sm font-medium text-gray-500">District</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="border border-gray-300 px-2 py-1 rounded w-full"
            disabled={!selectedState || disabled}
          >
            <option value="">Select District</option>
            {districtOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </dd>
      </div>

      {/* Local Body Dropdown */}
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
        <dt className="text-sm font-medium text-gray-500">Local Body</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <select
            value={selectedLocalBody}
            onChange={handleLocalBodyChange}
            className="border border-gray-300 px-2 py-1 rounded w-full"
            disabled={!selectedDistrict || disabled}
          >
            <option value="">Select Local Body</option>
            {localBodyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </dd>
      </div>

      {/* Gram Panchayat Dropdown */}
      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
        <dt className="text-sm font-medium text-gray-500">Gram Panchayat</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <select
            value={selectedGramPanchayat}
            onChange={handleGramPanchayatChange}
            className="border border-gray-300 px-2 py-1 rounded w-full"
            disabled={!selectedLocalBody || disabled}
          >
            <option value="">Select Gram Panchayat</option>
            {gramPanchayatOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </dd>
      </div>
    </>
  );
};

export default RegionalDropdowns;

