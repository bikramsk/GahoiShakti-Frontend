import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, User, MapPin, Phone, Mail, Calendar, Users, Briefcase, X, ChevronDown } from 'lucide-react';
import { checkAuthenticationStatus } from '../../utils/authUtils';

const API_BASE = import.meta.env.VITE_PUBLIC_STRAPI_API_URL || "http://localhost:1340";

const PeopleSearch = () => {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');
  const resultsPerPage = 12;

  
  const [filters, setFilters] = useState({
    name: '',
    gender: '',
    ageMin: '',
    ageMax: '',
    maritalStatus: ''
  });

  
  const genderOptions = ['Male', 'Female'];
  const maritalStatusOptions = ['Married', 'Unmarried', 'Widow/Widower', 'Divorced'];


  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };


  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
    // Clear validation message when user type
    if (validationMessage) {
      setValidationMessage('');
    }
  };

  
  const clearFilters = () => {
    setFilters({
      name: '',
      gender: '',
      ageMin: '',
      ageMax: '',
      maritalStatus: ''
    });
    setCurrentPage(1);
    setValidationMessage(''); 
  };


  const performSearch = useCallback(async () => {
    setLoading(true);
    setValidationMessage('');
    try {
      const authStatus = checkAuthenticationStatus();
      
      // Allow search if user is authenticated (either regular auth or family profile viewer)
      if (!authStatus.isAuthenticated) {
        setValidationMessage(t('search.loginRequired', 'Please login to search for people'));
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');


    
      const hasFilters = filters.name || filters.gender || filters.ageMin || filters.ageMax || filters.maritalStatus;
      if (!hasFilters) {
        setValidationMessage(t('search.validationMessage', 'Please enter at least one search criteria (name, gender, age, or marital status)'));
        setLoading(false);
        return;
      }

  
      setValidationMessage('');

      
      const queryParams = new URLSearchParams();

     
      queryParams.append('page', currentPage);
      queryParams.append('pageSize', resultsPerPage);

      
      if (filters.name) {
        queryParams.append('name', filters.name);
      }
      if (filters.gender) {
        queryParams.append('gender', filters.gender);
      }
      if (filters.ageMin) {
        queryParams.append('ageMin', filters.ageMin);
      }
      if (filters.ageMax) {
        queryParams.append('ageMax', filters.ageMax);
      }
      if (filters.maritalStatus) {
        queryParams.append('maritalStatus', filters.maritalStatus);
      }


      const searchUrl = `${API_BASE}/api/people-search?${queryParams}`;

      // Prepare headers - only add Authorization if token exists
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(searchUrl, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setSearchResults(data.data || []);
      setTotalResults(data.meta?.pagination?.total || 0);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      alert(`Error: ${error.message} ${API_BASE}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, t]);

  
  useEffect(() => {
    if (hasSearched && currentPage > 1) {
      performSearch();
    }
  }, [currentPage, hasSearched, performSearch]);

 
  const handleSearch = () => {
    setCurrentPage(1);
    performSearch();
  };

  
  const totalPages = Math.ceil(totalResults / resultsPerPage);

return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">{t('search.title', 'Search People')}</h1>
        <p className="text-gray-500 mt-2">
          {t('search.subtitle', 'Find and connect with community members based on various criteria')}
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search.namePlaceholder', 'Search by name...')}
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? t('search.searching', 'Searching...') : t('search.search', 'Search')}
          </button>
        </div>

        {/* Advanced Filters */}
        <div className="mt-6 border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('search.gender', 'Gender')}
              </label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="">{t('search.selectGender', 'Select Gender')}</option>
                {genderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('search.ageRange', 'Age Range')}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t('search.ageMin', 'Min')}
                  value={filters.ageMin}
                  onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                  className="w-1/2 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  min="18"
                />
                <input
                  type="number"
                  placeholder={t('search.ageMax', 'Max')}
                  value={filters.ageMax}
                  onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                  className="w-1/2 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  min="18"
                />
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('search.maritalStatus', 'Marital Status')}
              </label>
              <select
                value={filters.maritalStatus}
                onChange={(e) => handleFilterChange('maritalStatus', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="">{t('search.selectMaritalStatus', 'Select Status')}</option>
                {maritalStatusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              {t('search.clearFilters', 'Clear Filters')}
            </button>
          </div>

          {/* Validation Message  */}
          {validationMessage && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {validationMessage}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

   
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {t('search.results', 'Search Results')} ({totalResults})
        </h2>
      </div>

     
      {loading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">{t('search.loading', 'Searching...')}</p>
        </div>
      )}

     
      {!loading && searchResults.length === 0 && hasSearched && (
        <div className="text-center py-16">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800">
            {t('search.noResults', 'No results found')}
          </h3>
          <p className="text-gray-500 mt-2">{t('search.noResultsDesc', 'Try adjusting your search criteria or filters')}</p>
        </div>
      )}

      {/* Results Grid */}
      {!loading && searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((person, index) => {
            const personalInfo = person.personal_information || {};
            const additionalDetails = person.additional_details || {};
            const regionalInfo = additionalDetails.regional_information || {};
            const age = calculateAge(additionalDetails.date_of_birth);

            let imageUrl = null;
            if (personalInfo.display_picture?.url) {
              imageUrl = personalInfo.display_picture.url.startsWith('http')
                ? personalInfo.display_picture.url
                : `${API_BASE}${personalInfo.display_picture.url}`;
            } else if (personalInfo.display_picture?.data?.attributes?.url) {
              const url = personalInfo.display_picture.data.attributes.url;
              imageUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
            }

            return (
              <div key={person.id || index} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
          
                <div className="flex justify-center mb-4 relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={personalInfo.full_name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentElement.querySelector('.fallback-avatar');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-600" />
                    </div>
                  )}
                  <div className="fallback-avatar w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center absolute top-0 left-0 hidden">
                    <User className="h-10 w-10 text-gray-600" />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{personalInfo.full_name || 'N/A'}</h3>
                  <div className="flex justify-center gap-3 text-sm text-gray-500 mt-1 mb-2">
                    {age && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {age} yrs
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {personalInfo.Gender || 'N/A'}
                    </span>
                  </div>
                  {person.marital_status && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {person.marital_status}
                    </span>
                  )}
                </div>

                {/* Contact Info */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {personalInfo.mobile_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span>{personalInfo.mobile_number}</span>
                    </div>
                  )}
                  {personalInfo.email_address && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="truncate">{personalInfo.email_address}</span>
                    </div>
                  )}
                  {(regionalInfo.State || regionalInfo.District) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span className="truncate">
                        {[regionalInfo.District, regionalInfo.State].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && searchResults.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            {t('search.previous', 'Previous')}
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    currentPage === pageNum
                      ? 'bg-red-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
          >
            {t('search.next', 'Next')}
          </button>
        </div>
      )}
    </div>
  </div>
);

};

export default PeopleSearch;