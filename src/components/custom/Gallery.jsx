import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Image, Maximize2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  STATES, 
  STATE_TO_DISTRICTS, 
  DISTRICT_TO_CITIES,
  ASHOKNAGAR_LOCAL_BODIES,
  ALIRAJPUR_LOCAL_BODIES,
  ANUPPUR_LOCAL_BODIES,
  BALAGHAT_LOCAL_BODIES,
  BARWANI_LOCAL_BODIES,
  BETUL_LOCAL_BODIES,
  BHIND_LOCAL_BODIES,
  BHOPAL_LOCAL_BODIES,
  BURHANPUR_LOCAL_BODIES,
  CHHATARPUR_LOCAL_BODIES,
  CHHINDWARA_LOCAL_BODIES,
  DAMOH_LOCAL_BODIES,
  DATIA_LOCAL_BODIES,
  DEWAS_LOCAL_BODIES,
  DHAR_LOCAL_BODIES,
  DINDORI_LOCAL_BODIES,
  GUNA_LOCAL_BODIES,
  GWALIOR_LOCAL_BODIES,
  HARDA_LOCAL_BODIES,
  INDORE_LOCAL_BODIES,
  JABALPUR_LOCAL_BODIES,
  JHABUA_LOCAL_BODIES,
  KATNI_LOCAL_BODIES,
  KHANDWA_LOCAL_BODIES,
  KHARGONE_LOCAL_BODIES,
  MANDLA_LOCAL_BODIES,
  MANDSAUR_LOCAL_BODIES,
  MORENA_LOCAL_BODIES,
  NARSINGHPUR_LOCAL_BODIES,
  NEEMUCH_LOCAL_BODIES,
  PANNA_LOCAL_BODIES,
  RAISEN_LOCAL_BODIES,
  RAJGARH_LOCAL_BODIES,
  RATLAM_LOCAL_BODIES,
  REWA_LOCAL_BODIES,
  SAGAR_LOCAL_BODIES,
  SATNA_LOCAL_BODIES,
  SEHORE_LOCAL_BODIES,
  SEONI_LOCAL_BODIES,
  SHAHDOL_LOCAL_BODIES,
  SHAJAPUR_LOCAL_BODIES,
  SHEOPUR_LOCAL_BODIES,
  SHIVPURI_LOCAL_BODIES,
  SIDHI_LOCAL_BODIES,
  SINGRAULI_LOCAL_BODIES,
  TIKAMGARH_LOCAL_BODIES,
  UJJAIN_LOCAL_BODIES,
  UMARIYA_LOCAL_BODIES,
  VIDISHA_LOCAL_BODIES,
  ASHOKNAGAR_GRAM_PANCHAYATS,
  ALIRAJPUR_GRAM_PANCHAYATS,
  ANUPPUR_GRAM_PANCHAYATS,
  BALAGHAT_GRAM_PANCHAYATS,
  BARWANI_GRAM_PANCHAYATS,
  BETUL_GRAM_PANCHAYATS,
  BHIND_GRAM_PANCHAYATS,
  BHOPAL_GRAM_PANCHAYATS,
  BURHANPUR_GRAM_PANCHAYATS,
  CHHATARPUR_GRAM_PANCHAYATS,
  CHHINDWARA_GRAM_PANCHAYATS,
  DAMOH_GRAM_PANCHAYATS,
  DATIA_GRAM_PANCHAYATS,
  DEWAS_GRAM_PANCHAYATS,
  DHAR_GRAM_PANCHAYATS,
  DINDORI_GRAM_PANCHAYATS,
  GUNA_GRAM_PANCHAYATS,
  GWALIOR_GRAM_PANCHAYATS,
  HARDA_GRAM_PANCHAYATS,
  INDORE_GRAM_PANCHAYATS,
  JABALPUR_GRAM_PANCHAYATS,
  JHABUA_GRAM_PANCHAYATS,
  KATNI_GRAM_PANCHAYATS,
  KHANDWA_GRAM_PANCHAYATS,
  KHARGONE_GRAM_PANCHAYATS,
  MANDLA_GRAM_PANCHAYATS,
  MANDSAUR_GRAM_PANCHAYATS,
  MORENA_GRAM_PANCHAYATS,
  NARSINGHPUR_GRAM_PANCHAYATS,
  NEEMUCH_GRAM_PANCHAYATS,
  PANNA_GRAM_PANCHAYATS,
  RAISEN_GRAM_PANCHAYATS,
  RAJGARH_GRAM_PANCHAYATS,
  RATLAM_GRAM_PANCHAYATS,
  REWA_GRAM_PANCHAYATS,
  SAGAR_GRAM_PANCHAYATS,
  SATNA_GRAM_PANCHAYATS,
  SEHORE_GRAM_PANCHAYATS,
  SEONI_GRAM_PANCHAYATS,
  SHAHDOL_GRAM_PANCHAYATS,
  SHAJAPUR_GRAM_PANCHAYATS,
  SHEOPUR_GRAM_PANCHAYATS,
  SHIVPURI_GRAM_PANCHAYATS,
  SIDHI_GRAM_PANCHAYATS,
  SINGRAULI_GRAM_PANCHAYATS,
  TIKAMGARH_GRAM_PANCHAYATS,
  UJJAIN_GRAM_PANCHAYATS,
  UMARIYA_GRAM_PANCHAYATS,
  VIDISHA_GRAM_PANCHAYATS
} from '../../constants/locationData';
import { STATE_TO_ASSEMBLIES } from '../../constants/formConstants';
import { formatFormData } from '../../utils/form/formUtils';

