import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Wrench, 
  RefreshCw,
  Cpu
} from "lucide-react";
import Card from "../../components/ui/Card";
import StatTile from "../../components/ui/StatTile";
import Badge from "../../components/ui/Badge";
import Swal from "sweetalert2";

const LaundryManagerDashboard = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsage: 0,
    operationalMachines: 0,
    maintenanceRequired: 0
  });

  const fetchMachines = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/laundry/machines");
      if (res.ok) {
        const data = await res.json();
        setMachines(data);
        
        // Calculate overview stats
        const usage = data.reduce((acc, curr) => acc + curr.totalUsage, 0);
        const operational = data.filter(m => m.status === 'operational').length;
        const maintenance = data.filter(m => m.status === 'repair').length;
        
        setStats({
          totalUsage: usage,
          operationalMachines: operational,
          maintenanceRequired: maintenance
        });
      }
    } catch (err) {
      console.error("Failed to fetch machines", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleUpdateStatus = async (machineId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:4000/api/laundry/machines/${machineId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: `Machine ${machineId} is now ${newStatus}`,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchMachines();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update machine status", "error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6 bg-zinc-50 min-h-screen"
    >
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Laundry Manager Dashboard 🧺</h1>
          <p className="opacity-90">Monitor machine usage and maintenance status</p>
        </div>
        <button 
          onClick={fetchMachines}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-colors backdrop-blur-md"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatTile 
          title="Total Usage" 
          value={stats.totalUsage} 
          icon={Activity} 
          color="primary" 
        />
        <StatTile 
          title="Operational" 
          value={`${stats.operationalMachines}/${machines.length}`} 
          icon={CheckCircle} 
          color="success" 
        />
        <StatTile 
          title="Down for Repair" 
          value={stats.maintenanceRequired} 
          icon={AlertTriangle} 
          color="warning" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {machines.map((machine) => (
          <motion.div key={machine.machineId} variants={itemVariants}>
            <Card className="p-0 overflow-hidden border-zinc-200 hover:shadow-lg transition-all duration-300 group">
              <div className="flex flex-col sm:flex-row">
                <div className={`sm:w-32 flex items-center justify-center p-6 sm:p-0 ${
                  machine.status === 'operational' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <Cpu className="w-12 h-12" />
                </div>
                
                <div className="p-6 flex-1 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-1">{machine.machineId}</h3>
                      <p className="text-zinc-500 text-sm font-medium">{machine.model} • {machine.type}</p>
                    </div>
                    <Badge variant={machine.status === 'operational' ? 'success' : 'warning'} className="uppercase px-3">
                      {machine.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="bg-zinc-50 p-3 rounded-2xl flex-1 border border-zinc-100">
                      <p className="text-xs text-zinc-400 font-bold uppercase mb-1">Lifetime Usage</p>
                      <p className="text-xl font-bold text-zinc-800">{machine.totalUsage} cycles</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-2xl flex-1 border border-zinc-100">
                      <p className="text-xs text-zinc-400 font-bold uppercase mb-1">Avg per week</p>
                      <p className="text-xl font-bold text-zinc-800">{(machine.totalUsage / 4).toFixed(1)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {machine.status === 'operational' ? (
                      <button 
                        onClick={() => handleUpdateStatus(machine.machineId, 'repair')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition font-semibold"
                      >
                        <Wrench className="w-4 h-4" />
                        Mark for Maintenance
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUpdateStatus(machine.machineId, 'operational')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition font-semibold"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Repair Completed
                      </button>
                    )}
                    <button className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LaundryManagerDashboard;
