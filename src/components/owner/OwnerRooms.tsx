import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Room } from '../../types';
import {
  Home,
  Plus,
  Edit2,
  CheckCircle2,
  X,
  Check,
  Image as ImageIcon,
  DollarSign,
  Users,
  Eye,
} from 'lucide-react';

const ALL_AVAILABLE_AMENITIES = [
  'Single Bed',
  '2 Beds , Sharing Room',
  'Study Desk',
  'Built-in Wardrobe',
  'High-Speed Wi-Fi',
  'En-suite Bathroom',
  'Heating',
  'Common Kitchen',
  'Security',
];

const PRESET_ROOM_IMAGES = [
  {
    name: 'Modern Single Suite',
    url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Spacious Sharing Room',
    url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bright 2nd Floor Studio',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Renovated Ground Unit',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  },
];

export const OwnerRooms: React.FC = () => {
  const { rooms, students, addNewRoom, updateRoom, showToast } = useApp();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    roomNumber: string;
    block: string;
    floor: string;
    roomType: string;
    capacity: number;
    bedsCount: string;
    monthlyRent: number;
    status: 'Occupied' | '1 Bed Occupied' | 'Available';
    amenities: string[];
    imageUrl: string;
    description: string;
  }>({
    roomNumber: '',
    block: 'Block A',
    floor: '1st Floor',
    roomType: 'Single Suite',
    capacity: 1,
    bedsCount: '1 Single Bed (Single Occupancy)',
    monthlyRent: 2800,
    status: 'Available',
    amenities: ['Single Bed', 'Study Desk', 'Built-in Wardrobe', 'High-Speed Wi-Fi'],
    imageUrl: PRESET_ROOM_IMAGES[0].url,
    description: '',
  });

  const handleOpenEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      block: room.block,
      floor: room.floor,
      roomType: room.roomType,
      capacity: room.capacity,
      bedsCount: room.bedsCount,
      monthlyRent: room.monthlyRent,
      status: room.status,
      amenities: [...room.amenities],
      imageUrl: room.imageUrl,
      description: room.description,
    });
    setIsEditModalOpen(true);
  };

  const handleToggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleSaveAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomNumber) {
      showToast('Room name or number required', 'warning');
      return;
    }

    addNewRoom({
      ...formData,
      assignedStudentIds: [],
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    updateRoom(selectedRoom.id, {
      ...formData,
    });

    setIsEditModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Rooms Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your layout assets, check occupancy status, and configure pricing.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              roomNumber: `Room 0${rooms.length + 1}`,
              block: 'Block A',
              floor: '1st Floor',
              roomType: 'Single Suite',
              capacity: 1,
              bedsCount: '1 Single Bed (Single Occupancy)',
              monthlyRent: 3000,
              status: 'Available',
              amenities: ['Single Bed', 'Study Desk', 'Built-in Wardrobe', 'High-Speed Wi-Fi'],
              imageUrl: PRESET_ROOM_IMAGES[3].url,
              description: 'Comfortable student room with premium finishes.',
            });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => {
          const assignedStudents = students.filter((s) =>
            room.assignedStudentIds.includes(s.id)
          );

          let statusBadge = (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Available
            </span>
          );

          if (room.status === 'Occupied') {
            statusBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                Occupied
              </span>
            );
          } else if (room.status === '1 Bed Occupied') {
            statusBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                1 Bed Occupied
              </span>
            );
          }

          return (
            <div
              key={room.id}
              className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex gap-4">
                  <img
                    src={room.imageUrl}
                    alt={room.roomNumber}
                    className="w-24 h-24 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                        {room.roomNumber}
                      </h3>
                      {statusBadge}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {room.block} - {room.floor}
                    </div>

                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                      R{room.monthlyRent.toLocaleString('en-ZA')}
                      <span className="text-xs font-normal text-slate-500"> / month</span>
                    </div>

                    <div className="text-[11px] text-slate-500 truncate mt-1">
                      {room.roomType} • {room.bedsCount}
                    </div>
                  </div>
                </div>

                {/* Assigned Residents */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Assigned Student Resident(s)
                  </span>
                  {assignedStudents.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {assignedStudents.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-750 text-xs text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700"
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${s.avatarColor} text-white text-[9px] font-bold flex items-center justify-center`}
                          >
                            {s.initials}
                          </div>
                          <span className="font-medium truncate">{s.shortName}</span>
                          <span className="text-[10px] text-slate-400">({s.studentNumber})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Vacant & ready for assignment
                    </span>
                  )}
                </div>

                {/* Amenities pills */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {room.amenities.slice(0, 4).map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      {a}
                    </span>
                  ))}
                  {room.amenities.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                      +{room.amenities.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(room)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Room Config
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Room Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {isAddModalOpen ? 'Add Accommodation Room' : 'Edit Room Config'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure pricing, layout specifications, and included room amenities.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isAddModalOpen ? handleSaveAddRoom : handleSaveEditRoom}
              className="p-6 overflow-y-auto space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Room Name / Number *
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g. Room 05"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Block Name *
                  </label>
                  <select
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">Floor *</label>
                  <select
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Room Type *
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Single Suite">Single Suite</option>
                    <option value="Double Unit">Double Unit</option>
                    <option value="Sharing Room">Sharing Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Monthly Price (ZAR) *
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyRent: Number(e.target.value) })
                    }
                    placeholder="2800"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Occupancy Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Available">Available</option>
                    <option value="1 Bed Occupied">1 Bed Occupied</option>
                    <option value="Occupied">Occupied</option>
                  </select>
                </div>
              </div>

              {/* Room Image Select / Preset */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Upload Room Image / Select Preset
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {PRESET_ROOM_IMAGES.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                        formData.imageUrl === preset.url
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-14 object-cover" />
                      <div className="p-1 text-[9px] truncate text-center bg-slate-50 dark:bg-slate-800">
                        {preset.name}
                      </div>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Or enter direct image URL"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              {/* Room Facilities & Amenities */}
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Room Facilities & Amenities Included
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_AVAILABLE_AMENITIES.map((amenity) => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity)}
                        className={`p-2 rounded-lg text-left border flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="truncate text-[11px]">{amenity}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
