import { motion } from "framer-motion";
import { Building, Users, Wifi, Snowflake, Tv, Car, TreePine, Bed } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";


const RoomCard = ({ room }) => {
  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "wifi": return <Wifi className="w-4 h-4" />;
      case "ac": return <Snowflake className="w-4 h-4" />;
      case "tv": return <Tv className="w-4 h-4" />;
      case "parking": return <Car className="w-4 h-4" />;
      case "balcony": return <TreePine className="w-4 h-4" />;
      case "study_table": return <Bed className="w-4 h-4" />;
      case "wardrobe": return <Building className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const getAmenityLabel = (amenity) => {
    const labels = {
      wifi: "WiFi",
      ac: "Air Conditioning",
      tv: "Television",
      parking: "Parking",
      balcony: "Balcony",
      study_table: "Study Table",
      wardrobe: "Wardrobe",
    };
    return labels[amenity] || amenity;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "success";
      case "occupied": return "warning";
      case "maintenance": return "error";
      default: return "default";
    }
  };

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
      <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl">
        {/* Header */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
            <div className="text-center text-white">
              <Building className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{room.number}</h3>
              <p className="text-sm opacity-90">Block {room.block} • Floor {room.floor}</p>
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={getStatusColor(room.status)}>{room.status}</Badge>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Info */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{room.type} Room</h4>
              <p className="text-sm text-gray-500">{room.capacity} capacity</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-indigo-500">${room.rent}</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
          </div>

          {/* Occupancy */}
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{room.occupants.length} / {room.capacity} occupied</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(room.occupants.length / room.capacity) * 100}%` }} />
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-800 mb-2">Amenities</h5>
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 4).map((amenity) => (
                <div key={amenity} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                  {getAmenityIcon(amenity)}
                  <span>{getAmenityLabel(amenity)}</span>
                </div>
              ))}
              {room.amenities.length > 4 && (
                <div className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500">+{room.amenities.length - 4} more</div>
              )}
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
              room.status === "available"
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : room.status === "occupied"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-red-100 text-red-600 cursor-not-allowed"
            }`}
            disabled={room.status !== "available"}
          >
            {room.status === "available" ? "View Details" : room.status === "occupied" ? "Occupied" : "Under Maintenance"}
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
};

export default RoomCard;
