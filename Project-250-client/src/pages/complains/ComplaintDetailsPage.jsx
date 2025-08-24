import { useParams } from "react-router-dom";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { mockComplaints } from "../../data/mockData";
import NotFound from "../../components/Complain/details/NotFound";
import ComplaintHeader from "../../components/Complain/details/ComplaintHeader";

import UpdatesTimeline from "../../components/Complain/details/UpdatesTimeline";
import ComplaintInfo from "../../components/Complain/details/ComplaintInfo";
import RelatedIssues from "../../components/Complain/details/RelatedIssues";
import ComplaintDetails from "../../components/Complain/details/ComplaintDetails";
import QuickActions from "../../components/Complain/details/QuickActions";


const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const complaint = mockComplaints.find(c => c.id === id);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "in_progress": return <AlertTriangle className="w-4 h-4" />;
      case "resolved": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "warning";
      case "in_progress": return "primary";
      case "resolved": return "success";
      default: return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "error";
      default: return "default";
    }
  };

  if (!complaint) return <NotFound />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen">
      <ComplaintHeader complaint={complaint} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ComplaintDetails
            complaint={complaint}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />
          <UpdatesTimeline complaint={complaint} getStatusIcon={getStatusIcon} />
        </div>
        <div className="space-y-6">
          <ComplaintInfo complaint={complaint} />
          <QuickActions complaint={complaint} />
          <RelatedIssues />
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;
