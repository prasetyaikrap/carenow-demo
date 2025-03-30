import { tz } from "@date-fns/tz";
import { format } from "date-fns";

type FormatDateProps = {
  date: string;
  format?: string;
  timeZone?: string;
};

export function formatDate({
  date,
  format: formatString = "EEEE, dd MMMM yyyy, HH:mm:ss",
  timeZone = "Asia/Jakarta",
}: FormatDateProps) {
  const dateFormat = format(new Date(date), formatString, {
    in: tz(timeZone),
  });

  return {
    dateFormat,
    timeZone,
  };
}
