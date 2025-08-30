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
  const [siblingError, setSiblingError] = useState('');
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
          sibling_spouse_mobile: attributes.sibling_spouse_mobile,
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
      // Store spouse in dedicated sibling_spouse field
      await createOrUpdateUserFamilyAdditions({
        sibling_spouse_name: spouseData.name,
        sibling_spouse_mobile: spouseData.mobile || ''
      });
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
    } catch (error) {
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
          <p className="text-gray-600 text-lg">Profile not found or you don't have permission to view this profile.</p>
        </div>
      </div>
    );
  }

  const p = profile.personal_information || {};
  const f = profile.family_details || {};
  const mainPerson = getMainProfilePerson();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {p.full_name || 'Family Profile'}
              </h1>
              {mainPerson && (
                <p className="text-sm text-gray-600">
                  Viewing as: <span className="font-medium">{mainPerson.name}</span> ({mainPerson.role})
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Document ID</p>
              <p className="text-sm font-mono text-gray-700">{documentId}</p>
            </div>
          </div>
        </div>

        {/* Family Details Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Family Details</h2>
          </div>

          <div className="space-y-6">
            {/* Add Father Form */}
            {showAddFatherForm && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-blue-800 mb-3">Add Father Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Father Name</label>
                    <input
                      type="text"
                      value={fatherFormData.name}
                      onChange={(e) => {
                        setFatherFormData({...fatherFormData, name: e.target.value});
                        if (fatherError) setFatherError('');
                      }}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                        fatherError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter father mobile (optional)"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={async () => {
                      if (fatherFormData.name.trim()) {
                        setFatherError(''); 
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
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
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
                        if (motherError) setMotherError('');
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
              let canEditSpouse = false;
              let spouseLabel = "Spouse";

              if (currentUserRole === 'father') {
                // Viewing child's profile - show the mother (father's spouse)
                spouseName = f.mother_name;
                spouseMobile = f.mother_mobile;
                spouseLabel = "Mother";
              } else if (currentUserRole === 'mother') {
                // Viewing child's profile - show the father (mother's spouse)
                spouseName = f.father_name;
                spouseMobile = f.father_mobile;
                spouseLabel = "Father";
              } else if (currentUserRole === 'sibling') {
                // Sibling spouse is ONLY visible to the sibling who added
                // Check if current user has added spouse information for themselves
                spouseName = userFamilyAdditions?.sibling_spouse_name;
                spouseMobile = userFamilyAdditions?.sibling_spouse_mobile;
                canAddSpouse = true;
                canEditSpouse = true;
                showAddSpouseButton = !spouseName; // Show button only if no spouse added yet
                spouseLabel = "My Spouse";
              } else if (currentUserRole === 'main') {
                // Viewing own profile - show own spouse 
                spouseName = f.spouse_name;
                spouseMobile = f.spouse_mobile;
                canAddSpouse = !spouseName; 
                canEditSpouse = !!spouseName; 
                showAddSpouseButton = !spouseName;
                spouseLabel = "Spouse";
              } else {
                // For other roles (child, etc.), show main profile's spouse info
                spouseName = f.spouse_name;
                spouseMobile = f.spouse_mobile;
                spouseLabel = "Spouse";
              }
              
              
              if (!spouseName && !spouseMobile && !canAddSpouse) return null;
                
              return (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {spouseLabel}
                    </h3>
                    {showAddSpouseButton && (
                      <button
                        onClick={() => setShowAddSpouseForm(!showAddSpouseForm)}
                        className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors duration-200 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Spouse
                      </button>
                    )}
                  </div>
                  
                  {/* Spouse Information */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{spouseLabel} Name</label>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {spouseName ? addYouBadgeInFamilyDetails(spouseName, spouseMobile) : (
                            <span className="text-gray-400 italic">Not Added</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile Number</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {spouseMobile || <span className="text-gray-400 italic">Not Added</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {spouseName && canEditSpouse && (
                          <>
                            <button
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="Edit Spouse"
                              onClick={() => {
                                setSpouseFormData({ name: spouseName || '', mobile: spouseMobile || '' });
                                setShowAddSpouseForm(true);
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Remove Spouse"
                              onClick={async () => {
                                if (confirm('Are you sure you want to remove spouse information?')) {
                                  // Remove spouse by clearing the dedicated spouse fields
                                  await createOrUpdateUserFamilyAdditions({
                                    sibling_spouse_name: '',
                                    sibling_spouse_mobile: ''
                                  });
                                  const refreshed = await getUserFamilyAdditions();
                                  setUserFamilyAdditions(refreshed);
                                }
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Add/Edit Spouse Form */}
            {showAddSpouseForm && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-purple-800">
                    {spouseFormData.name ? 'Edit Spouse Details' : 'Add Spouse Details'}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={spouseFormData.name}
                      onChange={(e) => {
                        setSpouseFormData({...spouseFormData, name: e.target.value});
                        if (spouseError) setSpouseError('');
                      }}
                      className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
                        spouseError 
                          ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      }`}
                      placeholder="Enter spouse full name"
                    />
                    {spouseError && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {spouseError}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={spouseFormData.mobile}
                      onChange={(e) => setSpouseFormData({...spouseFormData, mobile: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      placeholder="Enter mobile number (optional)"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
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
                    className="px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {spouseFormData.name ? 'Update Spouse' : 'Save Spouse'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddSpouseForm(false);
                      setSpouseFormData({ name: '', mobile: '' });
                      setSpouseError('');
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
          } else if (currentUserRole === 'main' || currentUserRole === 'sibling') {
            // Show children from profile and user additions
            const children = [];
            if (profile.child_name && profile.child_name.length > 0) {
              children.push(...profile.child_name);
            }
            if (userFamilyAdditions?.added_children && userFamilyAdditions.added_children.length > 0) {
              children.push(...userFamilyAdditions.added_children);
            }
            childrenToShow = children;
            canAddChildren = true;
          }

          if (childrenToShow.length === 0 && !canAddChildren) return null;

          return (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Children</h2>
                {canAddChildren && (
                  <button
                    onClick={() => setShowAddChildForm(!showAddChildForm)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Child
                  </button>
                )}
              </div>

              {/* Add Child Form */}
              {showAddChildForm && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-green-800 mb-3">Add Child Details</h3>
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
                          childError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter child mobile (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={childFormData.gender}
                        onChange={(e) => setChildFormData({...childFormData, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            phone_number: childFormData.mobile.trim() || '',
                            gender: childFormData.gender
                          });
                          setChildFormData({ name: '', mobile: '', gender: 'Male' });
                          setShowAddChildForm(false);
                        } else {
                          setChildError('Please enter child name');
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
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

              {childrenToShow.length > 0 && (
                <>
                  <div className="grid grid-cols-4 gap-4 py-2 border-b font-semibold text-xs text-gray-500 uppercase">
                    <div>Name</div>
                    <div>Mobile Number</div>
                    <div>Gender</div>
                    <div>Actions</div>
                  </div>
                  {childrenToShow.map((child, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 py-2 border-b items-center">
                      <div>
                        {editingChildIndex === index ? (
                          <input
                            type="text"
                            value={editingChildData.child_name}
                            onChange={e => setEditingChildData({ ...editingChildData, child_name: e.target.value })}
                            className="px-2 py-1 border rounded w-full text-sm"
                            placeholder="Child Name"
                          />
                        ) : (
                          <span className="text-sm">{addYouBadgeInFamilyDetails(child.child_name, child.phone_number)}</span>
                        )}
                      </div>
                      <div>
                        {editingChildIndex === index ? (
                          <input
                            type="tel"
                            value={editingChildData.phone_number}
                            onChange={e => setEditingChildData({ ...editingChildData, phone_number: e.target.value })}
                            className="px-2 py-1 border rounded w-full text-sm"
                            placeholder="Child Mobile"
                          />
                        ) : (
                          <span className="text-sm">{child.phone_number || 'Not Added'}</span>
                        )}
                      </div>
                      <div>
                        {editingChildIndex === index ? (
                          <select
                            value={editingChildData.gender}
                            onChange={e => setEditingChildData({ ...editingChildData, gender: e.target.value })}
                            className="px-2 py-1 border rounded w-full text-sm"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        ) : (
                          <span className="text-sm">{child.gender || 'Male'}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {editingChildIndex === index ? (
                          <>
                            <button
                              className="px-2 py-1 bg-green-600 text-white rounded mr-1 text-sm"
                              onClick={saveEditChild}
                            >Save</button>
                            <button
                              className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                              onClick={cancelEditChild}
                            >Cancel</button>
                          </>
                        ) : (
                          <>
                            <button
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Edit"
                              onClick={() => startEditChild(index)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Delete"
                              onClick={() => deleteChild(index)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {childrenToShow.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No children added yet</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Siblings Section */}
        {(() => {
          let siblingsToShow = [];
          let canAddSiblings = false;

          // Combine original siblings and user-added siblings
          const originalSiblings = f.siblingDetails || [];
          const addedSiblings = userFamilyAdditions?.added_siblings || [];
          
          siblingsToShow = [...originalSiblings, ...addedSiblings];
          canAddSiblings = true; // Most users can add siblings

          if (siblingsToShow.length === 0 && !canAddSiblings) return null;

          return (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Siblings</h2>
                {canAddSiblings && (
                  <button
                    onClick={() => setShowAddSiblingForm(!showAddSiblingForm)}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Sibling
                  </button>
                )}
              </div>

              {/* Add Sibling Form */}
              {showAddSiblingForm && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-indigo-800 mb-3">Add Sibling Details</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sibling Name</label>
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
                          siblingFormErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                        }`}
                        placeholder="Enter sibling name"
                      />
                      {siblingFormErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{siblingFormErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Mobile (Optional)</label>
                      <input
                        type="tel"
                        value={siblingFormData.mobile}
                        onChange={(e) => setSiblingFormData({...siblingFormData, mobile: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter mobile (optional)"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={siblingFormData.gender}
                        onChange={(e) => setSiblingFormData({...siblingFormData, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Brother भाई">Brother भाई</option>
                        <option value="Sister बहन">Sister बहन</option>
                        <option value="Elder Brother बड़ा भाई">Elder Brother बड़ा भाई</option>
                        <option value="Elder Sister बड़ी बहन">Elder Sister बड़ी बहन</option>
                        <option value="Younger Brother छोटा भाई">Younger Brother छोटा भाई</option>
                        <option value="Younger Sister छोटी बहन">Younger Sister छोटी बहन</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={siblingFormData.age}
                        onChange={(e) => {
                          setSiblingFormData({...siblingFormData, age: e.target.value});
                          if (siblingFormErrors.age) {
                            setSiblingFormErrors({...siblingFormErrors, age: ''});
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          siblingFormErrors.age ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                        }`}
                        placeholder="Age"
                      />
                      {siblingFormErrors.age && (
                        <p className="text-red-500 text-xs mt-1">{siblingFormErrors.age}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Marital Status</label>
                      <select
                        value={siblingFormData.marital_status}
                        onChange={(e) => {
                          setSiblingFormData({...siblingFormData, marital_status: e.target.value});
                          if (siblingFormErrors.marital_status) {
                            setSiblingFormErrors({...siblingFormErrors, marital_status: ''});
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                          siblingFormErrors.marital_status ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                        }`}
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                      {siblingFormErrors.marital_status && (
                        <p className="text-red-500 text-xs mt-1">{siblingFormErrors.marital_status}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const errors = validateSiblingForm(siblingFormData);
                        const hasErrors = Object.values(errors).some(error => error !== '');
                        
                        if (hasErrors) {
                          setSiblingFormErrors(errors);
                          return;
                        }

                        setSiblingFormErrors({ name: '', age: '', marital_status: '' });
                        
                        await addSibling({
                          sibling_name: siblingFormData.name,
                          phone_number: siblingFormData.mobile.trim() || '',
                          gender: siblingFormData.gender,
                          sibling_relation: siblingFormData.relation,
                          age: siblingFormData.age,
                          marital_status: siblingFormData.marital_status
                        });
                        setSiblingFormData({ name: '', mobile: '', gender: 'Male', relation: 'Brother भाई', age: '', marital_status: '' });
                        setShowAddSiblingForm(false);
                      }}
                      disabled={isSavingSibling}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSavingSibling ? 'Saving...' : 'Save Sibling'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSiblingForm(false);
                        setSiblingFormData({ name: '', mobile: '', gender: 'Male', relation: 'Brother भाई', age: '', marital_status: '' });
                        setSiblingFormErrors({ name: '', age: '', marital_status: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {siblingsToShow.length > 0 && (
                <>
                  <div className="grid grid-cols-6 gap-4 py-2 border-b font-semibold text-xs text-gray-500 uppercase">
                    <div>Name</div>
                    <div>Mobile</div>
                    <div>Gender</div>
                    <div>Relation</div>
                    <div>Age</div>
                    <div>Actions</div>
                  </div>
                  {siblingsToShow.map((sibling, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 py-2 border-b items-center">
                      <div>
                        {editingSiblingIndex === index ? (
                          <input
                            type="text"
                            value={editingSiblingData.sibling_name}
                            onChange={e => {
                              setEditingSiblingData({ ...editingSiblingData, sibling_name: e.target.value });
                              if (editSiblingErrors.sibling_name) {
                                setEditSiblingErrors({...editSiblingErrors, sibling_name: ''});
                              }
                            }}
                            className={`px-2 py-1 border rounded w-full text-sm ${
                              editSiblingErrors.sibling_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Sibling Name"
                          />
                        ) : (
                          <span className="text-sm">{addYouBadgeInFamilyDetails(sibling.sibling_name, sibling.phone_number)}</span>
                        )}
                        {editingSiblingIndex === index && editSiblingErrors.sibling_name && (
                          <p className="text-red-500 text-xs mt-1">{editSiblingErrors.sibling_name}</p>
                        )}
                      </div>
                      <div>
                        {editingSiblingIndex === index ? (
                          <input
                            type="tel"
                            value={editingSiblingData.phone_number}
                            onChange={e => setEditingSiblingData({ ...editingSiblingData, phone_number: e.target.value })}
                            className="px-2 py-1 border rounded w-full text-sm"
                            placeholder="Mobile"
                          />
                        ) : (
                          <span className="text-sm">{sibling.phone_number || 'Not Added'}</span>
                        )}
                      </div>
                      <div>
                        {editingSiblingIndex === index ? (
                          <select
                            value={editingSiblingData.gender}
                            onChange={e => setEditingSiblingData({ ...editingSiblingData, gender: e.target.value })}
                            className="px-2 py-1 border rounded w-full text-sm"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        ) : (
                          <span className="text-sm">{sibling.gender || 'Male'}</span>
                        )}
                      </div>
                      <div>
                        {editingSiblingIndex === index ? (
                          <select
                            value={editingSiblingData.sibling_relation}
                            onChange={e => setEditingSiblingData({ ...editingSiblingData, sibling_relation: e.target.value })}
                            className="px-2 py-1 border rounded w-full text-sm"
                          >
                            <option value="Brother भाई">Brother भाई</option>
                            <option value="Sister बहन">Sister बहन</option>
                            <option value="Elder Brother बड़ा भाई">Elder Brother बड़ा भाई</option>
                            <option value="Elder Sister बड़ी बहन">Elder Sister बड़ी बहन</option>
                            <option value="Younger Brother छोटा भाई">Younger Brother छोटा भाई</option>
                            <option value="Younger Sister छोटी बहन">Younger Sister छोटी बहन</option>
                          </select>
                        ) : (
                          <span className="text-sm">{sibling.sibling_relation || 'Brother भाई'}</span>
                        )}
                      </div>
                      <div>
                        {editingSiblingIndex === index ? (
                          <input
                            type="number"
                            value={editingSiblingData.age}
                            onChange={e => {
                              setEditingSiblingData({ ...editingSiblingData, age: e.target.value });
                              if (editSiblingErrors.age) {
                                setEditSiblingErrors({...editSiblingErrors, age: ''});
                              }
                            }}
                            className={`px-2 py-1 border rounded w-full text-sm ${
                              editSiblingErrors.age ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Age"
                          />
                        ) : (
                          <span className="text-sm">{sibling.age || 'Not specified'}</span>
                        )}
                        {editingSiblingIndex === index && editSiblingErrors.age && (
                          <p className="text-red-500 text-xs mt-1">{editSiblingErrors.age}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {editingSiblingIndex === index ? (
                          <>
                            <button
                              className="px-2 py-1 bg-green-600 text-white rounded mr-1 text-sm"
                              onClick={saveEditSibling}
                            >Save</button>
                            <button
                              className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                              onClick={cancelEditSibling}
                            >Cancel</button>
                          </>
                        ) : (
                          <>
                            <button
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Edit"
                              onClick={() => startEditSibling(index)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Delete"
                              onClick={() => deleteSibling(index)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {siblingsToShow.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No siblings added yet</p>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}