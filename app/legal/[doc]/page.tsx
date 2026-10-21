import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs } from "@/lib/legal";

export function generateStaticParams() {
  return Object.keys(legalDocs).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc } = await params;
  return { title: legalDocs[doc]?.title ?? "Policy" };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const content = legalDocs[doc];
  if (!content) notFound();

  return (
    <article className="container-x max-w-3xl py-14">
      <h1 className="text-3xl font-semibold tracking-tight">{content.title}</h1>
      <div className="mt-10 space-y-8">
        {content.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-semibold">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