const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://admin.gahoishakti.in'
  : 'http://localhost:1337';

// Helper function to get local bodies based on district
const getLocalBodies = (district) => {
  const districtMap = {
    'Ashoknagar': ASHOKNAGAR_LOCAL_BODIES,
    'Alirajpur': ALIRAJPUR_LOCAL_BODIES,
    'Anuppur': ANUPPUR_LOCAL_BODIES,
    'Balaghat': BALAGHAT_LOCAL_BODIES,
    'Barwani': BARWANI_LOCAL_BODIES,
    'Betul': BETUL_LOCAL_BODIES,
    'Bhind': BHIND_LOCAL_BODIES,
    'Bhopal': BHOPAL_LOCAL_BODIES,
    'Burhanpur': BURHANPUR_LOCAL_BODIES,
    'Chhatarpur': CHHATARPUR_LOCAL_BODIES,
    'Chhindwara': CHHINDWARA_LOCAL_BODIES,
    'Damoh': DAMOH_LOCAL_BODIES,
    'Datia': DATIA_LOCAL_BODIES,
    'Dewas': DEWAS_LOCAL_BODIES,
    'Dhar': DHAR_LOCAL_BODIES,
    'Dindori': DINDORI_LOCAL_BODIES,
    'Guna': GUNA_LOCAL_BODIES,
    'Gwalior': GWALIOR_LOCAL_BODIES,
    'Harda': HARDA_LOCAL_BODIES,
    'Indore': INDORE_LOCAL_BODIES,
    'Jabalpur': JABALPUR_LOCAL_BODIES,
    'Jhabua': JHABUA_LOCAL_BODIES,
    'Katni': KATNI_LOCAL_BODIES,
    'Khandwa': KHANDWA_LOCAL_BODIES,
    'Khargone': KHARGONE_LOCAL_BODIES,
    'Mandla': MANDLA_LOCAL_BODIES,
    'Mandsaur': MANDSAUR_LOCAL_BODIES,
    'Morena': MORENA_LOCAL_BODIES,
    'Narsinghpur': NARSINGHPUR_LOCAL_BODIES,
    'Neemuch': NEEMUCH_LOCAL_BODIES,
    'Panna': PANNA_LOCAL_BODIES,
    'Raisen': RAISEN_LOCAL_BODIES,
    'Rajgarh': RAJGARH_LOCAL_BODIES,
    'Ratlam': RATLAM_LOCAL_BODIES,
    'Rewa': REWA_LOCAL_BODIES,
    'Sagar': SAGAR_LOCAL_BODIES,
    'Satna': SATNA_LOCAL_BODIES,
    'Sehore': SEHORE_LOCAL_BODIES,
    'Seoni': SEONI_LOCAL_BODIES,
    'Shahdol': SHAHDOL_LOCAL_BODIES,
    'Shajapur': SHAJAPUR_LOCAL_BODIES,
    'Sheopur': SHEOPUR_LOCAL_BODIES,
    'Shivpuri': SHIVPURI_LOCAL_BODIES,
    'Sidhi': SIDHI_LOCAL_BODIES,
    'Singrauli': SINGRAULI_LOCAL_BODIES,
    'Tikamgarh': TIKAMGARH_LOCAL_BODIES,
    'Ujjain': UJJAIN_LOCAL_BODIES,
    'Umariya': UMARIYA_LOCAL_BODIES,
    'Vidisha': VIDISHA_LOCAL_BODIES
  };

  try {
    const localBodies = districtMap[district];
    if (!localBodies) return [];

  
    const nagarPalika = Array.isArray(localBodies?.NAGAR_PALIKA) ? localBodies.NAGAR_PALIKA : [];
    const janpadPanchayat = Array.isArray(localBodies?.JANPAD_PANCHAYAT) ? localBodies.JANPAD_PANCHAYAT : [];
    
    // Return unique values only
    return [...new Set([...nagarPalika, ...janpadPanchayat])];
  } catch (error) {
    console.error('Error in getLocalBodies:', error);
    return [];
  }
};

