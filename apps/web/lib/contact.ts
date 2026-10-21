export const CONTACT_LINKS = {
  messenger: 'https://www.facebook.com/profile.php?id=61593582713829',
  zalo: 'https://zalo.me/0376631650',
  facebook: 'https://www.facebook.com/profile.php?id=61593582713829',
  phone: '0376631650',
};

export function buildZaloLink(productName: string, productSlug: string): string {
  const text = `Chào Kinari, mình quan tâm đến "${productName}" (kinari.vn/san-pham/${productSlug}).`;
  return `${CONTACT_LINKS.zalo}?ref=${encodeURIComponent(text)}`;
}