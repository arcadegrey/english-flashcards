import test from 'node:test';
import assert from 'node:assert/strict';
import { createSpeechService } from '../src/utils/speechEngine.js';

const tick = () => new Promise(resolve => setImmediate(resolve));
function harness({ provider = 'kokoro', globalRate = 1, speed = 1, staticFails = false, autoEnd = true,
  browser = true, emptyVoices = false, correctedAudioUrl, endpoint = '' } = {}) {
  const played = [], requests = [], utterances = [];
  const events = new EventTarget();
  let voices = emptyVoices ? [] : [{ name: 'Saved Voice', lang: 'en-GB' }];
  const storage = {
    getTtsProvider: () => provider, setTtsProvider: value => { provider = value; },
    getSpeechRate: () => globalRate, setSpeechRate: value => { globalRate = value; },
    getKokoroSpeed: () => speed, getKokoroVoice: () => 'af_bella',
    getKokoroEndpoint: () => endpoint, getSelectedVoice: () => 'Saved Voice', setSelectedVoice() {},
  };
  const runtime = {
    Audio: class {
      defaultPlaybackRate = 1;
      set src(value) { this.source = value; this.playbackRate = this.defaultPlaybackRate; }
      get src() { return this.source; }
      pause() { this.paused = true; }
      play() {
        played.push(this);
        if (staticFails) return Promise.reject(new Error('recording unavailable'));
        if (autoEnd) queueMicrotask(() => this.onended?.());
        return Promise.resolve();
      }
    },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
    fetch: (...args) => { requests.push(args); throw new Error('No live TTS request is allowed'); },
    ...(browser ? { speechSynthesis: {
      getVoices: () => voices, cancel() {},
      addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events),
      speak(utterance) { utterances.push(utterance); if (autoEnd) queueMicrotask(() => { utterance.onstart?.(); utterance.onend?.(); }); },
    } } : {}),
  };
  const service = createSpeechService({ storage, runtime,
    env: { VITE_KOKORO_TTS_URL: 'https://retired-service.invalid/v1/audio/speech' },
    correctedAudioUrl: correctedAudioUrl || ((word, field) => `/versioned/${field}/${word.id}.mp3`) });
  return { ...service, played, requests, utterances,
    loadVoices() { voices = [{ name: 'Saved Voice', lang: 'en-GB' }]; events.dispatchEvent(new Event('voiceschanged')); } };
}
const word = { id: 1, word: 'abandon', example: 'Do not abandon the plan.' };

test('optional static preference uses versioned example audio and preserves other modes browser fallback', async () => {
  const h = harness({ provider: 'browser', autoEnd: false });
  let starts = 0;
  const pending = h.speakExample(word, { preferStatic: true, rate: 0.75, onStart: () => starts++ });
  await tick();
  assert.equal(h.played[0].src, '/versioned/example/1.mp3');
  assert.equal(h.played[0].playbackRate, 0.75); assert.equal(starts, 1);
  h.played[0].onended(); await pending; assert.equal(h.utterances.length, 0);
  const fallback = harness({ provider: 'browser', staticFails: true });
  await fallback.speakExample(word, { preferStatic: true, rate: 0.75 });
  assert.equal(fallback.utterances[0].text, word.example); assert.equal(fallback.utterances[0].rate, 0.75);
  assert.equal(fallback.requests.length, 0);
});

test('recording-only sentence playback uses existing MP3s regardless of the saved provider', async () => {
  const h = harness({ provider: 'browser', autoEnd: false });
  const pending = h.speakExample(word, { recordingOnly: true, rate: 0.75 });
  await tick();
  assert.equal(h.played[0].src, '/versioned/example/1.mp3');
  assert.equal(h.played[0].playbackRate, 0.75);
  h.played[0].onended(); await pending;
  assert.equal(h.utterances.length, 0); assert.equal(h.requests.length, 0);
});

test('recording-only sentence failures never synthesize speech, including missing IDs and failed mappings', async () => {
  for (const options of [{ staticFails: true }, { correctedAudioUrl: () => Promise.reject(new Error('mapping unavailable')) }]) {
    const h = harness({ provider: 'browser', ...options });
    await assert.rejects(h.speakExample(word, { recordingOnly: true }));
    assert.equal(h.utterances.length, 0); assert.equal(h.requests.length, 0);
    // The option belongs to one call and does not remove other modes' fallback.
    await h.speakExample(word);
    assert.equal(h.utterances.length, 1);
  }
  const missing = harness();
  await assert.rejects(missing.speakExample('An example without an audio ID.', { recordingOnly: true }), /id/);
  assert.equal(missing.utterances.length, 0); assert.equal(missing.played.length, 0);
});

