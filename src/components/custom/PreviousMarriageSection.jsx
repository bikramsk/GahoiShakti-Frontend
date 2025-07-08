import React from 'react';
import { useTranslation } from 'react-i18next';
import { FIXED_CODES } from '../../utils/form/formUtils';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://admin.gahoishakti.in'
  : 'http://localhost:1340';


const GAHOI_GOTRAS = [
  "Vasar/Vastil/Vasal",
  "Gol",
  "Gangal/Gagil",
  "Badal/Waghil/Bandal",
  "Kocchal/Kochil",
  "Jaital",
  "Vachhil",
  "Kachhil",
  "Bhaal",
  "Kohil",
  "Kasiv",
  "Kasav",
  "Single"
];

// Map Gotra to Aakna 
const gotraAaknaMap = {
  "Vasar/Vastil/Vasal": [
    "Rusiya",
    "Arusiya",
    "Behre",
    "Bahre",
    "Pahariya",
    "Reja",
    "Mar",
    "Amar",
    "Mor",
    "Sethiya",
    "Damele",
    "Kathal",
    "Kathil",
    "Marele",
    "Nahar",
    "Naar",
    "KareKhemau",
    "Raghare",
    "Bagar",
    "Tudha",
    "Sah",
    "Saav",
    "Dangan ke",
    "Seth (Mau ke/Paliya ke/Khakshis ke/Mahuta ke/Bhaghoi ke)",
    "Kasav",
    "Khaira",
    "Sarawgi (Mau ke)",
    "Sahdele",
    "Sadele",
    "Changele",
    "Chungele",
    "Mungele",
    "Dhoosar",
    "Dadraya",
    "Patodiya",
    "Patodi",
    "Paterha",
    "Jhanjhar",
    "Kharaya",
    "Baraya",
    "Kunayar",
    "Purpuriya",
    "Puranpuriya",
    "Kajar",
    "Kshankshar",
  ],

  Gol: [
    "Andhi",
    "Baderiya",
    "Bamoriya",
    "Bardiya",
    "Bed",
    "Bhagoriya",
    "Bijpuriya",
    "Bilaiya",
    "Chiroliya",
    "Tarsolliya",
    "Trisolliya",
    "Kharaya",
    "Jakonya",
    "Jauriya",
    "Joliya",
    "Jalaounya",
    "Kanthariya",
    "Itoriya",
    "Itodiya",
    "Katare",
    "Kurele",
    "Vilaiya",
    "Nigoti",
    "Nignotiya",
    "Soni",
    "Rawat",
    "Sarawagi",
    "Brijpuriya",
    "Sijariya",
    "Gandhi",
    "Bamoriya",
    "Amoriya",
    "Dohariya Devaraha",
    "Devadhiya",
    "Chungele",
    "Seth (Rora ke)",
    "Mungele",
    "Mangole",
    "Kurothiya",
    "Khaira",
    "Bhagorya",
    "Maunya",
    "Hadyal",
    "Digoriya",
    "Dhingauriya",
    "Jaar",
    "Patwari",
    "Gandhi",
  ],

  "Gangal / Gagil": [
    "Geda",
    "Chapra",
    "Chupara",
    "Rawat",
    "Nogaraiya",
    "Jhudele/Kshurele",
    "Nisunge/Nisuri",
    "Seth (Nolha ke)",
    "Dangre",
    "Barele",
    "Barol",
    "Nolha/Nilha",
    "Mihi ke Kunwar",
    "Saab/Sahu",
  ],

  "Badal / Waghil / Bandal": [
    "Chauda",
    "Chodha",
    "Chouda",
    "Soni",
    "Kharya/Khairya",
    "Seth (Kathori, Karoli ke)",
    "Patraiya/Paterha",
    "Barha/Barehe",
    "Hathnoria/Hathnotiya",
    "Damorha",
    "Lakhatkiya",
    "Paharu",
    "Dagarhiha",
    "Kuretiya/Kuraithiya",
    "Gugoriya/Ugoriya",
    "Jugoriya",
    "Sulganiya/Sulghaniya",
    "Amroha",
    "Dadam",
    "Sawla",
    "Wageriya",
  ],

  "Kocchal / Kochil": [
    "Neekhra",
    "Indurkhiya",
    "Kastwar",
    "Kurele",
    "Misurha/Masaurya",
    "Sawla/Saula/Chawla",
    "Viswari",
    "Pahariya",
    "Piparsania",
    "Dadarya",
    "Nachhola",
    "Baronya",
    "Binaurya",
    "Kharya/Khara",
    "Iksade",
    "Sulganiya/Sulghaniya",
    "Kanjoulya",
    "Nigoti (Nigotiya)",
    "Rawat",
    "Seth",
    "Soni",
  ],

  Jaital: [
    "Baderia",
    "Kathal/Kathil",
    "Nagariya",
    "Rikholya/Lakhourya",
    "Seth (Bareth ke)",
    "Shikoly/Sokorya/Shipoulya",
    "Lahariya",
    "Sirojiya",
  ],

  Vachhil: [
    "Kuchiya/Kuchha",
    "Tikraya/Tapakle",
    "Damele",
    "Barsainya",
    "Tapa",
    "Kanakne",
    "Matele/Mahtele",
    "Hunka",
    "Seth (Nawgaon/Negua ke)",
    "Badonya",
    "Gandhi",
    "Rikholya",
    "Dhanoriya",
    "Itoriya/Itodiya",
    "Sakeray/Sakahere",
    "Soni",
    "Khadsariya/Kharsadiya",
    "Badhiya",
    "Vinaurya",
    "Sirsoniya/Risoniya",
    "Shikoly/Sokorya/Shipoulya",
    "Khangat",
    "Katare",
    "Sarawgi (Mau ke)",
    "Chungele",
  ],

  Kachhil: [
    "Chapra/Chupara",
    "Tusele",
    "Piparsaniya",
    "Seth (Padri ke)",
    "Dhusar",
    "Bhondiya (Bhondu)",
    "Amaulya/Amauriya",
    "Jhudele/Jhad",
    "Rawat",
    "Katare",
  ],

  Bhaal: [
    "Kudraya",
    "Khard",
    "Suhane/Sohane",
    "Dengre/Dagre",
    "Teetbilasi/Teetbirasi",
    "Ghura",
    "Khangat",
    "Bajrang Gadiya",
    "Naina/Nehna",
    "Pachnole/Pachraulya",
    "Sah/Saav",
    "Seth (Chandaiya ke)",
    "Chandaiya/Chandraseniya",
    "Jhudele/Jurele/Jhood",
  ],

  Kohil: ["Kandele", "Lohiya/Loiya", "Shaav/Shah (Unnao ke)", "Jhuke/Jhunk"],

  Kasiv: [
    "Asoo",
    "Asoopi",
    "Asooti",
    "Khantal",
    "Beder",
    "Badil",
    "Baidal",
    "Sudipa",
    "Asudipa",
    "Deepa/Teepa",
  ],

  Kasav: [
    "Asoo",
    "Asoopi",
    "Asooti",
    "Khantal",
    "Beder",
    "Badil",
    "Baidal",
    "Sudipa",
    "Asudipa",
    "Deepa/Teepa",
  ],
  Single: [],
};

