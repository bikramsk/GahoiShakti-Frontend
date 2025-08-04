const SUB_LOCAL_PANCHAYATS = {
  Pune: ["Pune", "Pimpri-Chinchwad", "Khadki", "Hadapsar"],
  Mumbai: ["South Mumbai", "Andheri", "Borivali", "Thane", "Navi Mumbai"],
  Nagpur: ["Nagpur", "Kamptee", "Hingna"],
  Amravati: ["Amravati", "Badnera", "Achalpur"],
  Chalisgaon: ["Chalisgaon"],
  Dhuliya: ["Dhuliya"],
  Morena: ["Morena", "Ambah", "Porsa"],
  Bhind: [
    "Bhind",
    "Ater",
    "Lahar",
    "Daboh",
    "Tharet",
    "Mihona",
    "Aswar",
    "Lahar",
    "Gohad",
    "Machhand",
    "Raun",
  ],
  Gwalior: [
    "Gwalior",
    "Dabra",
    "Madhavganj",
   
  ],
};

export function getFilteredSubLocalPanchayat({
  localPanchayat
}) {
  if (SUB_LOCAL_PANCHAYATS[localPanchayat]) {
    return SUB_LOCAL_PANCHAYATS[localPanchayat];
  }
  if (localPanchayat) {
    return [localPanchayat];
  }
  return [];
}
