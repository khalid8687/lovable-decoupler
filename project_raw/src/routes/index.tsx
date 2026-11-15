import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronRight, FileSpreadsheet, MapPin, MessageCircle, MessageSquare, Layers3, Workflow, BarChart3, ShieldCheck, Printer, Phone, Globe, Zap, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/oltani-logo.webp';
import network from '@/assets/messaging-network.jpg';
import { IMPLEMENTATION_PRICE, USD_EGP_RATE, WHATSAPP_RATES, egpLabel, implementationItems, smsPlans, whatsappEstimate } from '@/lib/pricing';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'WhatsApp & SMS Platform Proposal | OLTANI × Eng. Hany Hassan' },
    { name: 'description', content: 'A tailored WhatsApp and SMS management platform for Eng. Hany Hassan. EGP 15,000 implementation with transparent monthly usage estimates.' },
    { property: 'og:title', content: 'OLTANI | Your messaging. One powerful platform.' },
    { property: 'og:description', content: 'Explore the solution, one-month delivery plan, and interactive WhatsApp and SMS quotation.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

const format = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-label"><span>{number}</span>{children}</div>;
}

function VolumeControl({ label, value, onChange, rate, max = 50000 }: { label: string; value: number; onChange: (n: number) => void; rate: string; max?: number }) {
  return <div className="volume-control">
    <div className="volume-top"><label htmlFor={`${label}-number`}>{label}<small>{rate}</small></label><input id={`${label}-number`} type="number" min={0} max={max} value={value} onChange={e => onChange(Math.min(max, Math.max(0, Number(e.target.value))))} /></div>
    <input type="range" aria-label={`${label} volume`} min={0} max={max} step={100} value={value} onChange={e => onChange(Number(e.target.value))} />
    <div className="range-labels"><span>0</span><span>{format(max)}</span></div>
  </div>;
}

