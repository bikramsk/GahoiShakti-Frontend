import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

// const baseUrl = "https://admin.gahoishakti.in";

const baseUrl = import.meta.env.MODE === 'production'
  ? 'https://admin.gahoishakti.in'
  : 'http://localhost:1340';


const apiToken = import.meta.env.VITE_STRAPI_API_TOKEN || import.meta.env.VITE_API_TOKEN;
const authHeader = apiToken ? { Authorization: `Bearer ${apiToken}` } : {};

export default function FamilyProfilePage() {
  const { documentId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserMobile, setCurrentUserMobile] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [userFamilyAdditions, setUserFamilyAdditions] = useState(null);
  const [showAddFatherForm, setShowAddFatherForm] = useState(false);
  const [showAddMotherForm, setShowAddMotherForm] = useState(false);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [showAddSiblingForm, setShowAddSiblingForm] = useState(false);
  const [showAddSpouseForm, setShowAddSpouseForm] = useState(false);
  const [fatherFormData, setFatherFormData] = useState({ name: '', mobile: '' });
  const [motherFormData, setMotherFormData] = useState({ name: '', mobile: '' });
  const [childFormData, setChildFormData] = useState({ name: '', mobile: '', gender: 'Male' });
  const [siblingFormData, setSiblingFormData] = useState({ name: '', mobile: '', gender: 'Male', relation: 'Brother भाई', age: '', marital_status: '' });
  const [spouseFormData, setSpouseFormData] = useState({ name: '', mobile: '' });
  const [editingSiblingIndex, setEditingSiblingIndex] = useState(null);
  const [editingSiblingData, setEditingSiblingData] = useState({
    sibling_name: '',
    phone_number: '',
    gender: 'Male',
    sibling_relation: 'Brother भाई',
    age: '',
    marital_status: ''
  });

  const [isSavingSibling, setIsSavingSibling] = useState(false);

  const [fatherError, setFatherError] = useState('');
  const [motherError, setMotherError] = useState('');
  const [childError, setChildError] = useState('');

  const [spouseError, setSpouseError] = useState('');
  const [siblingFormErrors, setSiblingFormErrors] = useState({
    name: '',
    age: '',
    marital_status: ''
  });
  const [editSiblingErrors, setEditSiblingErrors] = useState({
    sibling_name: '',
    age: '',
    marital_status: ''
  });

  const [editingFather, setEditingFather] = useState(false);
  const [editFatherData, setEditFatherData] = useState({ name: '', mobile: '' });
  const [editingMother, setEditingMother] = useState(false);
  const [editMotherData, setEditMotherData] = useState({ name: '', mobile: '' });

  // State for editing children
  const [editingChildIndex, setEditingChildIndex] = useState(null);
  const [editingChildData, setEditingChildData] = useState({
    child_name: '',
    phone_number: '',
    gender: 'Male'
  });

 
  const getUserFamilyAdditions = useCallback(async (mobileOverride) => {
    const effectiveMobile = mobileOverride || currentUserMobile;
    if (!effectiveMobile || !documentId) return null;

    try {
   
      const response = await fetch(
        `${baseUrl}/api/user-family-additions?filters[user_mobile][$eq]=${effectiveMobile}&filters[viewed_profile_document_id][$eq]=${documentId}&populate=*`,
        { headers: { ...authHeader } }
      );
      const data = await response.json();



      if (data.data && data.data.length > 0) {
        const record = data.data[0];

        
        const attributes = record.attributes || record;


        
        let addedSiblings = [];
        if (attributes.added_siblings) {
          if (typeof attributes.added_siblings === 'string') {
            try {
              addedSiblings = JSON.parse(attributes.added_siblings);
            } catch {
              addedSiblings = [];
            }
          } else if (Array.isArray(attributes.added_siblings)) {
            addedSiblings = attributes.added_siblings;
          } else if (typeof attributes.added_siblings === 'object') {
           
            addedSiblings = [];
          } else {
            addedSiblings = [];
          }
        }

        
        if (!attributes.added_siblings) {
          const localStorageKey = `family_siblings_${effectiveMobile}_${documentId}`;
          const localStorageSiblings = localStorage.getItem(localStorageKey);
          if (localStorageSiblings) {
            try {
              const parsedSiblings = JSON.parse(localStorageSiblings);
              addedSiblings = parsedSiblings;
            } catch {
              // Failed to parse localStorage siblings
            }
          }
        }

        const result = {
          id: record.id,
          documentId: record.documentId || attributes.documentId,
          user_mobile: attributes.user_mobile,
          viewed_profile_document_id: attributes.viewed_profile_document_id,
          added_father_name: attributes.added_father_name,
          added_father_mobile: attributes.added_father_mobile,
          added_mother_name: attributes.added_mother_name,
          added_mother_mobile: attributes.added_mother_mobile,
          added_children: attributes.added_children || [],
          added_siblings: addedSiblings,
          sibling_spouse_name: attributes.sibling_spouse_name,
          sibling_spouse_mobile: attributes.sibling_spouse_mobile
        };


        return result;
      }

      return null;
    } catch (error) {
      console.error('Error fetching user family additions:', error);
      return null;
    }
  }, [currentUserMobile, documentId]);

  const createOrUpdateUserFamilyAdditions = async (updateData) => {
    if (!currentUserMobile || !documentId) return;

    try {

   
      let existingRecord = await getUserFamilyAdditions();


      if (existingRecord) {
        
        const mergedData = {
          user_mobile: existingRecord.user_mobile,
          viewed_profile_document_id: existingRecord.viewed_profile_document_id,
          added_father_name: Object.prototype.hasOwnProperty.call(updateData, 'added_father_name') ? (updateData.added_father_name === '' ? null : updateData.added_father_name) : existingRecord.added_father_name,
          added_father_mobile: Object.prototype.hasOwnProperty.call(updateData, 'added_father_mobile') ? (updateData.added_father_mobile === '' ? null : updateData.added_father_mobile) : existingRecord.added_father_mobile,
          added_mother_name: Object.prototype.hasOwnProperty.call(updateData, 'added_mother_name') ? (updateData.added_mother_name === '' ? null : updateData.added_mother_name) : existingRecord.added_mother_name,
          added_mother_mobile: Object.prototype.hasOwnProperty.call(updateData, 'added_mother_mobile') ? (updateData.added_mother_mobile === '' ? null : updateData.added_mother_mobile) : existingRecord.added_mother_mobile,
          added_children: Object.prototype.hasOwnProperty.call(updateData, 'added_children') ? updateData.added_children : (existingRecord.added_children || []),
          added_siblings: Object.prototype.hasOwnProperty.call(updateData, 'added_siblings') ? updateData.added_siblings : (existingRecord.added_siblings || []),
          sibling_spouse_name: Object.prototype.hasOwnProperty.call(updateData, 'sibling_spouse_name') ? (updateData.sibling_spouse_name === '' ? null : updateData.sibling_spouse_name) : existingRecord.sibling_spouse_name,
          sibling_spouse_mobile: Object.prototype.hasOwnProperty.call(updateData, 'sibling_spouse_mobile') ? (updateData.sibling_spouse_mobile === '' ? null : updateData.sibling_spouse_mobile) : existingRecord.sibling_spouse_mobile
        };

     
        if (mergedData.added_siblings && Array.isArray(mergedData.added_siblings)) {
          mergedData.added_siblings = mergedData.added_siblings.map(sib => {
            const { id: _id, ...rest } = sib;
            return rest;
          });
        }

        
        const targetId = existingRecord.documentId || existingRecord.id;

        
        const putData = {
          data: mergedData
        };
        

        
        const response = await fetch(`${baseUrl}/api/user-family-additions/${targetId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          },
          body: JSON.stringify(putData)
        });
        
        if (!response.ok) {
          throw new Error(`PUT request failed with status: ${response.status}`);
        }
        

       
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
       
        const freshData = await getUserFamilyAdditions();
        
        if (!freshData) {
          console.warn('No fresh data returned after update, this might indicate an issue');
        }
        
        return freshData;
      } else {
        // Create new record

        
        const response = await fetch(`${baseUrl}/api/user-family-additions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          },
          body: JSON.stringify({
            data: {
              user_mobile: currentUserMobile,
              viewed_profile_document_id: documentId,
              ...updateData
            }
          })
        });
        
        if (!response.ok) {
          throw new Error(`POST request failed with status: ${response.status}`);
        }
        

        
      
        await new Promise(resolve => setTimeout(resolve, 500));
        
        
        const freshData = await getUserFamilyAdditions();
        
        if (!freshData) {
          console.warn('No fresh data returned after create, this might indicate an issue');
        }
        
        return freshData;
      }
    } catch (error) {
      console.error('Error creating/updating user family additions:', error);
      return null;
    }
  };


  const addFather = async (fatherData) => {
    try {
      await createOrUpdateUserFamilyAdditions({
        added_father_name: fatherData.name,
        added_father_mobile: fatherData.mobile
      });
      const refreshedAdditions = await getUserFamilyAdditions();
      setUserFamilyAdditions(refreshedAdditions);
    } catch (error) {
      console.error('Error adding father:', error);
    }
  };

  const addMother = async (motherData) => {
    try {
      await createOrUpdateUserFamilyAdditions({
        added_mother_name: motherData.name,
        added_mother_mobile: motherData.mobile
      });
      const refreshedAdditions = await getUserFamilyAdditions();
      setUserFamilyAdditions(refreshedAdditions);
    } catch (error) {
      console.error('Error adding mother:', error);
    }
  };

  const addChild = async (childData) => {
    try {
      const currentAdditions = userFamilyAdditions?.added_children || [];
      
      const formattedChild = {
        child_name: childData.child_name,
        gender: childData.gender,
        phone_number: childData.phone_number || ''
      };
      await createOrUpdateUserFamilyAdditions({
        added_children: [...currentAdditions, formattedChild]
      });
      const refreshedAdditions = await getUserFamilyAdditions();
      setUserFamilyAdditions(refreshedAdditions);
    } catch (error) {
      console.error('Error adding child:', error);
    }
  };

  const addSpouse = async (spouseData) => {
    try {
      // Use sibling spouse fields for all users
      const updateData = {
        sibling_spouse_name: spouseData.name,
        sibling_spouse_mobile: spouseData.mobile
      };
      
      await createOrUpdateUserFamilyAdditions(updateData);
      const refreshedAdditions = await getUserFamilyAdditions();
      setUserFamilyAdditions(refreshedAdditions);
    } catch (error) {
      console.error('Error adding spouse:', error);
    }
  };

  // Validate sibling form fields
  const validateSiblingForm = (formData) => {
    const errors = {
      name: '',
      age: '',
      marital_status: ''
    };

    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Sibling name is required';
    }

    if (!formData.age || !formData.age.trim()) {
      errors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        errors.age = 'Please enter a valid age (0-120)';
      }
    }

    if (!formData.marital_status || !formData.marital_status.trim()) {
      errors.marital_status = 'Marital status is required';
    }

    return errors;
  };

  // Validate edit sibling form fields
  const validateEditSiblingForm = (formData) => {
    const errors = {
      sibling_name: '',
      age: '',
      marital_status: ''
    };

    if (!formData.sibling_name || !formData.sibling_name.trim()) {
      errors.sibling_name = 'Sibling name is required';
    }

    if (!formData.age || !formData.age.trim()) {
      errors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        errors.age = 'Please enter a valid age (0-120)';
      }
    }

    if (!formData.marital_status || !formData.marital_status.trim()) {
      errors.marital_status = 'Marital status is required';
    }

    return errors;
  };

  const addSibling = async (siblingData) => {
    try {
      setIsSavingSibling(true);
      const currentAdditions = userFamilyAdditions?.added_siblings || [];

      const formattedSibling = {
        sibling_name: siblingData.sibling_name,
        phone_number: siblingData.phone_number || '',
        gender: siblingData.gender,
        sibling_relation: siblingData.sibling_relation,
        age: siblingData.age || '',
        marital_status: siblingData.marital_status || ''
      };

      const updateData = {
        added_siblings: [...currentAdditions, formattedSibling]
      };

      const localStorageKey = `family_siblings_${currentUserMobile}_${documentId}`;
      localStorage.setItem(localStorageKey, JSON.stringify(updateData.added_siblings));

      const result = await createOrUpdateUserFamilyAdditions(updateData);
      
      localStorage.removeItem(localStorageKey);
      
      if (result && result.added_siblings) {
        setUserFamilyAdditions(result);
      } else {
        const tempAdditions = {
          ...userFamilyAdditions,
          added_siblings: updateData.added_siblings
        };
        setUserFamilyAdditions(tempAdditions);
        
        setTimeout(async () => {
          const refreshedAdditions = await getUserFamilyAdditions();
          if (refreshedAdditions && refreshedAdditions.added_siblings) {
            setUserFamilyAdditions(refreshedAdditions);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding sibling:', error);
    } finally {
      setIsSavingSibling(false);
    }
  };

        const startEditSibling = (index) => {
        const currentSiblings = userFamilyAdditions?.added_siblings || [];
        const target = currentSiblings[index];
        if (!target) return;
        setEditingSiblingIndex(index);
        setEditingSiblingData({
          sibling_name: target.sibling_name || '',
          phone_number: target.phone_number || '',
          gender: target.gender || 'Male',
          sibling_relation: target.sibling_relation || 'Brother भाई',
          age: target.age || '',
          marital_status: target.marital_status || ''
        });
      };

        const cancelEditSibling = () => {
        setEditingSiblingIndex(null);
        setEditingSiblingData({
          sibling_name: '',
          phone_number: '',
          gender: 'Male',
          sibling_relation: 'Brother भाई',
          age: '',
          marital_status: ''
        });
        setEditSiblingErrors({
          sibling_name: '',
          age: '',
          marital_status: ''
        });
      };

  const saveEditSibling = async () => {
    if (editingSiblingIndex === null) return;
    
    try {
      // Validate the edit form
      const errors = validateEditSiblingForm(editingSiblingData);
      const hasErrors = Object.values(errors).some(error => error !== '');
      
      if (hasErrors) {
        setEditSiblingErrors(errors);
        return;
      }

      // Clear any previous errors
      setEditSiblingErrors({
        sibling_name: '',
        age: '',
        marital_status: ''
      });

      const currentSiblings = userFamilyAdditions?.added_siblings || [];
      const updatedSiblings = currentSiblings.map((sibling, idx) =>
        idx === editingSiblingIndex
          ? {
              sibling_name: editingSiblingData.sibling_name,
              phone_number: editingSiblingData.phone_number || '',
              gender: editingSiblingData.gender,
              sibling_relation: editingSiblingData.sibling_relation,
              age: editingSiblingData.age ? parseInt(editingSiblingData.age, 10) : undefined,
              marital_status: editingSiblingData.marital_status || ''
            }
          : sibling
      );

      const localStorageKey = `family_siblings_${currentUserMobile}_${documentId}`;
      localStorage.setItem(localStorageKey, JSON.stringify(updatedSiblings));

      const result = await createOrUpdateUserFamilyAdditions({ added_siblings: updatedSiblings });
      
      localStorage.removeItem(localStorageKey);
      
      if (result) {
        const refreshed = await getUserFamilyAdditions();
        setUserFamilyAdditions(refreshed || { ...(userFamilyAdditions || {}), added_siblings: updatedSiblings });
      } else {
        // Still update local state as fallback
        setUserFamilyAdditions({ ...(userFamilyAdditions || {}), added_siblings: updatedSiblings });
      }
      
      cancelEditSibling();
    } catch {
      // Show error to user but still try to update local state
      const currentSiblings = userFamilyAdditions?.added_siblings || [];
      const updatedSiblings = currentSiblings.map((sibling, idx) =>
        idx === editingSiblingIndex
          ? {
              sibling_name: editingSiblingData.sibling_name,
              phone_number: editingSiblingData.phone_number || '',
              gender: editingSiblingData.gender,
              sibling_relation: editingSiblingData.sibling_relation,
              age: editingSiblingData.age ? parseInt(editingSiblingData.age, 10) : undefined,
              marital_status: editingSiblingData.marital_status || ''
            }
          : sibling
      );
      setUserFamilyAdditions({ ...(userFamilyAdditions || {}), added_siblings: updatedSiblings });
      cancelEditSibling();
    }
  };

  const deleteSibling = async (index) => {
    const currentSiblings = userFamilyAdditions?.added_siblings || [];
    const updatedSiblings = currentSiblings.filter((_, idx) => idx !== index);

    const localStorageKey = `family_siblings_${currentUserMobile}_${documentId}`;
    localStorage.setItem(localStorageKey, JSON.stringify(updatedSiblings));

    await createOrUpdateUserFamilyAdditions({ added_siblings: updatedSiblings });
    
    // Clear localStorage after successful backend save
    localStorage.removeItem(localStorageKey);
    
    const refreshed = await getUserFamilyAdditions();
    setUserFamilyAdditions(refreshed || { ...(userFamilyAdditions || {}), added_siblings: updatedSiblings });

    if (editingSiblingIndex === index) {
      cancelEditSibling();
    } else if (editingSiblingIndex !== null && editingSiblingIndex > index) {
      setEditingSiblingIndex(editingSiblingIndex - 1);
    }
  };

  // Edit child handlers
  const startEditChild = (index) => {
    const child = (userFamilyAdditions?.added_children || [])[index];
    if (!child) return;
    setEditingChildIndex(index);
    setEditingChildData({
      child_name: child.child_name || '',
      phone_number: child.phone_number || '',
      gender: child.gender || 'Male'
    });
  };
  const cancelEditChild = () => {
    setEditingChildIndex(null);
    setEditingChildData({ child_name: '', phone_number: '', gender: 'Male' });
  };
  const saveEditChild = async () => {
    if (editingChildIndex === null) return;
    const currentChildren = userFamilyAdditions?.added_children || [];
    const updatedChildren = currentChildren.map((child, idx) =>
      idx === editingChildIndex
        ? {
            child_name: editingChildData.child_name,
            phone_number: editingChildData.phone_number,
            gender: editingChildData.gender
          }
        : child
    );
    await createOrUpdateUserFamilyAdditions({ added_children: updatedChildren });
    const refreshed = await getUserFamilyAdditions();
    setUserFamilyAdditions(refreshed || { ...(userFamilyAdditions || {}), added_children: updatedChildren });
    cancelEditChild();
  };
  const deleteChild = async (index) => {
    const currentChildren = userFamilyAdditions?.added_children || [];
    const updatedChildren = currentChildren.filter((_, idx) => idx !== index);
    await createOrUpdateUserFamilyAdditions({ added_children: updatedChildren });
    const refreshed = await getUserFamilyAdditions();
    setUserFamilyAdditions(refreshed || { ...(userFamilyAdditions || {}), added_children: updatedChildren });
    if (editingChildIndex === index) {
      cancelEditChild();
    } else if (editingChildIndex !== null && editingChildIndex > index) {
      setEditingChildIndex(editingChildIndex - 1);
    }
  };



  const determineUserRole = (profileData, userMobile) => {
    if (!profileData || !userMobile) return null;

    const p = profileData.personal_information || {};
    const f = profileData.family_details || {};
    const c = profileData.child_name || [];

   
    if (p.mobile_number === userMobile) return 'main';

    //  father
    if (f.father_mobile === userMobile) return 'father';

    // mother
    if (f.mother_mobile === userMobile) return 'mother';

    //  spouse
    if (f.spouse_mobile === userMobile) return 'spouse';

    // child
    const isChild = c.some(child => child.phone_number === userMobile);
    if (isChild) return 'child';

    //  sibling
    const siblings = f.siblingDetails || [];
    const isSibling = siblings.some(sibling => sibling.phone_number === userMobile);
    if (isSibling) return 'sibling';

    return null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
      
        let userMobile = localStorage.getItem('verifiedMobile');

        
        if (!userMobile) {
          userMobile = localStorage.getItem('mobile') ||
                      localStorage.getItem('userMobile') ||
                      localStorage.getItem('authMobile') ||
                      localStorage.getItem('loggedInMobile');
        }

    
        setCurrentUserMobile(userMobile);

        const res = await fetch(
          `${baseUrl}/api/registration-pages?filters[documentId][$eq]=${documentId}&populate[personal_information]=true&populate[family_details][populate]=siblingDetails&populate[child_name]=true&populate[biographical_details]=true&populate[work_information]=true`,
          { headers: { ...authHeader } }
        );

        const data = await res.json();
        if (data.data && data.data.length > 0) {
          const profileData = data.data[0];
          setProfile(profileData);

        
          const role = userMobile ? determineUserRole(profileData, userMobile) : null;
          setCurrentUserRole(role);

         
          if (userMobile) {
            const additions = await getUserFamilyAdditions(userMobile);
            setUserFamilyAdditions(additions);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [documentId, getUserFamilyAdditions]);

  
  useEffect(() => {
    if (currentUserMobile && documentId) {
      const refreshData = async () => {
              const additions = await getUserFamilyAdditions();
        setUserFamilyAdditions(additions);
      };
      
     
      const timer = setTimeout(refreshData, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUserMobile, documentId, getUserFamilyAdditions]);


  const getMainProfilePerson = () => {
    if (!currentUserMobile || !profile) return null;

    const p = profile.personal_information || {};
    const f = profile.family_details || {};

    

    //if father
    if (f.father_mobile === currentUserMobile && f.father_name) {
      return {
        name: f.father_name,
        mobile: f.father_mobile,
        role: 'Father'
      };
    }

    // If  mother 
    if (f.mother_mobile === currentUserMobile && f.mother_name) {
      return {
        name: f.mother_name,
        mobile: f.mother_mobile,
        role: 'Mother'
      };
    }

    // If sibling
    const sibling = f.siblingDetails?.find(s => s.phone_number === currentUserMobile);
    if (sibling) {
      return {
        name: sibling.sibling_name,
        mobile: sibling.phone_number,
        role: 'Family Member'
      };
    }

    // If user
    if (p.mobile_number === currentUserMobile) {
      return {
        name: p.full_name,
        mobile: p.mobile_number,
        role: 'Profile Owner'
      };
    }

    // fallback 
    return {
      name: 'Unknown User',
      mobile: currentUserMobile,
      role: 'Family Member'
    };
  };




  


 
  const addYouBadgeInFamilyDetails = (name, mobile) => {
    const mainProfilePerson = getMainProfilePerson();

   
    if (mobile === currentUserMobile && mainProfilePerson && mobile === mainProfilePerson.mobile) {
      return (
        <div className="flex items-center gap-2">
          <span>{name}</span>
   
        </div>
      );
    }
    return name;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading family profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">The requested family profile could not be located.</p>
        </div>
      </div>
    );
  }

  const p = profile.personal_information || {};
  const f = profile.family_details || {};

 
  const mainPerson = getMainProfilePerson();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center text-center">
            {(() => {
              const mainPerson = getMainProfilePerson();
              const displayName = mainPerson?.name || p.full_name || "Family Profile";
              const displayMobile = mainPerson?.mobile || p.mobile_number || "Not Added";

              return (
                <>
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-sm mb-3">
                    <span className="text-2xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                   
                  </div>
                  <div className="mt-1">
                    <span className="text-sm text-gray-600 flex items-center justify-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {displayMobile}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Personal Information */}
          <div className="border-b">
            <div className="px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{mainPerson?.name || "Not Added"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Mobile Number</label>
                  <p className="mt-1 text-sm text-gray-900">{mainPerson?.mobile || "Not Added"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Details */}
          <div className="border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Family Details</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddFatherForm(!showAddFatherForm)}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Father
                  </button>
                  <button
                    onClick={() => setShowAddMotherForm(!showAddMotherForm)}
                    className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Mother
                  </button>
                </div>
              </div>



              {/* Add Father Form */}
              {showAddFatherForm && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-purple-800 mb-3">Add Father Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Father Name</label>
                      <input
                        type="text"
                        value={fatherFormData.name}
                        onChange={(e) => {
                          setFatherFormData({...fatherFormData, name: e.target.value});
                          if (fatherError) setFatherError(''); // Clear error when user types
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          fatherError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                        }`}
                        placeholder="Enter father name"
                      />
                      {fatherError && (
                        <p className="text-red-500 text-xs mt-1">{fatherError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Father Mobile (Optional)</label>
                      <input
                        type="tel"
                        value={fatherFormData.mobile}
                        onChange={(e) => setFatherFormData({...fatherFormData, mobile: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter father mobile (optional)"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        if (fatherFormData.name.trim()) {
                          setFatherError(''); // Clear any existing error
                          await addFather({
                            name: fatherFormData.name,
                            mobile: fatherFormData.mobile.trim() || null
                          });
                          setFatherFormData({ name: '', mobile: '' });
                          setShowAddFatherForm(false);
                        } else {
                          setFatherError('Please enter father name');
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                    >
                      Save Father
                    </button>
                    <button
                      onClick={() => {
                        setShowAddFatherForm(false);
                        setFatherFormData({ name: '', mobile: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Add Mother Form */}
              {showAddMotherForm && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-pink-800 mb-3">Add Mother Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Mother Name</label>
                      <input
                        type="text"
                        value={motherFormData.name}
                        onChange={(e) => {
                          setMotherFormData({...motherFormData, name: e.target.value});
                          if (motherError) setMotherError(''); // Clear error when user types
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          motherError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-pink-500'
                        }`}
                        placeholder="Enter mother name"
                      />
                      {motherError && (
                        <p className="text-red-500 text-xs mt-1">{motherError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Mother Mobile (Optional)</label>
                      <input
                        type="tel"
                        value={motherFormData.mobile}
                        onChange={(e) => setMotherFormData({...motherFormData, mobile: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Enter mother mobile (optional)"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        if (motherFormData.name.trim()) {
                          setMotherError(''); 
                          await addMother({
                            name: motherFormData.name,
                            mobile: motherFormData.mobile.trim() || null
                          });
                          setMotherFormData({ name: '', mobile: '' });
                          setShowAddMotherForm(false);
                        } else {
                          setMotherError('Please enter mother name');
                        }
                      }}
                      className="px-4 py-2 bg-pink-600 text-white text-sm rounded hover:bg-pink-700"
                    >
                      Save Mother
                    </button>
                    <button
                      onClick={() => {
                        setShowAddMotherForm(false);
                        setMotherFormData({ name: '', mobile: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Family Details Header Row */}
              <div className="grid grid-cols-3 gap-4 py-2 border-b font-semibold text-xs text-gray-500 uppercase">
                <div>Father Name</div>
                <div>Mobile Number</div>
                <div>Actions</div>
              </div>
              {/* Father - Show original or user-added */}
              {(() => {
                const mainPersonName = mainPerson?.name || p.full_name;
                const spouseName = f.spouse_name;

               
                let fatherName, fatherMobile, motherName, motherMobile;

                if (currentUserRole && currentUserRole.startsWith('sibling')) {
                  
                  fatherName = f.father_name || userFamilyAdditions?.added_father_name;
                  fatherMobile = f.father_mobile || userFamilyAdditions?.added_father_mobile;
                  motherName = f.mother_name || userFamilyAdditions?.added_mother_name;
                  motherMobile = f.mother_mobile || userFamilyAdditions?.added_mother_mobile;
                } else {
                 
                  fatherName = userFamilyAdditions?.added_father_name;
                  fatherMobile = userFamilyAdditions?.added_father_mobile;
                  motherName = userFamilyAdditions?.added_mother_name;
                  motherMobile = userFamilyAdditions?.added_mother_mobile;
                }

                const showFather = fatherName && fatherName !== mainPersonName;
                const showMother = motherName && motherName !== spouseName;

                return (
                  <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-2 border-b items-center">
                    <div>
                      {editingFather ? (
                        <input
                          type="text"
                          value={editFatherData.name}
                          onChange={e => setEditFatherData({ ...editFatherData, name: e.target.value })}
                          className="px-2 py-1 border rounded w-full text-sm"
                          placeholder="Father Name"
                        />
                      ) : (
                          <span className="text-sm">{showFather ? addYouBadgeInFamilyDetails(fatherName, fatherMobile) : "Not Added"}</span>
                      )}
                    </div>
                    <div>
                      {editingFather ? (
                        <input
                          type="tel"
                          value={editFatherData.mobile}
                          onChange={e => setEditFatherData({ ...editFatherData, mobile: e.target.value })}
                          className="px-2 py-1 border rounded w-full text-sm"
                          placeholder="Father Mobile"
                        />
                      ) : (
                          <span className="text-sm">{showFather ? (fatherMobile || 'Not Added') : "Not Added"}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {editingFather ? (
                        <>
                          <button
                            className="px-2 py-1 bg-green-600 text-white rounded mr-1 text-sm"
                            onClick={async () => {
                              await addFather({ name: editFatherData.name, mobile: editFatherData.mobile });
                              const refreshed = await getUserFamilyAdditions();
                              setUserFamilyAdditions(refreshed);
                              setEditingFather(false);
                            }}
                          >Save</button>
                          <button
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                            onClick={() => setEditingFather(false)}
                          >Cancel</button>
                        </>
                      ) : (
                          <>
                            {showFather && (
                        <>
                          <button
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="Edit"
                            onClick={() => {
                                    setEditFatherData({ name: fatherName || '', mobile: userFamilyAdditions?.added_father_mobile || '' });
                              setEditingFather(true);
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Delete"
                            onClick={async () => {
                              await addFather({ name: '', mobile: '' });
                              const refreshed = await getUserFamilyAdditions();
                              setUserFamilyAdditions(refreshed);
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                              </>
                            )}
                        </>
                      )}
                    </div>
                  </div>

                    <div className="grid grid-cols-3 gap-4 py-2 border-b font-semibold text-xs text-gray-500 uppercase">
                <div>Mother Name</div>
                <div>Mobile Number</div>
                <div>Actions</div>
              </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 py-2 border-b items-center">
                    <div>
                      {editingMother ? (
                        <input
                          type="text"
                          value={editMotherData.name}
                          onChange={e => setEditMotherData({ ...editMotherData, name: e.target.value })}
                          className="px-2 py-1 border rounded w-full text-sm"
                          placeholder="Mother Name"
                        />
                      ) : (
                          <span className="text-sm">{showMother ? addYouBadgeInFamilyDetails(motherName, motherMobile) : "Not Added"}</span>
                      )}
                    </div>
                    <div>
                      {editingMother ? (
                        <input
                          type="tel"
                          value={editMotherData.mobile}
                          onChange={e => setEditMotherData({ ...editMotherData, mobile: e.target.value })}
                          className="px-2 py-1 border rounded w-full text-sm"
                          placeholder="Mother Mobile"
                        />
                      ) : (
                          <span className="text-sm">{showMother ? (motherMobile || 'Not Added') : "Not Added"}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {editingMother ? (
                        <>
                          <button
                            className="px-2 py-1 bg-green-600 text-white rounded mr-1 text-sm"
                            onClick={async () => {
                              await addMother({ name: editMotherData.name, mobile: editMotherData.mobile });
                              const refreshed = await getUserFamilyAdditions();
                              setUserFamilyAdditions(refreshed);
                              setEditingMother(false);
                            }}
                          >Save</button>
                          <button
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                            onClick={() => setEditingMother(false)}
                          >Cancel</button>
                        </>
                      ) : (
                          <>
                            {showMother && (
                        <>
                          <button
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                            title="Edit"
                            onClick={() => {
                                    setEditMotherData({ name: motherName || '', mobile: userFamilyAdditions?.added_mother_mobile || '' });
                              setEditingMother(true);
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Delete"
                            onClick={async () => {
                              await addMother({ name: '', mobile: '' });
                              const refreshed = await getUserFamilyAdditions();
                              setUserFamilyAdditions(refreshed);
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                              </>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                  </>
                );
              })()}

              {/* Spouse Section */}
              {(() => {
                let spouseName, spouseMobile;
                let canAddSpouse = false;
                let showAddSpouseButton = false;

                if (currentUserRole === 'father') {
                  // Viewing child's profile - show the mother (father's spouse)
                  spouseName = f.mother_name;
                  spouseMobile = f.mother_mobile;
                } else if (currentUserRole === 'mother') {
                  // Viewing child's profile - show the father (mother's spouse)
                  spouseName = f.father_name;
                  spouseMobile = f.father_mobile;
                } else if (currentUserRole === 'sibling') {
                  // For siblings, check if they can add spouse (if married)
                  const currentSibling = f.siblingDetails?.find(s => s.phone_number === currentUserMobile);
                  const addedSibling = userFamilyAdditions?.added_siblings?.find(s => s.phone_number === currentUserMobile);
                  
                  const siblingData = currentSibling || addedSibling;
                  if (siblingData && siblingData.marital_status === 'Married') {
                    // Check if spouse is already added in userFamilyAdditions (use sibling-specific fields)
                    spouseName = userFamilyAdditions?.sibling_spouse_name;
                    spouseMobile = userFamilyAdditions?.sibling_spouse_mobile;
                    canAddSpouse = true;
                    showAddSpouseButton = !spouseName; 
                  }
                } else {
                  // For all other users, use sibling spouse fields
                  spouseName = userFamilyAdditions?.sibling_spouse_name;
                  spouseMobile = userFamilyAdditions?.sibling_spouse_mobile;
                  canAddSpouse = true;
                  showAddSpouseButton = !spouseName;
                }
                
                // Show spouse section if spouse exists or if sibling can add spouse
                if (!spouseName && !spouseMobile && !canAddSpouse) return null;
                
                return (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-md font-medium text-gray-900">Spouse</h3>
                      {showAddSpouseButton && (
                        <button
                          onClick={() => setShowAddSpouseForm(!showAddSpouseForm)}
                          className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Add Spouse
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Spouse Name</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {addYouBadgeInFamilyDetails(spouseName || "Not Added", spouseMobile)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Mobile Number</label>
                        <p className="mt-1 text-sm text-gray-900">{spouseMobile || "Not Added"}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Add Spouse Form */}
              {showAddSpouseForm && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-purple-800 mb-3">Add Spouse Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Spouse Name</label>
                      <input
                        type="text"
                        value={spouseFormData.name}
                        onChange={(e) => {
                          setSpouseFormData({...spouseFormData, name: e.target.value});
                          if (spouseError) setSpouseError('');
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          spouseError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                        }`}
                        placeholder="Enter spouse name"
                      />
                      {spouseError && (
                        <p className="text-red-500 text-xs mt-1">{spouseError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Spouse Mobile (Optional)</label>
                      <input
                        type="tel"
                        value={spouseFormData.mobile}
                        onChange={(e) => setSpouseFormData({...spouseFormData, mobile: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter spouse mobile (optional)"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        if (spouseFormData.name.trim()) {
                          setSpouseError('');
                          await addSpouse({
                            name: spouseFormData.name,
                            mobile: spouseFormData.mobile.trim() || null
                          });
                          setSpouseFormData({ name: '', mobile: '' });
                          setShowAddSpouseForm(false);
                        } else {
                          setSpouseError('Please enter spouse name');
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                    >
                      Save Spouse
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSpouseForm(false);
                        setSpouseFormData({ name: '', mobile: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
             
            </div>
          </div>

          {/* Children Section */}
          {(() => {
           
            let childrenToShow = [];
            let canAddChildren = false;

            if (currentUserRole === 'father' || currentUserRole === 'mother') {
              const children = [];
              // Add children from profile
              if (p.full_name && p.mobile_number) {
                children.push({
                  child_name: p.full_name,
                  phone_number: p.mobile_number,
                  gender: "Male"
                });
              }
              if (f.siblingDetails && f.siblingDetails.length > 0) {
                f.siblingDetails.forEach(sibling => {
                  children.push({
                    child_name: sibling.sibling_name,
                    phone_number: sibling.phone_number,
                    gender: sibling.gender || "Male"
                  });
                });
              }
              // Add children from userFamilyAdditions
              if (userFamilyAdditions?.added_children && userFamilyAdditions.added_children.length > 0) {
                userFamilyAdditions.added_children.forEach(child => {
                  children.push({
                    child_name: child.child_name,
                    phone_number: child.phone_number,
                    gender: child.gender
                  });
                });
              }
              childrenToShow = children;
              canAddChildren = true;
            } else if (currentUserRole === 'sibling') {
              // Siblings can also add their own children
              if (userFamilyAdditions?.added_children && userFamilyAdditions.added_children.length > 0) {
                childrenToShow = userFamilyAdditions.added_children;
              }
              canAddChildren = true;
            } else {
              childrenToShow = [];
            }

            return (childrenToShow.length > 0 || canAddChildren) ? (
              <div className="border-b">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Children</h2>
                    {canAddChildren && (
                      <button
                        onClick={() => setShowAddChildForm(!showAddChildForm)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Child
                      </button>
                    )}
                  </div>

                  {/* Child Form */}
                  {showAddChildForm && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h3 className="text-sm font-medium text-blue-800 mb-3">Add Child Details</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Child Name</label>
                          <input
                            type="text"
                            value={childFormData.name}
                            onChange={(e) => {
                              setChildFormData({...childFormData, name: e.target.value});
                              if (childError) setChildError(''); 
                            }}
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                              childError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Enter child name"
                          />
                          {childError && (
                            <p className="text-red-500 text-xs mt-1">{childError}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Child Mobile (Optional)</label>
                          <input
                            type="tel"
                            value={childFormData.mobile}
                            onChange={(e) => setChildFormData({...childFormData, mobile: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter child mobile (optional)"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                          <select
                            value={childFormData.gender}
                            onChange={(e) => setChildFormData({...childFormData, gender: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={async () => {
                            if (childFormData.name.trim()) {
                              setChildError('');
                                                             await addChild({
                                 child_name: childFormData.name,
                                 phone_number: childFormData.mobile,
                                 gender: childFormData.gender
                               });
                              setChildFormData({ name: '', mobile: '', gender: 'Male' });
                              setShowAddChildForm(false);
                            } else {
                              setChildError('Please enter child name');
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Save Child
                        </button>
                        <button
                          onClick={() => {
                            setShowAddChildForm(false);
                            setChildFormData({ name: '', mobile: '', gender: 'Male' });
                          }}
                          className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-4 mb-2">
                    <div className="text-xs font-medium text-gray-500 uppercase">Name</div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Mobile Number</div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Gender</div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Actions</div>
                  </div>
                  {childrenToShow.map((child, idx) => {
                   
                    const userChildren = userFamilyAdditions?.added_children || [];
                   
                    const userChildIdx = userChildren.findIndex(
                      uc => uc.child_name === child.child_name && uc.phone_number === child.phone_number && uc.gender === child.gender
                    );
                    const isUserChild = userChildIdx !== -1;
                   
                    if (isUserChild && editingChildIndex === userChildIdx) {
                      return (
                        <div key={idx} className="grid grid-cols-4 gap-4 py-2 border-t first:border-t-0">
                          <input
                            type="text"
                            value={editingChildData.child_name}
                            onChange={e => setEditingChildData({ ...editingChildData, child_name: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Child Name"
                          />
                          <input
                            type="tel"
                            value={editingChildData.phone_number}
                            onChange={e => setEditingChildData({ ...editingChildData, phone_number: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Mobile Number"
                          />
                          <select
                            value={editingChildData.gender}
                            onChange={e => setEditingChildData({ ...editingChildData, gender: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={saveEditChild}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                              title="Save"
                            >Save</button>
                            <button
                              onClick={cancelEditChild}
                              className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                              title="Cancel"
                            >Cancel</button>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="grid grid-cols-4 gap-4 py-2 border-t first:border-t-0">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-red-700">
                              {(child.child_name || "C").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-900">
                            {addYouBadgeInFamilyDetails(child.child_name || "Not Added", child.phone_number)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-900">{child.phone_number || "Not Added"}</div>
                        <div className="text-sm text-gray-900">
                          {child.gender === "Male" ? "Male" : child.gender === "Female" ? "Female" : "N/A"}
                        </div>
                        <div className="flex items-center gap-2">
                          {isUserChild && (
                            <>
                              <button
                                onClick={() => startEditChild(userChildIdx)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteChild(userChildIdx)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null;
          })()}

          {/* Siblings Section */}
          <div className="border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Siblings</h2>
                <div className="flex gap-2">
                <button
                  onClick={() => setShowAddSiblingForm(!showAddSiblingForm)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Sibling
                </button>
                </div>
              </div>

              {/* Add Sibling Form */}
              {showAddSiblingForm && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-green-800 mb-3">Add Sibling Details</h3>
                  <div className="grid grid-cols-6 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sibling Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={siblingFormData.name}
                        onChange={(e) => {
                          setSiblingFormData({...siblingFormData, name: e.target.value});
                          if (siblingFormErrors.name) {
                            setSiblingFormErrors({...siblingFormErrors, name: ''});
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          siblingFormErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                        }`}
                        placeholder="Enter sibling name"
                      />
                      {siblingFormErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{siblingFormErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sibling Mobile (Optional)</label>
                      <input
                        type="tel"
                        value={siblingFormData.mobile}
                        onChange={(e) => setSiblingFormData({...siblingFormData, mobile: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter sibling mobile (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={siblingFormData.gender}
                        onChange={(e) => setSiblingFormData({...siblingFormData, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Relation</label>
                      <select
                        value={siblingFormData.relation}
                        onChange={(e) => setSiblingFormData({...siblingFormData, relation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Brother भाई">Brother भाई</option>
                        <option value="Sister बहन">Sister बहन</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Age <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={siblingFormData.age}
                        onChange={(e) => {
                          setSiblingFormData({...siblingFormData, age: e.target.value});
                          if (siblingFormErrors.age) {
                            setSiblingFormErrors({...siblingFormErrors, age: ''});
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          siblingFormErrors.age ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                        }`}
                        placeholder="Enter age"
                      />
                      {siblingFormErrors.age && (
                        <p className="text-red-500 text-xs mt-1">{siblingFormErrors.age}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Marital Status <span className="text-red-500">*</span></label>
                      <select
                        value={siblingFormData.marital_status}
                        onChange={(e) => {
                          setSiblingFormData({...siblingFormData, marital_status: e.target.value});
                          if (siblingFormErrors.marital_status) {
                            setSiblingFormErrors({...siblingFormErrors, marital_status: ''});
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          siblingFormErrors.marital_status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                        }`}
                      >
                        <option value="">Choose here</option>
                        <option value="Married">Married</option>
                        <option value="Unmarried">Unmarried</option>
                        <option value="Widow/Widower">Widow/Widower</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                      {siblingFormErrors.marital_status && (
                        <p className="text-red-500 text-xs mt-1">{siblingFormErrors.marital_status}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        // Validate all required fields
                        const errors = validateSiblingForm(siblingFormData);
                        const hasErrors = Object.values(errors).some(error => error !== '');
                        
                        if (hasErrors) {
                          setSiblingFormErrors(errors);
                          return;
                        }

                        // Clear any previous errors
                        setSiblingFormErrors({
                          name: '',
                          age: '',
                          marital_status: ''
                        });

                        await addSibling({
                          sibling_name: siblingFormData.name,
                          phone_number: siblingFormData.mobile,
                          gender: siblingFormData.gender,
                          sibling_relation: siblingFormData.relation,
                          age: parseInt(siblingFormData.age, 10),
                          marital_status: siblingFormData.marital_status
                        });
                        setSiblingFormData({ name: '', mobile: '', gender: 'Male', relation: 'Brother भाई', age: '', marital_status: '' });
                        setShowAddSiblingForm(false);
                      }}
                      disabled={isSavingSibling}
                      className={`px-4 py-2 text-sm rounded ${
                        isSavingSibling 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {isSavingSibling ? 'Saving...' : 'Save Sibling'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSiblingForm(false);
                        setSiblingFormData({ name: '', mobile: '', gender: 'Male', relation: 'Brother भाई', age: '', marital_status: '' });
                        setSiblingFormErrors({
                          name: '',
                          age: '',
                          marital_status: ''
                        });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {(() => {
                let siblingsToShow = [];
                
                // If current user is a sibling, show the profile owner as a sibling
                if (currentUserRole === 'sibling') {
                  // Add the profile owner as a sibling
                  if (p.full_name && p.mobile_number) {
                    siblingsToShow.push({
                      sibling_name: p.full_name,
                      phone_number: p.mobile_number,
                      gender: "Male", // Default, could be enhanced
                      sibling_relation: "Sibling",
                      age: "", // Not available from profile
                      marital_status: f.spouse_name ? "Married" : "Unmarried"
                    });
                  }
                  
                  // Add other siblings from original profile data
                  if (f.siblingDetails && f.siblingDetails.length > 0) {
                    f.siblingDetails.forEach(sibling => {
                      // Don't add the current user as their own sibling
                      if (sibling.phone_number !== currentUserMobile) {
                        siblingsToShow.push({
                          sibling_name: sibling.sibling_name,
                          phone_number: sibling.phone_number,
                          gender: sibling.gender || "Male",
                          sibling_relation: sibling.sibling_relation || "Sibling",
                          age: sibling.age || "",
                          marital_status: sibling.marital_status || "Unmarried"
                        });
                      }
                    });
                  }
                }
                
                // Add user-added siblings
                if (userFamilyAdditions?.added_siblings && userFamilyAdditions.added_siblings.length > 0) {
                  userFamilyAdditions.added_siblings.forEach(sibling => {
                    siblingsToShow.push(sibling);
                  });
                }

                // Remove duplicates based on phone number
                const uniqueSiblings = siblingsToShow.filter((sibling, index, self) => 
                  index === self.findIndex(s => s.phone_number === sibling.phone_number)
                );

                return uniqueSiblings.length > 0 ? (
                  <>
                    <div className="grid grid-cols-7 gap-4 mb-2">
                      <div className="text-xs font-medium text-gray-500 uppercase">Sibling Name</div>
                      <div className="text-xs font-medium text-gray-500 uppercase">Phone Number</div>
                      <div className="text-xs font-medium text-gray-500 uppercase">Gender</div>
                      <div className="text-xs font-medium text-gray-500 uppercase">Sibling Relation</div>
                      <div className="text-xs font-medium text-gray-500 uppercase">Age</div>
                      <div className="text-xs font-medium text-gray-500 uppercase">Marital Status</div>
                      <div className="text-xs font-medium text-gray-500 uppercase">Actions</div>
                    </div>
                    {uniqueSiblings.map((sibling, idx) => (
                      <div key={idx} className="grid grid-cols-7 gap-4 py-2 border-t first:border-t-0">
                        {editingSiblingIndex === idx ? (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-red-700">
                                  {(editingSiblingData.sibling_name || "S").charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={editingSiblingData.sibling_name}
                                onChange={(e) => {
                                  setEditingSiblingData({ ...editingSiblingData, sibling_name: e.target.value });
                                  if (editSiblingErrors.sibling_name) {
                                    setEditSiblingErrors({...editSiblingErrors, sibling_name: ''});
                                  }
                                }}
                                className={`w-full px-3 py-1 border rounded text-sm ${
                                  editSiblingErrors.sibling_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Sibling Name"
                              />
                              {editSiblingErrors.sibling_name && (
                                <p className="text-red-500 text-xs mt-1">{editSiblingErrors.sibling_name}</p>
                              )}
                            </div>
                            <input
                              type="tel"
                              value={editingSiblingData.phone_number}
                              onChange={(e) => setEditingSiblingData({ ...editingSiblingData, phone_number: e.target.value })}
                              className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Phone Number"
                            />
                            <select
                              value={editingSiblingData.gender}
                              onChange={(e) => setEditingSiblingData({ ...editingSiblingData, gender: e.target.value })}
                              className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <select
                              value={editingSiblingData.sibling_relation}
                              onChange={(e) => setEditingSiblingData({ ...editingSiblingData, sibling_relation: e.target.value })}
                              className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="Brother भाई">Brother भाई</option>
                              <option value="Sister बहन">Sister बहन</option>
                            </select>
                            <div>
                              <input
                                type="number"
                                min="0"
                                max="120"
                                value={editingSiblingData.age}
                                onChange={(e) => {
                                  setEditingSiblingData({ ...editingSiblingData, age: e.target.value });
                                  if (editSiblingErrors.age) {
                                    setEditSiblingErrors({...editSiblingErrors, age: ''});
                                  }
                                }}
                                className={`w-full px-3 py-1 border rounded text-sm ${
                                  editSiblingErrors.age ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Age"
                              />
                              {editSiblingErrors.age && (
                                <p className="text-red-500 text-xs mt-1">{editSiblingErrors.age}</p>
                              )}
                            </div>
                            <div>
                              <select
                                value={editingSiblingData.marital_status}
                                onChange={(e) => {
                                  setEditingSiblingData({ ...editingSiblingData, marital_status: e.target.value });
                                  if (editSiblingErrors.marital_status) {
                                    setEditSiblingErrors({...editSiblingErrors, marital_status: ''});
                                  }
                                }}
                                className={`w-full px-3 py-1 border rounded text-sm ${
                                  editSiblingErrors.marital_status ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Choose here</option>
                                <option value="Married">Married</option>
                                <option value="Unmarried">Unmarried</option>
                                <option value="Widow/Widower">Widow/Widower</option>
                                <option value="Divorced">Divorced</option>
                              </select>
                              {editSiblingErrors.marital_status && (
                                <p className="text-red-500 text-xs mt-1">{editSiblingErrors.marital_status}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={saveEditSibling}
                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                title="Save"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditSibling}
                                className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                title="Cancel"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => deleteSibling(idx)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-red-700">
                                  {(sibling.sibling_name || "S").charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-sm text-gray-900">
                                {addYouBadgeInFamilyDetails(sibling.sibling_name || "Not Added", sibling.phone_number)}
                              </div>
                            </div>
                            <div className="text-sm text-gray-900">{sibling.phone_number || "Not Added"}</div>
                            <div className="text-sm text-gray-900">
                              {sibling.gender === "Male" ? "Male" : sibling.gender === "Female" ? "Female" : "N/A"}
                            </div>
                            <div className="text-sm text-gray-900">{sibling.sibling_relation || "Not Added"}</div>
                            <div className="text-sm text-gray-900">{sibling.age || "Not Added"}</div>
                            <div className="text-sm text-gray-900">{sibling.marital_status || "Not Added"}</div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditSibling(idx)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteSibling(idx)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-sm text-gray-500 italic">No siblings added</div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}