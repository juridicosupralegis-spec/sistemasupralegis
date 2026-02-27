/* =================================================================
   MÓDULO: INCIDENTE DE LIQUIDACIÓN DE COSTAS PROCESALES
   Fundamento: Arts. 130-145 CPC Puebla / Arts. 1083-1084 Cód. Comercio
   ================================================================= */

(function () {
    'use strict';

    const UMA_2026 = 117.31;

    // ─── BUILD UI ────────────────────────────────────────────────
    function buildCostasUI() {
        const container = document.getElementById('calcGastos');
        if (!container) return;

        container.innerHTML = `
        <h3 style="margin-top:0; color:var(--primary); display:flex; align-items:center; gap:8px;">
            <span class="material-icons-round">gavel</span>
            Incidente de Liquidaci&oacute;n de Costas y Gastos Procesales
        </h3>
        <div style="font-size:0.82rem; color:#555; margin-bottom:15px; background:#fffde7; padding:10px 14px; border-radius:8px; border-left:4px solid #f9a825; line-height:1.6;">
            <strong>Fundamento legal:</strong> Arts. 130&#8211;145 C&oacute;d. Procesal Civil de Puebla &bull; Arts. 1083&#8211;1084 C&oacute;d. de Comercio (materia mercantil).<br>
            Las costas comprenden todos los gastos <em>necesarios, &uacute;tiles o indispensables</em> erogados en el procedimiento judicial.
        </div>

        <!-- DATOS DEL EXPEDIENTE -->
        <div style="background:#e8f5e9; padding:15px; border-radius:10px; margin-bottom:18px; border:1px solid #c8e6c9;">
            <h4 style="margin:0 0 10px 0; color:#2e7d32; font-size:0.88rem; text-transform:uppercase; letter-spacing:.5px;">
                <span class="material-icons-round" style="font-size:1rem;vertical-align:middle;">folder_open</span> Datos del Expediente
            </h4>
            <div class="form-grid-2">
                <div><label>Parte Actora / Quien Reclama</label><input type="text" id="cos_actor" placeholder="Nombre completo del actor"></div>
                <div><label>Parte Demandada / Condenada en Costas</label><input type="text" id="cos_demandado" placeholder="Nombre del demandado"></div>
                <div><label>N&uacute;mero de Expediente</label><input type="text" id="cos_expediente" placeholder="Ej. 123/2025"></div>
                <div><label>Juzgado / Tribunal</label><input type="text" id="cos_juzgado" placeholder="Ej. 1er. Juzgado Civil Oral de Puebla"></div>
                <div>
                    <label>Materia del Juicio</label>
                    <select id="cos_tipo_juicio">
                        <option>Civil</option><option>Mercantil</option><option>Familiar</option>
                        <option>Penal</option><option>Laboral</option><option>Contencioso Administrativo</option><option>Amparo</option>
                    </select>
                </div>
                <div><label>Fecha de Corte</label><input type="date" id="cos_fecha_corte"></div>
            </div>
        </div>

        <!-- I. HONORARIOS -->
        ${buildSection('honorarios', 'f3e5f5', 'e1bee7', '6a1b9a', 'person', 'I', 'Honorarios Profesionales del Abogado (Arancel)',
            `<div style="font-size:0.75rem; color:#6a1b9a; background:#f3e5f5; border:1px solid #e1bee7; padding:8px; border-radius:6px; margin-bottom:10px; line-height:1.4;">
                <span class="material-icons-round" style="font-size:0.9rem; vertical-align:middle;">info</span>
                <strong>Guía de Equidad:</strong> El Arancel de Puebla marca rangos. Para un cobro justo: 
                <br>&bull; <b>Mínimo:</b> Asuntos simples/familiares econ. &bull; <b>Medio (Recomendado):</b> Equilibrio profesional. &bull; <b>Máximo:</b> Alta complejidad/cuantía.
            </div>
            <table class="data-table" style="font-size:.82rem; margin-bottom:8px;">
                <thead style="background:#e1bee7;">
                    <tr>
                        <th>Actuación / Descripci&oacute;n (Art. Arancel)</th>
                        <th style="width:105px;">Valor UMA ($)</th>
                        <th style="width:80px;">N&uacute;m. UMAs</th>
                        <th style="width:110px;">Total ($)</th>
                        <th style="width:40px;"></th>
                    </tr>
                </thead>
                <tbody id="honorariosRows"></tbody>
            </table>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
                <button class="btn btn-outline btn-small" onclick="window.costasAddHonorario()" style="border-color:#6a1b9a;color:#6a1b9a;"><span class="material-icons-round" style="font-size:.9rem;">add</span> Actuaci&oacute;n libre</button>
                <span style="color:#9e9e9e; font-size:.78rem; align-self:center;">Accesos rápidos (UMA sugerida):</span>
                <button class="btn btn-outline btn-small" title="Rango: 30-60 UMAs" onclick="window.costasAddHonorarioPreset('Formulaci&oacute;n de demanda (30-60 UMA / Art. 14)',30)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Demanda (30)</button>
                <button class="btn btn-outline btn-small" title="Rango: 20-40 UMAs" onclick="window.costasAddHonorarioPreset('Contestaci&oacute;n de demanda (20-40 UMA / Art. 15)',20)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Contestación (20)</button>
                <button class="btn btn-outline btn-small" title="Rango: 10-30 UMAs" onclick="window.costasAddHonorarioPreset('Ofrecimiento de Pruebas (10-30 UMA / Art. 21)',20)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Pruebas (20)</button>
                <button class="btn btn-outline btn-small" onclick="window.costasAddHonorarioPreset('Audiencia de juicio oral (Art. 17) – por hora',10)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Audiencia/hr (10)</button>
                <button class="btn btn-outline btn-small" onclick="window.costasAddHonorarioPreset('Escrito de alegatos (Art. 20)',15)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Alegatos (15)</button>
                <button class="btn btn-outline btn-small" onclick="window.costasAddHonorarioPreset('Incidente de Liquidación (Art. 39)',20)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Incidente (20)</button>
                <button class="btn btn-outline btn-small" onclick="window.costasAddHonorarioPreset('Recurso de Apelación (Art. 35)',25)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Apelación (25)</button>
                <button class="btn btn-outline btn-small" onclick="window.costasAddHonorarioPreset('Juicio de Amparo Indirecto (Art. 48)',50)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Amparo Ind. (50)</button>
                <button class="btn btn-outline btn-small" onclick="window.costasAddHonorarioPreset('Consultas en despacho (Art. 12)',5)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Consulta (5)</button>
                <button class="btn btn-outline btn-small" onclick="window.costasAddHonorarioPreset('Escrito de trámite (Art. 17 V)',5)" style="font-size:.73rem; border-color:#ab47bc; color:#ab47bc;">Promoción (5)</button>
            </div>`
        )}

        <!-- II. VIÁTICOS -->
        ${buildSection('viaticos', 'e3f2fd', 'bbdefb', '0277bd', 'directions_car', 'II', 'Vi&aacute;ticos y Gastos de Transportaci&oacute;n',
            buildSimpleTable('viaticosRows', [
                'Taxi / Uber a juzgado', 'Gasolina (diligencia)', 'Casetas de peaje',
                'Hospedaje (diligencia for&aacute;nea)', 'Alimentos (diligencia for&aacute;nea)', 'Otro vi&aacute;tico...'
            ], '0277bd', 'costasAddViatico', 'Agregar Vi&aacute;tico')
        )}

        <!-- III. ACTUARIOS Y NOTIFICACIONES -->
        ${buildSection('actuarios', 'fff3e0', 'ffe0b2', 'e65100', 'assignment_ind', 'III', 'Derechos de Actuario, Notificaciones y Diligencias',
            buildSimpleTable('actuariosRows', [
                'Notificaci&oacute;n personal', 'Publicaci&oacute;n por estrados',
                'Diligenciaci&oacute;n de exhorto', 'Embargo / Reembargo',
                'Lanzamiento / Desahucio', 'Formulaci&oacute;n de inventario', 'Otro concepto de actuario...'
            ], 'e65100', 'costasAddActuario', 'Agregar Diligencia')
        )}

        <!-- IV. PERITAJES -->
        ${buildSection('peritajes', 'fce4ec', 'f8bbd0', '880e4f', 'science', 'IV', 'Honorarios de Peritos y Pruebas Periciales',
            buildSimpleTable('peritajesRows', [
                'Av&aacute;luo / Valuaci&oacute;n', 'Peritaje contable', 'Peritaje m&eacute;dico',
                'Peritaje grafol&oacute;gico', 'Peritaje psicol&oacute;gico', 'Otro peritaje...'
            ], '880e4f', 'costasAddPeritaje', 'Agregar Peritaje')
        )}

        <!-- V. COPIAS Y TRÁMITES -->
        ${buildSection('copias', 'e0f7fa', 'b2ebf2', '006064', 'content_copy', 'V', 'Copias Certificadas, Derechos y Tr&aacute;mites',
            buildSimpleTable('copiasRows', [
                'Copias certificadas', 'Derechos de Registro P&uacute;blico',
                'Apostilla / Legalizaci&oacute;n', 'Honorarios notariales',
                'Correo certificado / Mensajer&iacute;a', 'Copias simples de expediente', 'Otro tr&aacute;mite...'
            ], '006064', 'costasAddCopia', 'Agregar Tr&aacute;mite')
        )}

        <!-- VI. OTROS -->
        ${buildSection('otros', 'f1f8e9', 'dcedc8', '33691e', 'more_horiz', 'VI', 'Otros Gastos Procesales Justificados',
            buildOtrosTable()
        )}

        <!-- TOTAL GENERAL -->
        <div style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8); padding:20px; border-radius:14px; color:white; margin-bottom:20px; box-shadow:0 8px 25px rgba(30,58,138,.35);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:15px;">
                <div style="min-width:230px;">
                    <div style="opacity:.75; font-size:.75rem; margin-bottom:10px; text-transform:uppercase; letter-spacing:1px;">Resumen por Concepto</div>
                    <div style="display:grid; grid-template-columns:auto 1fr; gap:4px 16px; font-size:.82rem;">
                        <span style="opacity:.85;">I. Honorarios</span><strong id="res_honorarios">$0.00</strong>
                        <span style="opacity:.85;">II. Vi&aacute;ticos</span><strong id="res_viaticos">$0.00</strong>
                        <span style="opacity:.85;">III. Actuarios/Notif.</span><strong id="res_actuarios">$0.00</strong>
                        <span style="opacity:.85;">IV. Peritajes</span><strong id="res_peritajes">$0.00</strong>
                        <span style="opacity:.85;">V. Copias/Tr&aacute;mites</span><strong id="res_copias">$0.00</strong>
                        <span style="opacity:.85;">VI. Otros</span><strong id="res_otros">$0.00</strong>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="opacity:.7; font-size:.78rem; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px;">Total Costas Procesales a Condenar</div>
                    <div id="costasTotal" style="font-size:2.5rem; font-weight:800; letter-spacing:-1px; line-height:1;">$0.00</div>
                    <div style="opacity:.6; font-size:.72rem; margin-top:6px;">Monto a cobrar a la parte condenada en costas</div>
                </div>
            </div>
        </div>

        <!-- ACCIONES -->
        <div style="display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap;">
            <button class="btn btn-outline" onclick="window.resetCostas()" style="border-color:#ef5350; color:#ef5350;">
                <span class="material-icons-round">restart_alt</span> Limpiar Todo
            </button>
            <button class="btn btn-primary" onclick="window.generarDictamenCostas()" style="background:linear-gradient(135deg,#1e3a8a,#2563eb); font-size:.95rem;">
                <span class="material-icons-round">picture_as_pdf</span> Generar Dictamen de Costas (PDF)
            </button>
        </div>`;

        // Add initial rows
        window.costasAddHonorario();
        window.costasAddViatico();
        window.costasAddActuario();
        window.costasAddPeritaje();
        window.costasAddCopia();
        window.costasAddOtro();

        // Set today's date
        const today = new Date().toISOString().split('T')[0];
        const corte = document.getElementById('cos_fecha_corte');
        if (corte) corte.value = today;
    }

    function buildSection(key, bg, headerBg, color, icon, num, title, innerHtml) {
        return `
        <div style="background:#${bg}; padding:15px; border-radius:10px; margin-bottom:15px; border:1px solid #${headerBg};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h4 style="margin:0; color:#${color}; font-size:.9rem;">
                    <span class="material-icons-round" style="font-size:1rem;vertical-align:middle;margin-right:4px;">${icon}</span>
                    ${num}. ${title}
                </h4>
                <div style="font-weight:bold; color:#${color}; font-size:.88rem; white-space:nowrap;">
                    Subtotal: <span id="subtotal_${key}">$0.00</span>
                </div>
            </div>
            ${innerHtml}
        </div>`;
    }

    function buildSimpleTable(tbodyId, options, color, addFn, addLabel) {
        const opts = options.map(o => `<option>${o}</option>`).join('');
        return `
        <table class="data-table" style="font-size:.82rem; margin-bottom:8px;">
            <thead style="background:rgba(0,0,0,.06);">
                <tr>
                    <th style="width:120px;">Fecha</th>
                    <th>Concepto</th>
                    <th style="width:130px;">Monto ($)</th>
                    <th style="width:40px;"></th>
                </tr>
            </thead>
            <tbody id="${tbodyId}"></tbody>
        </table>
        <button class="btn btn-outline btn-small" onclick="window.${addFn}()" style="border-color:#${color};color:#${color};">
            <span class="material-icons-round" style="font-size:.9rem;">add</span> ${addLabel}
        </button>`;
    }

    function buildOtrosTable() {
        return `
        <table class="data-table" style="font-size:.82rem; margin-bottom:8px;">
            <thead style="background:rgba(0,0,0,.06);">
                <tr>
                    <th style="width:120px;">Fecha</th>
                    <th>Descripci&oacute;n del Gasto Justificado</th>
                    <th style="width:130px;">Monto ($)</th>
                    <th style="width:40px;"></th>
                </tr>
            </thead>
            <tbody id="otrosRows"></tbody>
        </table>
        <button class="btn btn-outline btn-small" onclick="window.costasAddOtro()" style="border-color:#33691e;color:#33691e;">
            <span class="material-icons-round" style="font-size:.9rem;">add</span> Agregar Gasto
        </button>`;
    }

    // ─── ROW ADDERS ─────────────────────────────────────────────
    window.costasAddHonorario = () => {
        const tbody = document.getElementById('honorariosRows');
        if (!tbody) return;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="form-control-small hon-desc" placeholder="Ej. Formulaci&oacute;n de demanda (Art.14 Arancel)" style="width:100%;" oninput="window.recalcHonRow(this)"></td>
            <td><input type="number" class="form-control-small hon-uma" value="${UMA_2026}" step="0.01" oninput="window.recalcHonRow(this)" style="width:95px;"></td>
            <td><input type="number" class="form-control-small hon-uma-qty" value="1" min="0.5" step="0.5" oninput="window.recalcHonRow(this)" style="width:68px;"></td>
            <td style="font-weight:bold; color:#6a1b9a; white-space:nowrap;" class="hon-total">$${UMA_2026.toFixed(2)}</td>
            <td><button class="btn btn-outline btn-small" onclick="this.closest('tr').remove(); window.recalcCostas();" style="color:red;border-color:red;">&times;</button></td>`;
        tbody.appendChild(tr);
        window.recalcCostas();
    };

    window.costasAddHonorarioPreset = (desc, umas) => {
        const tbody = document.getElementById('honorariosRows');
        if (!tbody) return;
        const tr = document.createElement('tr');
        const total = (UMA_2026 * umas).toLocaleString('es-MX', { minimumFractionDigits: 2 });
        tr.innerHTML = `
            <td><input type="text" class="form-control-small hon-desc" value="${desc}" style="width:100%;" oninput="window.recalcHonRow(this)"></td>
            <td><input type="number" class="form-control-small hon-uma" value="${UMA_2026}" step="0.01" oninput="window.recalcHonRow(this)" style="width:95px;"></td>
            <td><input type="number" class="form-control-small hon-uma-qty" value="${umas}" min="0.5" step="0.5" oninput="window.recalcHonRow(this)" style="width:68px;"></td>
            <td style="font-weight:bold; color:#6a1b9a; white-space:nowrap;" class="hon-total">$${total}</td>
            <td><button class="btn btn-outline btn-small" onclick="this.closest('tr').remove(); window.recalcCostas();" style="color:red;border-color:red;">&times;</button></td>`;
        tbody.appendChild(tr);
        window.recalcCostas();
    };

    window.recalcHonRow = (input) => {
        const tr = input.closest('tr');
        const uma = parseFloat(tr.querySelector('.hon-uma').value) || 0;
        const qty = parseFloat(tr.querySelector('.hon-uma-qty').value) || 0;
        tr.querySelector('.hon-total').textContent = '$' + (uma * qty).toLocaleString('es-MX', { minimumFractionDigits: 2 });
        window.recalcCostas();
    };

    function makeSimpleRow(tbodyId, section, selectOptions) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        const today = new Date().toISOString().split('T')[0];
        const opts = selectOptions.map(o => `<option>${o}</option>`).join('');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="date" class="form-control-small" value="${today}"></td>
            <td><select class="form-control-small" style="width:100%;">${opts}</select></td>
            <td><input type="number" class="form-control-small gas-monto" data-section="${section}" placeholder="0.00" oninput="window.recalcCostas()" style="width:115px;"></td>
            <td><button class="btn btn-outline btn-small" onclick="this.closest('tr').remove(); window.recalcCostas();" style="color:red;border-color:red;">&times;</button></td>`;
        tbody.appendChild(tr);
    }

    window.costasAddViatico = () => makeSimpleRow('viaticosRows', 'viaticos', [
        'Taxi / Uber al Juzgado', 'Gasolina (diligencia)', 'Casetas de peaje',
        'Hospedaje (diligencia foránea)', 'Alimentos (diligencia foránea)', 'Otro viático...'
    ]);
    window.costasAddActuario = () => makeSimpleRow('actuariosRows', 'actuarios', [
        'Notificación personal', 'Publicación por estrados',
        'Diligenciación de exhorto', 'Embargo / Reembargo',
        'Lanzamiento / Desahucio', 'Formulación de inventario', 'Otro concepto...'
    ]);
    window.costasAddPeritaje = () => makeSimpleRow('peritajesRows', 'peritajes', [
        'Avalúo / Valuación', 'Peritaje contable', 'Peritaje médico',
        'Peritaje grafológico', 'Peritaje psicológico', 'Otro peritaje...'
    ]);
    window.costasAddCopia = () => makeSimpleRow('copiasRows', 'copias', [
        'Copias certificadas', 'Derechos de Registro Público',
        'Apostilla / Legalización', 'Honorarios notariales',
        'Correo certificado / Mensajería', 'Copias simples de expediente', 'Otro trámite...'
    ]);
    window.costasAddOtro = () => {
        const tbody = document.getElementById('otrosRows');
        if (!tbody) return;
        const today = new Date().toISOString().split('T')[0];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="date" class="form-control-small" value="${today}"></td>
            <td><input type="text" class="form-control-small" placeholder="Ej. Garantía de embargo, fianza judicial, traducción..." style="width:100%;"></td>
            <td><input type="number" class="form-control-small gas-monto" data-section="otros" placeholder="0.00" oninput="window.recalcCostas()" style="width:115px;"></td>
            <td><button class="btn btn-outline btn-small" onclick="this.closest('tr').remove(); window.recalcCostas();" style="color:red;border-color:red;">&times;</button></td>`;
        tbody.appendChild(tr);
    };

    // ─── RECALC ──────────────────────────────────────────────────
    window.recalcCostas = () => {
        const fmt = (n) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        let hon = 0;
        document.querySelectorAll('#honorariosRows tr').forEach(tr => {
            const uma = parseFloat(tr.querySelector('.hon-uma')?.value) || 0;
            const qty = parseFloat(tr.querySelector('.hon-uma-qty')?.value) || 0;
            hon += uma * qty;
        });

        const totals = { viaticos: 0, actuarios: 0, peritajes: 0, copias: 0, otros: 0 };
        document.querySelectorAll('.gas-monto').forEach(el => {
            const sec = el.dataset.section;
            if (sec && totals.hasOwnProperty(sec)) totals[sec] += parseFloat(el.value) || 0;
        });

        const grand = hon + totals.viaticos + totals.actuarios + totals.peritajes + totals.copias + totals.otros;

        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = fmt(val); };
        setEl('subtotal_honorarios', hon);
        setEl('subtotal_viaticos', totals.viaticos);
        setEl('subtotal_actuarios', totals.actuarios);
        setEl('subtotal_peritajes', totals.peritajes);
        setEl('subtotal_copias', totals.copias);
        setEl('subtotal_otros', totals.otros);
        setEl('res_honorarios', hon);
        setEl('res_viaticos', totals.viaticos);
        setEl('res_actuarios', totals.actuarios);
        setEl('res_peritajes', totals.peritajes);
        setEl('res_copias', totals.copias);
        setEl('res_otros', totals.otros);

        const totalEl = document.getElementById('costasTotal');
        if (totalEl) {
            totalEl.textContent = fmt(grand);
            totalEl.style.color = grand > 0 ? '#ffd700' : 'white';
        }
    };

    // ─── RESET ───────────────────────────────────────────────────
    window.resetCostas = () => {
        if (!confirm('¿Desea limpiar todos los datos del formulario de costas?')) return;
        buildCostasUI();
        setTimeout(() => window.recalcCostas(), 100);
    };

    // ─── PDF GENERATOR ───────────────────────────────────────────
    window.generarDictamenCostas = async () => {
        if (typeof PDFLib === 'undefined') return alert('Librería PDF no cargada.');

        const fmt = (n) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const actor = document.getElementById('cos_actor')?.value || 'No especificado';
        const demandado = document.getElementById('cos_demandado')?.value || 'No especificado';
        const expediente = document.getElementById('cos_expediente')?.value || 's/n';
        const juzgado = document.getElementById('cos_juzgado')?.value || 'No especificado';
        const materia = document.getElementById('cos_tipo_juicio')?.value || '';
        const fechaCorte = document.getElementById('cos_fecha_corte')?.value
            ? new Date(document.getElementById('cos_fecha_corte').value + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });

        const items = [];
        let secTotals = {};

        let hon = 0;
        document.querySelectorAll('#honorariosRows tr').forEach(tr => {
            const desc = tr.querySelector('.hon-desc')?.value || 'Honorarios';
            const uma = parseFloat(tr.querySelector('.hon-uma')?.value) || 0;
            const qty = parseFloat(tr.querySelector('.hon-uma-qty')?.value) || 0;
            const total = uma * qty;
            hon += total;
            if (total > 0) items.push({ sec: 'I. Honorarios', desc: `${desc} (${qty} UMA × $${uma})`, monto: total });
        });
        secTotals['I. Honorarios'] = hon;

        const secMap = {
            viaticos: 'II. Viáticos',
            actuarios: 'III. Actuarios / Notificaciones',
            peritajes: 'IV. Peritajes',
            copias: 'V. Copias / Trámites',
            otros: 'VI. Otros Gastos'
        };

        document.querySelectorAll('.gas-monto').forEach(el => {
            const sec = el.dataset.section;
            if (!sec) return;
            const monto = parseFloat(el.value) || 0;
            if (monto > 0) {
                const tr = el.closest('tr');
                const desc = tr.querySelector('select')?.value || tr.querySelector('input[type=text]')?.value || sec;
                const fecha = tr.querySelector('input[type=date]')?.value
                    ? new Date(tr.querySelector('input[type=date]').value + 'T12:00:00').toLocaleDateString('es-MX')
                    : '';
                const secLabel = secMap[sec] || sec;
                secTotals[secLabel] = (secTotals[secLabel] || 0) + monto;
                items.push({ sec: secLabel, desc: `${fecha ? fecha + ' — ' : ''}${desc}`, monto });
            }
        });

        const grand = Object.values(secTotals).reduce((a, b) => a + b, 0);
        if (grand <= 0) return alert('Capture al menos un concepto con monto para generar el dictamen.');

        const pdfDoc = await PDFLib.PDFDocument.create();
        if (typeof fontkit !== 'undefined') pdfDoc.registerFontkit(fontkit);
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanBold);
        const fontReg = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
        const fontItalic = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanItalic);

        const BLUE = PDFLib.rgb(0.07, 0.22, 0.54);
        const GRAY = PDFLib.rgb(0.4, 0.4, 0.4);
        const BLACK = PDFLib.rgb(0, 0, 0);
        const WHITE = PDFLib.rgb(1, 1, 1);

        let page = pdfDoc.addPage(PDFLib.PageSizes.Letter);
        let { width, height } = page.getSize();
        const L = 50, R = width - 50;

        page.drawRectangle({ x: 0, y: height - 90, width, height: 90, color: BLUE });

        const savedLogo = localStorage.getItem('sl_mem_logo');
        if (savedLogo) {
            try {
                const resp = await fetch(savedLogo);
                const bytes = await resp.arrayBuffer();
                let logoImg;
                try { logoImg = await pdfDoc.embedPng(bytes); } catch { logoImg = await pdfDoc.embedJpg(bytes); }
                if (logoImg) {
                    const lH = 70, lW = lH * (logoImg.width / logoImg.height);
                    page.drawImage(logoImg, { x: R - lW, y: height - 85, width: lW, height: lH });
                }
            } catch { }
        }

        const firmTitle = localStorage.getItem('sl_mem_title') || 'JURÍDICO SUPRA LEGIS';
        page.drawText(firmTitle, { x: L, y: height - 35, size: 16, font: fontBold, color: WHITE });
        page.drawText('DICTAMEN DE LIQUIDACIÓN DE COSTAS PROCESALES', { x: L, y: height - 56, size: 10, font: fontReg, color: PDFLib.rgb(0.8, 0.9, 1) });
        page.drawText(`Puebla, Pue., a ${fechaCorte}`, { x: L, y: height - 74, size: 9, font: fontReg, color: PDFLib.rgb(0.7, 0.85, 1) });

        let y = height - 108;
        const lh = 15;

        const drawLine = (text, size = 10, font = fontReg, color = BLACK, indent = L) => {
            if (y < 65) {
                page = pdfDoc.addPage(PDFLib.PageSizes.Letter);
                ({ width, height } = page.getSize());
                page.drawRectangle({ x: 0, y: height - 28, width, height: 28, color: BLUE });
                page.drawText('COSTAS PROCESALES — Continuación', { x: L, y: height - 20, size: 9, font: fontBold, color: WHITE });
                y = height - 48;
            }
            if (text) page.drawText(String(text), { x: indent, y, size, font, color });
            y -= lh;
        };

        const hrule = () => {
            if (y < 65) { drawLine(''); return; }
            page.drawLine({ start: { x: L, y }, end: { x: R, y }, thickness: 0.4, color: PDFLib.rgb(0.8, 0.8, 0.8) });
            y -= 6;
        };

        // Expediente block
        y -= 4;
        page.drawRectangle({ x: L - 8, y: y - 50, width: R - L + 16, height: 58, color: PDFLib.rgb(0.95, 0.97, 1), borderColor: PDFLib.rgb(0.75, 0.82, 0.95), borderWidth: 0.5 });
        page.drawText(`EXPEDIENTE: ${expediente}   |   MATERIA: ${materia}`, { x: L, y, size: 10, font: fontBold, color: BLUE }); y -= lh;
        page.drawText(`JUZGADO: ${juzgado}`, { x: L, y, size: 9, font: fontReg, color: GRAY }); y -= lh;
        page.drawText(`PARTE ACTORA: ${actor.toUpperCase()}`, { x: L, y, size: 9, font: fontReg, color: BLACK }); y -= lh;
        page.drawText(`PARTE CONDENADA EN COSTAS: ${demandado.toUpperCase()}`, { x: L, y, size: 9, font: fontReg, color: BLACK });
        y -= 18; hrule();

        drawLine('FUNDAMENTO LEGAL:', 9, fontBold, BLUE);
        drawLine('Arts. 130-145 Cód. Procesal Civil Puebla / Arts. 1083-1084 Cód. de Comercio. Las costas comprenden', 8, fontItalic, GRAY);
        drawLine('todos los gastos necesarios, útiles o realizados en el procedimiento judicial.', 8, fontItalic, GRAY);
        y -= 4; hrule();

        // Items by section
        const sectionsOrder = ['I. Honorarios', 'II. Viáticos', 'III. Actuarios / Notificaciones', 'IV. Peritajes', 'V. Copias / Trámites', 'VI. Otros Gastos'];
        sectionsOrder.forEach(sec => {
            const secItems = items.filter(i => i.sec === sec);
            if (!secItems.length) return;

            if (y < 90) { drawLine(''); }
            page.drawRectangle({ x: L - 8, y: y - 3, width: R - L + 16, height: 15, color: PDFLib.rgb(0.94, 0.96, 0.99) });
            page.drawText(sec, { x: L, y, size: 9, font: fontBold, color: BLUE });
            const stv = secTotals[sec] || 0;
            page.drawText(fmt(stv), { x: R - 75, y, size: 9, font: fontBold, color: BLUE });
            y -= lh;

            secItems.forEach(item => {
                const d = item.desc.length > 82 ? item.desc.substring(0, 81) + '…' : item.desc;
                page.drawText(`  ${d}`, { x: L, y, size: 8.5, font: fontReg, color: BLACK });
                page.drawText(fmt(item.monto), { x: R - 75, y, size: 8.5, font: fontReg, color: BLACK });
                y -= lh;
                if (y < 65) { drawLine(''); }
            });
            y -= 4;
        });

        hrule(); y -= 4;
        page.drawRectangle({ x: L - 8, y: y - 8, width: R - L + 16, height: 28, color: BLUE });
        page.drawText('TOTAL COSTAS PROCESALES A LIQUIDAR:', { x: L, y: y + 6, size: 11, font: fontBold, color: WHITE });
        page.drawText(fmt(grand), { x: R - 110, y: y + 6, size: 13, font: fontBold, color: PDFLib.rgb(1, 0.9, 0.3) });
        y -= 32;

        y -= 25;
        page.drawText('______________________________', { x: L, y, size: 10, font: fontReg, color: BLACK });
        page.drawText('______________________________', { x: R - 210, y, size: 10, font: fontReg, color: BLACK });
        y -= 12;
        page.drawText('Firma del Abogado', { x: L, y, size: 8, font: fontItalic, color: GRAY });
        page.drawText('Vo.Bo. Autoridad Judicial', { x: R - 210, y, size: 8, font: fontItalic, color: GRAY });

        pdfDoc.getPages().forEach((pg, idx, arr) => {
            pg.drawText(`Pág. ${idx + 1} / ${arr.length}  |  ${firmTitle}  |  Costas Procesales — Exp. ${expediente}`,
                { x: L, y: 16, size: 7, font: fontReg, color: PDFLib.rgb(0.6, 0.6, 0.6) });
        });

        const bytes = await pdfDoc.save();
        const fname = `DictamenCostas_${expediente.replace(/[/\\]/g, '-')}.pdf`;
        if (typeof savePdfToDisk === 'function') await savePdfToDisk(bytes, fname);
        else if (typeof download === 'function') download(bytes, fname, 'application/pdf');
    };

    // ─── INIT ─────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        buildCostasUI();
        setTimeout(() => window.recalcCostas(), 150);
    });

})();