// Helper function to get gram panchayats based on district
const getGramPanchayats = (district) => {
  const districtMap = {
    'Ashoknagar': ASHOKNAGAR_GRAM_PANCHAYATS,
    'Alirajpur': ALIRAJPUR_GRAM_PANCHAYATS,
    'Anuppur': ANUPPUR_GRAM_PANCHAYATS,
    'Balaghat': BALAGHAT_GRAM_PANCHAYATS,
    'Barwani': BARWANI_GRAM_PANCHAYATS,
    'Betul': BETUL_GRAM_PANCHAYATS,
    'Bhind': BHIND_GRAM_PANCHAYATS,
    'Bhopal': BHOPAL_GRAM_PANCHAYATS,
    'Burhanpur': BURHANPUR_GRAM_PANCHAYATS,
    'Chhatarpur': CHHATARPUR_GRAM_PANCHAYATS,
    'Chhindwara': CHHINDWARA_GRAM_PANCHAYATS,
    'Damoh': DAMOH_GRAM_PANCHAYATS,
    'Datia': DATIA_GRAM_PANCHAYATS,
    'Dewas': DEWAS_GRAM_PANCHAYATS,
    'Dhar': DHAR_GRAM_PANCHAYATS,
    'Dindori': DINDORI_GRAM_PANCHAYATS,
    'Guna': GUNA_GRAM_PANCHAYATS,
    'Gwalior': GWALIOR_GRAM_PANCHAYATS,
    'Harda': HARDA_GRAM_PANCHAYATS,
    'Indore': INDORE_GRAM_PANCHAYATS,
    'Jabalpur': JABALPUR_GRAM_PANCHAYATS,
    'Jhabua': JHABUA_GRAM_PANCHAYATS,
    'Katni': KATNI_GRAM_PANCHAYATS,
    'Khandwa': KHANDWA_GRAM_PANCHAYATS,
    'Khargone': KHARGONE_GRAM_PANCHAYATS,
    'Mandla': MANDLA_GRAM_PANCHAYATS,
    'Mandsaur': MANDSAUR_GRAM_PANCHAYATS,
    'Morena': MORENA_GRAM_PANCHAYATS,
    'Narsinghpur': NARSINGHPUR_GRAM_PANCHAYATS,
    'Neemuch': NEEMUCH_GRAM_PANCHAYATS,
    'Panna': PANNA_GRAM_PANCHAYATS,
    'Raisen': RAISEN_GRAM_PANCHAYATS,
    'Rajgarh': RAJGARH_GRAM_PANCHAYATS,
    'Ratlam': RATLAM_GRAM_PANCHAYATS,
    'Rewa': REWA_GRAM_PANCHAYATS,
    'Sagar': SAGAR_GRAM_PANCHAYATS,
    'Satna': SATNA_GRAM_PANCHAYATS,
    'Sehore': SEHORE_GRAM_PANCHAYATS,
    'Seoni': SEONI_GRAM_PANCHAYATS,
    'Shahdol': SHAHDOL_GRAM_PANCHAYATS,
    'Shajapur': SHAJAPUR_GRAM_PANCHAYATS,
    'Sheopur': SHEOPUR_GRAM_PANCHAYATS,
    'Shivpuri': SHIVPURI_GRAM_PANCHAYATS,
    'Sidhi': SIDHI_GRAM_PANCHAYATS,
    'Singrauli': SINGRAULI_GRAM_PANCHAYATS,
    'Tikamgarh': TIKAMGARH_GRAM_PANCHAYATS,
    'Ujjain': UJJAIN_GRAM_PANCHAYATS,
    'Umariya': UMARIYA_GRAM_PANCHAYATS,
    'Vidisha': VIDISHA_GRAM_PANCHAYATS
  };

  try {
    const gramPanchayats = districtMap[district];
    if (!gramPanchayats) return [];

    // Simply return the array if it exists
    return Array.isArray(gramPanchayats) ? gramPanchayats : [];
  } catch (error) {
    console.error('Error in getGramPanchayats:', error);
    return [];
  }
};

// Import constants from Registration component
const LOCAL_PANCHAYATS = {
  "Chambal Regional Assembly": {
    "Morena": ["Morena", "Ambah", "Porsa"],
    "Bhind": ["Bhind", "Ater", "Lahar", "Daboh", "Tharet", "Mihona", "Aswar", "Lahar", "Gohad", "Machhand", "Raun"],
    "Gwalior": ["Gwalior", "Dabra", "Madhavganj", "Khasgi Bazaar", "Daulatganj", "Kampoo", "Lohia Bazaar", "Phalka Bazaar", "Lohamandi", "Bahodapur", "Naka Chandravadni", "Harishankarpuram", "Thatipur", "Morar", "Dabra", "Pichhore Dabra", "Behat"]
  },
  "Central Malwa Regional Assembly": {
    "Indore": ["Indore"],
    "Dewas": ["Dewas"],
    "Ujjain": ["Ujjain"],
    "Bhopal": ["Bhopal"],
    "Vidisha": ["Vidisha"],
    "Raisen": ["Raisen"]
  },
  "Mahakaushal Regional Assembly": {
    "Jabalpur": ["Jabalpur"],
    "Katni": ["Katni"],
    "Rewa": ["Rewa"]
  },
  "Vindhya Regional Assembly": {
    "Satna": ["Satna"],
    "Shahdol": ["Shahdol"],
    "Sidhi": ["Sidhi"],
    "Chhatarpur": ["Chhatarpur"],
    "Panna": ["Panna"],
    "Rewa": ["Rewa"]
  },
  "Bundelkhand Regional Assembly": {
    "Sagar": ["Sagar"],
    "Damoh": ["Damoh"],
    "Chhatarpur": ["Chhatarpur"]
  },
  "Chaurasi Regional Assembly": {
    "Bhopal": ["Bhopal"],
    "Vidisha": ["Vidisha"],
    "Raisen": ["Raisen"]
  }
};

