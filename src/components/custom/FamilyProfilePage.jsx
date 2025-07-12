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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Family Profile</h2>

      {/* Personal Information */}
      <div className="bg-white border rounded shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <p><span className="font-medium">Name:</span> {p.full_name || "N/A"}</p>
          <p><span className="font-medium">Mobile:</span> {p.mobile_number || "N/A"}</p>
        </div>
      </div>

      {/* Children */}
      {c && c.length > 0 && (
        <div className="bg-white border rounded shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Children</h3>
          <div className="space-y-3">
            {c.map((child, idx) => (
              <div key={idx} className="border rounded p-3">
                <p><span className="font-medium">Name:</span> {child.child_name || "N/A"}</p>
                <p><span className="font-medium">Gender:</span> {child.gender || "N/A"}</p>
                {/* <p><span className="font-medium">Age:</span> {child.age || "N/A"}</p> */}
                <p><span className="font-medium">Mobile:</span> {child.phone_number || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Family Details */}
      <div className="bg-white border rounded shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Family Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <p><span className="font-medium">Father:</span> {f.father_name || "N/A"}</p>
          <p><span className="font-medium">Father Mobile:</span> {f.father_mobile || "N/A"}</p>
          <p><span className="font-medium">Mother:</span> {f.mother_name || "N/A"}</p>
          <p><span className="font-medium">Mother Mobile:</span> {f.mother_mobile || "N/A"}</p>
          <p><span className="font-medium">Spouse:</span> {f.spouse_name || "N/A"}</p>
          <p><span className="font-medium">Spouse Mobile:</span> {f.spouse_mobile || "N/A"}</p>
        </div>
      </div>

      {/* Siblings */}
      {f.siblingDetails && f.siblingDetails.length > 0 && (
        <div className="bg-white border rounded shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Siblings</h3>
          <div className="space-y-3">
            {f.siblingDetails.map((s, index) => (
              <div key={index} className="border rounded p-3">
                <p><span className="font-medium">Name:</span> {s.sibling_name || "N/A"}</p>
                <p><span className="font-medium">Relation:</span> {s.sibling_relation || "N/A"}</p>
                <p><span className="font-medium">Mobile:</span> {s.phone_number || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

