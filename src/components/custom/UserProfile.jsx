import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FORM_FIELD_CONFIG } from "../../utils/formFieldConfig";


function stripIds(obj) {
  if (Array.isArray(obj)) {
    return obj.map(stripIds);
  } else if (obj && typeof obj === "object") {
    // Destructure and ignore id field
    const { id: _, ...rest } = obj;
    const cleaned = {};
    for (const [k, v] of Object.entries(rest)) {
      cleaned[k] = stripIds(v);
    }
    return cleaned;
  }
  return obj;
}


const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://admin.gahoishakti.in"
    : "http://localhost:1340";

const SECTIONS = [
  { id: "personal", title: "Personal Information", icon: "user" },
  { id: "family", title: "Family Details", icon: "users" },
  { id: "biographical", title: "Biographical Details", icon: "book" },
  { id: "additional", title: "Additional Details", icon: "plus" },
   { id: "regional", title: "Regional Information", icon: "map" },
  { id: "previous_marriage", title: "Previous Marriage Information", icon: "ring" },
  { id: "work", title: "Work Information", icon: "briefcase" }  
];

const GOTRA_OPTIONS = [
  "Vasar/Vastil/Vasal",
  "Gol",
  "Gangal / Gagil",
  "Badal / Waghil / Bandal",
  "Kocchal / Kochil",
  "Jaital",
  "Vachhil",
  "Kachhil",
  "Bhaal",
  "Kohil",
  "Kasiv",
  "Kasav",
  "Single",
  "Others"
];

const AAKNA_OPTIONS = [
  "Amroha", "Andhi", "Asoo", "Asoopi", "Asooti", "Asudipa", "Amar", "Arusiya",
  "Badal/Waghil/Bandal", "Badil", "Baderiya", "Badhiya", "Badonya", "Bagar",
  "Bahre", "Bajrang Gadiya", "Bamoriya", "Bardiya", "Barele/Barol", "Barha/Barehe",
  "Baronya", "Barsainya", "Baidal", "Beder", "Behre", "Beder/Badil/Baidal", "Bed",
  "Bhagoriya", "Bhondu", "Bilaiya", "Binaurya", "Bijpuriya", "Brijpuriya",
  "Changele", "Chandaiya", "Chapra/Chupara", "Chauda/Chodha/Chouda", "Chiroliya",
  "Dagarhiha", "Dadam", "Dadarya", "Damele", "Damorha", "Dangre", "Dangan ke",
  "Deepa/Teepa", "Devadhiya", "Dhanoriya", "Dhoosar", "Digoriya", "Dingauriya",
  "Dohariya Devaraha", "Gandhi", "Geda", "Ghura", "Gol", "Gugoriya/Ugoriya",
  "Gangal/Gagil", "Hadyal", "Hathnoria/Hathnotiya", "Hunka", "Indurkhiya",
  "Itodiya", "Itoriya", "Iksade", "Jaar", "Jakonya", "Jalaounya", "Jauriya",
  "Jhudele/Kshurele", "Jhuke/Jhunk", "Joliya", "Jugoriya", "Jaital", "Kachhil",
  "Kajar", "Kanjoulya", "Kanthariya", "Kasav", "Kasiv", "Kastwar", "Kathal/Kathil",
  "Kathori/Karoli ke", "Khangat", "Khard", "Baraya", "Kunayar", "Chungele",
  "Bhagorya", "Dhingauriya", "Dengre/Dangre", "Mihi ke Kunwar", "Kharya/Khairya",
  "Baderia", "Sirojiya", "Kuchiya/Kuchha", "Kanakne", "Matele/Mahtele",
  "Itoriya/Itodiya", "Vinaurya", "Shikolya/Sakoraya/Shipolya", "Katare",
  "Amaulya/Amauriya", "Jhudele/Jhad", "Bhondiya/Bhondu", "Teetbilasi/Teetbirasi",
  "Chandaiya/Chandraseniya", "Jhudele/Jurele/Jhood", "Kandele", "Others"
];


