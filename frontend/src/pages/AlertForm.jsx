
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';   
import axios from './../utils/axiosInstance';

const AlertForm = ({onSubmit, onCancel}) => {
  const [form, setForm] = useState({
    severity: '',
    type: '',
    title: '',
    description: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();   // ✅ setup navigate hook

  const severityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const typeOptions = ['Security', 'Weather', 'Medical', 'Fire', 'Other'];

 const validateForm = () => {
    const newErrors = {};
    if (!form.severity) newErrors.severity = 'Severity is required';
    if (!form.type) newErrors.type = 'Threat type is required';
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const validationErrors = validateForm();
    
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     await axios.post('/alerts', form);
  //     alert('Alert sent successfully!');
  //     // Reset form after successful submission
  //     setForm({ severity: '', type: '', title: '', description: '', location: '' });
  //     setErrors({});
  //   } catch (err) {
  //     alert('Error sending alert');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/alerts', form);
      alert('Alert sent successfully!');

      // call onSubmit so Dashboard updates state
      if (onSubmit) {
        onSubmit(form);
      }

      setForm({ severity: '', type: '', title: '', description: '', location: '' });
      setErrors({});
    } catch (err) {
      alert('Error sending alert');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Alert</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
            Severity
          </label>
                    <select
            name="severity"
            value={form.severity}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.severity ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select severity</option>
            {severityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.severity && (
            <p className="mt-1 text-sm text-red-600">{errors.severity}</p>
          )}
        </div>

        {/* Type Select */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Threat Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select type</option>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter alert title"
            className={`mt-1 block w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter alert description"
            rows="4"
            className={`mt-1 block w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Location Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter location"
            className={`mt-1 block w-full rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isSubmitting ? 'Sending...' : 'Send Alert'}
        </button>

        {/* Cancel Button ✅ */}
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2 px-4 rounded-md text-white font-medium bg-gray-500 hover:bg-gray-600"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AlertForm;