for (const rate of [0.5, 0.8, 1, 1.5]) {
  test(`speech rate ${rate} is applied once to recordings, direct text and browser fallback`, async () => {
    const recordings = harness({ globalRate: rate });
    await recordings.speakWord(word); await recordings.speakExample(word);
    assert.deepEqual(recordings.played.map(audio => audio.playbackRate), [rate, rate]);
    assert.match(recordings.played[0].src, /versioned\/word\/1/);
    assert.match(recordings.played[1].src, /versioned\/example\/1/);
    const fallback = harness({ globalRate: rate, staticFails: true });
    await fallback.speakWord(word);
    assert.equal(fallback.utterances[0].rate, rate);
    assert.equal(fallback.requests.length, 0);
    const direct = harness({ globalRate: rate, speed: 0.6 });
    await direct.speak('One selected sentence.');
    assert.equal(direct.utterances[0].rate, rate, 'text does not use recording speed');
    assert.equal(direct.played.length, 0);
    assert.equal(direct.requests.length, 0);
  });
}

test('recording speed, global speed and call rate retain one bounded calculation', async () => {
  const h = harness({ globalRate: 0.8, speed: 0.75 });
  await h.speakWord(word, { rate: 0.9 });
  assert.ok(Math.abs(h.played[0].playbackRate - 0.54) < 1e-12);
  await h.speakExample(word, { rate: 0.1 }); assert.equal(h.played[1].playbackRate, 0.5);
  await h.speakWord(word, { rate: 100 }); assert.equal(h.played[2].playbackRate, 1.5);
  const fallback = harness({ globalRate: 0.8, speed: 0.75, staticFails: true });
  await fallback.speakExample(word, { rate: 0.9 });
  assert.ok(Math.abs(fallback.utterances[0].rate - 0.54) < 1e-12);
});

test('legacy endpoints and Kokoro preference cannot send plain text to a live service', async () => {
  const h = harness({ endpoint: 'https://obsolete.up.railway.app/v1/audio/speech' });
  await h.speak('Read only this sentence.');
  assert.deepEqual(h.utterances.map(item => item.text), ['Read only this sentence.']);
  assert.equal(h.requests.length, 0); assert.equal(h.played.length, 0);
});

test('stop settles browser playback immediately and clears late lifecycle handlers', async () => {
  const h = harness({ autoEnd: false }); let starts = 0;
  const pending = h.speak('old', { onStart: () => starts++ }); await tick();
  const utterance = h.utterances[0], lateStart = utterance.onstart;
  h.stopSpeak(); assert.deepEqual(await pending, { cancelled: true });
  assert.equal(utterance.onstart, null); assert.equal(utterance.onend, null);
  lateStart(); assert.equal(starts, 0);
});

test('a newer sentence cancels old speech and stale callbacks cannot become current', async () => {
  const h = harness({ autoEnd: false }); let oldStarts = 0;
  const first = h.speak('old', { onStart: () => oldStarts++ }); await tick();
  const lateStart = h.utterances[0].onstart;
  const second = h.speak('new'); await tick();
  lateStart(); assert.equal(oldStarts, 0);
  assert.deepEqual(await first, { cancelled: true });
  h.utterances[1].onend(); await second;
  assert.deepEqual(h.utterances.map(item => item.text), ['old', 'new']);
});

test('cancelling static audio pauses Audio and allows subsequent playback', async () => {
  const h = harness({ autoEnd: false });
  const first = h.speakWord(word); h.stopSpeak();
  assert.deepEqual(await first, { cancelled: true });
  assert.equal(h.played[0].paused, true); assert.equal(h.played[0].onended, null);
  const second = h.speakExample(word); h.played[1].onended(); await second;
  assert.equal(h.requests.length, 0);
});

test('unsupported browser speech reports an error and explicit recording never silently synthesizes', async () => {
  const h = harness({ staticFails: true, browser: false });
  await assert.rejects(h.speak('plain'), /不支持/);
  await assert.rejects(h.speakWord(word), /不支持/);
  await assert.rejects(h.speakStaticKokoroWordAudio(word), /recording unavailable/);
  assert.equal(h.requests.length, 0);
});

