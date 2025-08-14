import React, { useState } from 'react'

const PanValidationCard = ({ showPanCard = true }) => {
  const [formData, setFormData] = useState({
    organizationType: '',
    panNumber: '',
    panHolderName: '',
    dateOfBirth: '',
    panConsent: false
  })
  
  const [validationErrors, setValidationErrors] = useState({
    organizationType: '',
    panNumber: '',
    panHolderName: '',
    dateOfBirth: ''
  })

  // Validation patterns
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  const namePattern = /^[a-zA-Z\s]{2,50}$/
  const dobPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

  // Real-time validation function for PAN fields
  const validateField = (name, value) => {
    let error = ''
    
    switch (name) {
      case 'organizationType':
        if (!value.trim()) {
          error = 'Organization type is required'
        }
        break
        
      case 'panNumber':
        if (!value.trim()) {
          error = 'PAN number is required'
        } else if (!panPattern.test(value.toUpperCase())) {
          error = 'Invalid PAN number format'
        }
        break
        
      case 'panHolderName':
        if (!value.trim()) {
          error = 'PAN holder name is required'
        } else if (!namePattern.test(value.trim())) {
          error = 'PAN holder name should contain only letters and spaces (2-50 characters)'
        }
        break
        
      case 'dateOfBirth':
        if (!value.trim()) {
          error = 'Date of birth is required'
        } else if (!dobPattern.test(value)) {
          error = 'Invalid date of birth format (DD/MM/YYYY)'
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

    let formattedValue = newValue
    if (name === 'panNumber' && type !== 'checkbox') {
      // Format PAN to be uppercase and alphanumeric only
      formattedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10)
    } else if (name === 'dateOfBirth' && type !== 'checkbox') {
      // Format Date of Birth with slashes
      const digitsOnly = value.replace(/\D/g, '').slice(0, 8)
      if (digitsOnly.length > 4) {
        formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`
      } else if (digitsOnly.length > 2) {
        formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
      } else {
        formattedValue = digitsOnly
      }
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

  // Check if PAN form is valid
  const isPanFormValid = () => {
    return (
      formData.organizationType &&
      panPattern.test(formData.panNumber) &&
      namePattern.test(formData.panHolderName.trim()) &&
      dobPattern.test(formData.dateOfBirth) &&
      formData.panConsent &&
      !validationErrors.organizationType &&
      !validationErrors.panNumber &&
      !validationErrors.panHolderName &&
      !validationErrors.dateOfBirth
    )
  }

  const handlePanSubmit = (e) => {
    e.preventDefault()
    if (isPanFormValid()) {
      console.log('PAN Form submitted:', formData)
      alert('PAN validation successful!')
    } else {
      alert('Please fix the validation errors before submitting.')
    }
  }

  if (!showPanCard) return null

  return (
    <div className="max-w-6xl mx-auto mt-6">
      {/* PAN Card Header */}
      <div className="bg-green-500 text-white p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">PAN Verification</h2>
      </div>
      
      {/* PAN Card Content */}
      <form onSubmit={handlePanSubmit} className="bg-white border border-gray-200 rounded-b-lg p-6">
        {/* Organization Type and PAN Number Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. Type of Organisation / संगठन के प्रकार *
            </label>
            <select
              name="organizationType"
              value={formData.organizationType}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                validationErrors.organizationType 
                  ? 'border-red-500 focus:ring-red-500' 
                  : formData.organizationType && !validationErrors.organizationType 
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Type of Organisation / संगठन के प्रकार</option>
              <option value="Private Limited Company">Private Limited Company</option>
              <option value="Public Limited Company">Public Limited Company</option>
              <option value="Limited Liability Partnership">Limited Liability Partnership</option>
              <option value="Partnership Firm">Partnership Firm</option>
              <option value="Hindu Undivided Family">Hindu Undivided Family</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Cooperative Society">Cooperative Society</option>
              <option value="Society">Society</option>
              <option value="Trust">Trust</option>
            </select>
            {validationErrors.organizationType && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.organizationType}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4.1 PAN / पैन *
            </label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              placeholder="ENTER PAN NUMBER"
              maxLength="10"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                validationErrors.panNumber 
                  ? 'border-red-500 focus:ring-red-500' 
                  : formData.panNumber && !validationErrors.panNumber 
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {validationErrors.panNumber && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.panNumber}
              </p>
            )}
          </div>
        </div>
        
        {/* PAN Holder Name and DOB Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4.1.1 Name of PAN Holder / पैन धारक का नाम *
            </label>
            <input
              type="text"
              name="panHolderName"
              value={formData.panHolderName}
              onChange={handleInputChange}
              placeholder="Name as per PAN"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                validationErrors.panHolderName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : formData.panHolderName && !validationErrors.panHolderName 
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {validationErrors.panHolderName && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.panHolderName}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4.1.2 DOB or DOI as per PAN / पैन के अनुसार जन्म तिथि या निगमन तिथि *
            </label>
            <input
              type="text"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
              maxLength="10"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                validationErrors.dateOfBirth 
                  ? 'border-red-500 focus:ring-red-500' 
                  : formData.dateOfBirth && !validationErrors.dateOfBirth 
                  ? 'border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {validationErrors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validationErrors.dateOfBirth}
              </p>
            )}
          </div>
        </div>

        {/* PAN Consent Checkbox */}
        <div className="mb-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="panConsent"
              name="panConsent"
              checked={formData.panConsent}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="panConsent" className="text-sm text-gray-700 leading-relaxed">
              I, the holder of the above PAN, hereby give my consent to Ministry of MSME, Government of India, for using my data/ information available in the Income Tax Returns filed by me, and also the same available in the GST Returns and also from other Government organizations, for MSME classification and other official purposes, in pursuance of the MSMED Act, 2006.
            </label>
          </div>
          {!formData.panConsent && (formData.organizationType || formData.panNumber || formData.panHolderName || formData.dateOfBirth) && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Please provide consent to proceed
            </p>
          )}
        </div>

        {/* PAN Validate Button */}
        <div className="flex justify-start">
          <button 
            type="submit"
            disabled={!isPanFormValid()}
            className={`font-medium py-2 px-6 rounded-md transition-colors duration-200 ${
              isPanFormValid()
                ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            PAN Validate
          </button>
        </div>
      </form>
    </div>
  )
}

export default PanValidationCard
