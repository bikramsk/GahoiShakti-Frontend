// Centralized authentication utilities for consistent auth state management

export const checkAuthenticationStatus = () => {
  // Check regular authentication
  const token = localStorage.getItem('token');
  const verifiedMobile = localStorage.getItem('verifiedMobile');
  const hasRegularAuth = token && verifiedMobile;

  // Check family profile viewing context
  const currentPath = window.location.pathname;
  const isFamilyProfilePage = currentPath.includes('/profile/document/');
  const hasViewedFamilyProfile = sessionStorage.getItem('hasViewedFamilyProfile') === 'true';

  // Set family profile viewing flag if currently on family profile page
  if (isFamilyProfilePage) {
    sessionStorage.setItem('hasViewedFamilyProfile', 'true');
    sessionStorage.setItem('lastFamilyProfilePath', currentPath);
  }

  // Return authentication status
  return {
    isAuthenticated: hasRegularAuth || isFamilyProfilePage || hasViewedFamilyProfile,
    hasRegularAuth,
    isFamilyProfileViewer: isFamilyProfilePage || hasViewedFamilyProfile,
    lastFamilyProfilePath: sessionStorage.getItem('lastFamilyProfilePath')
  };
};

export const clearAuthenticationState = () => {
  // Clear regular auth tokens
  localStorage.removeItem('token');
  localStorage.removeItem('verifiedMobile');
  localStorage.removeItem('documentId');
  localStorage.removeItem('mobile');
  localStorage.removeItem('userMobile');
  localStorage.removeItem('authMobile');
  localStorage.removeItem('loggedInMobile');

  // Clear family profile session data
  sessionStorage.removeItem('hasViewedFamilyProfile');
  sessionStorage.removeItem('lastFamilyProfilePath');
  sessionStorage.clear();
};

export const getMyAccountLink = () => {
  const authStatus = checkAuthenticationStatus();
  
  if (window.location.pathname.includes('/profile/document/')) {
    // If currently viewing a family profile, link to current profile
    return window.location.pathname;
  } else if (authStatus.isFamilyProfileViewer && authStatus.lastFamilyProfilePath) {
    // Link back to the last viewed family profile
    return authStatus.lastFamilyProfilePath;
  } else {
    // Otherwise, link to regular my-account page
    return '/my-account';
  }
};