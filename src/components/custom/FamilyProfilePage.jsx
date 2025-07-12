import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const baseUrl = "https://admin.gahoishakti.in";

export default function FamilyProfilePage() {
  const { documentId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {

        const res = await fetch(
  `${baseUrl}/api/registration-pages?filters[documentId][$eq]=${documentId}&populate[personal_information]=true&populate[family_details][populate]=siblingDetails&populate[child_name]=true&populate[biographical_details]=true&populate[work_information]=true`
);

        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setProfile(data.data[0]);
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
  }, [documentId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!profile) return <div className="p-4">Profile not found.</div>;

const p = profile.personal_information || {};
const f = profile.family_details || {};
const c = profile.child_name || [];


  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-center gap-3">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        <h2 className="text-3xl font-extrabold text-gray-800">Family Profile</h2>
      </div>

      {/* Personal Information */}
      <div className="bg-white border rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm">
          <div><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{p.full_name || "N/A"}</span></div>
          <div><span className="font-medium text-gray-600">Mobile:</span> <span className="text-gray-900">{p.mobile_number || "N/A"}</span></div>
        </div>
      </div>

      {/* Children */}
      {c && c.length > 0 && (
        <div className="bg-white border rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <h3 className="text-lg font-semibold text-gray-700">Children</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {c.map((child, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                <div className="mb-1"><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{child.child_name || "N/A"}</span></div>
                <div className="mb-1"><span className="font-medium text-gray-600">Gender:</span> <span className="text-gray-900">{child.gender || "N/A"}</span></div>
                {/* <div className="mb-1"><span className="font-medium text-gray-600">Age:</span> <span className="text-gray-900">{child.age || "N/A"}</span></div> */}
                <div><span className="font-medium text-gray-600">Mobile:</span> <span className="text-gray-900">{child.phone_number || "N/A"}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Family Details */}
      <div className="bg-white border rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>
          <h3 className="text-lg font-semibold text-gray-700">Family Details</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm">
          <div><span className="font-medium text-gray-600">Father:</span> <span className="text-gray-900">{f.father_name || "N/A"}</span></div>
          <div><span className="font-medium text-gray-600">Father Mobile:</span> <span className="text-gray-900">{f.father_mobile || "N/A"}</span></div>
          <div><span className="font-medium text-gray-600">Mother:</span> <span className="text-gray-900">{f.mother_name || "N/A"}</span></div>
          <div><span className="font-medium text-gray-600">Mother Mobile:</span> <span className="text-gray-900">{f.mother_mobile || "N/A"}</span></div>
          <div><span className="font-medium text-gray-600">Spouse:</span> <span className="text-gray-900">{f.spouse_name || "N/A"}</span></div>
          <div><span className="font-medium text-gray-600">Spouse Mobile:</span> <span className="text-gray-900">{f.spouse_mobile || "N/A"}</span></div>
        </div>
      </div>

      {/* Siblings */}
      {f.siblingDetails && f.siblingDetails.length > 0 && (
        <div className="bg-white border rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zM17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7" /></svg>
            <h3 className="text-lg font-semibold text-gray-700">Siblings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {f.siblingDetails.map((s, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="mb-1"><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{s.sibling_name || "N/A"}</span></div>
                <div className="mb-1"><span className="font-medium text-gray-600">Relation:</span> <span className="text-gray-900">{s.sibling_relation || "N/A"}</span></div>
                <div><span className="font-medium text-gray-600">Mobile:</span> <span className="text-gray-900">{s.phone_number || "N/A"}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