const PreviousMarriageSection = ({ formData, setFormData, errors, setErrors }) => {
  const { t } = useTranslation();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      previousMarriage: {
        ...prev.previousMarriage,
        [field]: value,
        ...(field === 'spouse_gotra' ? { spouse_akna: '' } : {})
      }
    }));

    if (errors?.[`previous_marriage.${field}`]) {
      setErrors(prev => ({ 
        ...prev, 
        [`previous_marriage.${field}`]: undefined 
      }));
    }
  };

  const handleFileChange = async (field, file) => {
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('files', file);
    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await response.json();
      if (data && data[0] && data[0].id) {
        handleInputChange(field, data[0].id);
      } else {
        alert(t('errors.somethingWentWrong'));
      }
    } catch (error) {
      alert(t('errors.somethingWentWrong'));
      console.error(error);
    }
  };

  // Children dynamic fields
  const children = formData.previousMarriage?.children || [];
  const handleChildChange = (index, key, value) => {
    const updated = [...children];
    updated[index] = { 
      ...updated[index], 
      [key]: key === 'age' ? parseInt(value, 10) || '' : value 
    };
    handleInputChange('children', updated);
  };

  const addChild = () => {
    handleInputChange('children', [...children, { child_name: '', age: '', gender: '' }]);
  };

  const removeChild = (index) => {
    const updated = children.filter((_, i) => i !== index);
    handleInputChange('children', updated);
  };

  const sortedGotraOptions = GAHOI_GOTRAS.sort((a, b) => a.localeCompare(b));
  const getAaknaOptions = () => {
    const selectedGotra = formData.previousMarriage?.spouse_gotra;
    if (!selectedGotra) return [];
    return gotraAaknaMap[selectedGotra] || [];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 to-white px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          {t('previousMarriage.title')}
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('previousMarriage.spouse.name')}
            </label>
            <input
              type="text"
              value={formData.previousMarriage?.spouse_name || ''}
              onChange={(e) => handleInputChange('spouse_name', e.target.value)}
              className={`mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors?.['previous_marriage.spouse_name'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={t('previousMarriage.spouse.name_placeholder')}
            />
            {errors?.['previous_marriage.spouse_name'] && (
              <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('previousMarriage.spouse.gotra')}
            </label>
            <select
              value={formData.previousMarriage?.spouse_gotra || ''}
              onChange={(e) => handleInputChange('spouse_gotra', e.target.value)}
              className={`mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors?.['previous_marriage.spouse_gotra'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">{t('previousMarriage.spouse.gotra_placeholder')}</option>
              {sortedGotraOptions.map(gotra => (
                <option key={gotra} value={gotra}>{gotra}</option>
              ))}
            </select>
            {errors?.['previous_marriage.spouse_gotra'] && (
              <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('previousMarriage.spouse.akna')}
            </label>
            <select
              value={formData.previousMarriage?.spouse_akna || ''}
              onChange={(e) => handleInputChange('spouse_akna', e.target.value)}
              className={`mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors?.['previous_marriage.spouse_akna'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={!formData.previousMarriage?.spouse_gotra}
            >
              <option value="">{t('previousMarriage.spouse.akna_placeholder')}</option>
              {getAaknaOptions().map(akna => (
                <option key={akna} value={akna}>{akna}</option>
              ))}
            </select>
            {errors?.['previous_marriage.spouse_akna'] && (
              <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
            )}
            {!formData.previousMarriage?.spouse_gotra && (
              <p className="text-gray-500 text-xs mt-2 ml-1 italic">
                {t('previousMarriage.spouse.akna_help')}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('previousMarriage.spouse.dob')}
            </label>
            <input
              type="date"
              value={formData.previousMarriage?.spouse_dob || ''}
              onChange={(e) => handleInputChange('spouse_dob', e.target.value)}
              className={`mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors?.['previous_marriage.spouse_dob'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={t('previousMarriage.spouse.dob_placeholder')}
            />
            {errors?.['previous_marriage.spouse_dob'] && (
              <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
            )}
          </div>
        </div>

        {/* Children Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('previousMarriage.children.living_with')}
            </label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="children_living_with"
                  value="yes"
                  checked={formData.previousMarriage?.children_living_with === 'yes'}
                  onChange={(e) => handleInputChange('children_living_with', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.children_living_with'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">{t('common.yes')}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="children_living_with"
                  value="no"
                  checked={formData.previousMarriage?.children_living_with === 'no'}
                  onChange={(e) => handleInputChange('children_living_with', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.children_living_with'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">{t('common.no')}</span>
              </label>
            </div>
            {errors?.['previous_marriage.children_living_with'] && (
              <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
            )}
          </div>

          {formData.previousMarriage?.children_living_with === 'yes' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('previousMarriage.children.info_title')}
              </label>
              {children.map((child, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={child.child_name || ''}
                      onChange={e => handleChildChange(idx, 'child_name', e.target.value)}
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full ${
                        errors?.[`previous_marriage.children.${idx}.name`] ? 'border-red-500 bg-red-50' : ''
                      }`}
                      placeholder={t('previousMarriage.children.child_name_placeholder', { number: idx + 1 })}
                    />
                    {errors?.[`previous_marriage.children.${idx}.name`] && (
                      <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <select
                      value={child.gender || ''}
                      onChange={e => handleChildChange(idx, 'gender', e.target.value)}
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full ${
                        errors?.[`previous_marriage.children.${idx}.gender`] ? 'border-red-500 bg-red-50' : ''
                      }`}
                    >
                      <option value="">{t('previousMarriage.children.gender')}</option>
                      <option value="Male">{t('previousMarriage.children.gender_options.male')}</option>
                      <option value="Female">{t('previousMarriage.children.gender_options.female')}</option>
                    </select>
                    {errors?.[`previous_marriage.children.${idx}.gender`] && (
                      <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
                    )}
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={child.age || ''}
                      onChange={e => handleChildChange(idx, 'age', e.target.value)}
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full ${
                        errors?.[`previous_marriage.children.${idx}.age`] ? 'border-red-500 bg-red-50' : ''
                      }`}
                      placeholder={t('previousMarriage.children.age_placeholder')}
                      min="0"
                    />
                    {errors?.[`previous_marriage.children.${idx}.age`] && (
                      <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeChild(idx)} 
                    className="text-red-600 hover:text-red-800 px-2"
                    title={t('previousMarriage.children.remove_child')}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addChild} 
                className="mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 text-sm"
              >
                {t('previousMarriage.children.add_child')}
              </button>
            </div>
          )}
        </div>

        {/* Partner Preferences */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('previousMarriage.preferences.kundli_match')}
            </label>
            <div className="mt-1 flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="want_kundli_match"
                  value="yes"
                  checked={formData.previousMarriage?.want_kundli_match === 'yes'}
                  onChange={(e) => handleInputChange('want_kundli_match', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.want_kundli_match'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">{t('common.yes')}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="want_kundli_match"
                  value="no"
                  checked={formData.previousMarriage?.want_kundli_match === 'no'}
                  onChange={(e) => handleInputChange('want_kundli_match', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.want_kundli_match'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">{t('common.no')}</span>
              </label>
            </div>
            {errors?.['previous_marriage.want_kundli_match'] && (
              <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('previousMarriage.preferences.accept_children')}
            </label>
            <div className="mt-1 flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accept_partner_with_children"
                  value="yes"
                  checked={formData.previousMarriage?.accept_partner_with_children === 'yes'}
                  onChange={(e) => handleInputChange('accept_partner_with_children', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.accept_partner_with_children'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">{t('common.yes')}</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accept_partner_with_children"
                  value="no"
                  checked={formData.previousMarriage?.accept_partner_with_children === 'no'}
                  onChange={(e) => handleInputChange('accept_partner_with_children', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.accept_partner_with_children'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">{t('common.no')}</span>
              </label>
            </div>
            {errors?.['previous_marriage.accept_partner_with_children'] && (
              <p className="text-red-500 text-xs mt-1">{t('previousMarriage.validation.required')}</p>
            )}
          </div>
        </div>

        {/* Document Uploads */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">{t('previousMarriage.documents.title')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('previousMarriage.documents.payment_proof')}
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange('payment_proof', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                accept=".pdf,image/*"
              />
              {formData.previousMarriage?.payment_proof && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">
                    {typeof formData.previousMarriage.payment_proof === 'string' 
                      ? t('previousMarriage.documents.uploaded')
                      : formData.previousMarriage.payment_proof.name}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => handleInputChange('payment_proof', null)} 
                    className="text-red-500 text-xs ml-2"
                  >
                    {t('previousMarriage.documents.remove')}
                  </button>
                </div>
              )}
              {errors && errors['previous_marriage.payment_proof'] && (
                <span className="text-red-500 text-xs">{t('previousMarriage.validation.fileRequired')}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousMarriageSection; 