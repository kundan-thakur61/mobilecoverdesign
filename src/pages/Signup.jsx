import { useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirectUrl');
      if (redirectUrl) {
        navigate(decodeURIComponent(redirectUrl));
      } else {
        navigate('/');
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  // Handle Google Sign-In callback
  const handleGoogleCallback = useCallback(async (response) => {
    if (response.credential) {
      try {
        const result = await dispatch(googleLogin(response.credential));
        if (googleLogin.fulfilled.match(result)) {
          toast.success('Account created! Welcome to CoverGhar');
        } else {
          toast.error(result.payload || 'Sign up failed');
        }
      } catch (err) {
        toast.error('An error occurred during sign up');
      }
    }
  }, [dispatch]);

  // Initialize Google Sign-In
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('Google Client ID not configured');
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the Google Sign-In button
        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'center',
          }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [handleGoogleCallback]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <SEO
        title="Create Account | CoverGhar"
        description="Create your CoverGhar account to start shopping for custom mobile covers"
        url="/register"
      />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">CG</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Sign up with Google to get started</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Why join CoverGhar?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Design your own custom mobile covers
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save your designs and orders
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Track your shipments in real-time
                </li>
              </ul>
            </div>

            {/* Google Sign-Up Button */}
            <div className="space-y-6">
              <div id="google-signup-button" className="flex justify-center"></div>
              
              {!GOOGLE_CLIENT_ID && (
                <div className="text-center text-sm text-red-600">
                  Google Sign-Up is not configured. Please contact support.
                </div>
              )}
            </div>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Terms */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our{' '}
                <Link to="/terms-conditions" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
