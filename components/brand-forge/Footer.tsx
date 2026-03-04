"use client";

export function Footer() {
  return (
    <footer className="w-full py-12 mt-auto border-t border-border flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left">
      <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
        Made for the{" "}
        <span className="text-secondary font-bold">Bulk Trade</span> fam.
      </div>
      <div className="flex gap-6">
        <a
          href="https://x.com/bulktrade"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter) - Bulk Trade"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.732.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.923-2.958 1.138C18.47 3.6 17.287 3 16 3c-2.616 0-4.732 2.03-4.732 4.53 0 .354.04.7.117 1.03C7.728 8.39 4.1 6.405 1.67 3.42c-.388.66-.61 1.424-.61 2.238 0 1.547.81 2.913 2.043 3.714-.75-.024-1.457-.233-2.076-.577v.06c0 2.16 1.498 3.96 3.486 4.366-.365.1-.75.153-1.147.153-.28 0-.555-.028-.82-.078.556 1.78 2.168 3.077 4.082 3.112-1.495 1.193-3.38 1.906-5.428 1.906-.353 0-.704-.02-1.048-.06 1.94 1.228 4.243 1.944 6.72 1.944 8.064 0 12.48-6.86 12.48-12.811 0-.196-.005-.392-.014-.586.857-.62 1.6-1.397 2.187-2.283-.786.35-1.63.587-2.515.694z" />
          </svg>
        </a>
        <a
          href="https://discord.com/invite/bulk"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord - Bulk Trade"
          className="text-muted-foreground hover:text-secondary transition-colors"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.07.07 0 00-.075.035c-.21.375-.444.864-.608 1.249-1.84-.276-3.68-.276-5.486 0-.164-.393-.405-.874-.617-1.249a.066.066 0 00-.075-.035 19.736 19.736 0 00-4.885 1.515.059.059 0 00-.028.021C2.115 9.06 1.325 13.53 2.1 17.905a.082.082 0 00.03.049c2.052 1.5 4.045 2.422 5.992 3.03a.073.073 0 00.078-.027c.46-.63.874-1.297 1.237-1.995a.06.06 0 00-.035-.086c-.652-.247-1.27-.54-1.844-.88a.062.062 0 01-.006-.103c.124-.094.248-.192.366-.291a.06.06 0 01.061-.01c3.87 1.76 8.042 1.76 11.86 0a.06.06 0 01.063.009c.119.1.243.199.367.293.045.03.03.094-.006.103-.575.342-1.192.635-1.845.882a.061.061 0 00-.034.085c.36.697.774 1.364 1.237 1.995a.074.074 0 00.078.027c1.95-.608 3.944-1.53 5.996-3.03a.077.077 0 00.03-.05c.733-4.73-.559-9.163-2.927-12.516a.061.061 0 00-.03-.02zM8.02 15.331c-1.182 0-2.153-1.085-2.153-2.419 0-1.333.95-2.419 2.153-2.419 1.21 0 2.18 1.096 2.153 2.419 0 1.334-.95 2.419-2.153 2.419zm7.98 0c-1.182 0-2.153-1.085-2.153-2.419 0-1.333.95-2.419 2.153-2.419 1.21 0 2.18 1.096 2.153 2.419 0 1.334-.943 2.419-2.153 2.419z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
}
