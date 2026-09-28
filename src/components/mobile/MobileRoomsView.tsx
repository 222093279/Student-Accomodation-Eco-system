import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Room } from '../../types';
import {
  Search,
  Bed,
  Wifi,
  FileText,
  Shield,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

interface Props {
  onNavigateToAgreement: () => void;
}

export const MobileRoomsView: React.FC<Props> = ({ onNavigateToAgreement }) => {
  const { rooms, currentStudent, currentStudentRoom, currentStudentAgreement } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filteredRooms = rooms.filter(
    (r) =>
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.floor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search available blocks, rooms..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs placeholder:text-slate-400 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Active Lease / Your Accommodation Card */}
      {currentStudentRoom && (
        <div className="bg-gradient-to-br from-emerald-800 to-teal-950 text-white rounded-2xl p-4 shadow-lg border border-emerald-700/40 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-300">
              Your Accommodation • Active Lease
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {currentStudentRoom.roomNumber}
              </h2>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {currentStudentRoom.block} • {currentStudentRoom.floor}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-300 font-medium">Rental Price</div>
              <div className="text-base font-bold text-white">
                R{currentStudentRoom.monthlyRent.toLocaleString('en-ZA')}.00
                <span className="text-[10px] font-normal text-emerald-200"> / month</span>
              </div>
            </div>
          </div>

          {/* Key Amenities */}
          <div className="mt-3 pt-3 border-t border-emerald-700/50">
            <div className="text-[10px] font-medium uppercase tracking-wider text-emerald-300/90 mb-2">
              Amenities Included
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentStudentRoom.amenities.slice(0, 4).map((amenity, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-900/60 text-emerald-100 border border-emerald-700/60"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-300" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-3.5 flex items-center justify-between gap-2">
            <button
              onClick={onNavigateToAgreement}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-emerald-950 font-semibold text-xs shadow-xs hover:bg-emerald-50 transition active:scale-[0.98]"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-800" />
              View Agreement
            </button>
            <button
              onClick={() => setSelectedRoom(currentStudentRoom)}
              className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-emerald-700/60 text-emerald-100 font-medium text-xs hover:bg-emerald-700 transition"
            >
              Room Details
            </button>
          </div>
        </div>
      )}

      {/* Available / All Residence Rooms */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Residence Block Directory
          </h3>
          <span className="text-[11px] text-slate-400">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
          </span>
        </div>

        <div className="space-y-3">
          {filteredRooms.map((room) => {
            const isCurrentStudentRoom = room.id === currentStudentRoom?.id;
            return (
              <div
                key={room.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition flex flex-col gap-2.5"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <img
                    src={room.imageUrl}
                    alt={room.roomNumber}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {room.roomNumber}
                      </h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          room.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : room.status === '1 Bed Occupied'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isCurrentStudentRoom ? 'Your Room' : room.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {room.block} • {room.floor}
                    </p>

                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                      R{room.monthlyRent.toLocaleString('en-ZA')}
                      <span className="text-[10px] font-normal text-slate-500">/month</span>
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {room.bedsCount}
                    </div>
                  </div>
                </div>

                {/* Amenities snippet & button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 truncate max-w-[170px]">
                    {room.amenities.slice(0, 3).join(' • ')}
                  </span>
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800"
                  >
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Room Details
              </span>
              <button
                onClick={() => setSelectedRoom(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3">
              <img
                src={selectedRoom.imageUrl}
                alt={selectedRoom.roomNumber}
                className="w-full h-44 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
              />

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedRoom.roomNumber}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedRoom.block} • {selectedRoom.floor} • {selectedRoom.roomType}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Rental Price</div>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                    R{selectedRoom.monthlyRent.toLocaleString('en-ZA')}
                    <span className="text-xs font-normal"> / month</span>
                  </div>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedRoom.description}
              </p>

              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Amenities Included
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedRoom.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedRoom(null);
                    onNavigateToAgreement();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs text-center shadow-xs transition"
                >
                  View Agreement
                </button>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