test('browser synthesis waiting for voices cannot speak after cancellation', async () => {
  const h = harness({ emptyVoices: true });
  const pending = h.speak('wait'); h.stopSpeak(); await pending; h.loadVoices(); await tick();
  assert.equal(h.utterances.length, 0);
  await h.speak('new'); assert.equal(h.utterances[0].voice.name, 'Saved Voice');
});

test('provider/rate changes cancel pending speech and browser rate excludes recording speed', async () => {
  const h = harness({ speed: 0.5, autoEnd: false });
  const old = h.speak('old'); await tick(); h.setTtsProvider('browser');
  assert.deepEqual(await old, { cancelled: true });
  h.setSpeechRate(0.8); const next = h.speakWord(word); await tick();
  assert.equal(h.utterances[1].rate, 0.8); h.utterances[1].onend(); await next;
});

test('late audio mappings cannot play after stop, provider change or a newer request', async () => {
  const pending = [], h = harness({ correctedAudioUrl: () => new Promise(resolve => pending.push(resolve)) });
  const first = h.speakWord(word); h.stopSpeak(); assert.deepEqual(await first, { cancelled: true });
  pending[0]('/late.mp3'); await tick(); assert.equal(h.played.length, 0);
  const second = h.speakWord(word), third = h.speakExample(word);
  pending[2]('/current.mp3'); await third; pending[1]('/old.mp3'); await second; await tick();
  assert.deepEqual(h.played.map(audio => audio.src), ['/current.mp3']);
  const fourth = h.speakWord(word); h.setTtsProvider('browser'); await fourth;
  pending[3]('/late-provider.mp3'); await tick(); assert.equal(h.played.length, 1);
});

test('mapping failures use browser speech without stale recordings or dynamic requests', async () => {
  const h = harness({ correctedAudioUrl: async () => { throw new Error('mapping unavailable'); } });
  await h.speakWord(word); assert.equal(h.utterances[0].text, word.word);
  assert.equal(h.played.length, 0); assert.equal(h.requests.length, 0);
  await assert.rejects(h.speakStaticKokoroWordAudio(word), /mapping unavailable/);
  const browser = harness({ provider: 'browser', correctedAudioUrl: () => assert.fail('must remain lazy') });
  await browser.speakWord(word); assert.equal(browser.utterances[0].text, word.word);
});

test('owned cancellation settles its sentence but cannot stop a newer unrelated operation', async () => {
  const h = harness({ autoEnd: false }), owner = new AbortController();
  const first = h.speak('sentence', { signal: owner.signal }); await tick();
  const second = h.speakWord(word); assert.deepEqual(await first, { cancelled: true });
  owner.abort(); assert.equal(h.played[0].paused, undefined);
  h.played[0].onended(); await second;
  const already = new AbortController(); already.abort();
  const third = h.speak('current'); await tick();
  assert.deepEqual(await h.speak('stale', { signal: already.signal }), { cancelled: true });
  assert.equal(h.utterances.at(-1).onend instanceof Function, true);
  h.utterances.at(-1).onend(); await third;
});

test('native start drives playback state and aborting its owner stops active speech', async () => {
  const h = harness({ autoEnd: false }), owner = new AbortController(); let starts = 0;
  const pending = h.speak('sentence', { signal: owner.signal, onStart: () => starts++ }); await tick();
  assert.equal(starts, 0); h.utterances[0].onstart(); assert.equal(starts, 1);
  owner.abort(); assert.deepEqual(await pending, { cancelled: true });
  assert.equal(h.utterances[0].onstart, null);
});

test('browser start has a bounded wait; an already started sentence is not cut off', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const h = harness({ autoEnd: false });
  const stalled = h.speak('waiting'); await tick();
  const failed = assert.rejects(stalled, /暂未启动/);
  t.mock.timers.tick(5001); await failed;
  assert.equal(h.utterances[0].onstart, null);
  const playing = h.speak('a longer sentence'); await tick();
  h.utterances[1].onstart();
  t.mock.timers.tick(30000);
  assert.equal(typeof h.utterances[1].onend, 'function');
  h.utterances[1].onend(); await playing;
});
