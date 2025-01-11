import dayjs from "dayjs";

type Name = {
  lastName: string;
  middleName?: string | null;
  firstName: string;
};

export const displayName = <T extends Name>(args?: T | null, altText: string = "未登録") => {
  if (args) {
    const { lastName, firstName } = args;
    return `${lastName} ${firstName}`;
  }
  return altText;
};

export const displayDatetime = (date: Date | string, format: string = "YYYY-MM-DD HH:mm") => {
  return dayjs(date).format(format);
};

export const displayDuration = (start: Date | string, end: Date | string) => {
  const dStart = dayjs(start);
  const dEnd = dayjs(end);
  if (dStart.isSame(dEnd, "date")) {
    return `${ dStart.format("YYYY-MM-DD HH:mm") } 〜 ${ dEnd.format("HH:mm") }`;
  } else {
    return `${ dStart.format("YYYY-MM-DD HH:mm") } 〜 ${ dEnd.format("YYYY-MM-DD HH:mm") }`;
  }
};
