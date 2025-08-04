export function getFilteredLocalPanchayatNames({
  state,
  district,
  city,
  regionalAssembly
}) {
  // Chambal Regional Assembly
  if (regionalAssembly === "Chambal Regional Assembly") {
    if (state === "Madhya Pradesh" && district === "Gwalior") {
      return [
        "Gahoi Vaishya Samaj Register Brahttar Gwalior",
        "Gahoi Vaishya Panchayat"
      ];
    }
    if (state === "Madhya Pradesh" && district === "Bhind") {
      return ["Gahoi Vaishya Sabha", "Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Datia") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Morena") {
      return ["Gahoi Vaishya Samaj"];
    }
    if (state === "Rajasthan" && district === "Jaipur") {
      return ["Gahoi Vaishya Panchayat"];
    }
  }
  // Central Malwa Regional Assembly
  if (regionalAssembly === "Central Malwa Regional Assembly" && state === "Madhya Pradesh") {
    if (district === "Indore") return ["Gahoi Vaishya Samaj"];
    if (district === "Ujjain") return ["Gahoi Vaishya Panchayat"];
    if (district === "Bhopal") return ["Gahoi Vaishya Panchayat"];
    if (district === "Vidisha") return ["Gahoi Vaishya Samaj Kalyan Samiti"];
    if (district === "Raisen") return ["Shri Gahoi Vaishya Samaj Panchayat"];
  }
  // Mahakaushal Regional Assembly
  if (regionalAssembly === "Mahakaushal Regional Assembly") {
    if (state === "Madhya Pradesh" && district === "Jabalpur") {
      return ["Gahoi Vaishya Panchayat", "Shri Gahoi Vaishya Samaj"];
    }
    if (state === "Madhya Pradesh" && district === "Katni") {
      return ["Gahoi Vaishya Samaj", "Gahoi Vaishya Panchayat Parishad"];
    }
    if (state === "Madhya Pradesh" && district === "Chhindwara") {
      return ["Gahoi Vaishya Panchayat", "Shri Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Umariya") {
      return ["Shri Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Shahdol") {
      return ["Shri Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Dindori") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Hoshangabad") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Mandla") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Guna") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Narsinghpur") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Rewa") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Panna") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Sagar") {
      return ["Gahoi Vaishya Panchayat", "Shri Gahoi Vaishya Panchayat", "Gahoi Vaishya Samaj"];
    }

 
  }
  // Bundelkhand Regional Assembly
  if (regionalAssembly === "Bundelkhand Regional Assembly") {
    if (state === "Uttar Pradesh" && district === "Jhansi") {
      return ["Gahoi Vaishya Panchayat", "Shri Gahoi Vaishya Panchayat", "Shri Gahoi Vaishya Seva Samiti"];
    }
    if (state === "Madhya Pradesh" && district === "Tikamgarh") {
      return ["Shri Gahoi Vaishya Panchayat"];
    }
    if (state === "Uttar Pradesh" && district === "Lalitpur") {
      return ["Lalitpur"];
    }
  }
  // Chaurasi Regional Assembly
  if (regionalAssembly === "Chaurasi Regional Assembly") {
    if (state === "Madhya Pradesh" || state === "Gujarat") {
      return [district];
    }
  }
  // Vindhya Regional Assembly
  if (regionalAssembly === "Vindhya Regional Assembly") {
    if (state === "Bihar" && district === "Patna") {
      return ["Shri Gahoi Vaishya Sabha"];
    }
    if (state === "Uttar Pradesh" && district === "Mahoba") {
      return ["Gahoi Vaishya Samaj"];
    }
    if (state === "Madhya Pradesh" && district === "Vidisha") {
      return ["Gahoi Vaishya Samaj Kalyan Samiti"];
    }
    if (state === "Madhya Pradesh" && district === "Indore") {
      return ["Gahoi Vaishya Samaj"];
    }
    if (state === "Madhya Pradesh" && district === "Ujjain") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Bhopal") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Panna") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Raisen") {
      return ["Shri Gahoi Vaishya Samaj Panchayat"];
    }
    if (state === "Madhya Pradesh" && district === "Satna") {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (["Laundi", "Nowgong", "Chhatarpur", "Harpalpur", "Bada Malhera"].includes(district)) {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (district === "Panna") {
      return ["Gahoi Vaishya Panchayat"];
    }
  }
  // Ganga Jamuna Regional Assembly
  if (regionalAssembly === "Ganga Jamuna Regional Assembly" && state === "Uttar Pradesh") {
    if (district === "Jalaun") return ["Gahoi Vaishya Samaj Panchayat", "Gahoi Vaishya Panchayat Samiti"];
    if (district === "Lucknow") return ["Gahoi Vaishya Panchayat"];
    if (district === "Kanpur Nagar") return ["Gahoi Vaishya Kalyan Samiti"];
    if (district === "Chitrakoot") return ["Gahoi Vaishya Samaj"];
    if (district === "Banda") return ["Gahoi Vaishya Samaj Panchayat"];
    if (district === "Auraiya") return ["Gahoi Vaishya Yuva Samiti"];
  }
  // Chhattisgarh Regional Assembly
  if (regionalAssembly === "Chhattisgarh Regional Assembly" && state === "Chhattisgarh") {
    if (["Durg", "Rajnandgaon", "Dhamtari", "Raipur", "Bilaspur"].includes(district)) {
      return ["Gahoi Vaishya Panchayat"];
    }
    if (["Bastar", "Koriya"].includes(district)) {
      return ["Gahoi Vaishya Samaj"];
    }
  }
  // Southern Regional Assembly
  if (regionalAssembly === "Southern Regional Assembly" && state === "Maharashtra") {
    return ["Gahoi Vaishya Panchayat"];
  }
  // Northern Regional Assembly
  if (regionalAssembly === "Northern Regional Assembly") {
    if (state === "Delhi" && district === "Delhi") return ["Shri Gahoi Vaishya Association"];
    if (state === "Uttar Pradesh" && district === "Mathura") return ["Gahoi Vaishya Vikas Sansthan"];
  }
  return [];
}



