import React, { useState } from "react";
import ModalTemplate from "./ModalTemplate";
import Button from "../atoms/Button";
import { Spinner } from "flowbite-react";

/**
 * Examples of using the ModalTemplate component in different scenarios
 */
const ModalTemplateExamples = () => {
  // Modal visibility states
  const [showBasic, setShowBasic] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sample form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowForm(false);
      alert("Form submitted successfully!");
    }, 1500);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Modal Template Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Modal */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Basic Information Modal</h2>
          <p className="text-gray-600 mb-4">Simple modal with a title and content</p>
          <Button onClick={() => setShowBasic(true)}>Open Basic Modal</Button>
          
          <ModalTemplate 
            isOpen={showBasic}
            title="Important Information"
            icon="info-circle"
            onClose={() => setShowBasic(false)}
          >
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                This is an informational modal that presents important content to users.
                Use this pattern when you need to display critical information that doesn't
                require user action.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Pro tip: Keep your modal content concise and focused on a single topic
                  to avoid overwhelming users.
                </p>
              </div>
            </div>
          </ModalTemplate>
        </div>
        
        {/* Confirmation Modal */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Confirmation Dialog</h2>
          <p className="text-gray-600 mb-4">Modal for confirming user actions</p>
          <Button onClick={() => setShowConfirmation(true)}>Open Confirmation Modal</Button>
          
          <ModalTemplate 
            isOpen={showConfirmation}
            title="Confirm Action"
            icon="warning"
            onClose={() => setShowConfirmation(false)}
            footer={
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowConfirmation(false)}
                  className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    alert("Action confirmed!");
                    setShowConfirmation(false);
                  }}
                  className="px-5 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-xl"
                >
                  Delete Item
                </Button>
              </div>
            }
          >
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
              <p className="text-gray-600">
                This action cannot be undone. This will permanently delete the selected item and remove all associated data.
              </p>
            </div>
          </ModalTemplate>
        </div>
        
        {/* Form Modal */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Form Modal</h2>
          <p className="text-gray-600 mb-4">Modal containing a data entry form</p>
          <Button onClick={() => setShowForm(true)}>Open Form Modal</Button>
          
          <ModalTemplate 
            isOpen={showForm}
            title="Update Profile Information"
            icon="user"
            size="lg"
            onClose={() => setShowForm(false)}
            footer={
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-xl flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Please update your profile information below. These details will be visible to other users.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    placeholder="e.g., John Smith"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    placeholder="e.g., john.smith@example.com"
                  />
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    For security reasons, please verify your email after making changes.
                  </p>
                </div>
              </div>
            </div>
          </ModalTemplate>
        </div>
        
        {/* Custom Modal */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Custom Styled Modal</h2>
          <p className="text-gray-600 mb-4">Modal with custom styling options</p>
          <Button onClick={() => setShowCustom(true)}>Open Custom Modal</Button>
          
          <ModalTemplate 
            isOpen={showCustom}
            title="Success!"
            icon="check-circle"
            size="sm"
            onClose={() => setShowCustom(false)}
            className="bg-gradient-to-br from-white to-green-50"
            hideFooter={true}
            blurBackground={true}
          >
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                <svg className="h-14 w-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Operation Completed</h3>
              <p className="text-gray-600 mb-6">
                Your action has been completed successfully. The changes have been saved.
              </p>
              <Button
                onClick={() => setShowCustom(false)}
                className="px-6 py-3 text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-full shadow-lg shadow-green-200"
              >
                Continue
              </Button>
            </div>
          </ModalTemplate>
        </div>
      </div>
    </div>
  );
};

export default ModalTemplateExamples;
