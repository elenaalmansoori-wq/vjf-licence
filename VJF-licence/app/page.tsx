export default function HomePage() {
  return (
    <div
      className="home-bg"
      style={{
        backgroundImage: "url('/pozadi.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "calc(100vh - 140px)",
        margin: "-28px -20px -60px",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div className="card" style={{ background: "rgba(255,255,255,0.92)" }}>
          <h1>Licencování pro virtuální jezdeckou federaci</h1>
          <p>
            Zde si můžete vyplnit test pro každou licenci a pokud budete úspěšní, dostanete osvědčení
            na email a můžete jej použít na VJF pro vybrané práce.
          </p>
          <h2>Pravidla</h2>
          <ul className="rules">
            <li>Každý může vyzkoušet test max <b>1× za měsíc</b> a první pokus vždy stojí <b>15 000 Kk</b>.</li>
            <li>Každý další pokus je zdarma.</li>
            <li>Sumu automaticky odečteme ve virtuální bance, jakmile vyplníte test.</li>
            <li>
              Pro účast musíte být registrovaní na VJF.{" "}
              <a href="https://vjf.endora.site" target="_blank" rel="noreferrer">
                <img
                  src="https://vz-horizon.vercel.app/_next/image?url=https%3A%2F%2Fvjf.endora.site%2Fupload%2Fpropagace%2Fvjf_buttonek.png&w=256&q=75"
                  alt="VJF"
                  style={{ verticalAlign: "middle", marginLeft: 8, borderRadius: 6 }}
                />
              </a>
            </li>
            <li>
              Pro otázky a problémy se obraťte na náš{" "}
              <a href="https://discord.gg/TVa3yBYWDT" target="_blank" rel="noreferrer">
                Discord
              </a>
              .
            </li>
          </ul>
        </div>
        <div className="card" style={{ background: "rgba(255,255,255,0.92)" }}>
          <h2>Dostupné licence</h2>
          <p>Vyberte si v horním menu test pro <b>Veterináře</b>, <b>Kováře</b> nebo <b>Trenéra</b>.</p>
        </div>
      </div>
    </div>
  );
}
