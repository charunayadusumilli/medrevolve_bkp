// Scoped styles for the MedRevolve launch homepage. Every rule sits under .mrx.
export const LAUNCH_CSS = `
.mrx{--bg:#0D1411;--bg-2:#111A16;--surface:#16211C;--surface-2:#1D2B24;--line:#2A3C33;--fg:#ECF2ED;--muted:#9BB0A4;--sage:#8ED6A9;--sage-ink:#0D1411;--brass:#E0A668;--alert:#F08A7A;
  --f-display:"Fraunces", Georgia, "Times New Roman", serif;--f-body:"Geist", system-ui, -apple-system, "Segoe UI", sans-serif;--f-mono:"JetBrains Mono", ui-monospace, Menlo, monospace;
  --r:14px;--brand:#4A6741;color-scheme:dark;background:var(--bg);color:var(--fg);font-family:var(--f-body);font-size:16px;line-height:1.6}
.mrx, .mrx *{box-sizing:border-box}
.mrx a{color:inherit}
.mrx :focus-visible{outline:2px solid var(--sage);outline-offset:3px;border-radius:6px}
.mrx .wrap{max-width:1180px;margin:0 auto;padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px))}
.mrx h1, .mrx h2, .mrx h3{font-family:var(--f-display);font-weight:400;margin:0;text-wrap:balance;letter-spacing:-.01em;color:var(--fg)}
.mrx h1{font-size:clamp(2.6rem,6.2vw,4.9rem);line-height:1.0;font-variation-settings:"opsz" 144}
.mrx h2{font-size:clamp(2rem,4vw,3.1rem);line-height:1.05;font-variation-settings:"opsz" 120}
.mrx h3{font-size:1.35rem;line-height:1.2}
.mrx em.i{font-style:italic;color:var(--sage)}
.mrx p{margin:0}
.mrx ul, .mrx ol{margin:0}
.mrx .eyebrow{font-family:var(--f-mono);font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--brass)}
.mrx .lead{font-size:1.15rem;color:var(--muted);max-width:60ch}
.mrx .muted{color:var(--muted)}
.mrx .btn{display:inline-flex;align-items:center;gap:10px;font-weight:600;font-size:.98rem;padding:13px 20px;border-radius:999px;text-decoration:none;border:1px solid transparent;cursor:pointer;font-family:var(--f-body);transition:transform .2s ease, background .2s ease}
.mrx .btn:hover{transform:translateY(-1px)}
.mrx .btn-primary{background:var(--sage);color:var(--sage-ink)}
.mrx .btn-ghost{border-color:var(--line);color:var(--fg);background:transparent}
.mrx .btn-ghost:hover{background:var(--surface)}
.mrx .arrow{font-family:var(--f-mono)}
.mrx section{padding-block:96px}
.mrx section[id]{scroll-margin-top:110px}
.mrx .sec-head{display:flex;flex-direction:column;gap:14px;max-width:760px;margin-bottom:44px}
.mrx .alt{background:var(--bg-2);border-block:1px solid var(--line)}

.mrx .hero{padding-block:72px 64px;position:relative;overflow:hidden}
.mrx .hero::before{content:"";position:absolute;inset:-20% -10% auto auto;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle, color-mix(in srgb, var(--sage) 22%, transparent), transparent 62%);pointer-events:none}
.mrx .hero .wrap{display:grid;grid-template-columns:1.05fr 1fr;gap:56px;align-items:center;position:relative}
.mrx .hero-copy{display:flex;flex-direction:column;gap:24px;min-width:0}
.mrx .hero-cta{display:flex;flex-wrap:wrap;gap:12px}
.mrx .for{display:flex;flex-wrap:wrap;gap:8px}
.mrx .for span{font-family:var(--f-mono);font-size:.74rem;border:1px solid var(--line);border-radius:999px;padding:5px 11px;color:var(--muted)}
.mrx .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;border-top:1px solid var(--line);padding-top:22px}
.mrx .stat b{display:block;font-family:var(--f-display);font-weight:400;font-size:2.1rem;line-height:1}
.mrx .stat span{font-size:.84rem;color:var(--muted)}
@media (max-width:920px){.mrx .hero .wrap{grid-template-columns:1fr}}

.mrx .studio{display:flex;flex-direction:column;gap:14px;min-width:0}
.mrx .controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:12px 14px}
.mrx .controls label{font-family:var(--f-mono);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.mrx .controls input[type=text]{flex:1 1 150px;min-width:0;background:var(--bg-2);border:1px solid var(--line);border-radius:10px;color:var(--fg);padding:9px 12px;font:inherit}
.mrx .swatches{display:flex;gap:6px}
.mrx .swatch{width:26px;height:26px;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0}
.mrx .swatch[aria-pressed=true]{border-color:var(--fg)}
.mrx .controls select{background:var(--bg-2);border:1px solid var(--line);border-radius:10px;color:var(--fg);padding:8px 10px;font:inherit}
.mrx .browser{border-radius:18px;overflow:hidden;border:1px solid var(--line);background:#FBFAF7;color:#1A1F1C;box-shadow:0 30px 80px -30px rgba(0,0,0,.55)}
.mrx .bar{display:flex;align-items:center;gap:8px;background:#ECEAE4;padding:10px 12px;border-bottom:1px solid #DCD9D0}
.mrx .bar i{width:10px;height:10px;border-radius:50%;background:#CFCBC1;display:block}
.mrx .url{flex:1;background:#fff;border-radius:7px;font-family:var(--f-mono);font-size:.74rem;padding:5px 10px;color:#5B635E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mrx .sf{padding:18px 20px 22px;display:flex;flex-direction:column;gap:14px}
.mrx .sf-nav{display:flex;justify-content:space-between;align-items:center;font-size:.82rem}
.mrx .sf-brand{display:flex;align-items:center;gap:8px;font-weight:600;font-size:1rem}
.mrx .sf-dot{width:22px;height:22px;border-radius:7px;background:var(--brand);transition:background .3s}
.mrx .sf-links{display:flex;gap:14px;color:#6A716C}
.mrx .sf-hero{border-radius:14px;padding:22px;background:color-mix(in srgb, var(--brand) 12%, #fff);display:flex;flex-direction:column;gap:10px;transition:background .3s}
.mrx .sf-hero h4{margin:0;font-family:var(--f-display);font-weight:400;font-size:1.6rem;line-height:1.1;color:#141A17}
.mrx .sf-hero p{font-size:.86rem;color:#4E5651}
.mrx .sf-btn{align-self:flex-start;background:var(--brand);color:#fff;border-radius:999px;padding:8px 16px;font-size:.84rem;font-weight:600;transition:background .3s}
.mrx .sf-trust{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.74rem;color:#59615C}
.mrx .sf-trust span::before{content:"✓ ";color:var(--brand);font-weight:700}
.mrx .sf-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.mrx .sf-card{border:1px solid #E5E2DA;border-radius:10px;padding:10px;font-size:.76rem;display:flex;flex-direction:column;gap:4px;background:#fff}
.mrx .sf-card b{font-size:.82rem;color:#1A1F1C}
.mrx .sf-card span{color:#6A716C}
.mrx .studio-note{font-size:.8rem;color:var(--muted)}

.mrx .qband{border-block:1px solid var(--line);background:var(--bg-2);padding-block:0}
.mrx .qgrid{display:grid;grid-template-columns:repeat(5,1fr)}
.mrx .q{padding:26px 20px;border-right:1px solid var(--line);text-decoration:none;display:flex;flex-direction:column;gap:8px;transition:background .2s}
.mrx .q:last-child{border-right:0}
.mrx .q:hover{background:var(--surface)}
.mrx .q .n{font-family:var(--f-mono);font-size:.72rem;color:var(--brass)}
.mrx .q b{font-family:var(--f-display);font-weight:400;font-size:1.25rem;line-height:1.15}
.mrx .q span{font-size:.86rem;color:var(--muted)}
@media (max-width:980px){.mrx .qgrid{grid-template-columns:1fr 1fr}.mrx .q{border-bottom:1px solid var(--line)}}
@media (max-width:520px){.mrx .qgrid{grid-template-columns:1fr}.mrx .q{border-right:0}}

.mrx .days{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;position:relative;margin-bottom:22px}
.mrx .days::before{content:"";position:absolute;left:4%;right:4%;top:23px;height:2px;background:var(--line)}
.mrx .days .fill{position:absolute;left:4%;top:23px;height:2px;background:var(--sage);transition:width .45s ease}
.mrx .day{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;background:none;border:0;color:var(--muted);cursor:pointer;font:inherit;padding:0}
.mrx .day .dot{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--surface);border:1.5px solid var(--line);font-family:var(--f-mono);font-size:.9rem;color:var(--fg);transition:all .25s;z-index:1}
.mrx .day .lbl{font-size:.8rem;text-align:center;line-height:1.25}
.mrx .day.done .dot{background:color-mix(in srgb, var(--sage) 20%, var(--surface));border-color:var(--sage)}
.mrx .day[aria-selected=true] .dot{background:var(--sage);color:var(--sage-ink);border-color:var(--sage);transform:scale(1.08)}
.mrx .day[aria-selected=true] .lbl{color:var(--fg)}
@media (max-width:640px){.mrx .day .lbl{display:none}.mrx .days{gap:4px}.mrx .day .dot{width:38px;height:38px}.mrx .days::before, .mrx .days .fill{top:19px}}
.mrx .daypanel{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.mrx .col{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:24px;display:flex;flex-direction:column;gap:12px;min-width:0}
.mrx .col.we{border-color:color-mix(in srgb, var(--sage) 45%, var(--line))}
.mrx .col .who{font-family:var(--f-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase}
.mrx .col.you .who{color:var(--brass)}
.mrx .col.we .who{color:var(--sage)}
.mrx .col ul{padding-left:18px;display:flex;flex-direction:column;gap:6px;list-style:disc}
.mrx .daytitle{grid-column:1/-1;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:8px}
.mrx .daytitle h3{font-size:1.7rem}
.mrx .time{font-family:var(--f-mono);font-size:.8rem;color:var(--muted)}
@media (max-width:720px){.mrx .daypanel{grid-template-columns:1fr}}

.mrx .tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
.mrx .tab{background:var(--surface);border:1px solid var(--line);color:var(--muted);border-radius:999px;padding:8px 15px;font:inherit;font-size:.9rem;cursor:pointer}
.mrx .tab[aria-selected=true]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.mrx .anat{display:grid;grid-template-columns:1.25fr .75fr;gap:22px;align-items:start}
.mrx .anat .browser{min-height:360px}
.mrx .screen{position:relative}
.mrx .notes ul{padding:0;display:flex;flex-direction:column;gap:12px;counter-reset:n;list-style:none}
.mrx .notes li{display:grid;grid-template-columns:28px 1fr;gap:10px;font-size:.95rem}
.mrx .notes li::before{counter-increment:n;content:counter(n);width:26px;height:26px;border-radius:50%;background:var(--brass);color:var(--bg);font-family:var(--f-mono);font-size:.78rem;display:grid;place-items:center}
.mrx .pin{position:absolute;width:22px;height:22px;border-radius:50%;background:var(--brass);color:#141A17;font-family:var(--f-mono);font-size:.7rem;display:grid;place-items:center;box-shadow:0 0 0 4px color-mix(in srgb, var(--brass) 30%, transparent)}
@media (max-width:860px){.mrx .anat{grid-template-columns:1fr}}
.mrx .mock-row{display:flex;justify-content:space-between;gap:10px;font-size:.8rem;border-bottom:1px solid #EEEBE3;padding:8px 0}
.mrx .mock-k{color:#6A716C}
.mrx .mock-field{border:1px solid #E1DED5;border-radius:8px;padding:9px 11px;font-size:.8rem;color:#6A716C;background:#fff}
.mrx .mock-steps{display:flex;gap:6px}
.mrx .mock-steps i{flex:1;height:5px;border-radius:3px;background:#E3E0D7}
.mrx .mock-steps i.on{background:var(--brand)}
.mrx .mock-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.mrx .mock-kpi{border:1px solid #E5E2DA;border-radius:10px;padding:10px;background:#fff}
.mrx .mock-kpi b{display:block;font-size:1.05rem;color:#141A17;font-variant-numeric:tabular-nums}
.mrx .mock-kpi span{font-size:.7rem;color:#6A716C}
.mrx .ex{font-family:var(--f-mono);font-size:.64rem;letter-spacing:.08em;text-transform:uppercase;color:#8A6A3E;background:#F6EEDF;border-radius:4px;padding:2px 6px;align-self:flex-start}
@media (max-width:520px){.mrx .mock-kpis{grid-template-columns:1fr 1fr}.mrx .sf-cards{grid-template-columns:1fr 1fr}.mrx .sf-links{display:none}}

.mrx .journey{display:flex;align-items:stretch;margin-bottom:40px;overflow-x:auto;padding-bottom:6px}
.mrx .jstep{flex:1 0 128px;display:flex;flex-direction:column;gap:10px;position:relative;padding-right:22px}
.mrx .jstep:last-child{padding-right:0}
.mrx .jstep .ico{width:52px;height:52px;border-radius:16px;background:var(--surface);border:1px solid var(--line);display:grid;place-items:center;position:relative;z-index:1}
.mrx .jstep .ico svg{width:24px;height:24px;stroke:var(--sage);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.mrx .jstep::after{content:"";position:absolute;top:26px;left:58px;right:4px;height:2px;background:repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 11px)}
.mrx .jstep:last-child::after{display:none}
.mrx .jstep b{font-size:.95rem}
.mrx .jstep > span:not(.pulse){font-size:.8rem;color:var(--muted)}
.mrx .jstep .pulse{position:absolute;top:22px;left:58px;width:10px;height:10px;border-radius:50%;background:var(--sage);opacity:0}
.mrx .jstep:last-child .pulse{display:none}
@media (prefers-reduced-motion:no-preference){
  .mrx .jstep .pulse{animation:mrxTravel 7s linear infinite}
  .mrx .jstep:nth-child(2) .pulse{animation-delay:1s}.mrx .jstep:nth-child(3) .pulse{animation-delay:2s}.mrx .jstep:nth-child(4) .pulse{animation-delay:3s}.mrx .jstep:nth-child(5) .pulse{animation-delay:4s}
}
@keyframes mrxTravel{0%{opacity:0;transform:translateX(0)}2%{opacity:1}12%{opacity:1;transform:translateX(52px)}14%,100%{opacity:0;transform:translateX(56px)}}
.mrx .layers{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.mrx .layer{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:24px;display:flex;flex-direction:column;gap:12px}
.mrx .layer .tag{font-family:var(--f-mono);font-size:.72rem;color:var(--sage);letter-spacing:.08em;text-transform:uppercase}
.mrx .layer dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:.92rem}
.mrx .layer dt{color:var(--muted)}
.mrx .layer dd{margin:0}
@media (max-width:760px){.mrx .layers{grid-template-columns:1fr}.mrx .layer dl{grid-template-columns:1fr}.mrx .layer dt{margin-top:6px}}

.mrx .pay{display:grid;grid-template-columns:1.1fr .9fr;gap:22px}
.mrx .flowbox{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:26px;display:flex;flex-direction:column;gap:20px;min-width:0}
.mrx .pflow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.mrx .pnode{background:var(--bg-2);border:1px solid var(--line);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:2px;min-width:0}
.mrx .pnode b{font-size:.95rem}
.mrx .pnode span{font-size:.76rem;color:var(--muted)}
.mrx .parrow{color:var(--sage);font-family:var(--f-mono)}
.mrx .branches{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.mrx .branch{border-top:2px solid var(--brass);padding-top:10px;font-size:.88rem}
.mrx .branch b{display:block;margin-bottom:2px}
.mrx .side{display:flex;flex-direction:column;gap:16px}
.mrx .box{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:22px;display:flex;flex-direction:column;gap:10px}
.mrx .box.inset{background:var(--bg-2)}
.mrx .checks{list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;font-size:.93rem}
.mrx .checks li{display:grid;grid-template-columns:20px 1fr;gap:10px}
.mrx .checks li::before{content:"";width:16px;height:16px;margin-top:4px;border-radius:5px;border:1.5px solid var(--sage);background:color-mix(in srgb, var(--sage) 18%, transparent)}
@media (max-width:860px){.mrx .pay{grid-template-columns:1fr}.mrx .branches{grid-template-columns:1fr}}

.mrx .comp{display:grid;grid-template-columns:.9fr 1.1fr;gap:22px;align-items:start}
.mrx .cyc{display:grid;grid-template-columns:44px 1fr;gap:14px;padding-bottom:22px;position:relative}
.mrx .cyc::before{content:"";position:absolute;left:21px;top:44px;bottom:0;width:2px;background:var(--line)}
.mrx .cyc:last-child::before{display:none}
.mrx .cyc .k{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-family:var(--f-mono);font-size:.8rem;background:var(--surface);border:1.5px solid var(--sage);color:var(--sage)}
.mrx .cyc b{display:block;font-size:1.02rem;margin-top:9px}
.mrx .cyc span{font-size:.9rem;color:var(--muted)}
.mrx .inbox{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.mrx .inbox-h{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid var(--line);font-size:.9rem}
.mrx .msg{display:grid;grid-template-columns:auto 1fr auto;gap:12px;padding:15px 18px;border-bottom:1px solid var(--line);align-items:start}
.mrx .msg:last-child{border-bottom:0}
.mrx .sev{width:9px;height:9px;border-radius:50%;margin-top:7px;display:block}
.mrx .msg b{display:block;font-size:.95rem}
.mrx .msg span{font-size:.84rem;color:var(--muted)}
.mrx .msg .st{font-family:var(--f-mono);font-size:.68rem;border-radius:999px;padding:3px 9px;white-space:nowrap;border:1px solid var(--line)}
.mrx .exd{font-family:var(--f-mono);font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--brass);border:1px solid color-mix(in srgb, var(--brass) 50%, transparent);border-radius:4px;padding:2px 6px}
@media (max-width:860px){.mrx .comp{grid-template-columns:1fr}}

.mrx .board{display:grid;grid-template-columns:repeat(5,minmax(170px,1fr));gap:12px;overflow-x:auto;padding-bottom:8px}
.mrx .lane{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:14px;display:flex;flex-direction:column;gap:10px;min-width:170px}
.mrx .lane-h{display:flex;justify-content:space-between;font-size:.86rem;font-weight:600}
.mrx .lane-h span{font-family:var(--f-mono);color:var(--muted);font-weight:400}
.mrx .ticket{background:var(--bg-2);border:1px solid var(--line);border-radius:10px;padding:10px;font-size:.8rem;display:flex;flex-direction:column;gap:4px}
.mrx .ticket b{font-size:.85rem}
.mrx .ticket i{font-style:normal;color:var(--muted)}
.mrx .chans{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.mrx .chans span{border:1px solid var(--line);border-radius:999px;padding:6px 13px;font-size:.86rem;background:var(--surface)}
.mrx .grow2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:28px}
@media (max-width:760px){.mrx .grow2{grid-template-columns:1fr}}

.mrx .price{display:grid;grid-template-columns:.8fr 1.2fr;gap:22px;align-items:start}
.mrx .pcard{background:linear-gradient(160deg, color-mix(in srgb, var(--sage) 16%, var(--surface)), var(--surface));border:1px solid color-mix(in srgb, var(--sage) 40%, var(--line));border-radius:20px;padding:30px;display:flex;flex-direction:column;gap:16px;position:sticky;top:120px}
.mrx .pcard .btn{justify-content:center}
.mrx .amount{font-family:var(--f-display);font-size:4.2rem;line-height:1;font-variation-settings:"opsz" 144}
.mrx .plan{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.mrx .pgroup{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:20px;display:flex;flex-direction:column;gap:10px}
.mrx .pgroup h3{font-size:1.1rem;font-family:var(--f-body);font-weight:600}
.mrx .pgroup ol{padding-left:0;list-style:none;display:flex;flex-direction:column;gap:8px}
.mrx .pgroup li{display:grid;grid-template-columns:30px 1fr;gap:8px;font-size:.9rem}
.mrx .pgroup li b{display:block;font-weight:600}
.mrx .pgroup li span{color:var(--muted);font-size:.84rem}
.mrx .pgroup li::before{font-family:var(--f-mono);font-size:.74rem;color:var(--brass);padding-top:2px;content:attr(data-n)}
.mrx .sep{grid-column:1/-1;background:var(--bg-2);border:1px dashed var(--line);border-radius:var(--r);padding:20px;display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
.mrx .sep ul{padding-left:18px;font-size:.9rem;display:flex;flex-direction:column;gap:4px;list-style:disc}
@media (max-width:900px){.mrx .price{grid-template-columns:1fr}.mrx .pcard{position:static}}
@media (max-width:620px){.mrx .plan, .mrx .sep{grid-template-columns:1fr}}

.mrx .build{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start}
.mrx .form{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:26px;display:flex;flex-direction:column;gap:20px}
.mrx .fset{border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.mrx .fset legend{font-family:var(--f-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;padding:0}
.mrx .chips{display:flex;flex-wrap:wrap;gap:8px}
.mrx .chip{position:relative}
.mrx .chip input{position:absolute;opacity:0;inset:0;cursor:pointer;margin:0}
.mrx .chip span{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:7px 14px;font-size:.9rem;background:var(--bg-2);transition:all .15s}
.mrx .chip input:checked + span{background:var(--sage);color:var(--sage-ink);border-color:var(--sage)}
.mrx .chip input:focus-visible + span{outline:2px solid var(--sage);outline-offset:2px}
.mrx .out{background:var(--bg-2);border:1px solid color-mix(in srgb, var(--sage) 40%, var(--line));border-radius:var(--r);padding:26px;display:flex;flex-direction:column;gap:14px}
.mrx .out h3{font-size:1.5rem}
.mrx .out ul{padding-left:18px;display:flex;flex-direction:column;gap:6px;font-size:.93rem;list-style:disc}
.mrx .out .flag{font-size:.86rem;color:var(--muted);border-left:3px solid var(--brass);padding-left:12px}
.mrx .out .btn{align-self:flex-start}
.mrx .cl{display:flex;flex-direction:column;gap:10px;margin-top:6px}
.mrx .cl label{display:grid;grid-template-columns:22px 1fr;gap:10px;font-size:.92rem;cursor:pointer;align-items:start}
.mrx .cl input{width:18px;height:18px;margin-top:3px;accent-color:var(--sage)}
.mrx .cl input:checked + span{color:var(--muted);text-decoration:line-through}
.mrx .progress{height:6px;border-radius:3px;background:var(--line);overflow:hidden}
.mrx .progress i{display:block;height:100%;background:var(--sage);width:0;transition:width .3s}
.mrx .clcount{font-family:var(--f-mono);font-size:.82rem}
@media (max-width:860px){.mrx .build{grid-template-columns:1fr}}

.mrx .arts{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:48px}
.mrx .art{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:22px;display:flex;flex-direction:column;gap:10px}
.mrx .art .tg{font-family:var(--f-mono);font-size:.7rem;color:var(--brass);letter-spacing:.08em;text-transform:uppercase}
.mrx .art h3{font-size:1.25rem}
.mrx .art p{font-size:.9rem;color:var(--muted)}
@media (max-width:860px){.mrx .arts{grid-template-columns:1fr}}
.mrx .faq{display:flex;flex-direction:column;border-top:1px solid var(--line)}
.mrx .faq details{border-bottom:1px solid var(--line)}
.mrx .faq summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:16px;padding:18px 2px;font-size:1.06rem;font-weight:500}
.mrx .faq summary::-webkit-details-marker{display:none}
.mrx .faq summary::after{content:"+";font-family:var(--f-mono);color:var(--sage);font-size:1.2rem}
.mrx .faq details[open] summary::after{content:"–"}
.mrx .faq details p{padding:0 2px 20px;color:var(--muted);max-width:70ch}

.mrx .final{background:radial-gradient(120% 140% at 0% 0%, color-mix(in srgb, var(--sage) 22%, var(--bg-2)), var(--bg-2));border-block:1px solid var(--line)}
.mrx .final .wrap{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}
.mrx .final-copy{display:flex;flex-direction:column;gap:18px}
.mrx .final-card{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:28px;display:flex;flex-direction:column;gap:14px}
.mrx .final-card .row{display:flex;justify-content:space-between;gap:12px;font-size:.92rem;border-bottom:1px solid var(--line);padding-bottom:10px}
.mrx .final-card .row:last-child{border:0;padding:0}
.mrx .final-card .row b{text-align:right}
@media (max-width:860px){.mrx .final .wrap{grid-template-columns:1fr}}
.mrx .gallery{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.mrx .gtile{display:flex;flex-direction:column;gap:8px;text-decoration:none}
.mrx .gtile img{display:block;width:100%;height:auto;aspect-ratio:1/1;max-width:100%;border-radius:12px;border:1px solid var(--line);transition:transform .25s ease}
.mrx .gtile:hover img{transform:translateY(-3px)}
.mrx .gtile span{font-size:.86rem;color:var(--muted)}
@media (max-width:900px){.mrx .gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}
.mrx .discband{padding-block:28px 40px}
.mrx .disc{font-size:.8rem;max-width:90ch;color:var(--muted)}
`;
