import { Badge } from "@/components/ui/badge";

const Status = ({ status }) => {
  // console.log("status", status);

  return (
    <>
      <span className="font-serif">
        {(status === "pending" ||
          status === "Pending" ||
          status === "inactive") && (
          <Badge variant="parked" className="capitalize">
            {status}
          </Badge>
        )}
        {status === "Waiting for Password Reset" && (
          <Badge variant="parked" className="capitalize">
            {status}
          </Badge>
        )}
        {(status === "processing" || status === "Processing") && (
          <Badge variant="unpublished" className="capitalize">
            {status}
          </Badge>
        )}
        {(status === "delivered" ||
          status === "Delivered" ||
          status === "active") && (
          <Badge variant="success" className="capitalize">
            {status}
          </Badge>
        )}
        {(status === "cancel" || status === "Cancel") && (
          <Badge variant="error" className="capitalize">
            {status}
          </Badge>
        )}
      </span>
    </>
  );
};

export default Status;