const LOCAL_PANCHAYAT_NAMES = [
  "Gahoi Vaishya Samaj Register Brahttar Gwalior",
  "Gahoi Vaishya Panchayat",
  "Gahoi Vaishya Sabha",
  "Gahoi Vaishya Seva Samiti",
  "Gahoi Vaishya Samaj",
  "Gahoi Vaishya Samaj Panchayat",
  "Gahoi Vaishya Panchayat Samiti",
  "Gahoi Vaishya Kalyan Samiti",
  "Gahoi Vaishya Yuva Samiti",
  "Shri Gahoi Vaishya Panchayat",
  "Shri Gahoi Vaishya Seva Samiti",
  "Shri Daudayal Gahoi Vaishya Seva Samiti",
  "Gahoi Vaishya Samaj Kalyan Samiti",
  "Gahoi Vaishya Panchayat Parishad",
  "Shri Gahoi Vaishya Samaj Panchayat",
  "Shri Gahoi Vaishya Sabha",
  "Shri Gahoi Vaishya Samaj",
  "Gahoi Vaishya Vikas Sansthan",
  "Shri Gahoi Vaishya Association"
];

const getSubLocalPanchayats = (regionalAssembly, district) => {
  try {
    if (!regionalAssembly || !district || !LOCAL_PANCHAYATS[regionalAssembly]) return [];
    return LOCAL_PANCHAYATS[regionalAssembly][district] || [];
  } catch (error) {
    console.error('Error in getSubLocalPanchayats:', error);
    return [];
  }
};

