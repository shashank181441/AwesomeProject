import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const Input = ({ label, name, type = 'text', required, ...rest }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  // Watch the file input field to update the image preview
  const file = watch(name);
  const [imagePreview, setImagePreview] = useState('');

  // Handle image file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview('');
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        {type === 'file' ? (
          <>
            <input
              id={name}
              name={name}
              type={type}
              {...register(name, { required })}
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                errors[name] ? 'border-red-500 ring-red-500' : ''
              }`}
              onChange={handleFileChange}
              {...rest}
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-md border border-gray-300" />
              </div>
            )}
          </>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            {...register(name, { required })}
            className={`px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              errors[name] ? 'border-red-500 ring-red-500' : ''
            }`}
            {...rest}
          />
        )}
        {errors[name] && (
          <p className="mt-2 text-sm text-red-600">{label} is required</p>
        )}
      </div>
    </div>
  );
};

export default Input;
