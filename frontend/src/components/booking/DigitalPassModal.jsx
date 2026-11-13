import React, { useState, useEffect } from 'react';
import { reservationAPI } from '../../services/api';

export function DigitalPassModal({ reservation, onClose, onStatusChange }) {
  const [currentReservation, setCurrentReservation] = useState(reservation);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15 mins
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const isCheckedIn = currentReservation?.status === 'CHECKED_IN';
  const isCancelled = currentReservation?.status === 'CANCELLED';

  // 15-minute grace countdown
  useEffect(() => {
    if (isCheckedIn || isCancelled) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCheckedIn, isCancelled]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainderSecs).padStart(2, '0')}`;
  };

  const handleSimulateRfidCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      const id = currentReservation.id || currentReservation._id || currentReservation.reservationCode;
      const res = await reservationAPI.checkIn(id);
      if (res.success) {
        setCurrentReservation((prev) => ({
          ...prev,
          status: 'CHECKED_IN',
          rfidTapVerified: true,
          checkedInAt: new Date().toISOString(),
        }));
        setSuccessToast('RFID Tap Verified! Desk power conduits & monitors activated.');
        if (onStatusChange) onStatusChange('CHECKED_IN');
      }
    } catch (err) {
      console.warn('Check-in fallback:', err.message);
      setCurrentReservation((prev) => ({
        ...prev,
        status: 'CHECKED_IN',
        rfidTapVerified: true,
      }));
      setSuccessToast('Simulated RFID Tap Verified! Desk unlocked.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!window.confirm('Are you sure you want to release this workstation hold?')) return;
    setIsCancelling(true);
    try {
      const id = currentReservation.id || currentReservation._id || currentReservation.reservationCode;
      await reservationAPI.cancel(id);
      setCurrentReservation((prev) => ({ ...prev, status: 'CANCELLED' }));
      if (onStatusChange) onStatusChange('CANCELLED');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.warn('Cancel fallback:', err.message);
      setCurrentReservation((prev) => ({ ...prev, status: 'CANCELLED' }));
      setTimeout(() => {
        onClose();
      }, 1000);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-primary/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg max-h-[92vh] bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col">
        {/* Pass Top Banner */}
        <div className="bg-primary text-on-primary p-space-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed text-[22px]">verified</span>
            <div>
              <p className="font-title-md text-title-md font-bold tracking-tight text-surface-bright">
                LPU Central Library (Lovely Professional University)
              </p>
              <p className="font-label-sm text-[11px] text-primary-fixed uppercase tracking-wider">
                Institutional Digital Study Pass • LPU
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 flex items-center justify-center text-on-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {successToast && (
          <div className="bg-tertiary-container text-on-tertiary px-space-md py-2 flex items-center gap-2 text-label-md font-semibold shrink-0">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successToast}</span>
          </div>
        )}

        {/* Pass Body Ticket Layout */}
        <div className="p-3 sm:p-space-lg space-y-space-md overflow-y-auto">
          {/* Seat Number Hero Display */}
          <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Reserved Station
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display-lg text-[36px] font-bold text-primary tracking-tight">
                  Seat {currentReservation.seatNumber || 'B07'}
                </span>
                <span className="font-body-md text-body-md text-secondary font-semibold">
                  {currentReservation.deskCode || '#AT-207'}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {currentReservation.zoneName || 'Zone B • Collaborative Study Hub (Floor 2)'}
              </p>
            </div>

            <div className="text-right flex flex-col items-end">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-label-sm font-bold ${
                  isCheckedIn
                    ? 'bg-[#DCFCE7] text-[#15803D]'
                    : isCancelled
                    ? 'bg-error-container text-on-error-container'
                    : 'bg-secondary-fixed text-on-secondary-fixed animate-pulse'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCheckedIn ? 'bg-[#22C55E]' : isCancelled ? 'bg-error' : 'bg-secondary'
                  }`}
                />
                {isCheckedIn ? 'CHECKED IN (ACTIVE)' : isCancelled ? 'RELEASED' : 'HOLD ACTIVE (15M)'}
              </span>
              <span className="font-tabular-numeric text-[11px] text-outline mt-1 font-mono">
                {currentReservation.reservationCode || 'PASS-LPU-12513583-B07'}
              </span>
            </div>
          </div>

          {/* Time & Student Details Strip */}
          <div className="grid grid-cols-2 gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl border border-surface-container-high/40 text-body-sm">
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase block">Student Holder</span>
              <span className="font-title-md text-title-md text-primary font-semibold">
                {currentReservation.userName || 'Ankit'}
              </span>
              <span className="font-label-sm text-outline block font-mono">ID: {currentReservation.studentId || '12513583'}</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase block">Booking Window</span>
              <span className="font-title-md text-title-md text-primary font-semibold">
                {currentReservation.startTime || '14:00'} – {currentReservation.endTime || '16:00'}
              </span>
              <span className="font-label-sm text-secondary block font-semibold">
                {currentReservation.durationHours || 2.0} Hours Allocated
              </span>
            </div>
          </div>

          {/* 15-Minute Grace Period Counter Widget */}
          {!isCheckedIn && !isCancelled && (
            <div className="p-space-md rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-[20px] animate-spin">
                    hourglass_top
                  </span>
                  <span className="font-label-md text-label-md font-bold">15-Minute Check-In Grace Period</span>
                </div>
                <span className="font-tabular-numeric text-headline-sm font-bold text-amber-700">
                  {formatTimer(secondsRemaining)}
                </span>
              </div>
              <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(secondsRemaining / (15 * 60)) * 100}%` }}
                />
              </div>
              <p className="font-body-sm text-[12px] text-amber-800">
                You must tap your student RFID badge or scan the desk QR beacon before the timer hits 00:00 to prevent automated release.
              </p>
            </div>
          )}

          {/* Simulated QR Code / RFID Barcode Graphic */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center gap-2 text-center">
            <div className="flex items-center justify-center gap-1.5 p-3 bg-surface rounded-lg shadow-inner">
              <span className="material-symbols-outlined text-[64px] text-primary">qr_code_2</span>
            </div>
            <p className="font-label-sm text-label-sm text-outline font-mono">
              Scan at LPU Central Library Entrance Turnstile or Desk #AT-207 Beacon
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-space-xs pt-space-xs">
            {!isCheckedIn && !isCancelled && (
              <button
                type="button"
                onClick={handleSimulateRfidCheckIn}
                disabled={isCheckingIn}
                className="w-full py-3.5 px-space-md rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-title-md text-title-md font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[20px]">contactless</span>
                <span>{isCheckingIn ? 'Scanning Campus RFID...' : 'Simulate Campus RFID Badge Tap'}</span>
              </button>
            )}

            {!isCancelled && (
              <button
                type="button"
                onClick={handleCancelReservation}
                disabled={isCancelling}
                className="w-full py-2.5 px-space-md rounded-xl text-error hover:bg-error-container text-label-md font-semibold transition-colors cursor-pointer"
              >
                {isCancelling ? 'Releasing hold...' : 'Cancel Reservation & Release Desk'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DigitalPassModal;