const Gallery = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mpin, setMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [verifyingMpin, setVerifyingMpin] = useState(false);
  const [userMobile, setUserMobile] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    mobileNumber: '',
    gender: '',
    nationality: '',
    state: '',
    district: '',
    localBody: '',
    gramPanchayat: '',
    regionalAssembly: '',
    localPanchayatTrust: '',
    localPanchayatName: '',
    subLocalPanchayat: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add gotraAaknaMap constant
  const gotraAaknaMap = {
    "Vasar/Vastil/Vasal": [
      "Rusiya", "Arusiya", "Behre", "Bahre", "Pahariya", "Reja", "Mar", "Amar", "Mor", "Sethiya",
      "Damele", "Kathal", "Kathil", "Marele", "Nahar", "Naar", "KareKhemau", "Raghare", "Bagar",
      "Tudha", "Sah", "Saav", "Dangan ke", "Seth (Mau ke/Paliya ke/Khakshis ke/Mahuta ke/Bhaghoi ke)",
      "Kasav", "Khaira", "Sarawgi (Mau ke)", "Sahdele", "Sadele", "Changele", "Chungele", "Mungele",
      "Dhoosar", "Dadraya", "Patodiya", "Patodi", "Paterha", "Jhanjhar", "Kharaya", "Baraya",
      "Kunayar", "Purpuriya", "Puranpuriya", "Kajar", "Kshankshar"
    ],
    "Gol": [
      "Amroha", "Andhi", "Bamoriya", "Bardiya", "Barele/Barol", "Barha/Barehe", "Bed", "Bhagoriya",
      "Bilaiya", "Bijpuriya", "Brijpuriya", "Chauda/Chodha/Chouda", "Chiroliya", "Dagarhiha",
      "Dadam", "Damorha", "Devadhiya", "Digoriya", "Dingauriya", "Dohariya Devaraha", "Geda",
      "Gugoriya/Ugoriya", "Hadyal", "Hathnoria/Hathnotiya", "Jhudele/Jurele/Jhood", "Kachhwaha",
      "Kanjoulya", "Kharya/Khara", "Khatal", "Khatik", "Khunteta", "Kudayar", "Kudele", "Kudraya",
      "Kunayar", "Lakhaurya", "Lakoriya", "Lohiya/Loiya", "Maheshwari", "Matele/Mahtele", "Misurha/Masaurya",
      "Nagariya", "Naina/Nehna", "Neekhra", "Nigoti (Nigotiya)", "Pachnole/Pachraulya", "Paterha",
      "Piparsania", "Purpuriya", "Puranpuriya", "Rawat", "Rikholya", "Sakeray/Sakahere", "Sarawgi",
      "Seth", "Shaav/Shah", "Shikoly/Sokorya/Shipoulya", "Sirsoniya/Risoniya", "Soni", "Suhane/Sohane",
      "Sulganiya/Sulghaniya", "Tapa", "Teetbilasi/Teetbirasi", "Tikraya/Tapakle", "Tusele", "Viswari"
    ],
    "Gangal / Gagil": [
      "Amaulya/Amauriya", "Bhondiya (Bhondu)", "Chapra/Chupara", "Dhusar", "Jhudele/Jhad",
      "Katare", "Piparsaniya", "Rawat", "Seth (Padri ke)", "Tusele"
    ],
    "Badal / Waghil / Bandal": [
      "Bajrang Gadiya", "Chandaiya/Chandraseniya", "Dengre/Dagre", "Ghura", "Jhudele/Jurele/Jhood",
      "Khard", "Khangat", "Kudraya", "Naina/Nehna", "Pachnole/Pachraulya", "Sah/Saav",
      "Seth (Chandaiya ke)", "Suhane/Sohane", "Teetbilasi/Teetbirasi"
    ],
    "Kocchal / Kochil": [
      "Neekhra", "Indurkhiya", "Kastwar", "Kurele", "Misurha/Masaurya", "Sawla/Saula/Chawla",
      "Viswari", "Pahariya", "Piparsania", "Dadarya", "Nachhola", "Baronya", "Binaurya",
      "Kharya/Khara", "Iksade", "Sulganiya/Sulghaniya", "Kanjoulya", "Nigoti (Nigotiya)",
      "Rawat", "Seth", "Soni"
    ],
    "Jaital": [
      "Baderia", "Kathal/Kathil", "Nagariya", "Rikholya/Lakhourya", "Seth (Bareth ke)",
      "Shikoly/Sokorya/Shipoulya", "Lahariya", "Sirojiya"
    ],
    "Vachhil": [
      "Kuchiya/Kuchha", "Tikraya/Tapakle", "Damele", "Barsainya", "Tapa", "Kanakne",
      "Matele/Mahtele", "Hunka", "Seth (Nawgaon/Negua ke)", "Badonya", "Gandhi", "Rikholya",
      "Dhanoriya", "Itoriya/Itodiya", "Sakeray/Sakahere", "Soni", "Khadsariya/Kharsadiya",
      "Badhiya", "Vinaurya", "Sirsoniya/Risoniya", "Shikoly/Sokorya/Shipoulya", "Khangat",
      "Katare", "Sarawgi (Mau ke)", "Chungele"
    ],
    "Kachhil": [
      "Chapra/Chupara", "Tusele", "Piparsaniya", "Seth (Padri ke)", "Dhusar", "Bhondiya (Bhondu)",
      "Amaulya/Amauriya", "Jhudele/Jhad", "Rawat", "Katare"
    ],
    "Bhaal": [
      "Kudraya", "Khard", "Suhane/Sohane", "Dengre/Dagre", "Teetbilasi/Teetbirasi", "Ghura",
      "Khangat", "Bajrang Gadiya", "Naina/Nehna", "Pachnole/Pachraulya", "Sah/Saav",
      "Seth (Chandaiya ke)", "Chandaiya/Chandraseniya", "Jhudele/Jurele/Jhood"
    ],
    "Kohil": ["Kandele", "Lohiya/Loiya", "Shaav/Shah (Unnao ke)", "Jhuke/Jhunk"],
    "Kasiv": [
      "Asoo", "Asoopi", "Asooti", "Khantal", "Beder", "Badil", "Baidal", "Sudipa",
      "Asudipa", "Deepa/Teepa"
    ],
    "Kasav": [
      "Asoo", "Asoopi", "Asooti", "Khantal", "Beder", "Badil", "Baidal", "Sudipa",
      "Asudipa", "Deepa/Teepa"
    ],
    "Single": []
  };

  // Add getAaknaOptions function
  const getAaknaOptions = () => {
    return registrationForm.gotra ? gotraAaknaMap[registrationForm.gotra] || [] : [];
  };
 
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const verifiedMobile = localStorage.getItem('verifiedMobile');
      if (token && verifiedMobile) {
        setIsAuthenticated(true);
        setUserMobile(verifiedMobile);
        
   
        const pendingEventId = sessionStorage.getItem('pendingEventId');
        if (pendingEventId) {
          const event = events.find(e => e.id === parseInt(pendingEventId));
          if (event) {
            setSelectedEvent(event);
            setSelectedImageIdx(0);
            document.body.style.overflow = 'hidden';
          }
          sessionStorage.removeItem('pendingEventId');
        }
      }
    };

    checkAuth();
  }, [events]);

  const openLightbox = useCallback((event, imageIdx = 0) => {
    const token = localStorage.getItem('token');
    const verifiedMobile = localStorage.getItem('verifiedMobile');
    const isUserAuthenticated = !!token && !!verifiedMobile;
    
    if (!isUserAuthenticated) {
      
      localStorage.setItem('returnTo', '/gallery');
      localStorage.setItem('pendingEventId', event.id);
      
      navigate('/login');
      return;
    }
    
    setSelectedEvent(event);
    setSelectedImageIdx(imageIdx);
    document.body.style.overflow = 'hidden';
  }, [navigate]);

  // Handle MPIN verification
  const handleMpinVerify = async (e) => {
    e.preventDefault();
    if (mpin.length !== 4) {
      setMpinError(t('gallery.mpinLengthError') || 'MPIN must be 4 digits');
      return;
    }

    try {
      setVerifyingMpin(true);
      setMpinError('');

      const response = await fetch(`${API_URL}/api/verify-mpin`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobileNumber: userMobile,
          mpin: mpin
        })
      });

      const data = await response.json();
      
      if (response.ok && data.jwt) {
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('verifiedMobile', userMobile);
        setIsAuthenticated(true);
        setShowLoginModal(false);
        setMpin('');
        
        if (selectedEvent) {
          setSelectedImageIdx(0);
          document.body.style.overflow = 'hidden';
        }
      } else if (response.status === 404) {
        // User not found - redirect to registration with return path
        localStorage.setItem('returnTo', '/gallery');
        if (selectedEvent) {
          localStorage.setItem('pendingEventId', selectedEvent.id);
        }
        navigate('/login');
      } else {
        setMpinError(t('gallery.mpinError') || 'Invalid MPIN');
      }
    } catch (error) {
      console.error('MPIN verification error:', error);
      setMpinError(t('gallery.mpinVerificationError') || 'Failed to verify MPIN');
    } finally {
      setVerifyingMpin(false);
    }
  };

  useEffect(() => {
    const returnPath = localStorage.getItem('returnPath');
    if (returnPath === '/gallery') {
      localStorage.removeItem('returnPath');
      const token = localStorage.getItem('token');
      const verifiedMobile = localStorage.getItem('verifiedMobile');
      if (token && verifiedMobile) {
        setIsAuthenticated(true);
        setUserMobile(verifiedMobile);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/gallery-events?populate=*`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error?.message || `Server responded with status ${response.status}`);
        }

        const { data } = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        // transform data
        const transformedEvents = data.map(event => ({
          id: event.id,
          documentId: event.documentId,
          name: event.Name,
          description: event.Description,
          date: event.Date,
          images: event.Images || [],
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          publishedAt: event.publishedAt
        }));

        setEvents(transformedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery events:', err);
        setError(err.message || 'Failed to load gallery events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedEvent(null);
    setSelectedImageIdx(0);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateImage = useCallback((direction) => {
    if (!selectedEvent) return;
    
    const totalImages = selectedEvent.images.length;
    setSelectedImageIdx(prev => {
      if (direction === 'next') {
        return (prev + 1) % totalImages;
      } else {
        return (prev - 1 + totalImages) % totalImages;
      }
    });
  }, [selectedEvent]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedEvent) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent, navigateImage, closeLightbox]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Add helper functions for dropdowns
  const getFilteredLocalPanchayats = (regionalAssembly) => {
    try {
      if (!regionalAssembly || !LOCAL_PANCHAYATS[regionalAssembly]) return [];
      return Object.keys(LOCAL_PANCHAYATS[regionalAssembly]);
    } catch (error) {
      console.error('Error in getFilteredLocalPanchayats:', error);
      return [];
    }
  };

  const handleRegistrationInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => {
      const newForm = { ...prev, [name]: value };

      // Reset dependent fields when parent field changes
      if (name === 'state') {
        newForm.district = '';
        newForm.localBody = '';
        newForm.gramPanchayat = '';
        newForm.regionalAssembly = '';
        newForm.localPanchayatTrust = '';
        newForm.localPanchayatName = '';
        newForm.subLocalPanchayat = '';
      } else if (name === 'district') {
        newForm.localBody = '';
        newForm.gramPanchayat = '';
        newForm.subLocalPanchayat = '';
      } else if (name === 'localBody') {
        newForm.gramPanchayat = '';
      } else if (name === 'regionalAssembly') {
        newForm.localPanchayatTrust = '';
        newForm.localPanchayatName = '';
        newForm.subLocalPanchayat = '';
      }

      return newForm;
    });

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!registrationForm.name) errors.name = 'Name is required';
    if (!registrationForm.mobileNumber) errors.mobileNumber = 'Mobile number is required';
    if (registrationForm.mobileNumber && !/^\d{10}$/.test(registrationForm.mobileNumber)) {
      errors.mobileNumber = 'Invalid mobile number';
    }
    if (!registrationForm.gender) errors.gender = 'Gender is required';
    if (!registrationForm.nationality) errors.nationality = 'Nationality is required';
    if (!registrationForm.state) errors.state = 'State is required';
    if (!registrationForm.district) errors.district = 'District is required';
    if (!registrationForm.localBody) errors.localBody = 'Local Body is required';
    if (!registrationForm.gramPanchayat) errors.gramPanchayat = 'Gram Panchayat is required';
    if (!registrationForm.regionalAssembly) errors.regionalAssembly = 'Regional Assembly is required';
    if (!registrationForm.localPanchayatTrust) errors.localPanchayatTrust = 'Local Panchayat Trust is required';
    if (!registrationForm.localPanchayatName) errors.localPanchayatName = 'Local Panchayat Name is required';
    if (!registrationForm.subLocalPanchayat) errors.subLocalPanchayat = 'Sub Local Panchayat is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Format the form data according to the backend structure
      const formattedData = formatFormData({
        ...registrationForm,
        display_picture: null,
        email: '',
        birthDate: '',
        marriageDate: '',
        education: '',
        currentAddress: '',
        workType: 'Other',
        suggestions: '',
        location_details: {
          state: registrationForm.state,
          district: registrationForm.district,
          local_body: registrationForm.localBody,
          gram_panchayat: registrationForm.gramPanchayat,
          regional_assembly: registrationForm.regionalAssembly,
          local_panchayat_trust: registrationForm.localPanchayatTrust,
          local_panchayat_name: registrationForm.localPanchayatName,
          sub_local_panchayat: registrationForm.subLocalPanchayat
        }
      });

      // First create the registration
      const registrationResponse = await fetch(`${API_URL}/api/registration-pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: formattedData })
      });

      if (!registrationResponse.ok) {
        const errorData = await registrationResponse.json();
        throw new Error(errorData?.error?.message || 'Registration failed');
      }

      // Then create MPIN (using last 4 digits of mobile as default MPIN)
      const defaultMpin = registrationForm.mobileNumber.slice(-4);
      const mpinResponse = await fetch(`${API_URL}/api/create-mpin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobileNumber: registrationForm.mobileNumber,
          mpin: defaultMpin
        })
      });

      if (!mpinResponse.ok) {
        throw new Error('MPIN creation failed');
      }

      // Finally, verify MPIN to get JWT token
      const verifyResponse = await fetch(`${API_URL}/api/verify-mpin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobileNumber: registrationForm.mobileNumber,
          mpin: defaultMpin
        })
      });

      const verifyData = await verifyResponse.json();
      if (verifyResponse.ok && verifyData.jwt) {
        localStorage.setItem('token', verifyData.jwt);
        localStorage.setItem('verifiedMobile', registrationForm.mobileNumber);
        setIsAuthenticated(true);
        setShowRegistrationModal(false);
        // If there was a selected event, show it
        if (selectedEvent) {
          setSelectedImageIdx(0);
          document.body.style.overflow = 'hidden';
        }
      } else {
        throw new Error('Failed to verify MPIN');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormErrors(prev => ({
        ...prev,
        submit: error.message || 'Registration failed. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-100">
      {/* Hero Section - Always visible */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-orange-800"></div>
        <div className="absolute inset-0 bg-[url('/gallery-bg.webp')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
        
        <div className="relative pt-32 pb-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-xl">
              <Image className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {t('gallery.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {t('gallery.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Login/MPIN Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t('gallery.enterMpin')}
            </h3>
            
            <form onSubmit={handleMpinVerify}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('gallery.mpinLabel')}
                  </label>
                  <input
                    type="password"
                    value={mpin}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 4 && /^\d*$/.test(value)) {
                        setMpin(value);
                        setMpinError('');
                      }
                    }}
                    className={`w-full px-4 py-2 text-center text-lg tracking-widest border rounded-lg ${
                      mpinError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={4}
                    placeholder="••••"
                    autoFocus
                  />
                  {mpinError && (
                    <p className="mt-1 text-sm text-red-600">{mpinError}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setMpin('');
                      setMpinError('');
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={verifyingMpin}
                  >
                    {t('common.back')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    disabled={verifyingMpin || mpin.length !== 4}
                  >
                    {verifyingMpin ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      t('common.verify')
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Quick Registration</h3>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={registrationForm.name}
                    onChange={handleRegistrationInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={registrationForm.mobileNumber}
                    onChange={handleRegistrationInputChange}
                    maxLength={10}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2`}
                  />
                  {formErrors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender *</label>
                  <select
                    name="gender"
                    value={registrationForm.gender}
                    onChange={handleRegistrationInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.gender ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {formErrors.gender && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationality *</label>
                  <select
                    name="nationality"
                    value={registrationForm.nationality}
                    onChange={handleRegistrationInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      formErrors.nationality ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2`}
                  >
                    <option value="">Select Nationality</option>
                    <option value="Indian">Indian</option>
                    <option value="Non-Indian">Non-Indian</option>
                  </select>
                  {formErrors.nationality && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.nationality}</p>
                  )}
                </div>
              </div>

              {/* Community Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gotra</label>
                  <select
                    name="gotra"
                    value={registrationForm.gotra}
                    onChange={handleRegistrationInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">Select Gotra</option>
                    {Object.keys(gotraAaknaMap).map((gotra) => (
                      <option key={gotra} value={gotra}>
                        {gotra}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Aakna</label>
                  <select
                    name="aakna"
                    value={registrationForm.aakna}
                    onChange={handleRegistrationInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    disabled={!registrationForm.gotra}
                  >
                    <option value="">Select Aakna</option>
                    {getAaknaOptions().map((aakna) => (
                      <option key={aakna} value={aakna}>
                        {aakna}
                      </option>
                    ))}
                  </select>
                  {!registrationForm.gotra && (
                    <p className="text-gray-500 text-xs mt-2 ml-1 italic">
                      Select a Gotra first to see available Aakna options
                    </p>
                  )}
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State *</label>
                    <select
                      name="state"
                      value={registrationForm.state}
                      onChange={handleRegistrationInputChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.state ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2`}
                    >
                      <option value="">Select State</option>
                      {STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {formErrors.state && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">District *</label>
                    <select
                      name="district"
                      value={registrationForm.district}
                      onChange={handleRegistrationInputChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.district ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2`}
                      disabled={!registrationForm.state}
                    >
                      <option value="">Select District</option>
                      {registrationForm.state && STATE_TO_DISTRICTS[registrationForm.state]?.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {formErrors.district && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.district}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Local Body *</label>
                    <select
                      name="localBody"
                      value={registrationForm.localBody}
                      onChange={handleRegistrationInputChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.localBody ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2`}
                      disabled={!registrationForm.district}
                    >
                      <option value="">Select Local Body</option>
                      {registrationForm.district && getLocalBodies(registrationForm.district).map(lb => (
                        <option key={lb} value={lb}>{lb}</option>
                      ))}
                    </select>
                    {formErrors.localBody && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.localBody}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gram Panchayat *</label>
                    <select
                      name="gramPanchayat"
                      value={registrationForm.gramPanchayat}
                      onChange={handleRegistrationInputChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.gramPanchayat ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2`}
                      disabled={!registrationForm.district || !registrationForm.localBody}
                    >
                      <option value="">Select Gram Panchayat</option>
                      {registrationForm.district && registrationForm.localBody && 
                        getGramPanchayats(registrationForm.district).map((gp, index) => (
                          <option key={`${gp}-${index}`} value={gp}>{gp}</option>
                        ))
                      }
                    </select>
                    {formErrors.gramPanchayat && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.gramPanchayat}</p>
                    )}
                    {!registrationForm.district && (
                      <p className="text-gray-500 text-xs mt-1">Please select a district first</p>
                    )}
                    {registrationForm.district && !registrationForm.localBody && (
                      <p className="text-gray-500 text-xs mt-1">Please select a local body first</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Regional Assembly *</label>
                    <select
                      name="regionalAssembly"
                      value={registrationForm.regionalAssembly}
                      onChange={handleRegistrationInputChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.regionalAssembly ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2`}
                    >
                      <option value="">Select Regional Assembly</option>
                      {Object.keys(LOCAL_PANCHAYATS || {}).map(assembly => (
                        <option key={assembly} value={assembly}>{assembly}</option>
                      ))}
                    </select>
                    {formErrors.regionalAssembly && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.regionalAssembly}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Local Panchayat Trust *</label>
                    <select
                      name="localPanchayatTrust"
                      value={registrationForm.localPanchayatTrust}
                      onChange={handleRegistrationInputChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.localPanchayatTrust ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2`}
                      disabled={!registrationForm.regionalAssembly}
                    >
                      <option value="">Select Local Panchayat Trust</option>
                      {registrationForm.regionalAssembly && 
                        getFilteredLocalPanchayats(registrationForm.regionalAssembly).map((trust, index) => (
                          <option key={`${trust}-${index}`} value={trust}>{trust}</option>
                        ))
                      }
                    </select>
                    {formErrors.localPanchayatTrust && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.localPanchayatTrust}</p>
                    )}
                    {!registrationForm.regionalAssembly && (
                      <p className="text-gray-500 text-xs mt-1">Please select a regional assembly first</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Local Panchayat Name *</label>
                    <select
                      name="localPanchayatName"
                      value={registrationForm.localPanchayatName}
                      onChange={handleRegistrationInputChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.localPanchayatName ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2`}
                    >
                      <option value="">Select Local Panchayat Name</option>
                      {LOCAL_PANCHAYAT_NAMES.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    {formErrors.localPanchayatName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.localPanchayatName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sub Local Panchayat *</label>
                    <select
                      name="subLocalPanchayat"
                      value={registrationForm.subLocalPanchayat}
                      onChange={handleRegistrationInputChange}
                      className={`mt-1 block w-full rounded-md border ${
                        formErrors.subLocalPanchayat ? 'border-red-500' : 'border-gray-300'
                      } px-3 py-2`}
                      disabled={!registrationForm.regionalAssembly || !registrationForm.district}
                    >
                      <option value="">Select Sub Local Panchayat</option>
                      {registrationForm.regionalAssembly && registrationForm.district && 
                        getSubLocalPanchayats(registrationForm.regionalAssembly, registrationForm.district).map(slp => (
                          <option key={slp} value={slp}>{slp}</option>
                        ))
                      }
                    </select>
                    {formErrors.subLocalPanchayat && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.subLocalPanchayat}</p>
                    )}
                  </div>
                </div>
              </div>

              {formErrors.submit && (
                <p className="text-red-600 text-sm">{formErrors.submit}</p>
              )}

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px]"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events Grid Section - Shows loading/error states */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading gallery events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No gallery events available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  {!isAuthenticated && (
                    <div className="absolute inset-0 z-20 bg-black/25 backdrop-blur-[2px] flex flex-col items-center justify-center p-6">
                      <Lock className="w-12 h-12 text-white/90 mb-4" strokeWidth={1.5} />
                      <p className="text-white/90 text-center text-lg mb-4 font-medium">
                        {t('gallery.loginRequired') || 'Please login to view gallery images'}
                      </p>
                      <button
                        onClick={() => setShowRegistrationModal(true)}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-6 rounded-full font-semibold transition-colors duration-200"
                      >
                        {t('gallery.registerToView') || 'Register to View'}
                      </button>
                    </div>
                  )}
                  <img
                    src={event.images[0]?.url || '/placeholder-image.jpg'}
                    alt={event.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${!isAuthenticated ? 'filter blur-[1px]' : ''}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => openLightbox(event)}
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-full font-semibold hover:bg-white/30 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isAuthenticated ? (
                        <>
                          <Maximize2 className="w-4 h-4" />
                          {t('gallery.viewGallery')}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          {t('gallery.loginToView')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {event.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="flex items-center">
                    <span className="text-red-600 font-semibold text-sm flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      {event.images.length} {t('gallery.photos')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedEvent && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          ></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label={t('gallery.lightbox.close')}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-2">{selectedEvent.name}</h2>
              <p className="text-white/90 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedEvent.date)}
              </p>
            </div>

            {/* Image Display */}
            <div className="relative bg-gray-900">
              <img
                src={selectedEvent.images[selectedImageIdx].url}
                alt={selectedEvent.images[selectedImageIdx].alt}
                className="w-full h-96 md:h-[500px] object-contain"
              />
              
              {/* Navigation Arrows */}
              {selectedEvent.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={t('gallery.lightbox.previous')}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={t('gallery.lightbox.next')}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  {selectedEvent.images[selectedImageIdx].alt}
                </p>
                <span className="text-sm text-gray-500">
                  {t('gallery.lightbox.imageOf', {
                    current: selectedImageIdx + 1,
                    total: selectedEvent.images.length
                  })}
                </span>
              </div>
              
              {/* Thumbnail Navigation */}
              {selectedEvent.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedEvent.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        idx === selectedImageIdx
                          ? 'border-red-500 ring-2 ring-red-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;