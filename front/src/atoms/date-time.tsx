import React, { FC, TimeHTMLAttributes } from "react";
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
  return (
    <Typography
      ref={el =>
        el !== undefined &&
        el !== null &&
        ((el as TimeHTMLAttributes<HTMLElement>).dateTime = dt.toISOString())
      }
      component="time"
    >
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