const GOTRA_AAKNA_MAP = {
  "Vasar/Vastil/Vasal": [
    "Rusiya", "Arusiya", "Behre", "Bahre", "Pahariya", "Reja", "Mar", "Amar",
    "Mor", "Sethiya", "Damele", "Kathal", "Kathil", "Marele", "Nahar", "Naar",
    "KareKhemau", "Raghare", "Bagar", "Tudha", "Sah", "Saav", "Dangan ke",
    "Seth (Mau ke/Paliya ke/Khakshis ke/Mahuta ke/Bhaghoi ke)", "Kasav", "Khaira",
    "Sarawgi (Mau ke)", "Sahdele", "Sadele", "Changele", "Chungele", "Mungele",
    "Dhoosar", "Dadraya", "Patodiya", "Patodi", "Paterha", "Jhanjhar", "Kharaya",
    "Baraya", "Kunayar", "Purpuriya", "Puranpuriya", "Kajar", "Kshankshar"
  ],
  "Kasiv": [
    "Asoo", "Asoopi", "Asooti", "Khantal", "Beder", "Badil", "Baidal",
    "Sudipa", "Asudipa", "Deepa/Teepa"
  ],
  "Kasav": [
    "Asoo", "Asoopi", "Asooti", "Khantal", "Beder", "Badil", "Baidal",
    "Sudipa", "Asudipa", "Deepa/Teepa"
  ]
};


const getFieldType = (section, field, formData) => {
  
  if (section === "biographical_details" && field === "Aakna") {
    const selectedGotra = formData?.biographical_details?.Gotra;
    const aaknaOptions = selectedGotra ? (GOTRA_AAKNA_MAP[selectedGotra] || AAKNA_OPTIONS) : AAKNA_OPTIONS;
    return {
      type: "dropdown",
      options: aaknaOptions,
      disabled: !selectedGotra
    };
  }


  const fieldConfig = FORM_FIELD_CONFIG[section]?.[field.toLowerCase()];
  if (fieldConfig) {
    return fieldConfig;
  }

  return { type: "text" };
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      console.error("Error in UserProfile:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const mobileNumber = localStorage.getItem("verifiedMobile");
        const token = localStorage.getItem("token");
        const storedDocumentId = localStorage.getItem("documentId");

        console.log("Starting fetch with:", {
          mobileNumber,
          hasToken: !!token,
          storedDocumentId
        });

        if (!token || !mobileNumber) {
          console.log("Missing auth token or mobile number");
          setError("Please login again to continue");
          localStorage.clear();
          setTimeout(() => navigate("/login", { replace: true }), 2000);
          return;
        }

        // API call for main profile data
        const mainUrl = `${API_BASE}/api/registration-pages?filters[personal_information][mobile_number][$eq]=${mobileNumber}&populate=*`;
        const mainRes = await fetch(mainUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
        });
        if (!mainRes.ok) {
          const errorText = await mainRes.text();
          throw new Error(`Failed to fetch main profile data: ${mainRes.status} - ${errorText}`);
        }
        const mainData = await mainRes.json();
        const mainProfileData = mainData.data?.[0];
        if (!mainProfileData) {
          throw new Error(`No profile found for mobile number ${mobileNumber}`);
        }
        const mainAttrs = mainProfileData.attributes || mainProfileData;

        // API call for siblings only
        const siblingsUrl = `${API_BASE}/api/registration-pages?filters[personal_information][mobile_number][$eq]=${mobileNumber}&populate[family_details][populate]=siblingDetails`;
        const siblingsRes = await fetch(siblingsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (!siblingsRes.ok) {
          const errorText = await siblingsRes.text();
          throw new Error(`Failed to fetch siblings: ${siblingsRes.status} - ${errorText}`);
        }
        const siblingsData = await siblingsRes.json();
        const siblingsProfile = siblingsData.data?.[0]?.family_details?.siblingDetails || [];

  // API call for Regional only
  const regionalUrl = `${API_BASE}/api/registration-pages` +
  `?filters[personal_information][mobile_number][$eq]=${mobileNumber}` +
  `&populate[additional_details][populate]=regional_information`;

        const regionalRes = await fetch(regionalUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        
        if (!regionalRes.ok) {
          const errorText = await regionalRes.text();
          throw new Error(`Failed to fetch regional information: ${regionalRes.status} - ${errorText}`);
        }
        
        const regionalData = await regionalRes.json();
        const regionalProfile = regionalData.data?.[0]?.additional_details?.regional_information || {};
        

    
        const mergedData = {
          personal_information: mainAttrs.personal_information || {},
          family_details: {
            ...(mainAttrs.family_details || {}),
            siblingDetails: siblingsProfile
          },
          biographical_details: mainAttrs.biographical_details || {},
          work_information: mainAttrs.work_information || {},
          additional_details: {
            ...(mainAttrs.additional_details || {}),
            regional_information: {
              RegionalAssembly: regionalProfile?.RegionalAssembly || "",
              LocalPanchayatName: regionalProfile?.LocalPanchayatName || "",
              LocalPanchayat: regionalProfile?.LocalPanchayat || "",
              SubLocalPanchayat: regionalProfile?.SubLocalPanchayat || "",
              State: regionalProfile?.State || "",
              District: regionalProfile?.District || "",
              local_body: regionalProfile?.local_body || "",
              gram_panchayat: regionalProfile?.gram_panchayat || ""
            }
          },
          previous_marriage_info: mainAttrs.previous_marriage_info || {
            spouse_name: "",
            spouse_gotra: "",
            spouse_akna: "",
            children_living_with: "",
            want_kundli_match: "",
            accept_partner_with_children: ""
          },
          child_name: mainAttrs.child_name || [],
          your_suggestions: mainAttrs.your_suggestions || {},
          gahoi_code: mainAttrs.gahoi_code || "",
          documentId: mainAttrs.documentId || mainProfileData.documentId,
          createdAt: mainAttrs.createdAt,
          updatedAt: mainAttrs.updatedAt,
          publishedAt: mainAttrs.publishedAt,
        };

        setUserData(mergedData);
        setFormData(mergedData);
        setLoading(false);
        setError(null);

      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
        localStorage.removeItem("documentId");
      }
    };

    fetchUserData();
  }, [navigate]);

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "user":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      case "users":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      case "book":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case "briefcase":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "plus":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        );
      case "map":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      case "ring":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 14v1a4 4 0 108 0v-1M12 4v16m0-8h8m-8 0H4"
            />
          </svg>
        );
      default:
        return null;
    }
  };

const handleSaveProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const mobileNumber = localStorage.getItem("verifiedMobile");
    let documentId = localStorage.getItem("documentId");

    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    // If no documentId, try to find it by mobile number
    if (!documentId) {
      const searchResponse = await fetch(
        `${API_BASE}/api/registration-pages?filters[personal_information][mobile_number][$eq]=${mobileNumber}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        const profile = searchData.data?.[0];
        
        if (profile) {
          documentId = profile.attributes?.documentId || profile.documentId;
          if (documentId) {
            localStorage.setItem("documentId", documentId);
          } else {
            throw new Error("Profile found but no documentId available");
          }
        } else {
          throw new Error("Profile not found");
        }
      } else {
        throw new Error("Failed to verify profile");
      }
    }

    if (!documentId) {
      throw new Error("Could not determine documentId");
    }

    // Check if previous marriage info should be included
    const shouldIncludePreviousMarriage = 
      formData?.biographical_details?.is_married === "Widow/Widower" ||
      formData?.biographical_details?.is_married === "Divorced" ||
      formData?.consider_second_marriage === true;

   
    const rawSaveData = {
      personal_information: formData.personal_information || {},
      family_details: formData.family_details || {},
      biographical_details: formData.biographical_details || {},
      work_information: formData.work_information || {},
      additional_details: formData.additional_details || {},
      child_name: formData.child_name || [],
      your_suggestions: formData.your_suggestions || {},
      gahoi_code: formData.gahoi_code || "",
      marital_status: formData.marital_status || "",
      consider_second_marriage: formData.consider_second_marriage || false
    };
    
    // Only include previous marriage info if relevant
    if (shouldIncludePreviousMarriage) {
      rawSaveData.previous_marriage_info = {
        spouse_name: formData?.previous_marriage_info?.spouse_name || "",
        spouse_gotra: formData?.previous_marriage_info?.spouse_gotra || "",
        spouse_akna: formData?.previous_marriage_info?.spouse_akna || "",
        children_living_with: formData?.previous_marriage_info?.children_living_with || "",
        want_kundli_match: formData?.previous_marriage_info?.want_kundli_match || "",
        accept_partner_with_children: formData?.previous_marriage_info?.accept_partner_with_children || ""
      };
    }
   
    const saveData = stripIds(rawSaveData);

    // Save using the documentId
    const saveResponse = await fetch(
      `${API_BASE}/api/registration-pages/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: saveData }),
      }
    );

    if (!saveResponse.ok) {
      throw new Error(`Failed to save profile (${saveResponse.status})`);
    }

    const result = await saveResponse.json();

   
   const attrs = result.data?.attributes || {};
    
   const updatedData = {
      personal_information: {
        ...(formData.personal_information || {}),
        ...(attrs.personal_information || {})
      },
      family_details: {
        ...(formData.family_details || {}),
        ...(attrs.family_details || {})
      },
      biographical_details: {
        ...(formData.biographical_details || {}),
        ...(attrs.biographical_details || {})
      },
      work_information: {
        ...(formData.work_information || {}),
        ...(attrs.work_information || {})
      },
      additional_details: {
        ...(formData.additional_details || {}),
        ...(attrs.additional_details || {})
      },
      previous_marriage_info: {
        ...(formData.previous_marriage_info || {}),
        ...(attrs.previous_marriage_info || {})
      },
      child_name: attrs.child_name || formData.child_name || [],
      your_suggestions: attrs.your_suggestions || formData.your_suggestions || {},
      gahoi_code: attrs.gahoi_code || formData.gahoi_code || "",
      marital_status: attrs.marital_status || formData.marital_status || "",
      consider_second_marriage: attrs.consider_second_marriage ?? formData.consider_second_marriage ?? false,
      documentId: attrs.documentId || result.data?.documentId || formData.documentId,
      createdAt: attrs.createdAt || formData.createdAt,
      updatedAt: attrs.updatedAt || formData.updatedAt,
      publishedAt: attrs.publishedAt || formData.publishedAt,
    };

   
    setUserData(updatedData);
    setFormData(updatedData);
    setEditMode(false);

    
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px 30px;
      border-radius: 8px;
      z-index: 1000;
      text-align: center;
      min-width: 300px;
    `;
    
    const messageContent = document.createElement('div');
    messageContent.style.cssText = `
      margin-bottom: 15px;
      font-size: 16px;
    `;
    messageContent.textContent = 'Profile saved successfully!';
    
    const okButton = document.createElement('button');
    okButton.style.cssText = `
      background: #4CAF50;
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    `;
    okButton.textContent = 'OK';
    okButton.onmouseover = () => okButton.style.background = '#45a049';
    okButton.onmouseout = () => okButton.style.background = '#4CAF50';
    
    okButton.onclick = () => {
      document.body.removeChild(successMessage);
    };
    
    successMessage.appendChild(messageContent);
    successMessage.appendChild(okButton);
    document.body.appendChild(successMessage);

  } catch (error) {
    // error message 
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px 30px;
      border-radius: 8px;
      z-index: 1000;
      text-align: center;
      min-width: 300px;
    `;
    
    const messageContent = document.createElement('div');
    messageContent.style.cssText = `
      margin-bottom: 15px;
      font-size: 16px;
      color: #ff6b6b;
    `;
    messageContent.textContent = `Failed to save profile: ${error.message}`;
    
    const okButton = document.createElement('button');
    okButton.style.cssText = `
      background: #ff4444;
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    `;
    okButton.textContent = 'OK';
    okButton.onmouseover = () => okButton.style.background = '#ff3333';
    okButton.onmouseout = () => okButton.style.background = '#ff4444';
    
    okButton.onclick = () => {
      document.body.removeChild(errorMessage);
    };
    
    errorMessage.appendChild(messageContent);
    errorMessage.appendChild(okButton);
    document.body.appendChild(errorMessage);
  }
};

