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
  const c = profile.child_name || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-sm mb-3">
              <span className="text-2xl font-bold text-white">
                {(p.full_name || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{p.full_name || "Family Profile"}</h1>
            <div className="mt-1">
              <span className="text-sm text-gray-600 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {p.mobile_number || "Not Available"}
              </span>
            </div>
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
                  <p className="mt-1 text-sm text-gray-900">{p.full_name || "Not Available"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Mobile Number</label>
                  <p className="mt-1 text-sm text-gray-900">{p.mobile_number || "Not Available"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Details */}
          <div className="border-b">
            <div className="px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Family Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Father</label>
                  <p className="mt-1 text-sm text-gray-900">{f.father_name || "Not Available"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Mobile Number</label>
                  <p className="mt-1 text-sm text-gray-900">{f.father_mobile || "Not Available"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Mother</label>
                  <p className="mt-1 text-sm text-gray-900">{f.mother_name || "Not Available"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Mobile Number</label>
                  <p className="mt-1 text-sm text-gray-900">{f.mother_mobile || "Not Available"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Spouse</label>
                  <p className="mt-1 text-sm text-gray-900">{f.spouse_name || "Not Available"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Mobile Number</label>
                  <p className="mt-1 text-sm text-gray-900">{f.spouse_mobile || "Not Available"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Children Section */}
          {c && c.length > 0 && (
            <div className="border-b">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Children</h2>
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-red-50 text-red-700 rounded-full">
                    {c.length} {c.length === 1 ? 'Child' : 'Children'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div className="text-xs font-medium text-gray-500 uppercase">Name</div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Mobile Number</div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Gender</div>
                </div>
                {c.map((child, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-4 py-2 border-t first:border-t-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-red-700">
                          {(child.child_name || "C").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{child.child_name || "Not Available"}</span>
                    </div>
                    <div className="text-sm text-gray-900">{child.phone_number || "Not Available"}</div>
                    <div className="text-sm text-gray-900">
                      {child.gender === "Male" ? "Male" : child.gender === "Female" ? "Female" : "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Siblings Section */}
          {f.siblingDetails && f.siblingDetails.length > 0 && (
            <div className="border-b">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Siblings</h2>
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-red-50 text-red-700 rounded-full">
                    {f.siblingDetails.length} {f.siblingDetails.length === 1 ? 'Sibling' : 'Siblings'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-2">
                  <div className="text-xs font-medium text-gray-500 uppercase">Name</div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Mobile Number</div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Gender</div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Relation</div>
                </div>
                {f.siblingDetails.map((sibling, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4 py-2 border-t first:border-t-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-red-700">
                          {(sibling.sibling_name || "S").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{sibling.sibling_name || "Not Available"}</span>
                    </div>
                    <div className="text-sm text-gray-900">{sibling.phone_number || "Not Available"}</div>
                    <div className="text-sm text-gray-900">
                      {sibling.gender === "Male" ? "Male" : sibling.gender === "Female" ? "Female" : "N/A"}
                    </div>
                    <div className="text-sm text-gray-900">{sibling.sibling_relation || "N/A"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}