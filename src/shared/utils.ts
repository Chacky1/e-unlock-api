export const slugify = (str: string) => {
  const slug = str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  return slug;
};
