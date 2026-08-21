import { GroupVisual, PrivacyVisual, ReconnectVisual } from "./FeatureVisual";

const FEATURES = [
  {
    title: "Live, then and there",
    body: "Messages travel over an open socket, so they land while the other person is still typing the next one. When the network dips, a slim banner tells you, the queue holds what you wrote, and it sends itself the moment you are back.",
    visual: <ReconnectVisual />,
  },
  {
    title: "Groups that stay legible",
    body: "Three people or sixty. Everyone gets a colour drawn from their account, so you know who is talking before you read the name. Admins add, remove, promote and rename; everyone else just talks.",
    visual: <GroupVisual />,
  },
  {
    title: "Nothing to leak",
    body: "We hold a number and a name. No photo upload, no address book scrape, no password to steal. Your avatar is two letters and a colour, and that turns out to be plenty.",
    visual: <PrivacyVisual />,
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-line bg-surface-2/40 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-[52ch]">
          <span className="text-meta text-accent">Features</span>
          <h2 className="mt-3 font-display text-[30px] leading-tight font-bold tracking-tight text-ink sm:text-[36px]">
            What it does, and what it deliberately doesn&rsquo;t
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col border border-line bg-surface p-5 transition-shadow hover:shadow-e2"
            >
              <div className="mb-6 h-24 bg-surface-2/70 px-4">{feature.visual}</div>
              <h3 className="font-display text-[19px] leading-snug font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
