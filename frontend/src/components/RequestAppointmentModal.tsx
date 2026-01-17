"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { X } from "lucide-react";

interface RequestAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestAppointmentModal({
  isOpen,
  onClose,
}: RequestAppointmentModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_type: 'in_person',
    preferred_dates: ['', '', ''],
    preferred_times: [] as string[],
    reason: '',
  });
  const [errors, setErrors] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/users/doctors');
        const data = await response.json();
        if (data.success) {
          setDoctors(data.data);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen]);

  const handleTimeChange = (time: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        preferred_times: [...prev.preferred_times, time]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        preferred_times: prev.preferred_times.filter(t => t !== time)
      }));
    }
  };

  const handleDateChange = (index: number, value: string) => {
    const newDates = [...formData.preferred_dates];
    newDates[index] = value;
    setFormData(prev => ({ ...prev, preferred_dates: newDates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors('');
    setLoading(true);

    try {
      // Validation
      if (!formData.doctor_id || !formData.appointment_type) {
        setErrors('Please select a doctor and appointment type');
        setLoading(false);
        return;
      }

      const validDates = formData.preferred_dates.filter(d => d !== '');
      if (validDates.length === 0) {
        setErrors('Please select at least one preferred date');
        setLoading(false);
        return;
      }

      if (validDates.length > 3) {
        setErrors('Maximum 3 preferred dates allowed');
        setLoading(false);
        return;
      }

      if (formData.preferred_times.length === 0) {
        setErrors('Please select at least one preferred time');
        setLoading(false);
        return;
      }

      // Submit to backend
      const response = await fetch('/api/appointments/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: user?.id,
          doctor_id: formData.doctor_id,
          appointment_type: formData.appointment_type,
          preferred_dates: validDates,
          preferred_times: formData.preferred_times,
          reason: formData.reason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            doctor_id: '',
            appointment_type: 'in_person',
            preferred_dates: ['', '', ''],
            preferred_times: [],
            reason: '',
          });
        }, 2000);
      } else {
        setErrors(data.message || 'Failed to submit appointment request');
      }
    } catch (error) {
      setErrors('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Request Appointment</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success && (
          <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
            ✓ Appointment request submitted successfully!
          </div>
        )}

        {errors && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
            {errors}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Doctor Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Preferred Doctor *
            </label>
            <select
              value={formData.doctor_id}
              onChange={(e) => setFormData(prev => ({ ...prev, doctor_id: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor, index) => (
                <option key={doctor.id || doctor._id || index} value={doctor.clerkId || doctor.id || doctor._id}>
                  {doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim() || 'Unknown Doctor'}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Appointment Type *
            </label>
            <div className="flex gap-4">
              {[
                { value: 'in_person', label: 'In-Person' },
                { value: 'virtual', label: 'Virtual' },
                { value: 'follow_up', label: 'Follow-Up' }
              ].map(type => (
                <label key={type.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.appointment_type === type.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointment_type: e.target.value }))}
                    className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Dates */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Preferred Dates * (select up to 3)
            </label>
            <div className="space-y-2">
              {[0, 1, 2].map(index => (
                <input
                  key={index}
                  type="date"
                  value={formData.preferred_dates[index]}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder={`Date ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Preferred Time */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Preferred Time *
            </label>
            <div className="space-y-2">
              {['Morning (9-12)', 'Afternoon (12-3)', 'Evening (3-6)'].map(time => (
                <label key={time} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.preferred_times.includes(time)}
                    onChange={(e) => handleTimeChange(time, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{time}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reason for Visit (Optional)
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={4}
              maxLength={1000}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Please describe your symptoms or reason for the appointment..."
            />
            <p className="mt-1 text-xs text-gray-500">{formData.reason.length}/1000 characters</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
