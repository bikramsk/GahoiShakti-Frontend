import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FORM_FIELD_CONFIG } from "../../utils/formFieldConfig";
import { BLOOD_GROUPS } from "../../constants/formConstants";


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

const BIOGRAPHICAL_MARRIAGE_TYPE_OPTIONS = [
  "Same Caste Marriage",
  "Married to Another Caste"
];
const BIOGRAPHICAL_IS_MARRIED_OPTIONS = [
  "Married",
  "Unmarried",
  "Widow/Widower",
  "Divorced"
];

const getFieldType = (section, field, formData) => {
  
  if (section === "biographical_details" && field === "Aakna") {
    const selectedGotra = formData?.biographical_details?.Gotra;
    const aaknaOptions = selectedGotra ? (GOTRA_AAKNA_MAP[selectedGotra] || AAKNA_OPTIONS) : AAKNA_OPTIONS;
    return {
      type: "dropdown",
      options: [
        { value: "", label: "Select Aakna", disabled: true },
        ...aaknaOptions.map(a => ({ value: a, label: a }))
      ],
      disabled: !selectedGotra
    };
  }
  if (section === "biographical_details" && field === "Gotra") {
    return {
      type: "dropdown",
      options: [
        { value: "", label: "Select Gotra", disabled: true },
        ...GOTRA_OPTIONS.map(g => ({ value: g, label: g }))
      ],
      disabled: false
    };
  }
  if (section === "biographical_details" && field === "marriage_to_another_caste") {
    return {
      type: "dropdown",
      options: [
        { value: "", label: "Select Marriage To Another Caste", disabled: true },
        { value: "Same Caste Marriage", label: "Same Caste Marriage" },
        { value: "Married to Another Caste", label: "Married to Another Caste" }
      ],
      disabled: false
    };
  }
  if (section === "biographical_details" && field === "is_married") {
    return {
      type: "dropdown",
      options: [
        { value: "", label: "Select Marital Status", disabled: true },
        { value: "Married", label: "Married" },
        { value: "Unmarried", label: "Unmarried" },
        { value: "Widow/Widower", label: "Widow/Widower" },
        { value: "Divorced", label: "Divorced" }
      ],
      disabled: false
    };
  }
  if (section === "additional_details" && field === "blood_group") {
    return {
      type: "dropdown",
      options: [
        { value: "", label: "Select Blood Group", disabled: true },
        ...BLOOD_GROUPS.map(group => ({ value: group, label: group }))
      ],
      disabled: false
    };
  }
  if (section === "additional_details" && (field === "date_of_birth" || field === "date_of_marriage")) {
    return {
      type: "date"
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
  const [, forceUpdate] = useState({});
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [spouseErrors, setSpouseErrors] = useState({});
  const [childrenErrors, setChildrenErrors] = useState([]);
  const [siblingErrors, setSiblingErrors] = useState([]);
  const [prevMarriageErrors, setPrevMarriageErrors] = useState({});

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

        if (!token || !mobileNumber) {
        
          setError("Please login again to continue");
          localStorage.clear();
          setTimeout(() => navigate("/login", { replace: true }), 2000);
          return;
        }

        // API call: main profile data
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

        // API call: siblings only
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

        // API call: Previous Marriage Info with children
        const prevMarriageUrl = `${API_BASE}/api/registration-pages?filters[personal_information][mobile_number][$eq]=${mobileNumber}&populate[previous_marriage_info][populate]=children`;
        const prevMarriageRes = await fetch(prevMarriageUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (!prevMarriageRes.ok) {
          const errorText = await prevMarriageRes.text();
          throw new Error(`Failed to fetch previous marriage info: ${prevMarriageRes.status} - ${errorText}`);
        }
        const prevMarriageData = await prevMarriageRes.json();
        const prevMarriageProfile = prevMarriageData.data?.[0]?.previous_marriage_info || {};

  // API call: Regional only
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
          previous_marriage_info: prevMarriageProfile ? {
            ...prevMarriageProfile,
            spouse_name: prevMarriageProfile.spouse_name || "",
            spouse_gotra: prevMarriageProfile.spouse_gotra || "",
            spouse_akna: prevMarriageProfile.spouse_akna || "",
            spouse_dob: prevMarriageProfile.spouse_dob || "",
            children_living_with: prevMarriageProfile.children_living_with || "",
            want_kundli_match: prevMarriageProfile.want_kundli_match || "",
            accept_partner_with_children: prevMarriageProfile.accept_partner_with_children || "",
            children: prevMarriageProfile.children || []
          } : null,
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

  useEffect(() => {
    if (userData) {
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [userData]);

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

  const getCurrentData = () => formData || userData || emptyData;

const handleSaveProfile = async () => {
    // First check if any changes were made
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    
    if (!hasChanges) {
      setEditMode(false);
      return;
    }

    // Validate Previous Marriage Information if applicable
    const isWidowOrDivorced = 
      formData?.biographical_details?.is_married === "Widow/Widower" ||
      formData?.biographical_details?.is_married === "Divorced";

    if (isWidowOrDivorced) {
      const errors = {};
      const prevMarriageInfo = formData?.previous_marriage_info || {};

      // Required field validation
      if (!prevMarriageInfo.spouse_name?.trim()) {
        errors.spouse_name = "Spouse name is required";
      }
      if (!prevMarriageInfo.spouse_gotra) {
        errors.spouse_gotra = "Spouse gotra is required";
      }
      if (!prevMarriageInfo.spouse_akna) {
        errors.spouse_akna = "Spouse akna is required";
      }
      if (!prevMarriageInfo.spouse_dob) {
        errors.spouse_dob = "Spouse date of birth is required";
      }
      if (!prevMarriageInfo.children_living_with) {
        errors.children_living_with = "Please specify if children are living with you";
      }
      if (!prevMarriageInfo.want_kundli_match) {
        errors.want_kundli_match = "Please specify if you want kundli match";
      }
      if (!prevMarriageInfo.accept_partner_with_children) {
        errors.accept_partner_with_children = "Please specify if you accept partner with children";
      }

      // Children validation
      const childrenErrors = [];
      if (Array.isArray(prevMarriageInfo.children)) {
        prevMarriageInfo.children.forEach((child, index) => {
          const childError = {};
          if (!child.child_name?.trim()) {
            childError.name = "Child name is required";
          }
          if (!child.gender) {
            childError.gender = "Gender is required";
          }
          if (!child.age) {
            childError.age = "Age is required";
          }
          if (Object.keys(childError).length > 0) {
            childrenErrors[index] = childError;
          }
        });
      }

      // If there are validation errors
      if (Object.keys(errors).length > 0 || childrenErrors.some(error => error)) {
        setPrevMarriageErrors(errors);
        if (childrenErrors.some(error => error)) {
          setChildrenErrors(childrenErrors);
        }
        
        // Show validation error message
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
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        `;
        
        let errorHTML = `
          <div style="margin-bottom: 15px; font-size: 16px;">
            Please fill in all required fields:
            <br/><br/>
            <ul style="text-align: left; list-style-type: none;">
        `;

        // Add main form errors
        Object.values(errors).forEach(error => {
          errorHTML += `<li>• ${error}</li>`;
        });

        // Add children errors
        childrenErrors.forEach((childError, index) => {
          if (childError) {
            Object.values(childError).forEach(error => {
              errorHTML += `<li>• Child ${index + 1}: ${error}</li>`;
            });
          }
        });

        errorHTML += `
            </ul>
          </div>
          <button style="
            background:rgb(181, 18, 7);
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
          ">OK</button>
        `;

        errorMessage.innerHTML = errorHTML;
        
        const okButton = errorMessage.querySelector('button');
        okButton.onclick = () => {
          document.body.removeChild(errorMessage);
          // Navigate to previous marriage section
          setActiveSection('previous_marriage');
        };
        
    document.body.appendChild(errorMessage);
    return;
      }
  }

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

      // Prepare save data
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
    
      // Handle previous marriage info based on marital status
      const isWidowOrDivorced = 
        formData?.biographical_details?.is_married === "Widow/Widower" ||
        formData?.biographical_details?.is_married === "Divorced";

      rawSaveData.previous_marriage_info = isWidowOrDivorced
        ? formData.previous_marriage_info || {}
        : null;

      const saveData = {
        data: stripIds(rawSaveData)
      };

   
    const saveResponse = await fetch(
      `${API_BASE}/api/registration-pages/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify(saveData),
      }
    );

    if (!saveResponse.ok) {
      throw new Error(`Failed to save profile (${saveResponse.status})`);
    }

    const result = await saveResponse.json();

     
   const updatedData = {
        ...formData,
        ...result.data?.attributes,
        previous_marriage_info: isWidowOrDivorced 
          ? result.data?.attributes?.previous_marriage_info 
          : null
      };

     
    setFormData(updatedData);
      setOriginalData(updatedData);
      setUserData(updatedData);
    setEditMode(false);

      forceUpdate({});
    
      // Show success message 
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
        background: #15803d;
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    `;
    okButton.textContent = 'OK';
    okButton.onclick = () => {
      document.body.removeChild(successMessage);
        // Force another re-render
        forceUpdate({});
    };
    
    successMessage.appendChild(messageContent);
    successMessage.appendChild(okButton);
    document.body.appendChild(successMessage);

  } catch (error) {
      console.error("Error saving profile:", error);
      
      //error message
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
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    `;
    
    const messageContent = document.createElement('div');
    messageContent.style.cssText = `
      margin-bottom: 15px;
      font-size: 16px;
        color: white;
      `;

   
      if (error.response?.data?.error?.details?.errors) {
        const validationErrors = error.response.data.error.details.errors;
        messageContent.innerHTML = `Validation Errors:<br/><br/>` +
          validationErrors.map(err => `- ${err.message}`).join('<br/>');
      } else {
    messageContent.textContent = `Failed to save profile: ${error.message}`;
      }
    
    const okButton = document.createElement('button');
    okButton.style.cssText = `
        background: #3f3f46;
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    `;
    okButton.textContent = 'OK';
      okButton.onmouseover = () => okButton.style.background = '#52525b';
      okButton.onmouseout = () => okButton.style.background = '#3f3f46';
    
    okButton.onclick = () => {
      document.body.removeChild(errorMessage);
    };
    
    errorMessage.appendChild(messageContent);
    errorMessage.appendChild(okButton);
    document.body.appendChild(errorMessage);
  }
};

const handleInputChange = (section, field, value) => {
    setFormData(prev => {
      const newData = {
    ...prev,
    [section]: {
      ...prev[section],
      [field]: value
    }
      };

  
      if (section === "biographical_details" && field === "is_married") {
        if (value === "Widow/Widower" || value === "Divorced") {
   
          newData.previous_marriage_info = {
            spouse_name: "",
            spouse_gotra: "",
            spouse_akna: "",
            spouse_dob: "",
            children_living_with: "",
            want_kundli_match: "",
            accept_partner_with_children: "",
            children: []
          };
     
          newData.biographical_details.marriage_to_another_caste = "";

 
          const guidanceMessage = document.createElement('div');
          guidanceMessage.style.cssText = `
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
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          `;
          
          guidanceMessage.innerHTML = `
            <div style="margin-bottom: 15px; font-size: 16px;">
              Please fill in the Previous Marriage Information section with the following required details:
              <br/><br/>
              <ul style="text-align: left; list-style-type: none;">
                <li>• Spouse Name</li>
                <li>• Spouse Gotra</li>
                <li>• Spouse Akna</li>
                <li>• Spouse Date of Birth</li>
                <li>• Children Living With</li>
                <li>• Want Kundli Match</li>
                <li>• Accept Partner With Children</li>
              </ul>
              <br/>
              Please navigate to the Previous Marriage Information section to provide these details.
            </div>
            <button style="
              background: #15803d;
              color: white;
              border: none;
              padding: 8px 24px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              transition: background 0.3s;
            ">OK</button>
          `;
          
          const okButton = guidanceMessage.querySelector('button');
          okButton.onclick = () => {
            document.body.removeChild(guidanceMessage);
            // Navigate to previous marriage section
            setActiveSection('previous_marriage');
          };
          
          document.body.appendChild(guidanceMessage);

        } else if (value === "Married" || value === "Unmarried") {
     
          newData.previous_marriage_info = null;
      
          setSpouseErrors({});
          setChildrenErrors([]);
          setPrevMarriageErrors({});

       
          (async () => {
            try {
              const token = localStorage.getItem("token");
              const documentId = localStorage.getItem("documentId");

              if (!token || !documentId) {
                throw new Error("Missing authentication data");
              }

              const saveData = {
                data: stripIds(newData)
              };

              const saveResponse = await fetch(
                `${API_BASE}/api/registration-pages/${documentId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(saveData),
                }
              );

              if (!saveResponse.ok) {
                throw new Error(`Failed to save profile (${saveResponse.status})`);
              }

              const result = await saveResponse.json();
              
          
              const updatedData = {
                ...newData,
                ...result.data?.attributes
              };

              setFormData(updatedData);
              setOriginalData(updatedData);
              setUserData(updatedData);

              // success message
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
              successMessage.textContent = 'Marital status updated successfully';
              document.body.appendChild(successMessage);
              setTimeout(() => document.body.removeChild(successMessage), 2000);

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
              errorMessage.textContent = `Failed to save changes: ${error.message}`;
              document.body.appendChild(errorMessage);
              setTimeout(() => document.body.removeChild(errorMessage), 3000);
            }
          })();
        }
      }

      return newData;
    });
};

const renderField = (section, key, value, fieldConfig) => {
 
  if (!value || value === "N/A") {
    return null;
  }

  
  if (section === "additional_details" && key === "regional_information") {
    return null;
  }

  // Check if the section should be editable
  const isEditable = editMode && !["work_information", "regional_information"].includes(section);

  // Format date for display
  const displayValue = fieldConfig.type === "date" ? 
    (value ? new Date(value).toISOString().split('T')[0] : "") : 
    value?.toString() || "N/A";

  return (
    <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
      <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
        {key.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
      </dt>
      <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {isEditable ? (
          fieldConfig.type === "dropdown" ? (
            <select
              value={formData?.[section]?.[key] || ""}
              onChange={(e) => {
                handleInputChange(section, key, e.target.value);
                // Reset Aakna when Gotra 
                if (section === "biographical_details" && key === "Gotra") {
                  handleInputChange(section, "Aakna", "");
                }
              }}
              disabled={fieldConfig.disabled}
              className={`border border-gray-300 px-2 py-1 rounded w-full bg-white ${
                fieldConfig.disabled ? 'bg-gray-100' : ''
              }`}
            >
              {fieldConfig.options.map((option) =>
                typeof option === 'object' ? (
                  <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </option>
                ) : (
                <option key={option} value={option}>
                  {option}
                </option>
                )
              )}
            </select>
          ) : fieldConfig.type === "date" ? (
            <input
              type="date"
              value={formData?.[section]?.[key] ? new Date(formData[section][key]).toISOString().split('T')[0] : ""}
              onChange={(e) => handleInputChange(section, key, e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded w-full"
            />
          ) : (
            <input
              type="text"
              value={formData?.[section]?.[key] || ""}
              onChange={(e) => handleInputChange(section, key, e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded w-full"
            />
          )
        ) : (
          displayValue
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
    
    const currentData = getCurrentData();

  if (!["personal", "family", "biographical", "work", "additional", "regional", "previous_marriage"].includes(activeSection)) {
    return null;
  }

  const sectionKey = SECTION_KEYS[activeSection];
  
  // Added regional section handling
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
                const value = currentData?.additional_details?.regional_information?.[key];
              if (!value || value === "N/A") return null;
              return (
                <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">{label}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {value || "N/A"}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>
    );
  }
  
  // for previous marriage section
  if (activeSection === 'previous_marriage') {
    
    const shouldShowPreviousMarriage = 
        currentData?.biographical_details?.is_married === "Widow/Widower" ||
        currentData?.biographical_details?.is_married === "Divorced";

    if (!shouldShowPreviousMarriage) {
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

     
      const prevMarriageInfo = currentData?.previous_marriage_info || {};
      const prevMarriageChildren = Array.isArray(prevMarriageInfo?.children) ? prevMarriageInfo.children : [];

      const handlePrevMarriageChange = (field, value) => {
        setFormData(prev => ({
          ...prev,
          previous_marriage_info: {
            ...(prev.previous_marriage_info || {}),
            [field]: value
          }
        }));
      };

      const handleChildChange = (index, field, value) => {
        const newChildren = [...prevMarriageChildren];
        newChildren[index] = {
          ...newChildren[index],
          [field]: value
        };
        
        // Clear error when user starts typing/select
        const newErrors = [...childrenErrors];
        if (newErrors[index]) {
          newErrors[index] = {
            ...newErrors[index],
            [field === 'child_name' ? 'name' : field]: null
          };
          setChildrenErrors(newErrors);
        }
        
        setFormData(prev => ({
          ...prev,
          previous_marriage_info: {
            ...(prev.previous_marriage_info || {}),
            children: newChildren
          }
        }));
      };

      const addChild = () => {
        const newChild = {
          child_name: "",
          gender: "",
          age: "",
          phone_number: "" 
        };
        
        setFormData(prev => ({
          ...prev,
          previous_marriage_info: {
            ...(prev.previous_marriage_info || {}),
            children: [...(prev.previous_marriage_info?.children || []), newChild]
          }
        }));
      };

      const removeChild = (index) => {
        setFormData(prev => ({
          ...prev,
          previous_marriage_info: {
            ...(prev.previous_marriage_info || {}),
            children: prev.previous_marriage_info.children.filter((_, i) => i !== index)
          }
        }));
      };

    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Previous Marriage Information
          </h2>
        </div>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <dl className="divide-y divide-gray-200">
              {/* Spouse Name */}
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Spouse Name <span className="text-red-500">*</span></dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <div>
                      <input
                        type="text"
                      value={prevMarriageInfo?.spouse_name || ""}
                      onChange={(e) => handlePrevMarriageChange("spouse_name", e.target.value)}
                      className={`border ${prevMarriageErrors.spouse_name ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                      required
                    />
                    {prevMarriageErrors.spouse_name && (
                      <p className="text-red-500 text-xs mt-1">{prevMarriageErrors.spouse_name}</p>
                    )}
                  </div>
                ) : (
                  prevMarriageInfo?.spouse_name || "N/A"
                )}
                    </dd>
                  </div>

            {/* Spouse Gotra */}
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Spouse Gotra <span className="text-red-500">*</span></dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <div>
                      <select
                      value={prevMarriageInfo?.spouse_gotra || ""}
                      onChange={(e) => handlePrevMarriageChange("spouse_gotra", e.target.value)}
                      className={`border ${prevMarriageErrors.spouse_gotra ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                      required
                      >
                        <option value="">Select Gotra</option>
                        {GOTRA_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    {prevMarriageErrors.spouse_gotra && (
                      <p className="text-red-500 text-xs mt-1">{prevMarriageErrors.spouse_gotra}</p>
                    )}
                  </div>
                ) : (
                  prevMarriageInfo?.spouse_gotra || "N/A"
                )}
                    </dd>
                  </div>

            {/* Spouse Akna */}
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Spouse Akna <span className="text-red-500">*</span></dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <div>
                      <select
                      value={prevMarriageInfo?.spouse_akna || ""}
                      onChange={(e) => handlePrevMarriageChange("spouse_akna", e.target.value)}
                      className={`border ${prevMarriageErrors.spouse_akna ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                      required
                      disabled={!prevMarriageInfo?.spouse_gotra}
                      >
                        <option value="">Select Aakna</option>
                      {(prevMarriageInfo?.spouse_gotra 
                        ? (GOTRA_AAKNA_MAP[prevMarriageInfo.spouse_gotra] || AAKNA_OPTIONS)
                          : AAKNA_OPTIONS
                        ).map((option) => (
                        <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    {prevMarriageErrors.spouse_akna && (
                      <p className="text-red-500 text-xs mt-1">{prevMarriageErrors.spouse_akna}</p>
                    )}
                  </div>
                ) : (
                  prevMarriageInfo?.spouse_akna || "N/A"
                )}
                    </dd>
                  </div>

            {/* Spouse DOB */}
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Spouse Date of Birth <span className="text-red-500">*</span></dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <div>
                    <input
                      type="date"
                      value={prevMarriageInfo?.spouse_dob || ""}
                      onChange={(e) => handlePrevMarriageChange("spouse_dob", e.target.value)}
                      className={`border ${prevMarriageErrors.spouse_dob ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                      required
                    />
                    {prevMarriageErrors.spouse_dob && (
                      <p className="text-red-500 text-xs mt-1">{prevMarriageErrors.spouse_dob}</p>
                    )}
                  </div>
                ) : (
                  prevMarriageInfo?.spouse_dob || "N/A"
                )}
              </dd>
            </div>

            {/* Children Living With */}
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Children Living With <span className="text-red-500">*</span></dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <div>
                      <select
                      value={prevMarriageInfo?.children_living_with || ""}
                      onChange={(e) => handlePrevMarriageChange("children_living_with", e.target.value)}
                      className={`border ${prevMarriageErrors.children_living_with ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                      required
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    {prevMarriageErrors.children_living_with && (
                      <p className="text-red-500 text-xs mt-1">{prevMarriageErrors.children_living_with}</p>
                    )}
                  </div>
                ) : (
                  prevMarriageInfo?.children_living_with || "N/A"
                )}
                    </dd>
                  </div>

            {/* Want Kundli Match */}
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Want Kundli Match <span className="text-red-500">*</span></dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <div>
                      <select
                      value={prevMarriageInfo?.want_kundli_match || ""}
                      onChange={(e) => handlePrevMarriageChange("want_kundli_match", e.target.value)}
                      className={`border ${prevMarriageErrors.want_kundli_match ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                      required
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    {prevMarriageErrors.want_kundli_match && (
                      <p className="text-red-500 text-xs mt-1">{prevMarriageErrors.want_kundli_match}</p>
                    )}
                  </div>
                ) : (
                  prevMarriageInfo?.want_kundli_match || "N/A"
                )}
                    </dd>
                  </div>

            {/* Accept Partner With Children */}
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Accept Partner With Children <span className="text-red-500">*</span></dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <div>
                      <select
                      value={prevMarriageInfo?.accept_partner_with_children || ""}
                      onChange={(e) => handlePrevMarriageChange("accept_partner_with_children", e.target.value)}
                      className={`border ${prevMarriageErrors.accept_partner_with_children ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                      required
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    {prevMarriageErrors.accept_partner_with_children && (
                      <p className="text-red-500 text-xs mt-1">{prevMarriageErrors.accept_partner_with_children}</p>
                    )}
                  </div>
                ) : (
                  prevMarriageInfo?.accept_partner_with_children || "N/A"
                )}
              </dd>
            </div>

            {/* Children Section */}
            <div className="px-4 py-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Children</h3>
                {editMode && (
                  <button
                    onClick={addChild}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Child
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {prevMarriageChildren.length > 0 ? (
                  prevMarriageChildren.map((child, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name <span className="text-red-500">*</span></dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <div>
                                <input
                                  type="text"
                                  value={child?.child_name || ""}
                                  onChange={(e) => handleChildChange(index, "child_name", e.target.value)}
                                  className={`border ${childrenErrors[index]?.name ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                  required
                                />
                                {childrenErrors[index]?.name && (
                                  <p className="text-red-500 text-xs mt-1">{childrenErrors[index].name}</p>
                                )}
                              </div>
                            ) : (
                              child?.child_name || "N/A"
                            )}
                    </dd>
                  </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Gender <span className="text-red-500">*</span></dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <div>
                                <select
                                  value={child?.gender || ""}
                                  onChange={(e) => handleChildChange(index, "gender", e.target.value)}
                                  className={`border ${childrenErrors[index]?.gender ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                  required
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                                {childrenErrors[index]?.gender && (
                                  <p className="text-red-500 text-xs mt-1">{childrenErrors[index].gender}</p>
                                )}
          </div>
        ) : (
                              child.gender || "N/A"
                            )}
                          </dd>
          </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Age <span className="text-red-500">*</span></dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <div>
                                <input
                                  type="number"
                                  value={child?.age || ""}
                                  onChange={(e) => handleChildChange(index, "age", e.target.value)}
                                  className={`border ${childrenErrors[index]?.age ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                  min="0"
                                  max="100"
                                  required
                                />
                                {childrenErrors[index]?.age && (
                                  <p className="text-red-500 text-xs mt-1">{childrenErrors[index].age}</p>
                                )}
                              </div>
                            ) : (
                              child.age || "N/A"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <input
                                type="tel"
                                value={child?.phone_number || ""}
                                onChange={(e) => handleChildChange(index, "phone_number", e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded w-full"
                              />
                            ) : (
                              child?.phone_number || "N/A"
                            )}
                          </dd>
                        </div>
                      </div>
                      {editMode && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => removeChild(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">No children added</div>
                )}
              </div>
            </div>
          </dl>
        </div>
      </section>
    );
  }
  
  // for biographical details section
  if (activeSection === 'biographical') {
    return (
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Biographical Details
          </h2>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <dl className="divide-y divide-gray-200">
            {/* Gotra Field */}
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Gotra</dt>
              <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <select
                    value={formData?.biographical_details?.gotra || ""}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        biographical_details: {
                          ...prev.biographical_details,
                          gotra: e.target.value,
                          aakna: "" // Reset Aakna when Gotra changes
                        }
                      }));
                    }}
                    className="border border-gray-300 px-2 py-1 rounded w-full"
                  >
                    <option value="">Select Gotra</option>
                    {GOTRA_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  currentData?.biographical_details?.gotra || "N/A"
                )}
              </dd>
            </div>

            {/* Aakna Field */}
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Aakna</dt>
              <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <>
                    <select
                      value={formData?.biographical_details?.aakna || ""}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          biographical_details: {
                            ...prev.biographical_details,
                            aakna: e.target.value
                          }
                        }));
                      }}
                      className="border border-gray-300 px-2 py-1 rounded w-full"
                      disabled={!formData?.biographical_details?.gotra}
                    >
                      <option value="">Select Aakna</option>
                      {(formData?.biographical_details?.gotra 
                        ? (GOTRA_AAKNA_MAP[formData.biographical_details.gotra] || AAKNA_OPTIONS)
                        : AAKNA_OPTIONS
                      ).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {!formData?.biographical_details?.gotra && (
                      <p className="text-gray-500 text-xs mt-1">
                        Please select a Gotra first
                      </p>
                    )}
                  </>
                ) : (
                  currentData?.biographical_details?.aakna || "N/A"
                )}
              </dd>
            </div>

            {/* Married  */}
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Is Married</dt>
              <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <select
                    value={formData?.biographical_details?.is_married || ""}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        biographical_details: {
                          ...prev.biographical_details,
                          is_married: e.target.value
                        }
                      }));
                    }}
                    className="border border-gray-300 px-2 py-1 rounded w-full"
                  >
                    <option value="" disabled>Select Marital Status</option>
                    {BIOGRAPHICAL_IS_MARRIED_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  currentData?.biographical_details?.is_married || "N/A"
                )}
              </dd>
            </div>

            {/* Marriage To Another Caste Field */}
            {formData?.biographical_details?.is_married !== "Widow/Widower" && 
             formData?.biographical_details?.is_married !== "Divorced" && (
            <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
              <dt className="text-sm font-medium text-gray-500">Marriage To Another Caste</dt>
              <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {editMode ? (
                  <select
                    value={formData?.biographical_details?.marriage_to_another_caste || ""}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        biographical_details: {
                          ...prev.biographical_details,
                          marriage_to_another_caste: e.target.value
                        }
                      }));
                    }}
                    className="border border-gray-300 px-2 py-1 rounded w-full"
                  >
                    <option value="" disabled>Select Marriage Type</option>
                    {BIOGRAPHICAL_MARRIAGE_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  currentData?.biographical_details?.marriage_to_another_caste || "N/A"
                )}
              </dd>
            </div>
            )}

            {/* Render other biographical fields */}
            {Object.entries(currentData?.biographical_details || {})
              .filter(([key]) => 
                key !== "id" && 
                key !== "Gotra" && 
                key !== "Aakna" && 
                key !== "gotra" && 
                key !== "aakna" &&
                key !== "is_married" && 
                key !== "marriage_to_another_caste")
              .map(([key, value]) => {
                
                if (key.toLowerCase() === "gotra" || 
                    key.toLowerCase() === "aakna" || 
                    key.toLowerCase() === "is_married" || 
                    key.toLowerCase() === "marriage_to_another_caste") {
                  return null;
                }
                const fieldConfig = getFieldType(sectionKey, key, formData);
                return renderField(sectionKey, key, value, fieldConfig);
              })}
          </dl>
        </div>
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
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Father's Name */}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Father's Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {editMode ? (
                            <input
                              type="text"
                              value={formData?.family_details?.father_name || ""}
                              onChange={(e) => {
                                setFormData(prev => ({
                                  ...prev,
                                  family_details: {
                                    ...prev.family_details,
                                    father_name: e.target.value
                                  }
                                }));
                              }}
                              className="border border-gray-300 px-2 py-1 rounded w-full"
                              placeholder="Enter father's name"
                            />
                          ) : (
                            currentData?.family_details?.father_name || "Not Added"
                          )}
                        </dd>
                      </div>

                      {/* Father's Mobile */}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Father's Mobile</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {editMode ? (
                            <input
                              type="tel"
                              value={formData?.family_details?.father_mobile || ""}
                              onChange={(e) => {
                                setFormData(prev => ({
                                  ...prev,
                                  family_details: {
                                    ...prev.family_details,
                                    father_mobile: e.target.value
                                  }
                                }));
                              }}
                              className="border border-gray-300 px-2 py-1 rounded w-full"
                              placeholder="Enter father's mobile"
                            />
                          ) : (
                            currentData?.family_details?.father_mobile || "Not Added"
                          )}
                        </dd>
                      </div>

                      {/* Mother's Name */}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Mother's Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {editMode ? (
                            <input
                              type="text"
                              value={formData?.family_details?.mother_name || ""}
                              onChange={(e) => {
                                setFormData(prev => ({
                                  ...prev,
                                  family_details: {
                                    ...prev.family_details,
                                    mother_name: e.target.value
                                  }
                                }));
                              }}
                              className="border border-gray-300 px-2 py-1 rounded w-full"
                              placeholder="Enter mother's name"
                            />
                          ) : (
                            currentData?.family_details?.mother_name || "Not Added"
                          )}
                        </dd>
                      </div>

                      {/* Mother's Mobile */}
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Mother's Mobile</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {editMode ? (
                            <input
                              type="tel"
                              value={formData?.family_details?.mother_mobile || ""}
                              onChange={(e) => {
                                setFormData(prev => ({
                                  ...prev,
                                  family_details: {
                                    ...prev.family_details,
                                    mother_mobile: e.target.value
                                  }
                                }));
                              }}
                              className="border border-gray-300 px-2 py-1 rounded w-full"
                              placeholder="Enter mother's mobile"
                            />
                          ) : (
                            currentData?.family_details?.mother_mobile || "Not Added"
                          )}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spouse Details */}
              <div className="px-4 py-3">
                <h3 className="text-lg font-semibold mb-4">Spouse Information</h3>
                <div className="space-y-4">
                  {(currentData?.biographical_details?.is_married === "Married" || editMode) && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Spouse Name */}
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Spouse Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {editMode ? (
                                <div>
                                  <input
                                    type="text"
                                    value={formData?.family_details?.spouse_name || ""}
                                    onChange={(e) => {
                                      setFormData(prev => ({
                                        ...prev,
                                        family_details: {
                                          ...prev.family_details,
                                          spouse_name: e.target.value
                                        }
                                      }));
                                    
                                      setSpouseErrors(prev => ({...prev, spouse_name: null}));
                                    }}
                                    className={`border ${spouseErrors.spouse_name ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                    placeholder="Enter spouse name"
                                  />
                                  {spouseErrors.spouse_name && (
                                    <p className="text-red-500 text-xs mt-1">{spouseErrors.spouse_name}</p>
                                  )}
                                </div>
                              ) : (
                                currentData?.family_details?.spouse_name || "Not Added"
                              )}
                            </dd>
                          </div>

                          {/* Spouse Mobile */}
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Spouse Mobile</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {editMode ? (
                                <input
                                  type="tel"
                                  value={formData?.family_details?.spouse_mobile || ""}
                                  onChange={(e) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      family_details: {
                                        ...prev.family_details,
                                        spouse_mobile: e.target.value
                                      }
                                    }));
                                  }}
                                  className="border border-gray-300 px-2 py-1 rounded w-full"
                                  placeholder="Enter spouse mobile"
                                />
                              ) : (
                                currentData?.family_details?.spouse_mobile || "Not Added"
                              )}
                            </dd>
                          </div>

                          {/* Spouse Gotra */}
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Spouse Gotra</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {editMode ? (
                                <select
                                  value={formData?.family_details?.spouse_gotra || ""}
                                  onChange={(e) => {
                                    const newGotra = e.target.value;
                                    setFormData(prev => ({
                                      ...prev,
                                      family_details: {
                                        ...prev.family_details,
                                        spouse_gotra: newGotra,
                                        // Reset Aakna when Gotra changes
                                        spouse_aakna: ""
                                      }
                                    }));
                                  }}
                                  className="border border-gray-300 px-2 py-1 rounded w-full"
                                >
                                  <option value="">Select Gotra</option>
                                  {GOTRA_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                currentData?.family_details?.spouse_gotra || "Not Added"
                              )}
                            </dd>
                          </div>

                          {/* Spouse Aakna */}
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Spouse Aakna</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {editMode ? (
                                <select
                                  value={formData?.family_details?.spouse_aakna || ""}
                                  onChange={(e) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      family_details: {
                                        ...prev.family_details,
                                        spouse_aakna: e.target.value
                                      }
                                    }));
                                  }}
                                  className="border border-gray-300 px-2 py-1 rounded w-full"
                                  disabled={!formData?.family_details?.spouse_gotra}
                                >
                                  <option value="">Select Aakna</option>
                                  {(formData?.family_details?.spouse_gotra 
                                    ? (GOTRA_AAKNA_MAP[formData.family_details.spouse_gotra] || AAKNA_OPTIONS)
                                    : AAKNA_OPTIONS
                                  ).map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                currentData?.family_details?.spouse_aakna || "Not Added"
                              )}
                            </dd>
                            {editMode && !formData?.family_details?.spouse_gotra && (
                              <p className="text-gray-500 text-xs mt-1">
                                Please select spouse's Gotra first
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* {currentData?.biographical_details?.is_married === "Married" && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Marriage Type</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {editMode ? (
                                <select
                                  value={formData?.biographical_details?.marriage_to_another_caste || ""}
                                  onChange={(e) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      biographical_details: {
                                        ...prev.biographical_details,
                                        marriage_to_another_caste: e.target.value
                                      }
                                    }));
                                  }}
                                  className="border border-gray-300 px-2 py-1 rounded w-full"
                                >
                                  <option value="">Select Marriage Type</option>
                                  <option value="Same Caste Marriage">Same Caste Marriage</option>
                                  <option value="Married to Another Caste">Married to Another Caste</option>
                                </select>
                              ) : (
                                currentData?.biographical_details?.marriage_to_another_caste || "Not Specified"
                              )}
                            </dd>
                          </div>
                        </div>
                      )} */}
                    </>
                  )}
                  {!currentData?.biographical_details?.is_married && !editMode && (
                    <div className="text-sm text-gray-500">
                      Spouse information will be available after marriage status is updated
                    </div>
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
                          <dt className="text-sm font-medium text-gray-500">Name <span className="text-red-500">*</span></dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <div>
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
                                    // Clear error when user starts typing
                                    const newErrors = [...childrenErrors];
                                    newErrors[index] = {...newErrors[index], name: null};
                                    setChildrenErrors(newErrors);
                                  }}
                                  className={`border ${childrenErrors[index]?.name ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                  placeholder="Enter child name"
                                />
                                {childrenErrors[index]?.name && (
                                  <p className="text-red-500 text-xs mt-1">{childrenErrors[index].name}</p>
                                )}
                              </div>
                            ) : (
                              child.child_name || "N/A"
                            )}
                          </dd>
                        </div>

                        {/* Gender */}
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Gender <span className="text-red-500">*</span></dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <div>
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
                                   
                                    const newErrors = [...childrenErrors];
                                    newErrors[index] = {...newErrors[index], gender: null};
                                    setChildrenErrors(newErrors);
                                  }}
                                  className={`border ${childrenErrors[index]?.gender ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                                {childrenErrors[index]?.gender && (
                                  <p className="text-red-500 text-xs mt-1">{childrenErrors[index].gender}</p>
                                )}
                              </div>
                            ) : (
                              child.gender || "N/A"
                            )}
                          </dd>
                        </div>

                        {/* Phone Number */}
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone Number (Optional)</dt>
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

                      {/* Delete */}
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

                {/* Add Child */}
                {editMode && (
                  <button
                    onClick={() => {
                      const newChild = { child_name: "", gender: "", phone_number: "" };
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
                          <dt className="text-sm font-medium text-gray-500">Name <span className="text-red-500">*</span></dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <div>
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
                                   
                                    const newErrors = [...siblingErrors];
                                    newErrors[index] = {...newErrors[index], name: null};
                                    setSiblingErrors(newErrors);
                                  }}
                                  className={`border ${siblingErrors[index]?.name ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                  placeholder="Enter sibling name"
                                />
                                {siblingErrors[index]?.name && (
                                  <p className="text-red-500 text-xs mt-1">{siblingErrors[index].name}</p>
                                )}
                              </div>
                            ) : (
                              sibling.sibling_name || "N/A"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Gender <span className="text-red-500">*</span></dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <div>
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
                                    // Clear error when user selects
                                    const newErrors = [...siblingErrors];
                                    newErrors[index] = {...newErrors[index], gender: null};
                                    setSiblingErrors(newErrors);
                                  }}
                                  className={`border ${siblingErrors[index]?.gender ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                                {siblingErrors[index]?.gender && (
                                  <p className="text-red-500 text-xs mt-1">{siblingErrors[index].gender}</p>
                                )}
                              </div>
                            ) : (
                              sibling.gender || "N/A"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Age <span className="text-red-500">*</span></dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <div>
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
                                    // Clear error when user types
                                    const newErrors = [...siblingErrors];
                                    newErrors[index] = {...newErrors[index], age: null};
                                    setSiblingErrors(newErrors);
                                  }}
                                  className={`border ${siblingErrors[index]?.age ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                  placeholder="Enter age"
                                  min="0"
                                  max="100"
                                />
                                {siblingErrors[index]?.age && (
                                  <p className="text-red-500 text-xs mt-1">{siblingErrors[index].age}</p>
                                )}
                              </div>
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
                              <div>
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
                                    // Clear error when user selects
                                    const newErrors = [...siblingErrors];
                                    newErrors[index] = {...newErrors[index], marital_status: null};
                                    setSiblingErrors(newErrors);
                                  }}
                                  className={`border ${siblingErrors[index]?.marital_status ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                >
                                  <option value="">Select Marital Status</option>
                                  <option value="Married">Married</option>
                                  <option value="Unmarried">Unmarried</option>
                                </select>
                                {siblingErrors[index]?.marital_status && (
                                  <p className="text-red-500 text-xs mt-1">{siblingErrors[index].marital_status}</p>
                                )}
                              </div>
                            ) : (
                              sibling.marital_status || "N/A"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Sibling Relation</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {editMode ? (
                              <div>
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
                                    // Clear error when user selects
                                    const newErrors = [...siblingErrors];
                                    newErrors[index] = {...newErrors[index], sibling_relation: null};
                                    setSiblingErrors(newErrors);
                                  }}
                                  className={`border ${siblingErrors[index]?.sibling_relation ? 'border-red-500' : 'border-gray-300'} px-2 py-1 rounded w-full`}
                                >
                                  <option value="">Select Relation</option>
                                  <option value="Brother भाई">Brother भाई</option>
                                  <option value="Sister बहन">Sister बहन</option>
                                </select>
                                {siblingErrors[index]?.sibling_relation && (
                                  <p className="text-red-500 text-xs mt-1">{siblingErrors[index].sibling_relation}</p>
                                )}
                              </div>
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
            Object.entries(currentData[sectionKey] || {})
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

  const handleCancel = () => {
   
    const resetData = {
      ...originalData,
      child_name: [...(originalData?.child_name || [])],
      family_details: {
        ...(originalData?.family_details || {}),
        siblingDetails: [...(originalData?.family_details?.siblingDetails || [])]
      }
    };
    
    setFormData(resetData);
    setEditMode(false);
    setSpouseErrors({});
    setChildrenErrors([]);
    setSiblingErrors([]);
  };

  
  const handleEditClick = () => {
    // Make a deep copy of the current data
    const backupData = {
      ...formData,
      child_name: [...(formData?.child_name || [])],
      family_details: {
        ...(formData?.family_details || {}),
        siblingDetails: [...(formData?.family_details?.siblingDetails || [])]
      },
      previous_marriage_info: formData?.previous_marriage_info ? {
        ...formData.previous_marriage_info,
        children: [...(formData.previous_marriage_info.children || [])]
      } : null
    };
    setOriginalData(backupData);
    setEditMode(true);
  };

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
    child_name: [],
    your_suggestions: {},
    gahoi_code: "",
    documentId: "",
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
  };

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
                  onClick={handleCancel}
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
              activeSection !== 'regional' && activeSection !== 'work' && 
             
              !(activeSection === 'previous_marriage' && 
                (formData?.biographical_details?.is_married === "Married" || 
                 formData?.biographical_details?.is_married === "Unmarried")) && (
                <button
                  onClick={handleEditClick}
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
