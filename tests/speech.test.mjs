import test from 'node:test';
import assert from 'node:assert/strict';
import { createSpeechService } from '../src/utils/speechEngine.js';

const tick = () => new Promise(resolve => setImmediate(resolve));
const response = () => ({ ok: true, headers: { get: () => 'audio/mpeg' }, blob: async () => new Blob(['audio']) });
function harness({ provider = 'kokoro', globalRate = 1, speed = 1, staticFails = false, blobFails = false, networkFails = false, deferred = false, autoEnd = true, browser = true, emptyVoices = false } = {}) {
  const played = [], requests = [], utterances = [], revoked = [];
  const events = new EventTarget();
  let voices = emptyVoices ? [] : [{ name: 'Saved Voice', lang: 'en-GB' }];
  const storage = {
    getTtsProvider: () => provider, setTtsProvider: value => { provider = value; },
    getSpeechRate: () => globalRate, setSpeechRate: value => { globalRate = value; },
    getKokoroSpeed: () => speed, getKokoroVoice: () => 'af_bella',
    getKokoroEndpoint: () => '', getSelectedVoice: () => 'Saved Voice', setSelectedVoice() {},
  };
  const runtime = {
    URL: { createObjectURL: () => `blob:${played.length}`, revokeObjectURL: value => revoked.push(value) },
    Audio: class {
      defaultPlaybackRate = 1;
      set src(value) { this.source = value; this.playbackRate = this.defaultPlaybackRate; }
      get src() { return this.source; }
      pause() { this.paused = true; }
      play() {
        played.push(this);
        const fail = this.src.startsWith('blob:') ? blobFails : staticFails;
        if (fail) return Promise.reject(new Error('play failed'));
        if (autoEnd) queueMicrotask(() => this.onended?.());
        return Promise.resolve();
      }
    },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
    fetch: (url, options) => {
      const request = { url, ...options };
      requests.push(request);
      if (deferred) return new Promise(resolve => { request.respond = value => resolve(value || response()); });
      return networkFails ? Promise.reject(new Error('offline')) : Promise.resolve(response());
    },
    ...(browser ? { speechSynthesis: {
      getVoices: () => voices, cancel() {},
      addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events),
      speak(utterance) { utterances.push(utterance); if (autoEnd) queueMicrotask(() => utterance.onend?.()); },
    } } : {}),
  };
  const service = createSpeechService({ storage, runtime, correctedAudioUrl: (word, field) => `/versioned/${field}/${word.id}.mp3` });
  return { ...service, played, requests, utterances, revoked,
    loadVoices() { voices = [{ name: 'Saved Voice', lang: 'en-GB' }]; events.dispatchEvent(new Event('voiceschanged')); } };
}
const word = { id: 1, word: 'abandon', example: 'Do not abandon the plan.' };

for (const rate of [0.5, 0.8, 1, 1.5]) {
  test(`speech rate ${rate} is applied once to static word/example, dynamic audio and browser fallback`, async () => {
    const staticAudio = harness({ globalRate: rate });
    await staticAudio.speakWord(word); await staticAudio.speakExample(word);
    assert.deepEqual(staticAudio.played.map(audio => audio.playbackRate), [rate, rate]);
    assert.match(staticAudio.played[0].src, /versioned\/word\/1/);
    const dynamic = harness({ globalRate: rate, staticFails: true });
    await dynamic.speakWord(word);
    assert.equal(JSON.parse(dynamic.requests[0].body).speed, rate);
    assert.equal(dynamic.played.at(-1).playbackRate, 1, 'generated speed must not be applied again during playback');
    const fallback = harness({ globalRate: rate, staticFails: true, networkFails: true });
    await fallback.speakWord(word);
    assert.equal(fallback.utterances[0].rate, rate);
    const browser = harness({ provider: 'browser', globalRate: rate });
    await browser.speak('direct'); await browser.speakWord(word); await browser.speakExample(word);
    assert.deepEqual(browser.utterances.map(utterance => utterance.rate), [rate, rate, rate]);
  });
}

test('settings speed, global speed and call rate share one bounded calculation', async () => {
  const h = harness({ globalRate: 0.8, speed: 0.75 });
  await h.speakWord(word, { rate: 0.9 });
  assert.ok(Math.abs(h.played[0].playbackRate - 0.54) < 1e-12);
  await h.speakExample(word, { rate: 0.1 });
  assert.equal(h.played[1].playbackRate, 0.5);
  await h.speakWord(word, { rate: 100 });
  assert.equal(h.played[2].playbackRate, 1.5);
});

test('stop settles pending network speech immediately and a late response cannot start playback or fallback', async () => {
  const h = harness({ deferred: true });
  const pending = h.speak('old');
  h.stopSpeak();
  assert.deepEqual(await pending, { cancelled: true });
  assert.equal(h.requests[0].signal.aborted, true);
  h.requests[0].respond(); await tick();
  assert.equal(h.played.length, 0); assert.equal(h.utterances.length, 0);
});

test('latest speech wins even when the old network response arrives after the new response', async () => {
  const h = harness({ deferred: true });
  const first = h.speak('old');
  const second = h.speak('new');
  h.requests[1].respond(); await second;
  h.requests[0].respond(); await first; await tick();
  assert.equal(h.played.length, 1);
  assert.equal(h.utterances.length, 0);
  assert.equal(h.revoked.length, 1);
});

test('cancelling static audio settles the caller, pauses Audio and allows the next playback', async () => {
  const h = harness({ autoEnd: false });
  const first = h.speakWord(word);
  h.stopSpeak();
  assert.deepEqual(await first, { cancelled: true });
  assert.equal(h.played[0].paused, true);
  assert.equal(h.played[0].onended, null);
  const second = h.speakExample(word);
  h.played[1].onended(); await second;
  assert.equal(h.requests.length, 0);
});

test('stopping a generated blob cleans the object URL and does not fall back', async () => {
  const h = harness({ autoEnd: false });
  const pending = h.speak('generated'); await tick();
  h.stopSpeak(); await pending;
  assert.equal(h.revoked.length, 1);
  assert.equal(h.utterances.length, 0);
});

test('genuine blob playback failure releases URL and falls back to browser at the same effective rate', async () => {
  const h = harness({ blobFails: true, speed: 0.8 });
  await h.speak('generated');
  assert.equal(h.revoked.length, 1);
  assert.equal(h.utterances[0].rate, 0.8);
});

test('unavailable backends still report real errors and explicit static playback does not silently synthesize', async () => {
  const h = harness({ staticFails: true, networkFails: true, browser: false });
  await assert.rejects(h.speakWord(word), /offline/);
  await assert.rejects(h.speakStaticKokoroWordAudio(word), /play failed/);
  assert.equal(h.requests.length, 1);
});

test('browser synthesis waiting for voices cannot speak after cancellation', async () => {
  const h = harness({ provider: 'browser', emptyVoices: true });
  const pending = h.speak('wait for voice');
  h.stopSpeak(); await pending; h.loadVoices(); await tick();
  assert.equal(h.utterances.length, 0);
  await h.speak('new');
  assert.equal(h.utterances[0].voice.name, 'Saved Voice');
});

test('provider/rate changes cancel pending playback and browser-only rate excludes Kokoro speed', async () => {
  const h = harness({ deferred: true, speed: 0.5 });
  const old = h.speak('old');
  h.setTtsProvider('browser');
  assert.deepEqual(await old, { cancelled: true });
  h.setSpeechRate(0.8);
  await h.speakWord(word);
  assert.equal(h.utterances[0].rate, 0.8);
  h.requests[0].respond(); await tick();
  assert.equal(h.played.length, 0);
});