const handleInputChange = (section, field, value) => {
  setFormData(prev => ({
    ...prev,
    [section]: {
      ...prev[section],
      [field]: value
    }
  }));
};

const renderField = (section, key, value, fieldConfig) => {
  // Skip rendering if value is N/A or empty for all
  if (!value || value === "N/A") {
    return null;
  }

  // Skip regional_information field in additional_details section
  if (section === "additional_details" && key === "regional_information") {
    return null;
  }

  return (
    <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
      <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
        {key.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
      </dt>
      <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {editMode ? (
          fieldConfig.type === "dropdown" ? (
            <select
              value={formData?.[section]?.[key] || ""}
              onChange={(e) => {
                handleInputChange(section, key, e.target.value);
                
                if (key === "Gotra") {
                  handleInputChange(section, "Aakna", "");
                }
              }}
              disabled={fieldConfig.disabled}
              className={`border border-gray-300 px-2 py-1 rounded w-full bg-white ${
                fieldConfig.disabled ? 'bg-gray-100' : ''
              }`}
            >
              <option value="">{`Select ${key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}`}</option>
              {fieldConfig.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData?.[section]?.[key] || ""}
              onChange={(e) => handleInputChange(section, key, e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded w-full"
            />
          )
        ) : (
          value?.toString() || "N/A"
        )}
        {key === "Aakna" && !formData?.[section]?.Gotra && editMode && (
          <p className="text-gray-500 text-xs mt-1">
            Please select a Gotra first
          </p>
        )}
      </dd>
    </div>
  );
};

const SECTION_KEYS = {
  personal: "personal_information",
  family: "family_details",
  biographical: "biographical_details",
  work: "work_information",
  additional: "additional_details",
  regional: "regional_information",
  previous_marriage: "previous_marriage_info"
};

const renderSectionContent = () => {
  if (!["personal", "family", "biographical", "work", "additional", "regional", "previous_marriage"].includes(activeSection)) {
    return null;
  }

  const sectionKey = SECTION_KEYS[activeSection];
  
  
  if (activeSection === 'regional') {
    const regionalFields = [
      { key: 'RegionalAssembly', label: 'Regional Assembly' },
      { key: 'LocalPanchayatName', label: 'Local Panchayat Name' },
      { key: 'LocalPanchayat', label: 'Local Panchayat' },
      { key: 'SubLocalPanchayat', label: 'Sub Local Panchayat' },
      { key: 'State', label: 'State' },
      { key: 'District', label: 'District' },
      { key: 'local_body', label: 'Local Body' },
      { key: 'gram_panchayat', label: 'Gram Panchayat' }
    ];

    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Regional Information
          </h2>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <dl className="divide-y divide-gray-200">
            {regionalFields.map(({ key, label }) => {
              const value = displayData?.additional_details?.regional_information?.[key];

              // Skip rendering if value is empty or N/A
              if (!editMode && (!value || value === "N/A")) {
                return null;
              }
              
              return (
                <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">{label}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={formData?.additional_details?.regional_information?.[key] || ""}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            additional_details: {
                              ...prev.additional_details,
                              regional_information: {
                                ...prev.additional_details?.regional_information,
                                [key]: e.target.value
                              }
                            }
                          }));
                        }}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                      />
                    ) : (
                      value || "N/A"
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>
    );
  }
  
  // Add special handling for previous marriage section
  if (activeSection === 'previous_marriage') {
    // Only show this section if user's status makes it relevant
    const shouldShowPreviousMarriage = 
      displayData?.biographical_details?.is_married === "Widow/Widower" ||
      displayData?.biographical_details?.is_married === "Divorced" ||
      displayData?.consider_second_marriage === true;

    if (!shouldShowPreviousMarriage && !editMode) {
      return (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Previous Marriage Information
            </h2>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
            Not applicable based on current marital status
          </div>
        </section>
      );
    }

    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Previous Marriage Information
          </h2>
        </div>
        {shouldShowPreviousMarriage ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <dl className="divide-y divide-gray-200">
              {editMode && (
                <>
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Previous Spouse Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        value={formData?.previous_marriage_info?.spouse_name || ""}
                        onChange={(e) => handleInputChange("previous_marriage_info", "spouse_name", e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                        placeholder="Enter previous spouse name"
                      />
                    </dd>
                  </div>

                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Previous Spouse Gotra</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <select
                        value={formData?.previous_marriage_info?.spouse_gotra || ""}
                        onChange={(e) => handleInputChange("previous_marriage_info", "spouse_gotra", e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                      >
                        <option value="">Select Gotra</option>
                        {GOTRA_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </dd>
                  </div>

                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Previous Spouse Aakna</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <select
                        value={formData?.previous_marriage_info?.spouse_akna || ""}
                        onChange={(e) => handleInputChange("previous_marriage_info", "spouse_akna", e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                        disabled={!formData?.previous_marriage_info?.spouse_gotra}
                      >
                        <option value="">Select Aakna</option>
                        {(formData?.previous_marriage_info?.spouse_gotra 
                          ? (GOTRA_AAKNA_MAP[formData.previous_marriage_info.spouse_gotra] || AAKNA_OPTIONS)
                          : AAKNA_OPTIONS
                        ).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </dd>
                  </div>

                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Will children live with you/your spouse?</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <select
                        value={formData?.previous_marriage_info?.children_living_with || ""}
                        onChange={(e) => handleInputChange("previous_marriage_info", "children_living_with", e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </dd>
                  </div>

                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Do you want horoscope matching?</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <select
                        value={formData?.previous_marriage_info?.want_kundli_match || ""}
                        onChange={(e) => handleInputChange("previous_marriage_info", "want_kundli_match", e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </dd>
                  </div>

                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Accept Partner with Children</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <select
                        value={formData?.previous_marriage_info?.accept_partner_with_children || ""}
                        onChange={(e) => handleInputChange("previous_marriage_info", "accept_partner_with_children", e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </dd>
                  </div>
                </>
              )}
              
              {/* Show filled values in view mode */}
              {!editMode && Object.entries(displayData?.previous_marriage_info || {}).map(([key, value]) => {
                // Skip id field and empty values
                if (!value || value === "N/A" || key === "id") return null;
                
                const label = key.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');

                return (
                  <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">{label}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {value}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
            Not applicable based on current marital status
          </div>
        )}
      </section>
    );
  }
  
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {SECTIONS.find(s => s.id === activeSection)?.title}
        </h2>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <dl className="divide-y divide-gray-200">
          {activeSection === 'family' ? (
            <>
              {/* Parent Details */}
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
                <div className="space-y-4">
                  {renderField(sectionKey, "father_name", displayData[sectionKey]?.father_name, { type: "text" })}
                  {renderField(sectionKey, "father_mobile", displayData[sectionKey]?.father_mobile, { type: "text" })}
                  {renderField(sectionKey, "mother_name", displayData[sectionKey]?.mother_name, { type: "text" })}
                  {renderField(sectionKey, "mother_mobile", displayData[sectionKey]?.mother_mobile, { type: "text" })}
                </div>
              </div>

              {/* Spouse Details */}
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold mb-4">Spouse Information</h3>
                <div className="space-y-4">
                  {renderField(sectionKey, "spouse_name", displayData[sectionKey]?.spouse_name, { type: "text" })}
                  {renderField(sectionKey, "spouse_mobile", displayData[sectionKey]?.spouse_mobile, { type: "text" })}
                  {renderField(sectionKey, "spouse_gotra", displayData[sectionKey]?.spouse_gotra, { 
                    type: "dropdown",
                    options: GOTRA_OPTIONS
                  })}
                  {renderField(sectionKey, "spouse_aakna", displayData[sectionKey]?.spouse_aakna, { 
                    type: "dropdown",
                    options: displayData[sectionKey]?.spouse_gotra ? 
                      (GOTRA_AAKNA_MAP[displayData[sectionKey].spouse_gotra] || AAKNA_OPTIONS) : 
                      AAKNA_OPTIONS,
                    disabled: !displayData[sectionKey]?.spouse_gotra
                  })}
                  {displayData?.biographical_details?.is_married === "Married" && (
                    <>
                      {renderField("biographical_details", "marriage_to_another_caste", 
                        displayData?.biographical_details?.marriage_to_another_caste, {
                        type: "dropdown",
                        options: ["Same Caste Marriage", "Married to Another Caste"]
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* Children Details */}
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold mb-4">Children Information</h3>
                <div className="space-y-4">
                  {(formData?.child_name || []).map((child, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Child Name */}
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <input
                                type="text"
                                value={child?.child_name || ""}
                                onChange={(e) => {
                                  const newChildren = [...(formData?.child_name || [])];
                                  newChildren[index] = {
                                    ...newChildren[index],
                                    child_name: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    child_name: newChildren
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                                placeholder="Enter child name"
                              />
                            ) : (
                              child.child_name || "N/A"
                            )}
                          </dd>
                        </div>

                        {/* Gender */}
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Gender</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <select
                                value={child?.gender || ""}
                                onChange={(e) => {
                                  const newChildren = [...(formData?.child_name || [])];
                                  newChildren[index] = {
                                    ...newChildren[index],
                                    gender: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    child_name: newChildren
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            ) : (
                              child.gender || "N/A"
                            )}
                          </dd>
                        </div>

                        {/* Age */}
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Age</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <input
                                type="number"
                                value={child?.age || ""}
                                onChange={(e) => {
                                  const newChildren = [...(formData?.child_name || [])];
                                  newChildren[index] = {
                                    ...newChildren[index],
                                    age: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    child_name: newChildren
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                                min="0"
                                max="100"
                                placeholder="Enter age"
                              />
                            ) : (
                              child.age || "N/A"
                            )}
                          </dd>
                        </div>

                        {/* Phone Number */}
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <input
                                type="tel"
                                value={child?.phone_number || ""}
                                onChange={(e) => {
                                  const newChildren = [...(formData?.child_name || [])];
                                  newChildren[index] = {
                                    ...newChildren[index],
                                    phone_number: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    child_name: newChildren
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                                placeholder="Enter phone number"
                              />
                            ) : (
                              child.phone_number || "N/A"
                            )}
                          </dd>
                        </div>
                      </div>

                      {/* Delete Button */}
                      {editMode && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => {
                              const newChildren = [...(formData?.child_name || [])];
                              newChildren.splice(index, 1);
                              setFormData(prev => ({
                                ...prev,
                                child_name: newChildren
                              }));
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Child Button */}
                {editMode && (
                  <button
                    onClick={() => {
                      const newChild = { child_name: "", gender: "", age: "" };
                      setFormData(prev => ({
                        ...prev,
                        child_name: [...(prev.child_name || []), newChild]
                      }));
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Child
                  </button>
                )}
              </div>

              {/* Siblings Details */}
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold mb-4">Siblings Information</h3>
                <div className="space-y-4">
                  {(formData?.family_details?.siblingDetails || []).map((sibling, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <input
                                type="text"
                                value={sibling?.sibling_name || ""}
                                onChange={(e) => {
                                  const newSiblings = [...(formData?.family_details?.siblingDetails || [])];
                                  newSiblings[index] = {
                                    ...newSiblings[index],
                                    sibling_name: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    family_details: {
                                      ...prev.family_details,
                                      siblingDetails: newSiblings
                                    }
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                                placeholder="Enter sibling name"
                              />
                            ) : (
                              sibling.sibling_name || "N/A"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Gender</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <select
                                value={sibling?.gender || ""}
                                onChange={(e) => {
                                  const newSiblings = [...(formData?.family_details?.siblingDetails || [])];
                                  newSiblings[index] = {
                                    ...newSiblings[index],
                                    gender: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    family_details: {
                                      ...prev.family_details,
                                      siblingDetails: newSiblings
                                    }
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                            ) : (
                              sibling.gender || "N/A"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Age</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <input
                                type="number"
                                value={sibling?.age || ""}
                                onChange={(e) => {
                                  const newSiblings = [...(formData?.family_details?.siblingDetails || [])];
                                  newSiblings[index] = {
                                    ...newSiblings[index],
                                    age: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    family_details: {
                                      ...prev.family_details,
                                      siblingDetails: newSiblings
                                    }
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                                placeholder="Enter age"
                                min="0"
                                max="100"
                              />
                            ) : (
                              sibling.age || "N/A"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <input
                                type="text"
                                value={sibling?.phone_number || ""}
                                onChange={(e) => {
                                  const newSiblings = [...(formData?.family_details?.siblingDetails || [])];
                                  newSiblings[index] = {
                                    ...newSiblings[index],
                                    phone_number: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    family_details: {
                                      ...prev.family_details,
                                      siblingDetails: newSiblings
                                    }
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                                placeholder="Enter phone number"
                              />
                            ) : (
                              sibling.phone_number || "N/A"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Marital Status</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <select
                                value={sibling?.marital_status || ""}
                                onChange={(e) => {
                                  const newSiblings = [...(formData?.family_details?.siblingDetails || [])];
                                  newSiblings[index] = {
                                    ...newSiblings[index],
                                    marital_status: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    family_details: {
                                      ...prev.family_details,
                                      siblingDetails: newSiblings
                                    }
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                              >
                                <option value="">Select Marital Status</option>
                                <option value="Married">Married</option>
                                <option value="Unmarried">Unmarried</option>
                              </select>
                            ) : (
                              sibling.marital_status || "N/A"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Sibling Relation</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <select
                                value={sibling?.sibling_relation || ""}
                                onChange={(e) => {
                                  const newSiblings = [...(formData?.family_details?.siblingDetails || [])];
                                  newSiblings[index] = {
                                    ...newSiblings[index],
                                    sibling_relation: e.target.value
                                  };
                                  setFormData(prev => ({
                                    ...prev,
                                    family_details: {
                                      ...prev.family_details,
                                      siblingDetails: newSiblings
                                    }
                                  }));
                                }}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                              >
                                <option value="">Select Relation</option>
                                <option value="Brother भाई">Brother भाई</option>
                                <option value="Sister बहन">Sister बहन</option>
                              </select>
                            ) : (
                              sibling.sibling_relation || "N/A"
                            )}
                          </dd>
                        </div>
                      </div>
                      
                      {/* Delete Sibling Button */}
                      {editMode && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => {
                              const newSiblings = [...(formData?.family_details?.siblingDetails || [])];
                              newSiblings.splice(index, 1);
                              setFormData(prev => ({
                                ...prev,
                                family_details: {
                                  ...prev.family_details,
                                  siblingDetails: newSiblings
                                }
                              }));
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {editMode && (
                  <button
                    onClick={() => {
                      const newSibling = {
                        sibling_name: "",
                        gender: "",
                        age: "",
                        phone_number: "",
                        marital_status: "",
                        sibling_relation: ""
                      };
                      setFormData(prev => ({
                        ...prev,
                        family_details: {
                          ...prev.family_details,
                          siblingDetails: [...(prev.family_details?.siblingDetails || []), newSibling]
                        }
                      }));
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Sibling
                  </button>
                )}
              </div>
            </>
          ) : (
            Object.entries(displayData[sectionKey] || {})
              .filter(([key]) => key !== "id" && key !== "display_picture" && key !== "regional_information")
              .map(([key, value]) => {
                const fieldConfig = getFieldType(sectionKey, key, formData);
                return renderField(sectionKey, key, value, fieldConfig);
              })
          )}
        </dl>
      </div>
    </section>
  );
};


  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <span>Log out and log in again to complete your profile</span>
      </div>
    );
  }

  //  if no data is available
  const emptyData = {
    personal_information: {},
    family_details: {},
    biographical_details: {},
    work_information: {},
    additional_details: {},
    regional_information: {
      RegionalAssembly: "",
      LocalPanchayatName: "",
      LocalPanchayat: "",
      SubLocalPanchayat: "",
      State: "",
      District: "",
      local_body: "",
      gram_panchayat: "",
    },
    previous_marriage_info: {
      spouse_name: "",
      spouse_gotra: "",
      spouse_akna: "",
      children_living_with: "",
      want_kundli_match: "",
      accept_partner_with_children: ""
    },
    child_name: [],
    your_suggestions: {},
    gahoi_code: "",
    documentId: "",
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  };

  // Use empty data if userData is not available
  const displayData = userData || emptyData;

  return (
<div className="min-h-screen bg-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible py-2 lg:py-4">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-shrink-0 flex items-center px-4 py-3 text-sm font-medium transition-colors
                  ${
                    activeSection === section.id
                      ? "bg-red-50 text-red-700 border-b-4 lg:border-b-0 lg:border-l-4 border-red-700"
                      : "text-gray-600 hover:bg-gray-100"
                  } w-auto lg:w-full whitespace-nowrap`}
              >
                {renderIcon(section.icon)}
                <span className="ml-3">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

      
        <div className="flex-1 p-4 lg:p-6">
          
          <div className="flex justify-end mb-4 space-x-2">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </>
            ) : (
              //disable edit on regional section
              activeSection !== 'regional' && activeSection !== 'work' && (
              <button
                onClick={() => setEditMode(true)}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
              )
            )}
          </div>

          {/* Sections */}
          {renderSectionContent()}
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default UserProfile;
