import { Loader2Icon } from "lucide-react";

const STATUS_CLASSES = {
  loading: "bg-muted-foreground",
  success: "bg-green-500",
  error: "bg-red-500",
};

const STATUS_LABELS = {
  loading: <Loader2Icon className="size-4 animate-spin" />,
  success: <b>UP</b>,
  error: <b>FAIL</b>,
};

export const ConnectionStatusIndicator = ({
  status,
}: {
  status: "loading" | "success" | "error";
}) => {
  const colorClass = STATUS_CLASSES[status];
  return (
    <div className="flex flex-row gap-2 items-center text-muted-foreground font-mono">
      {STATUS_LABELS[status]}
      <div className="relative size-4">
        <div
          className={`absolute size-4 rounded-full animate-ping ${colorClass}`}
        />
        <div className={`absolute size-4 rounded-full ${colorClass}`} />
      </div>
    </div>
  );
};
