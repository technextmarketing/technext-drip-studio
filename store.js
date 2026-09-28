/* TechNext Drip Studio — where drips live.
   hub:   the claude.ai Artifact. Drips, categories and the Claude usage log are documents in the
          artifact's shared database (auto-saved, live for everyone with access); uploaded photos go to
          the artifact's asset store; PNGs are saved through the viewer's download prompt.
   local: GitHub Pages or a file on disk. Everything is auto-saved in this browser only. */
(function () {
  'use strict';
  var KEY = 'tn-drip-library', KEY_CATS = 'tn-drip-categories', KEY_USAGE = 'tn-drip-usage';
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  var S = { mode: 'local', db: null, assets: null, downloads: null, user: null, canWrite: true, listeners: {} };
  S.on = function (ev, fn) { (S.listeners[ev] = S.listeners[ev] || []).push(fn); };
  function emit(ev, a) { (S.listeners[ev] || []).forEach(function (fn) { try { fn(a); } catch (e) { console.error(e); } }); }
  function use(name) { return window.claude && window.claude.use ? window.claude.use(name).catch(function () { return null; }) : Promise.resolve(null); }

  /* resolves {lib, cats, usage, empty} once the first data is in */
  S.init = function (fileLib, fileCats) {
    return use('db').then(function (db) {
      if (!db) return initLocal(fileLib, fileCats);
      S.db = db; S.mode = 'hub';
      use('assets').then(function (a) { S.assets = a; emit('caps'); });
      use('downloads').then(function (d) { S.downloads = d; emit('caps'); });
      use('user').then(function (u) { S.user = u; if (u && u.can) Promise.resolve(u.can('data.write')).then(function (v) { if (v === false) { S.canWrite = false; emit('caps'); } }).catch(function () {}); });
      return new Promise(function (resolve) {
        var got = { drips: null, cats: null, usage: null }, done = false;
        function maybe() {
          if (done || !got.drips || !got.cats || !got.usage) return;
          done = true;
          resolve({ lib: got.drips.lib, cats: got.cats.v || clone(fileCats), usage: got.usage.v || [], empty: !got.drips.lib.length });
        }
        db.collection('drips').onSnapshot(function (snap) {
          var lib = snap.docs.filter(function (d) { return d.exists; }).map(function (d) { return clone(d.data()); });
          lib.sort(function (a, b) { return (a.order || 0) - (b.order || 0) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')); });
          if (!got.drips) { got.drips = { lib: lib }; maybe(); } else emit('remote', lib);
        }, function (e) { emit('error', e); if (!got.drips) { got.drips = { lib: [] }; maybe(); } });
        db.doc('config/library').onSnapshot(function (snap) {
          var v = snap.exists && snap.data().categories ? clone(snap.data().categories) : null;
          if (!got.cats) { got.cats = { v: v }; maybe(); } else if (v) emit('remoteCats', v);
        }, function () { if (!got.cats) { got.cats = { v: null }; maybe(); } });
        db.doc('stats/usage').onSnapshot(function (snap) {
          var v = snap.exists && snap.data().items ? clone(snap.data().items) : [];
          if (!got.usage) { got.usage = { v: v }; maybe(); } else emit('remoteUsage', v);
        }, function () { if (!got.usage) { got.usage = { v: [] }; maybe(); } });
      });
    });
  };
  function initLocal(fileLib, fileCats) {
    S.mode = 'local';
    var saved = lsGet(KEY), cats = lsGet(KEY_CATS) || clone(fileCats);
    fileCats.forEach(function (c) { if (!cats.some(function (x) { return x.id === c.id; })) cats.push(clone(c)); });
    var lib = saved && saved.length ? saved : clone(fileLib);
    fileLib.forEach(function (d) { if (!lib.some(function (x) { return x.id === d.id; })) lib.push(clone(d)); });
    return Promise.resolve({ lib: lib, cats: cats, usage: lsGet(KEY_USAGE) || [], empty: false });
  }

  /* one write at a time per document; the newest body wins */
  var inflight = {}, queued = {};
  function write(path, body, del) {
    if (inflight[path]) { queued[path] = { body: body, del: del }; return inflight[path]; }
    var ref = S.db.doc(path);
    var failed = false;
    var p = (del ? ref.delete() : ref.set(body)).catch(function (e) {
      failed = true; emit('saveError', e);
      if (e && e.code === 'invalid_argument') { S.canWrite = false; emit('caps'); }
    }).then(function () {
      delete inflight[path];
      var q = queued[path]; delete queued[path];
      if (q) return write(path, q.body, q.del);
      if (!failed) emit('saved');
    });
    inflight[path] = p; return p;
  }
  S.pending = function () { return Object.keys(inflight).length > 0; };

  S.saveDrip = function (d, lib) {
    emit('saving');
    if (S.mode === 'hub') { var b = clone(d); b.updatedAt = new Date().toISOString(); return write('drips/' + d.id, b); }
    var ok = lsSet(KEY, lib); emit(ok ? 'saved' : 'saveError', ok ? null : { code: 'quota' }); return Promise.resolve();
  };
  S.deleteDrip = function (id, lib) {
    if (S.mode === 'hub') return write('drips/' + id, null, true);
    lsSet(KEY, lib); emit('saved'); return Promise.resolve();
  };
  S.saveCats = function (cats) {
    if (S.mode === 'hub') return write('config/library', { categories: clone(cats) });
    lsSet(KEY_CATS, cats); return Promise.resolve();
  };
  S.logUsage = function (items) {
    var v = items.slice(-200);
    if (S.mode === 'hub') return write('stats/usage', { items: clone(v) });
    lsSet(KEY_USAGE, v); return Promise.resolve();
  };
  S.resetLocal = function () { try { localStorage.removeItem(KEY); localStorage.removeItem(KEY_CATS); } catch (e) {} };

  /* images people add: the hub's asset store, else embedded */
  S.uploadImage = function (file) {
    if (S.assets) return S.assets.upload(file).then(function (r) { return r.url; });
    return new Promise(function (res, rej) { var f = new FileReader(); f.onload = function () { res(f.result); }; f.onerror = rej; f.readAsDataURL(file); });
  };

  /* hand a file to the viewer */
  S.download = function (filename, blob) {
    if (S.downloads) return S.downloads.save({ filename: filename, data: blob }).then(function () { return true; }, function (e) { if (e && e.code === 'declined') return false; throw e; });
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    return Promise.resolve(true);
  };

  window.TNStore = S;
})();
