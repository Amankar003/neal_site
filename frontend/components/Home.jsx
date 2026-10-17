'use client';

import { useState, useEffect } from 'react';
import SplitText from './rb/SplitText/SplitText';
import RotatingText from './rb/RotatingText/RotatingText';
import CountUp from './rb/CountUp/CountUp';
import ScrollVelocity from './rb/ScrollVelocity/ScrollVelocity';
import Magnet from './rb/Magnet/Magnet';
import ClickSpark from './rb/ClickSpark/ClickSpark';
import FadeContent from './rb/FadeContent/FadeContent';
import Stack from './rb/Stack/Stack';
import './site.css';
import './a.css';
import './b.css';

import cutFront from '../assets/cut-front.png';
import cutWide from '../assets/cut-wide.png';
import gFront from '../assets/g-front.jpg';
import gInterior from '../assets/g-interior.jpg';
import gRear from '../assets/g-rear.jpg';
import gRoad from '../assets/g-road.jpg';
import gBack from '../assets/g-back.jpg';
import gBrand from '../assets/g-brand.jpg';
import carBody from '../assets/car-body.png';
import wheelRear from '../assets/wheel-rear.png';
import wheelFront from '../assets/wheel-front.png';
import trainer from '../assets/trainer.jpg'; // replace with the real trainer photo, same file name

const src = (m) => (typeof m === 'string' ? m : m.src);
const API = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || '';
const PHONE = '9431370327', PHONE_SHOW = '94313 70327', MOTORS = '6299916160', MOTORS_SHOW = '62999 16160';
const wa = (t = 'Hello, I want to know about your services.') => `https://wa.me/91${PHONE}?text=${encodeURIComponent(t)}`;
const rupees = (n) => '₹' + n.toLocaleString('en-IN');
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Neal+Driving+School+Rahar+Gora+Dhaiya+Dhanbad';

