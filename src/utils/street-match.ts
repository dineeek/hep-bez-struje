export function isUserStreet(
  outageStreet: string,
  userStreet: string
): boolean {
  return (
    !!userStreet &&
    !!outageStreet &&
    outageStreet.toLowerCase().includes(userStreet.toLowerCase())
  );
}
