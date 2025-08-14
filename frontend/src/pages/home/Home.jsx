import React, { useState } from 'react'
import axios from 'axios'
import NavBar from '../../components/NavBar'
import Footer from '../../components/Footer'
import PanValidationCard from '../../components/PanValidationCard'

const Home = () => {
  const [formData, setFormData] = useState({
    aadhaar: '',
    name: '',
    consent: false
  })
  
  const [validationErrors, setValidationErrors] = useState({
    aadhaar: '',
    name: ''
  })

  const [showPanCard, setShowPanCard] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  // Validation patterns
  const aadhaarPattern = /^\d{12}$/
  const namePattern = /^[a-zA-Z\s]{2,50}$/
  
  // Real-time validation function
  const validateField = (name, value) => {
    let error = ''
    
    switch (name) {
      case 'aadhaar': {
        // Remove spaces and check if it's exactly 12 digits
        const cleanAadhaar = value.replace(/\s/g, '')
        if (!cleanAadhaar) {
          error = 'Aadhaar number is required'
        } else if (!aadhaarPattern.test(cleanAadhaar)) {
          error = 'Aadhaar must be exactly 12 digits'
        }
        break
      }
        
      case 'name':
        if (!value.trim()) {
          error = 'Name is required'
        } else if (!namePattern.test(value.trim())) {
          error = 'Name should contain only letters and spaces (2-50 characters)'
        }
        break
        
      default:
        break
    }
    
    return error
  }
  
  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    // For Aadhaar, format with spaces for better readability
    let formattedValue = newValue
    if (name === 'aadhaar' && type !== 'checkbox') {
      // Remove all non-digits and limit to 12 digits
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12)
      // Add spaces every 4 digits
      formattedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ')
    }

    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? newValue : formattedValue
    }))
    
    // Validate field if it's not checkbox
    if (type !== 'checkbox') {
      const error = validateField(name, formattedValue)
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }
  
  // Check if form is valid
  const isFormValid = () => {
    const aadhaarClean = formData.aadhaar.replace(/\s/g, '')
    return (
      aadhaarPattern.test(aadhaarClean) &&
      namePattern.test(formData.name.trim()) &&
      formData.consent &&
      !validationErrors.aadhaar &&
      !validationErrors.name
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusText('');
    
    if (showOtpField) {
      // Handle OTP verification
      setIsVerifyingOtp(true);
      setOtpError('');
      axios.post('http://localhost:8000/validation/adhaar/verify', {
        number: formData.aadhaar.replace(/\s/g, ''),
        otp: otpValue,
      })
      .then(function (response) {
        console.log(response);
        setIsVerifyingOtp(false);
        setShowPanCard(true); // Show PAN card after successful OTP verification
        setShowOtpField(false); // Hide OTP field
        setAadhaarVerified(true);
      })
      .catch(function (error) {
        console.log(error);
        setIsVerifyingOtp(false);
        setOtpError('Invalid OTP. Please try again.');
      });
    } else {
      // Handle Aadhaar validation
      if (isFormValid()) {
        axios.post('http://localhost:8000/validation/adhaar', {
          number: formData.aadhaar.replace(/\s/g, ''), // Remove spaces and use 'number' field
          name: formData.name
        })
        .then(function (response) {
          console.log(response);
          setShowOtpField(true); // Show OTP field on successful validation
        })
        .catch(function (error) {
          console.log(error);
          setStatusText("Name and number don't match.")
        });
      }
    }
  }

  const handleOtpChange = (e) => {
    setOtpValue(e.target.value);
  }

  return (
    <div>
      <NavBar />
      
      {/* Add padding-top to account for fixed navbar and responsive heading */}
      <div className="pt-17">
        <div className="bg-gray-100 py-6 px-4">
          <h1 className="text-center text-blue-800 font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight mx-auto lg:whitespace-nowrap">
            UDYAM REGISTRATION FORM - For New Enterprise who are not Registered yet as MSME
          </h1>
        </div>
        
        {/* Main content area */}
        <div className="min-h-screen p-4 bg-white">
          {/* Aadhaar Verification Form */}
          <div className="max-w-6xl mx-auto">
            {/* Form Header */}
            <div className="bg-blue-500 text-white p-4 rounded-t-lg">
              <h2 className="text-lg font-semibold">Aadhaar Verification With OTP</h2>
            </div>
            
            {/* Form Content */}
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-b-lg p-6">
              {/* Input Fields - Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Aadhaar Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. Aadhaar Number/ आधार संख्या *
                  </label>
                  <input
                    type="text"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012"
                    maxLength="14" // 12 digits + 2 spaces
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      validationErrors.aadhaar 
                        ? 'border-red-500 focus:ring-red-500' 
                        : formData.aadhaar && !validationErrors.aadhaar 
                        ? 'border-green-500 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {validationErrors.aadhaar && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.aadhaar}
                    </p>
                  )}
                  {formData.aadhaar && !validationErrors.aadhaar && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Valid Aadhaar number
                    </p>
                  )}
                </div>
                
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Name of Entrepreneur / उद्यमी का नाम *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name as per Aadhaar"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      validationErrors.name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : formData.name && !validationErrors.name 
                        ? 'border-green-500 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {validationErrors.name}
                    </p>
                  )}
                  {formData.name && !validationErrors.name && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Valid name
                    </p>
                  )}
                </div>
              </div>
              
              {/* Information Points */}
              <div className="mb-6 space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <p>Aadhaar number shall be required for Udyam Registration.</p>
                </div>
                
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <p>The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).</p>
                </div>
                
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <p>In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a Trust, the organisation or its authorised signatory shall provide its GSTIN(As per applicability of CGST Act 2017 and as notified by the ministry of MSME 
                      <a href="#" className="text-blue-600 hover:underline ml-1">vide S.O. 1055(E) dated 05th March 2021</a>) and PAN along with its Aadhaar number.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Consent Checkbox */}
              <div className="mb-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                    I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for using my Aadhaar number as alloted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of India, have informed me that my aadhaar data will not be stored/shared. / मैं, आधार धारक, इस प्रकार उद्यम पंजीकरण के लिए यूआईडीएआई के साथ अपने आधार संख्या का उपयोग करने के लिए सूक्ष्म0म0उ0 मंत्रालय, भारत सरकार को अपनी सहमति देता हूं। एनआईसी / सूक्ष्म0म0उ0 मंत्रालय, भारत सरकार ने मुझे सूचित किया है कि मेरा आधार डेटा संग्रहीत / साझा नहीं किया जाएगा।
                  </label>
                </div>
                {!formData.consent && (formData.aadhaar || formData.name) && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Please provide consent to proceed
                  </p>
                )}
              </div>
              
              {/* Status Message */}
              {statusText && (
                <div className="mb-4">
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {statusText}
                  </p>
                </div>
              )}
              
              {/* OTP Field - Conditionally Rendered */}
              {showOtpField && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={otpValue}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    maxLength="6"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                      otpError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : otpValue 
                        ? 'border-green-500 focus:ring-green-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {otpError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {otpError}
                    </p>
                  )}
                </div>
              )}
              
              {/* Submit Button or Success Message */}
              <div className="flex justify-start">
                {aadhaarVerified ? (
                  <div className="text-green-600 font-medium py-2 px-6 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Your Aadhaar has been successfully verified. You can continue Udyam Registration process.
                  </div>
                ) : (
                  <button 
                    type="submit"
                    disabled={showOtpField ? !otpValue : !isFormValid()}
                    className={`font-medium py-2 px-6 rounded-md transition-colors duration-200 ${
                      (showOtpField ? otpValue : isFormValid())
                        ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {showOtpField ? 'Validate' : 'Validate & Generate OTP'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* PAN Validation Card - Conditionally Rendered */}
          {showPanCard && (
            <PanValidationCard />
          )}
          
          {/* Scrolling Text Below Card - Full Width */}
          <div className="w-full mt-8">
            <div className="py-3 overflow-hidden">
              <div className="whitespace-nowrap animate-marquee text-blue-600 font-medium text-lg">
                Activities (NIC codes) not covered under MSMED Act, 2006 for Udyam Registration
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
