import React, { FC, useRef, useEffect } from "react";
import Typography from "@material-ui/core/Typography";

interface DateTimeProps {
  readonly datetime: number | string | Date;
  readonly formatter: Intl.DateTimeFormat;
}

export const DateTime: FC<DateTimeProps> = ({
  datetime,
  formatter: format,
}) => {
  const dt = guessDate(datetime);
  const ref = useRef<HTMLTimeElement | null>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.dateTime = dt.toISOString();
    }
  }, []);
  return (
    <Typography ref={ref} component="time">
      {format.format(dt)}
    </Typography>
  );
};

const guessDate = (value: number | string | Date): Date =>
  value instanceof Date
    ? value
    : typeof value === "number"
    ? new Date(value)
    : new Date(Date.parse(value));
