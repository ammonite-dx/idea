export default function FavoriteButton({ recordKind, recordId }: { recordKind:string, recordId:string }) {

  console.log('FavoriteButton', recordKind, recordId);
  return (
    <button className="base-text p-0">
      ☆
    </button>
  );
}
