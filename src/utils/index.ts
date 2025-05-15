import dayjs from "dayjs";

export const COMMUNITY_ID = "neo88";

// export const PLACEHOLDER_IMAGE =
//   "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/placeholder.jpg";

export const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

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
    return `${dStart.format("YYYY-MM-DD HH:mm")} 〜 ${dEnd.format("HH:mm")}`;
  } else {
    return `${dStart.format("YYYY-MM-DD HH:mm")} 〜 ${dEnd.format("YYYY-MM-DD HH:mm")}`;
  }
};

export const wait = async (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, 1_000 * seconds));
};
