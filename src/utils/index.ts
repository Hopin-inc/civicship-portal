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
