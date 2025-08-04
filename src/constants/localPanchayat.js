export function getFilteredLocalPanchayat({
  state,
  district,
  city,
  regionalAssembly,
  localPanchayatName
}) {
  // Central Malwa Regional Assembly
  if (regionalAssembly === "Central Malwa Regional Assembly" && state === "Madhya Pradesh") {
    if (localPanchayatName === "Gahoi Vaishya Samaj" && district === "Indore") return ["Indore"];
    if (localPanchayatName === "Gahoi Vaishya Panchayat" && district === "Ujjain") return ["Ujjain"];
    if (localPanchayatName === "Gahoi Vaishya Panchayat" && district === "Bhopal") return ["Bhopal"];
    if (localPanchayatName === "Gahoi Vaishya Samaj Kalyan Samiti" && district === "Vidisha") return ["Vidisha"];
    if (localPanchayatName === "Shri Gahoi Vaishya Samaj Panchayat" && district === "Raisen") return ["Raisen"];
    return [];
  }
  // Bundelkhand Regional Assembly
  if (regionalAssembly === "Bundelkhand Regional Assembly") {
    if (state === "Uttar Pradesh" && district === "Lalitpur") return ["Lalitpur"];
  }
  // Chaurasi Regional Assembly
  if (regionalAssembly === "Chaurasi Regional Assembly") {
    if (state === "Madhya Pradesh" || state === "Gujarat") return [district];
  }
  // Chambal Regional Assembly
  if (regionalAssembly === "Chambal Regional Assembly") {
    if (state === "Madhya Pradesh" && district === "Gwalior") return ["Gwalior"];
    if (state === "Madhya Pradesh" && district === "Bhind") return ["Bhind"];
    if (state === "Madhya Pradesh" && district === "Datia") return ["Datia"];
    if (state === "Madhya Pradesh" && district === "Morena") return ["Morena"];
    if (state === "Rajasthan" && district === "Jaipur") return ["Jaipur"];
  }
  // Mahakaushal Regional Assembly
  if (regionalAssembly === "Mahakaushal Regional Assembly") {
    if (state === "Madhya Pradesh" && district === "Jabalpur") return ["Jabalpur"];
    if (state === "Madhya Pradesh" && district === "Katni") return ["Katni"];
    if (state === "Madhya Pradesh" && district === "Chhindwara") return ["Chhindwara"];
    if (state === "Madhya Pradesh" && district === "Umariya") return ["Umariya"];
    if (state === "Madhya Pradesh" && district === "Shahdol") return ["Shahdol"];
    if (state === "Madhya Pradesh" && district === "Dindori") return ["Dindori"];
    if (state === "Madhya Pradesh" && district === "Hoshangabad") return ["Hoshangabad"];
    if (state === "Madhya Pradesh" && district === "Mandla") return ["Mandla"];
    if (state === "Madhya Pradesh" && district === "Guna") return ["Guna"];
    if (state === "Madhya Pradesh" && district === "Narsinghpur") return ["Narsinghpur"];
    if (state === "Madhya Pradesh" && district === "Rewa") return ["Rewa"];
    if (state === "Madhya Pradesh" && district === "Panna") return ["Panna"];
    if (state === "Madhya Pradesh" && district === "Sagar") return ["Sagar"];
  }
  // Vindhya Regional Assembly
  if (regionalAssembly === "Vindhya Regional Assembly") {
    if (state === "Bihar" && district === "Patna") return ["Patna"];
    if (state === "Uttar Pradesh" && district === "Mahoba") return ["Mahoba"];
    if (state === "Madhya Pradesh" && district === "Vidisha") return ["Vidisha"];
    if (state === "Madhya Pradesh" && district === "Indore") return ["Indore"];
    if (state === "Madhya Pradesh" && district === "Ujjain") return ["Ujjain"];
    if (state === "Madhya Pradesh" && district === "Bhopal") return ["Bhopal"];
    if (state === "Madhya Pradesh" && district === "Panna") return ["Panna"];
    if (state === "Madhya Pradesh" && district === "Raisen") return ["Raisen"];
    if (state === "Madhya Pradesh" && district === "Satna") return ["Satna"];
    if (["Laundi", "Nowgong", "Chhatarpur", "Harpalpur", "Bada Malhera"].includes(district)) return [district];
  }
  // Ganga Jamuna Regional Assembly
  if (regionalAssembly === "Ganga Jamuna Regional Assembly" && state === "Uttar Pradesh") {
    if (district === "Jalaun") return ["Jalaun"];
    if (district === "Lucknow") return ["Lucknow"];
    if (district === "Kanpur Nagar") return ["Kanpur Nagar"];
    if (district === "Chitrakoot") return ["Chitrakoot"];
    if (district === "Banda") return ["Banda"];
    if (district === "Auraiya") return ["Auraiya"];
  }
  // Chhattisgarh Regional Assembly
  if (regionalAssembly === "Chhattisgarh Regional Assembly" && state === "Chhattisgarh") {
    if (["Durg", "Rajnandgaon", "Dhamtari", "Raipur", "Bilaspur"].includes(district)) return [district];
    if (["Bastar", "Koriya"].includes(district)) return [district];
  }
  // Southern Regional Assembly
  if (regionalAssembly === "Southern Regional Assembly" && state === "Maharashtra") {
    return [district];
  }
  // Northern Regional Assembly
  if (regionalAssembly === "Northern Regional Assembly") {
    if (state === "Delhi" && district === "Delhi") return ["Delhi"];
    if (state === "Uttar Pradesh" && district === "Mathura") return ["Mathura"];
  }

   // Fallback: if no mapping found, return [district] if district is set
  if (district) {
    return [district];
  }

  return [];
}
