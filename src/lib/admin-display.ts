export function countryFlag(code: string) {
  if (!/^[A-Za-z]{2}$/.test(code)) return "";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((letter) => 127397 + letter.charCodeAt(0)),
  );
}

export function formatAdminTime(iso: string) {
  return new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Pacific/Auckland",
  }).format(new Date(iso));
}
