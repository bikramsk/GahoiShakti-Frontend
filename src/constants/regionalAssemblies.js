export const LOCAL_PANCHAYATS = {
  "Chambal Regional Assembly": ["Morena", "Bhind", "Gwalior"],
  "Central Malwa Regional Assembly": [
    "Indore",
    "Dewas",
    "Ujjain",
    "Bhopal",
    "Vidisha",
    "Raisen",
  ],
  "Mahakaushal Regional Assembly": ["Jabalpur", "Katni", "Rewa", ""],
  "Vindhya Regional Assembly": [
    "Satna",
    "Shahdol",
    "Sidhi",
    "Chhatarpur",
    "Panna",
    "Rewa",
  ],
  "Bundelkhand Regional Assembly": ["Sagar", "Damoh", "Chhatarpur"],
  "Chaurasi Regional Assembly": ["Bhopal", "Vidisha", "Raisen"],
  "Southern Regional Assembly": [
    "Pune",
    "Mumbai",
    "Nagpur",
    "Amravati",
    "Chalisgaon",
    "Dhuliya",
  ],
};


export function getFilteredRegionalAssemblies(state, district) {
  if (!state) return [];
  // For Uttar Pradesh
  if (state === "Uttar Pradesh") {
    if (district === "Mathura") return ["Northern Regional Assembly"];
    if (district === "Mahoba") return ["Vindhya Regional Assembly"];
    if (district === "Sultanpur") return ["Mahakaushal Regional Assembly"];
    if (["Lalitpur", "Jhansi"].includes(district)) return ["Bundelkhand Regional Assembly"];
    if (["Jalaun", "Lucknow", "Kanpur Nagar", "Chitrakoot", "Banda", "Auraiya"].includes(district)) return ["Ganga Jamuna Regional Assembly"];
  }
  // Gujarat
  if (state === "Gujarat" && district === "Ahmedabad") return ["Chaurasi Regional Assembly"];
  // Madhya Pradesh
  if (state === "Madhya Pradesh") {
    if (["Jabalpur", "Katni", "Rewa", "Narsinghpur", "Umariya", "Sagar", "Seoni", "Katni", "Chhindwara", "Panna", "Hoshangabad", "Mandla", "Damoh", "Shahdol", "Dindori", "Guna"].includes(district)) {
      if (district === "Panna") return ["Mahakaushal Regional Assembly", "Vindhya Regional Assembly"];
      if (district === "Guna") return ["Mahakaushal Regional Assembly", "Chaurasi Regional Assembly"];
      return ["Mahakaushal Regional Assembly"];
    }
    if (["Satna", "Shahdol", "Sidhi", "Chhatarpur", "Panna", "Rewa"].includes(district)) {
      if (district === "Panna") return ["Mahakaushal Regional Assembly", "Vindhya Regional Assembly"];
      return ["Vindhya Regional Assembly"];
    }
    if (["Shivpuri", "Rewa", "Satna", "Ashoknagar", "Guna"].includes(district)) return ["Chaurasi Regional Assembly"];
    if (["Gwalior", "Bhind", "Datia", "Morena"].includes(district)) return ["Chambal Regional Assembly"];
    if (["Indore", "Dewas", "Ujjain", "Bhopal", "Vidisha", "Raisen"].includes(district)) return ["Central Malwa Regional Assembly"];
    if (["Tikamgarh"].includes(district)) return ["Bundelkhand Regional Assembly"];
  }
  // Delhi
  if (state === "Delhi" && district === "Delhi") return ["Northern Regional Assembly"];
  // Bihar
  if (state === "Bihar" && district === "Patna") return ["Vindhya Regional Assembly"];
  // Rajasthan
  if (state === "Rajasthan" && district === "Jaipur") return ["Chambal Regional Assembly"];
  // Chhattisgarh
  if (state === "Chhattisgarh" && ["Durg", "Rajnandgaon", "Dhamtari", "Raipur", "Bilaspur", "Bastar", "Koriya"].includes(district)) return ["Chhattisgarh Regional Assembly"];
  // Maharashtra
  if (state === "Maharashtra" && ["Nagpur", "Pune", "Amravati", "Mumbai", "Jalgaon"].includes(district)) return ["Southern Regional Assembly"];
  return [];
}
