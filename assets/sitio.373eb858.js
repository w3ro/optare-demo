(function () {
'use strict';
var CONFIG = {
whatsapp: '525581808008',
gaId: '',
avisoClave: 'optare-aviso-visto'
};
var doc = document;
doc.documentElement.classList.remove('no-js');
var reducir = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
var objetivos = doc.querySelectorAll('[data-reveal]');
if (objetivos.length && !reducir.matches && 'IntersectionObserver' in window) {
var mostrarTodo = function () { objetivos.forEach(function (el) { el.classList.add('is-revealed'); }); };
var obs = new IntersectionObserver(function (entradas) {
entradas.forEach(function (en) {
if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add('is-revealed'); obs.unobserve(en.target); }
});
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
doc.documentElement.classList.add('has-reveal');
objetivos.forEach(function (el) { obs.observe(el); });
var alCambiar = function (e) { if (e.matches) { obs.disconnect(); mostrarTodo(); } };
if (reducir.addEventListener) { reducir.addEventListener('change', alCambiar); }
}
var btn = doc.querySelector('.navbar_menu-button');
var nav = doc.getElementById('menu');
if (btn && nav) {
var cerrar = function () { nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
btn.addEventListener('click', function () {
var abierto = nav.classList.toggle('is-open');
btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
});
doc.addEventListener('keydown', function (e) {
if (e.key === 'Escape' && nav.classList.contains('is-open')) { cerrar(); btn.focus(); }
});
nav.addEventListener('click', function (e) { if (e.target.closest('a')) { cerrar(); } });
}
var dlg = doc.getElementById('aviso-fraude');
if (dlg && typeof dlg.showModal === 'function') {
var visto = false;
try { visto = sessionStorage.getItem(CONFIG.avisoClave) === '1'; } catch (e) {  }
var marcar = function () { try { sessionStorage.setItem(CONFIG.avisoClave, '1'); } catch (e) {  } };
dlg.addEventListener('close', marcar);
dlg.addEventListener('click', function (e) { if (e.target === dlg) { dlg.close(); } });
dlg.querySelectorAll('[data-cerrar]').forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
var abrir = function () { if (!dlg.open) { dlg.showModal(); } };
doc.querySelectorAll('[data-abrir-aviso]').forEach(function (a) {
a.addEventListener('click', function (e) { e.preventDefault(); abrir(); });
});
if (!visto) {
var lanzado = false;
var eventos = ['scroll', 'pointerdown', 'keydown', 'touchstart'];
var lanzar = function () {
if (lanzado) { return; }
lanzado = true;
eventos.forEach(function (ev) { window.removeEventListener(ev, alMover); });
if (!dlg.open && !visto) { abrir(); }
};
var alMover = function () { setTimeout(lanzar, 700); };
eventos.forEach(function (ev) { window.addEventListener(ev, alMover, { passive: true, once: true }); });
setTimeout(lanzar, 8000);
dlg.addEventListener('close', function () { visto = true; });
}
}
var form = doc.getElementById('form-contacto');
if (form) {
var resumen = doc.getElementById('resumen-errores');
var campos = {
nombre: function (v) { return v.trim().length >= 2 ? '' : 'Escribe tu nombre.'; },
empresa: function (v) { return v.trim().length >= 2 ? '' : 'Escribe el nombre de tu empresa.'; },
telefono: function (v) { return v.replace(/\D/g, '').length >= 10 ? '' : 'Escribe un teléfono o WhatsApp de 10 dígitos.'; },
tipo: function (v) { return v ? '' : 'Elige un tipo de crédito o “No estoy seguro”.'; },
aviso: function (v, el) { return el.checked ? '' : 'Marca que leíste el aviso de privacidad.'; },
consentimiento: function (v, el) { return el.checked ? '' : 'Marca tu consentimiento para poder enviar tu solicitud.'; }
};
var mostrar = function (nombre, msg) {
var el = form.elements[nombre];
var err = doc.getElementById('error-' + nombre);
if (!el || !err) { return; }
err.textContent = msg;
err.classList.toggle('is-visible', !!msg);
el.setAttribute('aria-invalid', msg ? 'true' : 'false');
};
Object.keys(campos).forEach(function (n) {
var el = form.elements[n];
if (!el) { return; }
el.addEventListener('blur', function () { mostrar(n, campos[n](el.value, el)); });
el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') { mostrar(n, campos[n](el.value, el)); } });
});
form.addEventListener('submit', function (e) {
e.preventDefault();
var errores = [];
Object.keys(campos).forEach(function (n) {
var el = form.elements[n];
var msg = campos[n](el.value, el);
mostrar(n, msg);
if (msg) { errores.push({ n: n, msg: msg }); }
});
if (errores.length) {
resumen.innerHTML = '<p>Revisa estos campos para poder enviar tu solicitud:</p><ul></ul>';
errores.forEach(function (x) {
var li = doc.createElement('li');
var a = doc.createElement('a');
a.href = '#' + form.elements[x.n].id;
a.textContent = x.msg;
a.addEventListener('click', function (ev) { ev.preventDefault(); form.elements[x.n].focus(); });
li.appendChild(a);
resumen.querySelector('ul').appendChild(li);
});
resumen.classList.add('is-visible');
resumen.focus();
return;
}
resumen.classList.remove('is-visible');
var tipoTxt = form.elements.tipo.options[form.elements.tipo.selectedIndex].text;
var partes = [
'Hola, quiero una asesoría para mi empresa.',
'Nombre: ' + form.elements.nombre.value.trim(),
'Empresa: ' + form.elements.empresa.value.trim(),
'Teléfono: ' + form.elements.telefono.value.trim(),
'Me interesa: ' + tipoTxt
];
var msg = form.elements.mensaje.value.trim();
if (msg) { partes.push('Mensaje: ' + msg); }
partes.push('Leí el aviso de privacidad (optare.mx/aviso).');
var url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(partes.join('\n'));
var w = window.open(url, '_blank', 'noopener');
if (!w) { window.location.href = url; }
var ok = doc.getElementById('envio-ok');
if (ok) { ok.classList.add('is-visible'); ok.focus(); }
});
}
if (CONFIG.gaId && navigator.doNotTrack !== '1') {
var cargada = false;
var cargarGA = function () {
if (cargada) { return; }
cargada = true;
var s = doc.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.gaId;
doc.head.appendChild(s);
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.gtag('config', CONFIG.gaId, { anonymize_ip: true });
};
['pointerdown', 'keydown', 'scroll'].forEach(function (ev) {
window.addEventListener(ev, cargarGA, { once: true, passive: true });
});
setTimeout(cargarGA, 6000);
}
})();