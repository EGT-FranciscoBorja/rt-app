'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCloudUploadAlt, FaTimes, FaFileUpload } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { MdEmail, MdPhone, MdLanguage } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import UploadModal from '@/components/upload/uploadModal';

interface HotelFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  price: string;
  rating: string;
  description: string;
}

function CreateHotel() {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formData, setFormData] = useState<HotelFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    price: '',
    rating: '',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<HotelFormData>>({});

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateWebsite = (website: string): boolean => {
    try {
      new URL(website);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    // Clear error when user starts typing
    if (errors[name as keyof HotelFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<HotelFormData> = {};

    // Required fields validation
    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof HotelFormData]) {
        newErrors[key as keyof HotelFormData] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Website validation
    if (formData.website && !validateWebsite(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    // Price validation
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Please enter a valid price';
    }

    // Rating validation
    if (formData.rating && (Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Here you would typically make an API call to create the hotel
      console.log('Form submitted:', formData);
      router.push('/listHotels');
    } catch (error) {
      console.error('Error creating hotel:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Aquí implementarías la lógica para procesar el archivo
    // Por ahora solo simulamos una carga exitosa
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('File uploaded:', file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create New Hotel</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <FaFileUpload className="text-lg" />
            Upload File
          </button>
          <button
            onClick={() => router.push('/listHotels')}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          You can upload an Excel (.xlsx) or CSV (.csv) file with the required format according to the listHotels table.
          <a
            href="/assets/demo.xlsx"
            download
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Download example
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Hotel Name */}
              <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                <input
                  type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
                  placeholder="Enter hotel name"
                />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="flex items-center gap-2">
            <IoLocationOutline className="text-gray-400" />
                <input
                  type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Address"
                />
              </div>
          {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          
          <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="City"
            />
                <input
                  type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="State"
            />
                <input
                  type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Country"
                />
              </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contact Information</label>
          <div className="flex items-center gap-2">
            <MdPhone className="text-gray-400" />
                <input
                  type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Phone number"
                />
              </div>
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}

          <div className="flex items-center gap-2">
            <MdEmail className="text-gray-400" />
                <input
                  type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Email"
                />
              </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}

          <div className="flex items-center gap-2">
            <MdLanguage className="text-gray-400" />
                <input
                  type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.website ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Website"
                />
              </div>
          {errors.website && <p className="mt-1 text-sm text-red-500">{errors.website}</p>}
        </div>

        {/* Price and Rating */}
        <div className="grid grid-cols-2 gap-4">
              <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night</label>
            <div className="flex items-center gap-2">
              <BsCurrencyDollar className="text-gray-400" />
                <input
                  type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                  placeholder="Enter price"
                />
              </div>
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

              <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex items-center gap-2">
              <AiFillStar className="text-yellow-400" />
                <input
                  type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                  max="5"
                  step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.rating ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter rating (0-5)"
              />
            </div>
            {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter hotel description"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/listHotels')}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
              <button
                type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
            <FaCloudUploadAlt />
                Create Hotel
              </button>
            </div>
          </form>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
}

export default CreateHotel;
