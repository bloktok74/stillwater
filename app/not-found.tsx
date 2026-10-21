import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <Link href="/shop" className="btn mt-6">
        Browse compounds
      </Link>
    </div>
  );
}
