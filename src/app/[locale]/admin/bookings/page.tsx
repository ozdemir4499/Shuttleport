"use client";
import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tr } from 'date-fns/locale';
import OperationMapModal from './OperationMapModal';
import { LocationAutocomplete } from '@/features/maps/components/LocationAutocomplete';

registerLocale('tr', tr);

type Booking = {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  origin: string;
  destination: string;
  transfer_datetime: string;
  flight_number?: string;
  passengers?: number;
  vehicle_type: string;
  total_price: number;
  currency?: string;
  payment_method?: string;
  status: string;
  notes?: string;
  created_at?: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapBooking, setMapBooking] = useState<Booking | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeInput, setActiveInput] = useState<'origin' | 'destination' | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_code: '+90',
    customer_phone: '',
    customer_email: '',
    origin: '',
    destination: '',
    transfer_datetime: '',
    passengers: 1,
    vehicle_type: 'vito',
    total_price: 1000,
    currency: 'TRY',
    payment_method: 'cash_in_car',
    flight_number: '',
    notes: ''
  });

  const [extraPassengers, setExtraPassengers] = useState<string[]>([]);

  const addExtraPassenger = () => {
    setExtraPassengers([...extraPassengers, '']);
  };

  const removeExtraPassenger = (index: number) => {
    const newArr = [...extraPassengers];
    newArr.splice(index, 1);
    setExtraPassengers(newArr);
  };

  const updateExtraPassenger = (index: number, value: string) => {
    const newArr = [...extraPassengers];
    newArr[index] = value;
    setExtraPassengers(newArr);
  };

  const originInputRef = React.useRef<HTMLInputElement>(null);
  const destinationInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Google Autocomplete iptal edildi (API Key hatası girdileri kilitliyordu)
  useEffect(() => {
    // if (isVoucherModalOpen && typeof window !== 'undefined' && (window as Window & typeof globalThis & { google: unknown }).google) { ... }
  }, [isVoucherModalOpen]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Ağ hatası.");
    }
  };

  const getLocalDatetimeString = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const closeVoucherModal = () => {
    setIsVoucherModalOpen(false);
    setEditingBookingId(null);
    setFormData({
      customer_name: '', phone_code: '+90', customer_phone: '', customer_email: '', origin: '', destination: '', transfer_datetime: getLocalDatetimeString(), passengers: 1, vehicle_type: 'vito', total_price: 1000, currency: 'TRY', payment_method: 'cash_in_car', flight_number: '', notes: ''
    });
    setExtraPassengers([]);
  };

  const openCreateModal = () => {
    closeVoucherModal();
    setIsVoucherModalOpen(true);
  };

  const openEditModal = (booking: Booking) => {
    let mainNotes = booking.notes || '';
    const parsedExtraPassengers: string[] = [];

    let pCode = '+90';
    let pBody = booking.customer_phone || '';
    const knownCodes = [
      '+995', '+994', '+974', '+973', '+972', '+971', '+968', '+966', '+965', '+420', '+380', '+374', '+373', '+359', '+358',
      '+98', '+91', '+90', '+86', '+82', '+81', '+61', '+55', '+52', '+49', '+48', '+47', '+46', '+45', '+44', '+43', '+41', '+40',
      '+39', '+34', '+33', '+32', '+31', '+30', '+20', '+7', '+1'
    ];
    for (const code of knownCodes) {
      if (pBody.replace(/\s+/g, '').startsWith(code)) {
        pCode = code;
        pBody = pBody.replace(/\s+/g, '').substring(code.length);
        break;
      }
    }

    if (mainNotes) {
      const lines = mainNotes.split('\n');
      const otherLines: string[] = [];
      lines.forEach(line => {
        const match = line.match(/^\d+\.\s*Yolcu:\s*(.+)/i);
        if (match) {
          parsedExtraPassengers.push(match[1].trim());
        } else {
          otherLines.push(line);
        }
      });
      mainNotes = otherLines.join('\n').trim();
    }

    setFormData({
      customer_name: booking.customer_name,
      phone_code: pCode,
      customer_phone: pBody,
      customer_email: booking.customer_email || '',
      origin: booking.origin,
      destination: booking.destination,
      transfer_datetime: booking.transfer_datetime ? booking.transfer_datetime.slice(0, 16) : getLocalDatetimeString(),
      passengers: booking.passengers || 1,
      vehicle_type: booking.vehicle_type,
      total_price: booking.total_price,
      currency: booking.currency || 'TRY',
      payment_method: booking.payment_method || 'cash_in_car',
      flight_number: booking.flight_number || '',
      notes: mainNotes
    });
    setExtraPassengers(parsedExtraPassengers);
    setEditingBookingId(booking.id);
    setIsVoucherModalOpen(true);
  };

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');

      let finalNotes = formData.notes;
      if (extraPassengers.some(p => p.trim() !== '')) {
        const passengerList = extraPassengers.filter(p => p.trim() !== '').map((p, i) => `${i + 2}. Yolcu: ${p}`).join('\n');
        finalNotes = finalNotes ? `${finalNotes}\n\n${passengerList}` : passengerList;
      }

      const payload: Record<string, unknown> = {
        ...formData,
        customer_phone: `${formData.phone_code} ${formData.customer_phone}`.trim(),
        transfer_datetime: formData.transfer_datetime.length === 16 ? formData.transfer_datetime + ':00' : formData.transfer_datetime,
        customer_email: formData.customer_email || undefined,
        flight_number: formData.flight_number || undefined,
        notes: finalNotes || undefined
      };
      delete payload.phone_code;

      const url = editingBookingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings/${editingBookingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/bookings`;

      const method = editingBookingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      if (res.ok) {
        closeVoucherModal();
        fetchBookings();
      } else {
        const err = await res.json();
        alert("Hata: " + JSON.stringify(err));
      }
    } catch (error) {
      console.error("Error creating/updating booking:", error);
      alert("Ağ hatası.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 shadow-sm shadow-rose-200/50">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </div>
            Onay Bekliyor
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-sm shadow-blue-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Onaylandı
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60 shadow-sm shadow-emerald-100/50">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            Tamamlandı
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/60 shadow-sm shadow-rose-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            İptal
          </span>
        );
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const openDetailModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const openMapModal = (booking: Booking) => {
    setMapBooking(booking);
    setIsMapModalOpen(true);
  };

  const handleCopyDetails = (booking: Booking) => {
    const formattedDate = new Date(booking.transfer_datetime).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = new Date(booking.transfer_datetime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    let extraGuests = "";
    if (booking.notes) {
      const passengerMatches = booking.notes.match(/\d+\.\s*Yolcu:\s*(.+)/g);
      if (passengerMatches) {
        const names = passengerMatches.map(m => m.replace(/\d+\.\s*Yolcu:\s*/, '').trim());
        if (names.length > 0) {
          extraGuests = ", " + names.join(", ");
        }
      }
    }

    const textToCopy = `PNR NO: #${booking.id}

Araç: ${booking.vehicle_type.toUpperCase()}

Tarih: ${formattedDate}
Saat: ${formattedTime}

Uçuş No: ${booking.flight_number || '-'}

Alım adresi: ${booking.origin}

Bırakım adresi: ${booking.destination}

Misafir Bilgisi:
 ${booking.customer_name}${extraGuests}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Kopyalama işlemi başarısız:', err);
      alert('Kopyalama işlemi desteklenmiyor veya başarısız oldu.');
    });
  };

  const printVoucher = (booking: Booking) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Voucher #${booking.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #1a56db; }
              .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
              .box { border: 1px solid #ccc; padding: 15px; border-radius: 8px; }
              .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
              .value { font-size: 16px; font-weight: bold; }
              .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">SHUTTLEPORT</div>
              <h2>TRANSFER VOUCHER</h2>
              <p>Ref: #${booking.id}</p>
            </div>
            <div class="details">
              <div class="box">
                <div class="label">Müşteri Adı</div>
                <div class="value">${booking.customer_name}</div>
              </div>
              <div class="box">
                <div class="label">Telefon</div>
                <div class="value">${booking.customer_phone}</div>
              </div>
              <div class="box">
                <div class="label">Nereden</div>
                <div class="value">${booking.origin}</div>
              </div>
              <div class="box">
                <div class="label">Nereye</div>
                <div class="value">${booking.destination}</div>
              </div>
              <div class="box">
                <div class="label">Tarih & Saat</div>
                <div class="value">${new Date(booking.transfer_datetime).toLocaleString('tr-TR')}</div>
              </div>
              <div class="box">
                <div class="label">Araç Tipi</div>
                <div class="value">${booking.vehicle_type.toUpperCase()}</div>
              </div>
            </div>
            <div style="margin-top: 20px; text-align: right;">
              <h3>Toplam Tutar: ${booking.total_price} ${booking.currency === 'USD' ? '$' : booking.currency === 'EUR' ? '€' : booking.currency === 'GBP' ? '£' : '₺'}</h3>
            </div>
            <div class="footer">Bu belge Shuttleport sistemi tarafından üretilmiştir.</div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  let detailDisplayNotes = selectedBooking?.notes || "";
  let detailExtraPassengers: string[] = [];

  if (detailDisplayNotes) {
    const lines = detailDisplayNotes.split('\n');
    const filteredLines: string[] = [];
    lines.forEach(line => {
      if (/^\d+\.\sYolcu:\s.+/i.test(line.trim())) {
        detailExtraPassengers.push(line.trim());
      } else {
        filteredLines.push(line);
      }
    });
    detailDisplayNotes = filteredLines.join('\n').trim();
  }

  if (loading) return (
    <div className="flex h-[400px] items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  const filteredBookings = filterDate
    ? bookings.filter(b => {
      const d = new Date(b.transfer_datetime);
      return d.getDate() === filterDate.getDate() &&
        d.getMonth() === filterDate.getMonth() &&
        d.getFullYear() === filterDate.getFullYear();
    })
    : bookings;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .react-datepicker { font-family: inherit; border: 1px solid #f3f4f6; border-radius: 1.25rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid rgba(255,255,255,0.5); }
        .react-datepicker__header { background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; padding-top: 1.25rem; padding-bottom: 0.5rem; }
        .react-datepicker__current-month { color: #0f172a; font-weight: 800; font-size: 1.1rem; letter-spacing: -0.025em; }
        .react-datepicker__day-name { color: #64748b; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; margin: 0.2rem; }
        .react-datepicker__day { color: #334155; font-weight: 600; border-radius: 0.5rem; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); margin: 0.2rem; }
        .react-datepicker__day:hover { background-color: #e0e7ff; color: #4f46e5; transform: scale(1.1); }
        .react-datepicker__day--selected { background-color: #4f46e5; color: #ffffff; font-weight: 800; transform: scale(1.1); box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.39); }
        .react-datepicker__day--keyboard-selected { background-color: #e0e7ff; color: #4f46e5; }
        .react-datepicker__day--outside-month { color: #cbd5e1; }
        .react-datepicker__navigation { top: 1.25rem; }
        .react-datepicker__navigation-icon::before { border-color: #64748b; border-width: 2px 2px 0 0; }
        .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before { border-color: #4f46e5; }
        .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle { fill: #f8fafc; color: #f8fafc; stroke: #e2e8f0; }
      `}} />
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.3)] ring-4 ring-indigo-50 transform transition-transform hover:scale-105 hover:rotate-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Rezervasyon Yönetimi</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Sistemdeki tüm transfer ve voucher taleplerini anlık olarak yönetin</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none z-10">
                <svg className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <DatePicker
                selected={filterDate}
                onChange={(date: Date | null) => setFilterDate(date)}
                locale="tr"
                dateFormat="dd MMMM yyyy"
                placeholderText="Tarih seçiniz..."
                className="pl-11 pr-4 py-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 text-indigo-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full sm:w-[160px] outline-none transition-all shadow-sm cursor-pointer"
              />
            </div>
            {filterDate && (
              <button
                onClick={() => setFilterDate(null)}
                className="px-4 py-3 text-sm font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 hover:text-rose-700 transition-all border border-rose-100/50 shadow-sm w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                Temizle
              </button>
            )}
            <button onClick={openCreateModal} className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 w-full sm:w-auto">
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Yeni Voucher Oluştur
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md hover:border-indigo-200 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{filteredBookings.length}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-0.5">Toplam Kayıt</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md hover:border-amber-200 transition-all duration-300">
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {filteredBookings.filter(b => b.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
                </span>
              )}
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{filteredBookings.filter(b => b.status === 'pending').length}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-0.5">Bekleyen</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md hover:border-blue-200 transition-all duration-300">
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              {filteredBookings.filter(b => b.status === 'confirmed').length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border-2 border-white"></span>
                </span>
              )}
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{filteredBookings.filter(b => b.status === 'confirmed').length}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-0.5">Onaylanan</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md hover:border-emerald-200 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{filteredBookings.filter(b => b.status === 'completed').length}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-0.5">Tamamlanan</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl shadow-indigo-100/20 rounded-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full divide-y divide-gray-100">
              <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/60">
                <tr>
                  <th className="px-3 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                      Ref ID
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Müşteri
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Güzergah
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Zaman
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      Tutar & Araç
                    </div>
                  </th>
                  <th className="px-3 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Durum
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-wider align-middle whitespace-nowrap">
                    <div className="flex items-center justify-start gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                      Aksiyonlar
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-indigo-50/40 transition-all duration-300 group relative">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openMapModal(b)} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all duration-300 group/map" title="Canlı Operasyon Haritası">
                          <svg className="w-4 h-4 transition-transform group-hover/map:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                        </button>
                        <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 text-xs font-bold border border-gray-200/60 shadow-sm group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">#{b.id}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative group/avatar">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-base shadow-[0_4px_12px_rgba(79,70,229,0.3)] ring-2 ring-white transform transition-transform group-hover/avatar:scale-105 group-hover/avatar:rotate-3">
                            {b.customer_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-[14px] font-black text-gray-900 tracking-tight capitalize drop-shadow-sm">{b.customer_name}</div>
                          <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mt-1 bg-gray-100/80 px-2 py-0.5 rounded-md w-fit border border-gray-200/50">
                            <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <span className="tracking-wide text-indigo-900/70">{b.customer_phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-col space-y-3 relative">
                        <div className="absolute left-[6.5px] top-[14px] bottom-[14px] w-[2px] bg-gradient-to-b from-indigo-400 to-rose-400 opacity-50 rounded-full"></div>

                        {/* Alış Noktası */}
                        <div className="flex items-start gap-3 relative z-10 group/route">
                          <div className="mt-0.5 flex-shrink-0 relative">
                            <div className="w-[15px] h-[15px] rounded-full bg-white border-[4px] border-indigo-500 shadow-sm ring-4 ring-white flex items-center justify-center"></div>
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[9px] font-extrabold text-indigo-500/80 uppercase tracking-widest leading-none mb-1">Nereden</span>
                            <span className="text-[13px] font-bold text-slate-800 group-hover/route:text-indigo-700 transition-colors truncate max-w-[140px]" title={b.origin}>{b.origin}</span>
                          </div>
                        </div>

                        {/* Varış Noktası */}
                        <div className="flex items-start gap-3 relative z-10 group/route">
                          <div className="mt-0.5 flex-shrink-0 relative">
                            <div className="w-[15px] h-[15px] rounded-full bg-white border-[4px] border-rose-500 shadow-sm ring-4 ring-white flex items-center justify-center"></div>
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[9px] font-extrabold text-rose-500/80 uppercase tracking-widest leading-none mb-1">Nereye</span>
                            <span className="text-[13px] font-bold text-slate-800 group-hover/route:text-rose-700 transition-colors truncate max-w-[140px]" title={b.destination}>{b.destination}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {new Date(b.transfer_datetime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50/80 text-indigo-700 text-xs font-bold w-fit border border-indigo-100/50">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {new Date(b.transfer_datetime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-[85px] shrink-0 text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 flex items-baseline gap-1">
                            {b.total_price.toLocaleString('tr-TR')}
                            <span className={`text-sm font-black drop-shadow-sm ${b.currency === 'USD' ? 'text-emerald-500' :
                                b.currency === 'EUR' ? 'text-blue-500' :
                                  b.currency === 'GBP' ? 'text-purple-500' :
                                    'text-indigo-500'
                              }`}>
                              {b.currency === 'USD' ? '$' : b.currency === 'EUR' ? '€' : b.currency === 'GBP' ? '£' : '₺'}
                            </span>
                          </div>
                          <div className={`w-[85px] shrink-0 flex justify-center items-center gap-1 text-[9px] font-black uppercase tracking-widest px-1 py-1 rounded-md shadow-sm border ${b.payment_method === 'credit_card' ? 'bg-amber-50 text-amber-700 border-amber-200/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'}`}>
                            {b.payment_method === 'credit_card' ? (
                              <><svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> K. KARTI</>
                            ) : (
                              <><svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> NAKİT</>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-[85px] shrink-0 flex justify-center items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-1 py-1 rounded border ${b.vehicle_type === 'vip_vito' ? 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100' :
                              b.vehicle_type === 'sedan' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                                b.vehicle_type === 'sprinter' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                  'bg-cyan-50 text-cyan-600 border-cyan-100'
                            }`}>
                            <svg className="w-3 h-3 opacity-70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                            <span className="truncate">{b.vehicle_type.replace('_', ' ')}</span>
                          </div>
                          <div className="w-[85px] shrink-0 flex justify-center items-center gap-1 text-[9px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100/50 px-1 py-1 rounded">
                            <svg className="w-3 h-3 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <span className="truncate">{b.passengers} Kişi</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium w-px">
                      <div className="flex items-center justify-start gap-1.5 opacity-100 transition-all duration-300">
                        <button onClick={() => openDetailModal(b)} className="w-6 h-6 shrink-0 rounded-md flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all shadow-sm border border-blue-200/50" title="Detayları Görüntüle">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        {(b.status === 'pending' || b.status === 'confirmed') && (
                          <button onClick={() => openEditModal(b)} className="w-6 h-6 shrink-0 rounded-md flex items-center justify-center bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-all shadow-sm border border-amber-200/50" title="Düzenle">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                        )}

                        {b.status === 'completed' && (
                          <button onClick={() => alert('Voucher PDF oluşturma ve yazdırma modülü yakında eklenecek')} className="w-6 h-6 shrink-0 rounded-md flex items-center justify-center bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-all shadow-sm border border-purple-200/50" title="Voucher / Fatura İndir">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </button>
                        )}

                        {b.status === 'cancelled' && (
                          <button onClick={() => alert('Kayıt silme işlemi yakında eklenecek')} className="w-6 h-6 shrink-0 rounded-md flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all shadow-sm border border-red-200/50" title="Kaydı Sil">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}

                        <div className="w-px h-3.5 bg-gray-200 mx-0.5 shrink-0"></div>

                        {b.status === 'pending' && (
                          <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow-md hover:shadow-indigo-100 font-extrabold text-[9px] uppercase tracking-widest transition-all border border-indigo-200/50 shrink-0">Onayla</button>
                        )}
                        {b.status === 'confirmed' && (
                          <button onClick={() => updateStatus(b.id, 'completed')} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-md hover:shadow-emerald-100 font-extrabold text-[9px] uppercase tracking-widest transition-all border border-emerald-200/50 shrink-0">Bitir</button>
                        )}
                        {(b.status === 'pending' || b.status === 'confirmed') && (
                          <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 hover:shadow-md hover:shadow-rose-100 font-extrabold text-[9px] uppercase tracking-widest transition-all border border-rose-200/50 shrink-0">İptal</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          {filterDate
                            ? "Seçilen tarihe ait rezervasyon bulunamadı."
                            : "Henüz bir rezervasyon kaydı bulunmuyor."}
                        </p>
                        {!filterDate && (
                          <button onClick={openCreateModal} className="mt-4 text-indigo-600 font-semibold hover:text-indigo-700">İlk Voucher'ı Oluştur</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Premium Voucher Modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[95vh] overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gray-900 to-indigo-900 px-6 py-5 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <span className="text-xl">✈️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">{editingBookingId ? 'Rezervasyon Düzenle' : 'Yeni Rezervasyon Oluştur'}</h3>
                  <p className="text-indigo-200 text-xs mt-0.5 font-medium">{editingBookingId ? `Kayıt ID: #${editingBookingId}` : 'VIP Transfer & Shuttle Voucher Kaydı'}</p>
                </div>
              </div>
              <button onClick={closeVoucherModal} className="text-white/60 hover:text-white bg-white/5 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all relative z-10">
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {/* Modal Body */}
            <form onSubmit={handleCreateVoucher} className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 space-y-6">

              {/* Bölüm 1: Müşteri Bilgileri */}
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/60 relative overflow-hidden group/section">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover/section:scale-150 duration-700"></div>
                <h4 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  Müşteri Bilgileri
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Adı Soyadı <span className="text-rose-500">*</span></label>
                    <input type="text" required value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-3 transition-all" placeholder="Örn: Ahmet Yılmaz" />
                  </div>
                  <div className="relative group/phone">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Telefon <span className="text-rose-500">*</span></label>
                    <div className="flex w-full shadow-sm rounded-xl border border-slate-200 overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 focus-within:bg-white items-stretch">
                      <div className="relative flex shrink-0 border-r border-slate-200 bg-slate-100/50 hover:bg-slate-100 transition-colors">
                        <select value={formData.phone_code} onChange={e => setFormData({ ...formData, phone_code: e.target.value })} className="appearance-none bg-transparent border-none text-slate-700 text-sm focus:ring-0 block pl-3 pr-7 py-3 cursor-pointer outline-none font-bold font-sans z-10 w-full h-full text-center">
                          <option value="+90" className="font-sans font-semibold text-slate-800 bg-white py-1">+90</option>
                          <option value="+1" className="font-sans font-semibold text-slate-800 bg-white py-1">+1</option>
                          <option value="+7" className="font-sans font-semibold text-slate-800 bg-white py-1">+7</option>
                          <option value="+20" className="font-sans font-semibold text-slate-800 bg-white py-1">+20</option>
                          <option value="+30" className="font-sans font-semibold text-slate-800 bg-white py-1">+30</option>
                          <option value="+31" className="font-sans font-semibold text-slate-800 bg-white py-1">+31</option>
                          <option value="+32" className="font-sans font-semibold text-slate-800 bg-white py-1">+32</option>
                          <option value="+33" className="font-sans font-semibold text-slate-800 bg-white py-1">+33</option>
                          <option value="+34" className="font-sans font-semibold text-slate-800 bg-white py-1">+34</option>
                          <option value="+39" className="font-sans font-semibold text-slate-800 bg-white py-1">+39</option>
                          <option value="+40" className="font-sans font-semibold text-slate-800 bg-white py-1">+40</option>
                          <option value="+41" className="font-sans font-semibold text-slate-800 bg-white py-1">+41</option>
                          <option value="+43" className="font-sans font-semibold text-slate-800 bg-white py-1">+43</option>
                          <option value="+44" className="font-sans font-semibold text-slate-800 bg-white py-1">+44</option>
                          <option value="+45" className="font-sans font-semibold text-slate-800 bg-white py-1">+45</option>
                          <option value="+46" className="font-sans font-semibold text-slate-800 bg-white py-1">+46</option>
                          <option value="+47" className="font-sans font-semibold text-slate-800 bg-white py-1">+47</option>
                          <option value="+48" className="font-sans font-semibold text-slate-800 bg-white py-1">+48</option>
                          <option value="+49" className="font-sans font-semibold text-slate-800 bg-white py-1">+49</option>
                          <option value="+52" className="font-sans font-semibold text-slate-800 bg-white py-1">+52</option>
                          <option value="+55" className="font-sans font-semibold text-slate-800 bg-white py-1">+55</option>
                          <option value="+61" className="font-sans font-semibold text-slate-800 bg-white py-1">+61</option>
                          <option value="+81" className="font-sans font-semibold text-slate-800 bg-white py-1">+81</option>
                          <option value="+82" className="font-sans font-semibold text-slate-800 bg-white py-1">+82</option>
                          <option value="+86" className="font-sans font-semibold text-slate-800 bg-white py-1">+86</option>
                          <option value="+91" className="font-sans font-semibold text-slate-800 bg-white py-1">+91</option>
                          <option value="+98" className="font-sans font-semibold text-slate-800 bg-white py-1">+98</option>
                          <option value="+358" className="font-sans font-semibold text-slate-800 bg-white py-1">+358</option>
                          <option value="+359" className="font-sans font-semibold text-slate-800 bg-white py-1">+359</option>
                          <option value="+373" className="font-sans font-semibold text-slate-800 bg-white py-1">+373</option>
                          <option value="+374" className="font-sans font-semibold text-slate-800 bg-white py-1">+374</option>
                          <option value="+380" className="font-sans font-semibold text-slate-800 bg-white py-1">+380</option>
                          <option value="+420" className="font-sans font-semibold text-slate-800 bg-white py-1">+420</option>
                          <option value="+965" className="font-sans font-semibold text-slate-800 bg-white py-1">+965</option>
                          <option value="+966" className="font-sans font-semibold text-slate-800 bg-white py-1">+966</option>
                          <option value="+968" className="font-sans font-semibold text-slate-800 bg-white py-1">+968</option>
                          <option value="+971" className="font-sans font-semibold text-slate-800 bg-white py-1">+971</option>
                          <option value="+972" className="font-sans font-semibold text-slate-800 bg-white py-1">+972</option>
                          <option value="+973" className="font-sans font-semibold text-slate-800 bg-white py-1">+973</option>
                          <option value="+974" className="font-sans font-semibold text-slate-800 bg-white py-1">+974</option>
                          <option value="+994" className="font-sans font-semibold text-slate-800 bg-white py-1">+994</option>
                          <option value="+995" className="font-sans font-semibold text-slate-800 bg-white py-1">+995</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                      <input type="text" required value={formData.customer_phone} onChange={e => setFormData({ ...formData, customer_phone: e.target.value })} className="flex-1 w-full bg-transparent border-none text-slate-900 text-sm focus:ring-0 block px-3 py-3 outline-none min-w-0" placeholder="555 123 45 67" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">E-Posta</label>
                    <input type="email" value={formData.customer_email} onChange={e => setFormData({ ...formData, customer_email: e.target.value })} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-3 transition-all" placeholder="Örn: ahmet@mail.com" />
                  </div>
                </div>
              </div>

              {/* Bölüm 2: Rota & Uçuş */}
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/60 relative overflow-visible group/section z-50">
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover/section:scale-150 duration-700"></div>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </div>
                  Rota & Uçuş Detayları
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 relative z-50">
                  <div className="relative z-50">
                    <LocationAutocomplete
                      type="origin"
                      label="Nereden (Alış)"
                      placeholder="Alış Noktası"
                      value={formData.origin ? { lat: 0, lng: 0, address: formData.origin, name: formData.origin } : null}
                      onChange={(loc) => setFormData({ ...formData, origin: loc ? (loc.name || loc.address) : '' })}
                      isActive={activeInput === 'origin'}
                      onActivate={() => setActiveInput('origin')}
                      onDeactivate={() => setActiveInput(null)}
                      dropdownPosition="bottom"
                    />
                  </div>
                  <div className="relative z-10">
                    <LocationAutocomplete
                      type="destination"
                      label="Nereye (Varış)"
                      placeholder="Varış Noktası"
                      value={formData.destination ? { lat: 0, lng: 0, address: formData.destination, name: formData.destination } : null}
                      onChange={(loc) => setFormData({ ...formData, destination: loc ? (loc.name || loc.address) : '' })}
                      isActive={activeInput === 'destination'}
                      onActivate={() => setActiveInput('destination')}
                      onDeactivate={() => setActiveInput(null)}
                      dropdownPosition="bottom"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-0">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Tarih ve Saat <span className="text-rose-500">*</span></label>
                    <input type="datetime-local" required value={formData.transfer_datetime} onChange={e => setFormData({ ...formData, transfer_datetime: e.target.value })} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-3 transition-all cursor-pointer" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Uçuş No</label>
                    <input type="text" value={formData.flight_number} onChange={e => setFormData({ ...formData, flight_number: e.target.value })} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-3 transition-all uppercase placeholder:normal-case" placeholder="Örn: TK1983" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Yolcu Sayısı <span className="text-rose-500">*</span></label>
                    <input type="number" min="1" required value={formData.passengers} onChange={e => setFormData({ ...formData, passengers: parseInt(e.target.value) })} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-3 transition-all font-bold" />
                  </div>
                </div>
              </div>

              {/* Bölüm 3: Araç & Fiyat */}
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/60 relative overflow-hidden group/section">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover/section:scale-150 duration-700"></div>
                <h4 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  Operasyon & Ücret
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Araç Tipi <span className="text-rose-500">*</span></label>
                    <select required value={formData.vehicle_type} onChange={e => setFormData({ ...formData, vehicle_type: e.target.value })} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-3 transition-all cursor-pointer font-bold">
                      <option value="vito">Mercedes Vito (1-6 Kişi)</option>
                      <option value="vip_vito">VIP Vito (1-5 Kişi)</option>
                      <option value="sedan">Lüks Sedan (1-3 Kişi)</option>
                      <option value="sprinter">Mercedes Sprinter (1-14 Kişi)</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Ödeme Türü <span className="text-rose-500">*</span></label>
                    <select required value={formData.payment_method} onChange={e => setFormData({ ...formData, payment_method: e.target.value })} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-3 transition-all cursor-pointer font-bold">
                      <option value="cash_in_car">Araçta Nakit</option>
                      <option value="credit_card">Kredi Kartı</option>
                    </select>
                  </div>
                  <div className="relative group/price">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Toplam Fiyat <span className="text-rose-500">*</span></label>
                    <div className="flex w-full shadow-sm rounded-xl border border-indigo-200/80 overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all bg-white">
                      <select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })} className="bg-indigo-50/80 border-none text-indigo-700 text-sm focus:ring-0 block px-4 py-3 font-black cursor-pointer outline-none tracking-wider">
                        <option value="TRY">₺ TRY</option>
                        <option value="USD">$ USD</option>
                        <option value="EUR">€ EUR</option>
                        <option value="GBP">£ GBP</option>
                      </select>
                      <input type="number" required value={formData.total_price} onChange={e => setFormData({ ...formData, total_price: parseFloat(e.target.value) })} className="w-full bg-transparent border-none text-slate-900 text-lg font-black focus:ring-0 block px-4 py-2 outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bölüm 4: Ekstra Yolcular & Notlar */}
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/60 relative overflow-hidden group/section">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover/section:scale-150 duration-700"></div>
                <div className="flex justify-between items-center mb-5 relative z-10">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </div>
                    Ekstralar & Notlar
                  </h4>
                  <button type="button" onClick={addExtraPassenger} className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:shadow-sm px-4 py-2 rounded-xl transition-all border border-indigo-100">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    Ek Yolcu Ekle
                  </button>
                </div>

                <div className="relative z-10">
                  {extraPassengers.length > 0 && (
                    <div className="space-y-3 mb-5 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                      {extraPassengers.map((passenger, index) => (
                        <div key={index} className="flex items-center gap-3 group/passenger">
                          <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                            {index + 2}
                          </div>
                          <input
                            type="text"
                            value={passenger}
                            onChange={(e) => updateExtraPassenger(index, e.target.value)}
                            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-2.5 transition-all"
                            placeholder={`${index + 2}. Yolcu Adı Soyadı`}
                          />
                          <button type="button" onClick={() => removeExtraPassenger(index)} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white hover:shadow-md hover:shadow-rose-500/20 flex items-center justify-center transition-all shrink-0" title="Kaldır">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <textarea rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block px-4 py-3 transition-all resize-none" placeholder="Şoföre iletilecek notlar, çocuk koltuğu talebi vs..." />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200/60 relative z-10 bg-slate-50/50 -mx-8 -mb-8 p-6 md:px-8">
                <button type="button" onClick={closeVoucherModal} className="px-6 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                  İptal Et
                </button>
                <button type="submit" className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 flex items-center gap-2">
                  {editingBookingId ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  )}
                  {editingBookingId ? 'Değişiklikleri Kaydet' : 'Rezervasyonu Tamamla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Detay Görünümü Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[95vh] overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gray-900 to-blue-900 px-6 py-5 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <span className="text-xl">📋</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">Rezervasyon Detayı</h3>
                  <p className="text-blue-200 text-xs mt-0.5 font-medium">Ref ID: #{selectedBooking.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 relative z-10">
                <button onClick={() => handleCopyDetails(selectedBooking)} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all text-xs font-bold shadow-sm border border-white/5" title="Bilgileri Kopyala">
                  {isCopied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-emerald-100">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      Kopyala
                    </>
                  )}
                </button>
                <button onClick={() => setIsDetailModalOpen(false)} className="text-white/60 hover:text-white bg-white/5 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm border border-white/5">
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Sol Kolon */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      Müşteri Bilgileri
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Adı Soyadı</p>
                      <p className="font-semibold text-gray-900 mb-3">{selectedBooking.customer_name}</p>

                      <p className="text-sm text-gray-500 mb-1">Telefon</p>
                      <p className="font-semibold text-gray-900 mb-3">{selectedBooking.customer_phone}</p>

                      {selectedBooking.customer_email && (
                        <>
                          <p className="text-sm text-gray-500 mb-1">E-Posta</p>
                          <p className="font-semibold text-gray-900">{selectedBooking.customer_email}</p>
                        </>
                      )}

                      {detailExtraPassengers.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ek Yolcular</p>
                          <div className="space-y-1.5">
                            {detailExtraPassengers.map((ep, idx) => (
                              <p key={idx} className="font-medium text-gray-800 text-sm">{ep}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      Transfer Bilgileri
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Tarih & Saat</p>
                      <p className="font-semibold text-gray-900 mb-3">
                        {new Date(selectedBooking.transfer_datetime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>

                      <p className="text-sm text-gray-500 mb-1">Araç Tipi</p>
                      <p className="font-semibold text-gray-900 mb-3 capitalize">{selectedBooking.vehicle_type}</p>

                      <p className="text-sm text-gray-500 mb-1">Yolcu Sayısı</p>
                      <p className="font-semibold text-gray-900 mb-3">{selectedBooking.passengers || 1} Kişi</p>

                      {selectedBooking.flight_number && (
                        <>
                          <p className="text-sm text-gray-500 mb-1">Uçuş No</p>
                          <p className="font-semibold text-gray-900">{selectedBooking.flight_number}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sağ Kolon */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      Güzergah
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center mt-1">
                          <div className="w-3 h-3 rounded-full bg-indigo-100 border-2 border-indigo-500"></div>
                          <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Alış Noktası</p>
                          <p className="font-medium text-gray-900">{selectedBooking.origin}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-100 border-2 border-emerald-500"></div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Varış Noktası</p>
                          <p className="font-medium text-gray-900">{selectedBooking.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      Finans & Durum
                    </h4>
                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                      <p className="text-sm text-gray-500 mb-1">Toplam Tutar</p>
                      <p className="text-2xl font-black text-indigo-700 mb-4">{selectedBooking.total_price.toLocaleString('tr-TR')} ₺</p>

                      <p className="text-sm text-gray-500 mb-1">Rezervasyon Durumu</p>
                      <div>{getStatusBadge(selectedBooking.status)}</div>
                    </div>
                  </div>

                  {detailDisplayNotes && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        Notlar
                      </h4>
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-sm text-gray-800 whitespace-pre-wrap">
                        {detailDisplayNotes}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => printVoucher(selectedBooking)} className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Yazdır
              </button>
              <button onClick={() => setIsDetailModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Map Analysis Modal */}
      <OperationMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        booking={mapBooking}
      />
    </>
  );
}
