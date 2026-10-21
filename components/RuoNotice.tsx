export function RuoNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-lg border border-warn-line bg-warn-bg p-4 text-sm text-warn ${className}`}>
      <p className="font-semibold">For laboratory research use only.</p>
      <p className="mt-1">
        Not for human or veterinary use. Not a drug, food, supplement or cosmetic. We do not provide dosing, administration
        or medical guidance, and we will cancel any order that indicates human use.
      </p>
    </div>
  );
}
