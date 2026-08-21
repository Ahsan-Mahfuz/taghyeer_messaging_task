const STEPS = [
  {
    number: "01",
    title: "Type your number",
    body: "Either format. If you have been here before, you pick up where you left off.",
  },
  {
    number: "02",
    title: "Choose your name",
    body: "This is what everyone sees next to your messages. Change it whenever you like.",
  },
  {
    number: "03",
    title: "Talk",
    body: "Search a number to start a chat, or gather three people into a group.",
  },
];

export function Steps() {
  return (
    <section id="how" className="border-t border-line py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-[30px] leading-tight font-bold tracking-tight text-ink sm:text-[36px]">
          Three steps, none of them a form
        </h2>

        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((step) => (
            <li key={step.number} className="border-t-2 border-accent pt-4">
              <span className="text-meta text-accent">{step.number}</span>
              <h3 className="mt-2 text-[17px] font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
