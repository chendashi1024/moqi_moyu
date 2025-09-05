import React from "react";
import { AlertCircle } from "lucide-react";
import { useHotlist } from "../hooks/useHotlist";
import { cn } from "../lib/utils";

interface DataSourceStatusProps {
  className?: string;
}

export const DataSourceStatus: React.FC<DataSourceStatusProps> = ({
  className,
}) => {
  const { apiError, timestamp } = useHotlist();

  const isRealData = true;
  const lastUpdateTime = timestamp ? new Date().toLocaleTimeString() : "";

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
        className
      )}
      style={{
        // background: isRealData
        //   ? "rgba(34, 197, 94, 0.15)"
        //   : "rgba(245, 158, 11, 0.15)",
        color: isRealData ? "var(--light-purple)" : "var(--secondary-purple)",
        border: `1px solid ${
          isRealData ? "rgba(34, 197, 94, 0.3)" : "rgba(245, 158, 11, 0.3)"
        }`,
        backdropFilter: "blur(10px)",
      }}
    >
      {/* {isRealData ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>实时数据</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>演示数据</span>
        </>
      )} */}

      {lastUpdateTime && <span className="opacity-75">·</span>}

      <span className="opacity-75">更新时间：{lastUpdateTime}</span>

      {apiError && (
        <>
          <AlertCircle className="w-3 h-3" />
          <span className="hidden sm:inline" title={apiError}>
            连接异常
          </span>
        </>
      )}
    </div>
  );
};

export default DataSourceStatus;
