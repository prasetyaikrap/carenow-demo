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

export function debounce<T extends (...args: never[]) => void>(
  callback: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}