const PLANS = [
  { days: 10, price: 3200, points: ['Manual or automatic car', 'Traffic rules basics', 'Daily instructor session'] },
  { days: 15, price: 4500, hot: true, points: ['Manual or automatic car', 'City driving, parking and reverse', 'Traffic rules and road safety'] },
  { days: 30, price: 8000, points: ['Everything in the 15-day plan', 'City and highway driving', 'Extra practice before your test'] },
];
const SKILLS = [
  ['4W', 'Four-wheeler training', 'From the first time you sit behind the wheel.'],
  ['M/A', 'Manual and automatic', 'Learn on the gearbox you plan to drive.'],
  ['HWY', 'City and highway driving', 'Busy roads and open roads, with an instructor beside you.'],
  ['P', 'Parking and reverse', 'Tight spots and turns, practised until they feel easy.'],
  ['RULES', 'Traffic rules and road safety', 'What you need for the test and for every day after.'],
];
const ic = (d) => <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
const SERVICES = [
  ['Airport pickup and drop', 'Pickup and drop to and from the airport, booked in advance.', ic(<path d="M2 14l8-2 4-9 2 1-2 8 6 2-1 2-6-1-3 5-2-1 1-5z" />)],
  ['Cab service', 'City rides and outstation trips in a clean, comfortable car.', ic(<><path d="M4 16V11l2-5h12l2 5v5M3 16h18M7 19v-3M17 19v-3" /><circle cx="8" cy="13" r="1" /><circle cx="16" cy="13" r="1" /></>)],
  ['Corporate and office rental', 'Regular and monthly cars for offices, staff travel and business visits.', ic(<><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" /></>)],
  ['Daily, weekly and monthly rental', 'Rent by the day, week or month, with or without a driver.', ic(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>)],
  ['Self-drive car rental', 'Take the wheel yourself in a well-kept Hyundai Aura.', ic(<><circle cx="8" cy="12" r="4" /><path d="M12 12h9v3M18 12v3" /></>)],
];
const FAQ = [
  ['Do you teach both manual and automatic cars?', 'Yes. You can learn on manual, automatic or both. Tell us your choice when you book.'],
  ['I am scared to drive. Can I still learn?', 'Yes. Our training is beginner friendly and built around confidence, with personal attention from your instructor.'],
  ['Is there special training for ladies?', 'Yes. We offer special training for ladies, first-time learners, nervous drivers and working professionals.'],
  ['How much do I practise every day?', 'Each plan includes a daily 10 km session with an instructor. Plans run for 10, 15 or 30 days.'],
  ['What does the passing guarantee cover?', `Please call us on ${PHONE_SHOW} and we will explain the exact terms.`],
  ['Can I book an airport pickup or drop?', `Yes. Call or WhatsApp us on ${PHONE_SHOW} with your date, time and pickup place, and we will confirm the booking and fare.`],
  ['Do you rent cars to offices and companies?', 'Yes. We offer corporate and office rentals for regular and monthly use, with or without a driver. Call us for a quote.'],
  ['Can I rent a car for a single day?', 'Yes. You can rent by the day, week or month, self-drive or with a driver.'],
  ['Where are you located?', 'Rahar Gora, Dhaiya, near Prabhatam Mall, Dhanbad, Jharkhand 826004.'],
];
const REVIEWS = ['Add a real Google review here.', 'Add a real Google review here.', 'Add a real Google review here.']; // TODO real reviews
const TICK = ['Driving classes + Airport pickup and drop + Cab service + Daily rental +', 'Passing guarantee + Manual and automatic + Ladies training + Corporate rental +'];

function Enquiry() {
  const [state, setState] = useState('idle');
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget, d = new FormData(form);
    const body = { name: String(d.get('name')).trim(), phone: String(d.get('phone')).trim(), service: String(d.get('service')), plan: String(d.get('plan')), car: String(d.get('car')) };
    const school = body.service === 'Driving classes';
    const text = `Hello, I am ${body.name} (${body.phone}). I am interested in: ${body.service}.` + (school ? ` Plan: ${body.plan}, ${body.car} car.` : '');
    if (!API) { window.open(wa(text), '_blank'); return; }
    setState('sending');
    try {
      const r = await fetch(`${API}/api/enquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: body.name, phone: body.phone, service: body.service, plan: body.plan, car: body.car }) });
      if (!r.ok) throw new Error();
      form.reset(); setState('done');
    } catch { setState('error'); }
  }
  if (state === 'done') return (<div className="done"><h3>We got your request</h3><p>We will call you on the number you gave. For anything urgent, call {PHONE_SHOW}.</p><button className="btn w" onClick={() => setState('idle')}>Send another request</button></div>);
  return (
    <form className="form" onSubmit={submit}>
      <label>Your name<input name="name" required minLength={2} autoComplete="name" /></label>
      <label>Mobile number<input name="phone" type="tel" inputMode="numeric" required pattern="(\+91|91|0)?[\s-]?[6-9][0-9]{4}[\s-]?[0-9]{5}" title="10-digit mobile number" autoComplete="tel" /></label>
      <label>I need<select name="service" defaultValue="Driving classes"><option>Driving classes</option><option>Airport pickup and drop</option><option>Cab service</option><option>Corporate and office rental</option><option>Daily, weekly or monthly rental</option><option>Self-drive car rental</option></select></label>
      <div className="two">
        <label>Plan (for classes)<select name="plan" defaultValue="15 days"><option>10 days</option><option>15 days</option><option>30 days</option><option>Not sure yet</option></select></label>
        <label>Car type<select name="car" defaultValue="Manual"><option>Manual</option><option>Automatic</option><option>Both</option></select></label>
      </div>
      <button className="btn k" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : 'Request a call back'}</button>
      {state === 'error' && <p className="err">We could not send your request. Please call <a href={`tel:${PHONE}`}>{PHONE_SHOW}</a> or <a href={wa()} target="_blank" rel="noreferrer">message us on WhatsApp</a>.</p>}
    </form>
  );
}

// Real Hyundai Aura (photo cutout). The body is one image, the two alloy wheels are separate images that spin in CSS.
const Aura = () => (
  <div className="aura" role="img" aria-label="Hyundai Aura, Neal Driving School car">
    <img className="ab" src={src(carBody)} alt="" draggable={false} />
    <img className="aw w1" src={src(wheelRear)} alt="" draggable={false} />
    <img className="aw w2" src={src(wheelFront)} alt="" draggable={false} />
    <div className="decal"><i>L</i><span><b>NEAL</b><small>Driving School</small></span></div>
  </div>
);
// What the instructor says to a learner, in the way people actually say it.
const SAY = ['Mirror dekh liya?', 'Ghabrao mat, main hu na.', 'Indicator de do, bhai.', 'Ab reverse, aaram se.'];
// Road signs that pass by during the drive: a learner's journey.
const MILES = [['Din 1', 'Steering pakdo'], ['Din 5', 'Clutch ka darr gaya'], ['Din 10', 'Parking ho gayi'], ['Din 15', 'Licence ki taiyari']];
function Bubble() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % SAY.length), 3200); return () => clearInterval(t); }, []);
  return <div className="say" key={i}>{SAY[i]}</div>;
}
const tile = (svg) => ({ backgroundImage: `url("data:image/svg+xml,${svg.replace(/#/g, '%23')}")` });
const HILLS = tile("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 130' preserveAspectRatio='none'><path d='M0 130V70Q75 10 150 60T300 55T450 50T600 70V130Z' fill='#13884b'/><path d='M0 130V100Q100 60 200 95T400 90T600 100V130Z' fill='#0a6e3a'/></svg>");
const TREES = tile("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 80'><rect x='38' y='50' width='5' height='30' fill='#5a3b1e'/><circle cx='40' cy='38' r='22' fill='#0a6e3a'/><rect x='158' y='46' width='5' height='34' fill='#5a3b1e'/><circle cx='160' cy='32' r='17' fill='#13884b'/><rect x='260' y='14' width='4' height='66' fill='#222'/><rect x='260' y='14' width='24' height='4' fill='#222'/><circle cx='284' cy='20' r='4' fill='#ffd21a'/><rect x='328' y='56' width='4' height='24' fill='#5a3b1e'/><circle cx='330' cy='48' r='14' fill='#0a6e3a'/></svg>");
// Design A: endless drive. The car stays put, the hills, trees, road and the 15-day milestone signs scroll past.
function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <i className="sun" /><i className="lay hills" style={HILLS} /><i className="lay trees" style={TREES} />
      <div className="signs">{MILES.map(([d, t], k) => (<div className={'sg' + (k === MILES.length - 1 ? ' last' : '')} key={d}><div className="bd"><b>{d}</b><span>{t}</span></div><i /></div>))}</div>
      <div className="road" />
      <div className="vehicle"><Bubble /><Aura /></div>
    </div>
  );
}
function Feats({ loc }) {
  return (
    <div className="fcs">
      {loc && <a className="card fc loc" href={MAPS} target="_blank" rel="noreferrer"><i className="pn" /><div><b>Rahar Gora, Dhaiya</b><span>Dhanbad, get directions</span></div></a>}
      {[['10 km', 'every day'], ['M / A', 'manual + auto'], ['100%', 'passing guarantee']].map(([a, b]) => <div className="card fc" key={a}><b>{a}</b><span>{b}</span></div>)}
    </div>
  );
}

export default function Home({ theme = 'a' }) {
  const car = theme === 'a' ? cutFront : cutWide;
  return (
    <ClickSpark sparkColor={theme === 'a' ? '#0a6e3a' : '#ff3b2f'} sparkCount={10} sparkSize={12} sparkRadius={28} sparkWidth={3}>
      <div className={`site t-${theme}`}>
        <div className="hazard" />
        <header className="top"><div className="wrap bar">
          <a className="logo" href="#top"><span>NEA<i>L</i></span><small>Driving School and Motors</small></a>
          <nav><a href="#learn">Driving school</a><a href="#services">Services</a><a href="#pricing">Pricing</a><a href="#trainer">Trainer</a><a href="#faq">FAQ</a></nav>
          <a className="btn k sm" href={`tel:${PHONE}`}>Call now</a>
        </div></header>

        <main id="top">
          <section className="hero"><div className="wrap hg">
            <div className="c1 copy">
              <span className="chip">Rahar Gora, Dhaiya, Dhanbad</span>
              <SplitText tag="h1" className="h1" text="Learn to drive with confidence." splitType="words" textAlign="left" delay={70} duration={0.9} from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} />
              <p className="sub">Car chalana seekho, aaram se.</p>
            </div>
            {theme === 'b' && <div className="stage">
              <div className="art">
                <i className="disc" /><i className="streaks" />
                <div className="burst"><span>Passing guarantee</span></div>
                <img className="carimg" src={src(car)} alt="Neal Driving School training car, Hyundai Aura" />
              </div>
              <Feats />
            </div>}
            <div className="c2 copy">
              <p className="made">Made for <RotatingText texts={['beginners', 'ladies', 'nervous drivers', 'working professionals']} rotationInterval={2600} transition={{ duration: 0.3, ease: 'easeOut' }} mainClassName="rot" splitBy="words" /></p>
              <p className="also">Also at Neal Motors: airport pickup and drop, cab service and car rental.</p>
              <div className="cta">
                <Magnet padding={60} magnetStrength={3}><a className="btn k" href={`tel:${PHONE}`}>Call {PHONE_SHOW}</a></Magnet>
                <Magnet padding={60} magnetStrength={3}><a className="btn w" href={wa()} target="_blank" rel="noreferrer">WhatsApp us</a></Magnet>
              </div>
              {theme === 'a' && <Feats loc />}
            </div>
          </div>{theme === 'a' && <Scene />}</section>

          <div className="checks" aria-hidden="true" />
          <div className="ticker" aria-hidden="true"><ScrollVelocity texts={TICK} velocity={60} className="tk" /></div>

          <section className="stats"><div className="wrap grid4">
            <div className="box"><b><CountUp to={10} duration={1.6} /> km</b><span>every single day</span></div>
            <div className="box"><b><CountUp to={3} duration={1.2} /> plans</b><span>10, 15 or 30 days</span></div>
            <div className="box"><b><CountUp to={5} duration={1.2} /> services</b><span>classes, rides and rentals</span></div>
            <div className="box"><b><CountUp to={2} duration={1} /> gearboxes</b><span>manual and automatic</span></div>
          </div></section>

          <section className="sec" id="learn"><div className="wrap split">
            <div className="stick">
              <h2>Driving school</h2>
              <p className="lead">Every lesson is on real roads with an instructor beside you, so you build habits that work long after the test.</p>
              <figure className="ph pic"><img src={src(gInterior)} alt="Inside the Neal training car" /></figure>
              <p className="cap">Learn in a clean, comfortable car.</p>
            </div>
            <div>
              <ul className="skills">{SKILLS.map(([tag, t, d]) => (<li className="card" key={t}><span className="tag">{tag}</span><div><h3>{t}</h3><p>{d}</p></div></li>))}</ul>
              <div className="groups"><b>Special training for</b><ul><li>Ladies</li><li>First-time learners</li><li>Nervous drivers</li><li>Working professionals</li></ul></div>
            </div>
          </div></section>

          <section className="sec colour" id="pricing"><div className="wrap"><FadeContent blur duration={800}>
            <h2>Simple plans. Clear prices.</h2>
            <p className="lead">Every plan includes a daily 10 km session with an instructor. Choose manual or automatic when you book.</p>
            <div className="plans">{PLANS.map((p) => (
              <article className={'plan' + (p.hot ? ' hot' : '')} key={p.days}>
                {p.hot && <span className="flag">Most chosen</span>}
                <h3>{p.days} days</h3><p className="km">10 km every day</p><div className="pr">{rupees(p.price)}</div>
                <ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
                <a className={'btn ' + (p.hot ? 'k' : 'y')} href={wa(`Hello, I want to book the ${p.days}-day driving plan (${rupees(p.price)}).`)} target="_blank" rel="noreferrer">Book this plan</a>
              </article>))}</div>
            <p className="fine">Prices shown are indicative. Please confirm the current fee when you call.</p>
          </FadeContent></div></section>

          <section className="sec hl" id="services"><div className="wrap">
            <h2>Neal Motors: rides and rentals</h2>
            <p className="lead">Need a car, not a lesson? Book a ride or rent our Hyundai Aura. Call or WhatsApp for rates and availability.</p>
            <div className="svc">
              <div className="cars card">
                <img src={src(cutFront)} alt="Hyundai Aura CNG available for rental" />
                <h3>Hyundai Aura (CNG)</h3>
                <ul><li>Economical CNG model for longer trips</li><li>Clean, comfortable cabin</li><li>With driver or self-drive</li></ul>
                <a className="btn k" href={`tel:${MOTORS}`}>Call Neal Motors {MOTORS_SHOW}</a>
              </div>
              <ul className="slist">{SERVICES.map(([t, d, icon]) => (
                <li className="card" key={t}><span className="sic">{icon}</span><div><h3>{t}</h3><p>{d}</p>
                  <a className="lnk" href={wa(`Hello, I want to book: ${t}.`)} target="_blank" rel="noreferrer">Get a quote on WhatsApp</a></div></li>))}</ul>
            </div>
          </div></section>

          <section className="sec" id="trainer"><div className="wrap trainer">
            <figure className="ph pic"><img src={src(trainer)} alt="Lead instructor at Neal Driving School" /></figure>
            <FadeContent duration={800}>
              <h2>Meet your trainer</h2>
              <div className="card prof">
                <h3>Instructor name</h3><p className="role">Owner and lead instructor, Neal Driving School</p>
                <p>Teaches manual and automatic cars with patience for first-time and nervous learners. Write two or three lines here about the trainer: experience, teaching style and what a student can expect on day one.</p>
                <ul className="chips"><li>Manual and automatic</li><li>Ladies batches</li><li>City and highway</li></ul>
                <a className="btn k" href={`tel:${PHONE}`}>Talk to your trainer</a>
              </div>
            </FadeContent>
          </div></section>

          <section className="sec dark" id="gallery"><div className="wrap split mid">
            <div>
              <h2>Our car, up close</h2>
              <p className="lead">Drag the photos to flip through. This is the Hyundai Aura you will learn in, and the one you can rent.</p>
              <div className="cta"><a className="btn y" href={MAPS} target="_blank" rel="noreferrer">Get directions</a><a className="btn w" href={wa()} target="_blank" rel="noreferrer">WhatsApp us</a></div>
            </div>
            <div className="stackbox"><Stack layout="fan" visible={4} radius={14} frame={4} frameColor="#fff" cards={[gFront, gRoad, gRear, gInterior, gBack, gBrand].map((m, i) => <img key={i} src={src(m)} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />)} /></div>
          </div></section>

          <section className="sec tint" id="reviews"><div className="wrap">
            <h2>Trusted by local learners</h2><p className="lead">What students say about us on Google.</p>
            <div className="reviews">{REVIEWS.map((r, i) => (<figure className="card q" key={i}><div className="st">★★★★★</div><p>{r}</p><b>Google reviewer</b></figure>))}</div>
            <a className="btn k" href="https://share.google/chuuq7Lb9e3djTQq4" target="_blank" rel="noreferrer">Read all reviews on Google</a>
          </div></section>

          <section className="sec colour" id="faq"><div className="wrap split mid">
            <div><h2>Frequently asked questions</h2><p className="lead">Cannot find your answer? Call us on {PHONE_SHOW}.</p></div>
            <div className="faq">{FAQ.map(([q, a], i) => (<details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>))}</div>
          </div></section>

          <section className="sec dark" id="contact"><div className="wrap split mid">
            <div>
              <h2>Book your lesson or ride</h2>
              <p className="lead">Leave your number and we will call you back, or reach us directly.</p>
              <address>Rahar Gora, Dhaiya, near Prabhatam Mall<br />Dhanbad, Jharkhand 826004</address>
              <div className="cta"><a className="btn y" href={`tel:${PHONE}`}>Call {PHONE_SHOW}</a><a className="btn w" href={MAPS} target="_blank" rel="noreferrer">Get directions</a></div>
            </div>
            <div className="card formcard"><Enquiry /></div>
          </div></section>
        </main>

        <footer className="foot"><div className="hazard" /><div className="wrap">
          <p><b>Neal Driving School and Motors</b>, Rahar Gora, Dhaiya, near Prabhatam Mall, Dhanbad 826004</p>
          <p>Driving classes {PHONE_SHOW}. Neal Motors rentals <a href={`tel:${MOTORS}`}>{MOTORS_SHOW}</a></p>
        </div></footer>
        <div className="sticky"><a href={`tel:${PHONE}`}>Call now</a><a href={wa()} target="_blank" rel="noreferrer">WhatsApp</a></div>
      </div>
    </ClickSpark>
  );
}
