// import './App.css'


// function App() {
//   return <> hello world</>
// }

// export default App

import { useState } from 'react'

export default function CustomContactformForm() {
  const initialValues = {
    name: '',
    username: '',
    password: '',
    rpi : '',
  };

  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({})

  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
  const { name, type, value, checked } = e.target
  setFormData((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? checked
        : type === "number"
        ? value === "" ? "" : Number(value)
        : value,
  }))
}

  const handleCheckboxGroupChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const requiredFields = [
  'name',
  'username',
  'password'
]
const newErrors = {}

requiredFields.forEach((name) => {
  const value = formData[name]

  if (
    value === "" || // empty string
    (Array.isArray(value) && value.length === 0) || // empty array
    (typeof value === "boolean" && !value) // explicitly false boolean
  ) {
    newErrors[name] = "This field is required"
  }
})

setFormErrors(newErrors)

if (Object.keys(newErrors).length > 0) {
  setStatus("idle")
  return
}

    try {
      const response = await fetch("https://apiforms.com/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apikey:"cd30a061-608c-4326-b202-01c6eb3360d3",
          formId: "SX0xNSSAScexHc3XMfzG",
          formData: {
            name: formData.name,
            username: formData.username,
            password: formData.password
            }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Form submission failed");
      }

      setStatus("success");
      alert("Form submitted successfully!");
      setFormData(initialValues);
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert(err.message || "Error submitting form");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 p-4">
      
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input 
              type="text" 
              name="name"
              className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
  
              value={formData.name}
              onChange={(e) => handleChange(e)}
            />
            {formErrors.name && (
          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
        )}
          </div>
      
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              user*name *
            </label>
            <input 
              type="text" 
              name="username"
              className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
  
              value={formData.username}
              onChange={(e) => handleChange(e)}
            />
            {formErrors.username && (
          <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
        )}
          </div>
      
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              password *
            </label>
            <input 
              type="text" 
              name="password"
              className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
  
              value={formData.password}
              onChange={(e) => handleChange(e)}
            />
            {formErrors.password && (
          <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
        )}
          </div>
      <button 
        type="submit" 
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}