function Index() {
  const [channel, setChannel] = useState<'both' | 'whatsapp' | 'sms'>('both');
  const [marketing, setMarketing] = useState(1000);
  const [utility, setUtility] = useState(1000);
  const [service, setService] = useState(1000);
  const [smsIndex, setSmsIndex] = useState(1);
  const [targeting, setTargeting] = useState<'csv' | 'location'>('csv');
  const hasWhatsapp = channel !== 'sms';
  const hasSms = channel !== 'whatsapp';
  const wa = whatsappEstimate(marketing, utility, service);
  const sms = smsPlans[smsIndex] ?? smsPlans[0];
  const monthly = (hasWhatsapp ? wa.egp : 0) + (hasSms ? sms.price : 0);
  return <div className="proposal-page">
    <header className="site-header"><a className="brand" href="https://oltani.com" target="_blank" rel="noreferrer"><img src={logo} width={64} height={64} alt="OLTANI" /><span>OLTANI<span className="brand-caption">TECHNOLOGY SOLUTIONS</span></span></a>
      <nav aria-label="Proposal navigation"><a href="#solution">The solution</a><a href="#workflow">How it works</a><a href="#investment">Investment</a></nav>
      <Button variant="outline" onClick={() => window.print()} className="print-button"><Printer /> <span>Save proposal</span></Button>
    </header>

    <main>
      <section className="hero">
        <img className="hero-image" src={network} alt="Connected messaging network with a glass smartphone" width={1536} height={1024} />
        <div className="hero-shade" />
        <div className="hero-content page-width">
          <div className="eyebrow"><span className="status-dot" /> A PROPOSAL BUILT FOR YOUR BUSINESS</div>
          <h1>WhatsApp & SMS.<br />One platform.<br /><span>Endless possibilities.</span></h1>
          <p>Connect with your customers. Automate your conversations.<br className="desktop-break" /> Take control of every message, from one place.</p>
          <div className="hero-actions"><Button size="lg" asChild><a href="#investment">Explore your investment <ArrowRight /></a></Button><a className="text-action" href="#solution">Discover the solution <ArrowDown size={16} /></a></div>
          <div className="prepared"><span className="prepared-icon">HH</span><div><small>PREPARED EXCLUSIVELY FOR</small><strong>Eng. Hany Hassan</strong></div><span className="prepared-divider" /><div><small>DELIVERY TIMELINE</small><strong>Within 1 month</strong></div></div>
        </div>
        <div className="hero-bottom page-width"><span>SMARTER COMMUNICATION. STRONGER CONNECTIONS.</span><span>PROJECT PROPOSAL <span className="accent-text">/ 2026</span></span></div>
      </section>

      <div className="channel-strip"><div className="page-width strip-inner"><span>Two channels. <strong>One command center.</strong></span><div><MessageCircle className="accent-text" /> WhatsApp Business <span className="strip-plus">+</span><MessageSquare className="cyan-text" /> WE Business SMS <span className="strip-divider" /><ShieldCheck size={18} /> Built around your business</div></div></div>

      <section id="solution" className="section page-width">
        <SectionLabel number="01">THE SOLUTION</SectionLabel>
        <div className="section-heading"><h2>Less complexity.<br /><span className="muted-text">More connection.</span></h2><p>A custom-built management platform that brings your WhatsApp bots and SMS campaigns together. Your audience, your budget, your rules.</p></div>
        <div className="feature-grid">
          {[{ icon: Layers3, color: 'accent-text', title: 'One unified dashboard', text: 'Manage WhatsApp and SMS from a single workspace. Send on either channel—or both.' }, { icon: Workflow, color: 'cyan-text', title: 'Bots that work for you', text: 'Build automated replies and customer journeys for support, notifications and campaigns.' }, { icon: BarChart3, color: 'orange-text', title: 'Every message accounted for', text: 'Set message quotas, track campaign delivery and monitor usage with clear cost visibility.' }].map((f, i) => <article className="feature" key={f.title}><div className="feature-top"><f.icon size={29} className={f.color} /><span>0{i + 1}</span></div><h3>{f.title}</h3><p>{f.text}</p><div className="feature-footer"><Check size={14} /> Included in implementation</div></article>)}
        </div>
      </section>

      <section id="workflow" className="workflow-band"><div className="section page-width">
        <SectionLabel number="02">HOW IT WORKS</SectionLabel>
        <div className="section-heading"><h2>From your audience<br />to their inbox.</h2><p>One streamlined journey, from customer selection to delivery. No switching between provider dashboards.</p></div>
        <div className="workflow-grid">{[{ icon: FileSpreadsheet, title: 'Choose your audience', text: 'Upload a CSV contact list or choose consent-based location targeting.' }, { icon: MessageCircle, title: 'Create your message', text: 'Compose your SMS or approved WhatsApp template and configure bot replies.' }, { icon: Zap, title: 'Select & send', text: 'Choose WhatsApp, SMS or both. Set your quota and launch your campaign.' }, { icon: BarChart3, title: 'Track your results', text: 'Follow delivery status, message consumption and campaign costs.' }].map((f, i) => <div className="workflow-step" key={f.title}><div className="step-number">0{i + 1}<ChevronRight size={16} /></div><f.icon size={25} /><h3>{f.title}</h3><p>{f.text}</p></div>)}</div>
        <div className="audience-layout"><div><div className="eyebrow">THE RIGHT PEOPLE. THE RIGHT MOMENT.</div><h3>Two ways to reach<br />your customers.</h3><p>Choose the audience approach that fits your business.</p></div><div className="audience-options">
          <Button variant={targeting === 'csv' ? 'secondary' : 'ghost'} className="audience-choice" onClick={() => setTargeting('csv')} aria-pressed={targeting === 'csv'}><FileSpreadsheet /><span>CSV contact list<small>Your existing customers, ready to connect.</small></span>{targeting === 'csv' && <Check size={16} />}</Button>
          <Button variant={targeting === 'location' ? 'secondary' : 'ghost'} className="audience-choice" onClick={() => setTargeting('location')} aria-pressed={targeting === 'location'}><MapPin /><span>Location-based triggers<small>Connect when an opted-in customer enters an area.</small></span>{targeting === 'location' && <Check size={16} />}</Button>
          <p className="audience-note">{targeting === 'csv' ? 'Contacts must have opted in. CSV imports include validation and duplicate checks before sending.' : 'Requires explicit customer consent, location access through a participating app and compatible provider support. It cannot detect or message arbitrary people nearby; final feasibility is confirmed during discovery.'}</p>
        </div></div>
      </div></section>

      <section className="section page-width timeline-section"><SectionLabel number="03">THE DELIVERY PLAN</SectionLabel><div className="section-heading"><h2>Ready in a month.<br /><span className="muted-text">Built to go further.</span></h2><span className="timeline-badge"><Zap size={16} /> UP TO 30 DAYS</span></div><div className="timeline-grid">{[{ week: 'WEEK 01', title: 'Discover & design', text: 'Confirm requirements, audience approach and the dashboard experience.' }, { week: 'WEEK 02', title: 'Build & connect', text: 'Develop the platform and connect WhatsApp and SMS providers.' }, { week: 'WEEK 03', title: 'Automate & test', text: 'Configure bots, imports and campaigns. Test complete workflows.' }, { week: 'WEEK 04', title: 'Launch & hand over', text: 'Deploy your platform, walk your team through it and deliver access.' }].map(f => <div className="timeline-item" key={f.week}><span>{f.week}</span><h3>{f.title}</h3><p>{f.text}</p></div>)}</div><p className="small-note">Delivery within one month assumes timely access, approved requirements and provider approvals. External approval delays may affect launch.</p></section>

      <section id="investment" className="investment-band"><div className="section page-width"><SectionLabel number="04">YOUR INVESTMENT</SectionLabel><div className="section-heading"><h2>A clear investment.<br /><span className="accent-text">No guesswork.</span></h2><p>Pay once to build your platform. Then choose the monthly message volume that works for your business.</p></div>
        <div className="setup-heading"><div><span className="cost-tag">ONE-TIME COST</span><h3>Your platform. Fully implemented.</h3></div><div className="setup-total"><small>EGP</small> {format(IMPLEMENTATION_PRICE)}<span>One payment for the complete implementation</span></div></div>
        <div className="setup-grid">{implementationItems.map((item, i) => <div className="setup-item" key={item.name}><span className="setup-index">0{i + 1}</span><h4>{item.name}</h4><p>{item.detail}</p><strong>{format(item.price)} <small>EGP</small></strong></div>)}</div>
        <div className="setup-included"><CheckCheck size={17} /> Both channels included <span>•</span> Testing & handover included <span>•</span> No recurring implementation fee</div>

        <div className="calculator-heading"><div><span className="cost-tag">MONTHLY USAGE</span><h3>Make your budget work for you.</h3><p>Adjust your message volumes to estimate your monthly investment.</p></div><div className="channel-tabs" role="group" aria-label="Messaging channels">{(['both', 'whatsapp', 'sms'] as const).map(c => <Button key={c} variant={channel === c ? 'secondary' : 'ghost'} aria-pressed={channel === c} onClick={() => setChannel(c)}>{c === 'both' ? 'Both channels' : c === 'whatsapp' ? 'WhatsApp' : 'SMS'}</Button>)}</div></div>
        <div className="calculator-layout"><div className="calculator-controls">
          {hasWhatsapp && <div className="channel-controls"><div className="control-title"><MessageCircle className="accent-text" /><h4>WhatsApp</h4><span>via Fasla Cloud</span></div><VolumeControl label="Marketing messages" value={marketing} onChange={setMarketing} rate={`$${WHATSAPP_RATES.marketingUsd} / message · ≈ EGP ${egpLabel(WHATSAPP_RATES.marketingUsd)}`} /><VolumeControl label="Utility messages" value={utility} onChange={setUtility} rate={`$${WHATSAPP_RATES.utilityUsd} / message · ≈ EGP ${egpLabel(WHATSAPP_RATES.utilityUsd)}`} /><VolumeControl label="Service conversations" value={service} onChange={setService} rate={`First ${format(WHATSAPP_RATES.freeServiceConversations)} free · then $${WHATSAPP_RATES.serviceUsd} / conversation`} /><p className="small-note">WhatsApp rates and the free-service allowance above are supplied planning assumptions, not verified current provider terms. USD estimate: ${format(wa.usd)}. EGP values are converted at EGP {USD_EGP_RATE} per USD.</p></div>}
          {hasSms && <div className="channel-controls sms-controls"><div className="control-title"><MessageSquare className="cyan-text" /><h4>SMS</h4><span>via WE Business SMS</span></div><label className="sms-label" htmlFor="sms-plan">Monthly message bundle</label><select id="sms-plan" value={smsIndex} onChange={e => setSmsIndex(Number(e.target.value))}>{smsPlans.map((p, i) => <option key={p.messages} value={i}>{format(p.messages)} messages — EGP {format(p.price)}</option>)}</select><input type="range" aria-label="SMS bundle" min={0} max={4} step={1} value={smsIndex} onChange={e => setSmsIndex(Number(e.target.value))} /><div className="range-labels"><span>250 messages</span><span>10,000 messages</span></div><div className="sms-rate"><span>{sms.rate} piastres / SMS</span><strong>EGP {format(sms.price)} <small>/ month</small></strong></div></div>}
        </div><aside className="estimate-panel"><div className="estimate-eyebrow"><span className="status-dot" /> YOUR TAILORED ESTIMATE</div><h4>Monthly messaging</h4><div className="monthly-price"><small>EGP</small> <span data-testid="monthly-total">{format(monthly)}</span></div><p>Estimated usage per month</p><div className="estimate-lines">{hasWhatsapp && <div><span><MessageCircle size={15} />WhatsApp</span><strong>EGP {format(wa.egp)}</strong></div>}{hasSms && <div><span><MessageSquare size={15} />SMS · {format(sms.messages)}</span><strong>EGP {format(sms.price)}</strong></div>}</div><div className="estimate-setup"><span>One-time implementation</span><strong>EGP 15,000</strong></div><div className="first-month"><span>Estimated first month total</span><strong>EGP {format(IMPLEMENTATION_PRICE + monthly)}</strong></div><Button size="lg" asChild className="discuss-button"><a href={`https://wa.me/201002194451?text=${encodeURIComponent(`Hello OLTANI, I would like to discuss the proposal for Eng. Hany Hassan. My selection: ${channel}; estimated monthly usage EGP ${format(monthly)}, plus EGP 15,000 setup.`)}`} target="_blank" rel="noreferrer">Let's discuss your project <ArrowRight /></a></Button><div className="estimate-disclaimer"><ShieldCheck size={14} /><span>Transparent costs. Tailored to your usage.</span></div></aside></div>
        <div className="pricing-notes"><h4>A few important details</h4><p>Monthly estimates cover messaging usage only. Provider subscriptions, hosting, taxes and any location-enabled customer app are not included; confirm these before agreement. Fasla Cloud's own fees and current rates require confirmation. Direct Meta Cloud API has no platform subscription under the supplied assumption and requires a USD-capable payment card; ready-made platforms may add $15–$100+ monthly. Final WhatsApp pricing, free allowances and template eligibility depend on current provider terms. WE prices reflect the supplied bundles, subject to provider confirmation. USD-to-EGP figures use a locked conversion rate of EGP {USD_EGP_RATE} per USD.</p></div>
      </div></section>
      <section className="closing page-width"><div><div className="eyebrow">LET'S BUILD YOUR NEXT CHAPTER</div><h2>Better conversations.<br /><span className="accent-text">Start here.</span></h2></div><div><p>Prepared for Eng. Hany Hassan.<br />Built with care by OLTANI.</p><a href="tel:+201002194451"><Phone size={17} /> +20 100 219 4451 <ArrowRight size={17} /></a><a href="https://oltani.com" target="_blank" rel="noreferrer"><Globe size={17} /> oltani.com <ArrowRight size={17} /></a></div></section>
    </main><footer className="page-width"><span>© 2026 OLTANI. All rights reserved.</span><span>WHATSAPP & SMS MANAGEMENT PLATFORM <span className="accent-text">/ PROPOSAL</span></span></footer>
  </div>;
}
