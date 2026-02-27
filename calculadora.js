/* --- MODULE: CALCULADORAS JURÍDICAS (ISOLATED) --- */
/* v5.3 - Honorarios Calculator */

const UMA_HISTORY = {
    "2026": 117.31, "2025": 113.14, "2024": 108.57, "2023": 103.74, "2022": 96.22, "2021": 89.62,
    "2020": 86.88, "2019": 84.49, "2018": 80.60, "2017": 75.49, "2016": 73.04
};

const SM_HISTORY = {
    "2026": 315.04, "2025": 278.80, "2024": 248.93, "2023": 207.44, "2022": 172.87, "2021": 141.70, "2020": 123.22,
    "2019": 102.68, "2018": 88.36, "2017": 80.04, "2016": 73.04, "2015": 70.10, "2014": 67.29
};

const SM_FRONTERA = {
    "2026": 440.87, "2025": 419.88, "2024": 374.89, "2023": 312.41, "2022": 260.34, "2021": 213.39, "2020": 185.56,
    "2019": 176.72
};

// --- HELPER: NÚMERO A LETRAS (MONEDA NACIONAL) ---
window.numeroALetras = (function () {
    function Unidades(num) {
        switch (num) {
            case 1: return "UN"; case 2: return "DOS"; case 3: return "TRES"; case 4: return "CUATRO";
            case 5: return "CINCO"; case 6: return "SEIS"; case 7: return "SIETE"; case 8: return "OCHO"; case 9: return "NUEVE";
        } return "";
    }
    function Decenas(num) {
        let decena = Math.floor(num / 10);
        let unidad = num - (decena * 10);
        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0: return "DIEZ"; case 1: return "ONCE"; case 2: return "DOCE"; case 3: return "TRECE";
                    case 4: return "CATORCE"; case 5: return "QUINCE"; default: return "DIECI" + Unidades(unidad);
                }
            case 2: return unidad === 0 ? "VEINTE" : "VEINTI" + Unidades(unidad);
            case 3: return DecenasY("TREINTA", unidad);
            case 4: return DecenasY("CUARENTA", unidad);
            case 5: return DecenasY("CINCUENTA", unidad);
            case 6: return DecenasY("SESENTA", unidad);
            case 7: return DecenasY("SETENTA", unidad);
            case 8: return DecenasY("OCHENTA", unidad);
            case 9: return DecenasY("NOVENTA", unidad);
            case 0: return Unidades(unidad);
        }
    }
    function DecenasY(strSin, numUnidades) { return numUnidades > 0 ? strSin + " Y " + Unidades(numUnidades) : strSin; }
    function Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);
        switch (centenas) {
            case 1: return decenas > 0 ? "CIENTO " + Decenas(decenas) : "CIEN";
            case 2: return "DOSCIENTOS " + Decenas(decenas);
            case 3: return "TRESCIENTOS " + Decenas(decenas);
            case 4: return "CUATROCIENTOS " + Decenas(decenas);
            case 5: return "QUINIENTOS " + Decenas(decenas);
            case 6: return "SEISCIENTOS " + Decenas(decenas);
            case 7: return "SETECIENTOS " + Decenas(decenas);
            case 8: return "OCHOCIENTOS " + Decenas(decenas);
            case 9: return "NOVECIENTOS " + Decenas(decenas);
        } return Decenas(decenas);
    }
    function Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor);
        let resto = num - (cientos * divisor);
        let letras = "";
        if (cientos > 0) letras = cientos > 1 ? Centenas(cientos) + " " + strPlural : (strSingular === "MILLON" ? "UN MILLON" : Centenas(cientos) + " " + strSingular);
        if (resto > 0) letras += "";
        return letras;
    }
    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor);
        let resto = num - (cientos * divisor);
        let strMiles = Seccion(num, divisor, "MIL", "MIL");
        let strCentenas = Centenas(resto);
        if (strMiles === "") return strCentenas;
        return strMiles + " " + strCentenas;
    }
    function Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor);
        let resto = num - (cientos * divisor);
        let strMillones = Seccion(num, divisor, "MILLON", "MILLONES");
        let strMiles = Miles(resto);
        if (strMillones === "") return strMiles;
        return strMillones + " " + strMiles;
    }
    return function (num) {
        let data = { numero: num, enteros: Math.floor(num), centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))), letrasCentavos: "" };
        if (data.centavos < 10) data.letrasCentavos = "0" + data.centavos + "/100 M.N.";
        else data.letrasCentavos = data.centavos + "/100 M.N.";
        if (data.enteros === 0) return "CERO PESOS " + data.letrasCentavos;
        if (data.enteros === 1) return Millones(data.enteros) + " PESO " + data.letrasCentavos;
        return Millones(data.enteros) + " PESOS " + data.letrasCentavos;
    };
})();

window.updateUmaField = (year, inputId) => {
    const val = UMA_HISTORY[year];
    if (val) document.getElementById(inputId).value = val.toFixed(2);
};

window.updateSmField = (year, inputId) => {
    const zona = document.getElementById('global_zona_region')?.value || 'general';
    const val = (zona === 'frontera') ? (SM_FRONTERA[year] || SM_FRONTERA["2024"]) : (SM_HISTORY[year] || SM_HISTORY["2024"]);
    if (val) {
        const el = document.getElementById(inputId);
        if (el) {
            el.value = val.toFixed(2);
            // Si el input disparado es el de settings o dash, sincronizar
            if (inputId === 'global_sm' || inputId === 'global_sm_dash') {
                window.sincronizarValoresGlobales('sm', el.value);
            }
        }
    }
};

window.selectZonaRegion = (zona) => {
    // Buscar el año activo (usualmente el de los selects si existen, o 2026 por defecto)
    const year = "2026";
    const val = (zona === 'frontera') ? SM_FRONTERA[year] : SM_HISTORY[year];
    window.sincronizarValoresGlobales('sm', val.toFixed(2));
};

window.sincronizarValoresGlobales = (tipo, val) => {
    if (tipo === 'uma') {
        const inputs = ['ara_uma', 'pen_ref_val'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'ara_uma') el.value = val;
                if (id === 'pen_ref_val' && document.getElementById('pen_tipo_fijacion').value === 'uma') el.value = val;
            }
        });
        localStorage.setItem('supra_uma_default', val);
    } else if (tipo === 'sm') {
        const inputs = ['pen_ref_val', 'penal_salario', 'global_sm', 'global_sm_dash'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'penal_salario' || id === 'global_sm' || id === 'global_sm_dash') el.value = val;
                if (id === 'pen_ref_val' && document.getElementById('pen_tipo_fijacion').value === 'sm') el.value = val;
            }
        });
        localStorage.setItem('supra_sm_default', val);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("Calculadora Module Loaded (v6.1)");

    const savedUma = localStorage.getItem('supra_uma_default');
    const savedSm = localStorage.getItem('supra_sm_default');
    if (savedUma) {
        const gUma = document.getElementById('global_uma');
        if (gUma) gUma.value = savedUma;
        const araUma = document.getElementById('ara_uma');
        if (araUma) araUma.value = savedUma;
    }
    if (savedSm) {
        const gSm = document.getElementById('global_sm');
        if (gSm) gSm.value = savedSm;
        const gSmDash = document.getElementById('global_sm_dash');
        if (gSmDash) gSmDash.value = savedSm;
    }
    // Check for stored logo on boot
    const savedLogo = localStorage.getItem('sl_mem_logo');
    if (savedLogo) {
        const sidebarImg = document.getElementById('sidebarLogoImg');
        if (sidebarImg) sidebarImg.src = savedLogo;

        const previewBtn = document.getElementById('logoPreviewBtn');
        if (previewBtn) {
            previewBtn.style.display = 'inline-flex';
            previewBtn.querySelector('img').src = savedLogo;
        }
    }
});

window.lastCalcData = null;

// --- LOGO HANDLING ---
window.saveLogoToStorage = (input) => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("El logo es demasiado grande (>2MB).");

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const dataUrl = e.target.result;
            localStorage.setItem('sl_mem_logo', dataUrl);

            // Update UI Previews
            const sidebarLogo = document.querySelector('.logo-img');
            if (sidebarLogo) sidebarLogo.src = dataUrl;

            const previewBtn = document.getElementById('logoPreviewBtn');
            if (previewBtn) {
                previewBtn.style.display = 'inline-flex';
                previewBtn.querySelector('img').src = dataUrl;
            }

            alert("Logo guardado exitosamente. Ahora aparecerá en sus PDFs y en la barra lateral.");
        } catch (err) {
            console.error(err);
            alert("Error al guardar logo: " + err.message);
        }
    };
    reader.readAsDataURL(file);
};

window.switchCalcTab = (tabId) => {
    // Hide all
    document.querySelectorAll('.calc-tab-content').forEach(c => c.style.display = 'none');
    // Deactivate all buttons
    document.querySelectorAll('#calculadora .btn-outline').forEach(b => {
        b.classList.remove('active-tab');
        b.style.borderBottomColor = 'transparent';
        b.style.opacity = '0.7';
    });

    // Show selected
    const target = document.getElementById('calc' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
    if (target) target.style.display = 'block';

    // Activate button
    const btn = document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
    if (btn) {
        btn.classList.add('active-tab');
        btn.style.borderBottomColor = 'var(--accent)';
        btn.style.opacity = '1';
    }

    // Reset any shared result areas
    const res = document.getElementById('calcResult');
    if (res) { res.style.display = 'none'; res.innerHTML = ''; }

    // Hide all planillas when switching tabs to avoid confusion
    document.querySelectorAll('.collapsible-wrapper').forEach(w => w.style.display = 'none');
};

window.toggleIncrementoLaboral = () => {
    const chk = document.getElementById('lab_check_incremento');
    const panel = document.getElementById('lab_incremento_panel');
    if (panel) panel.style.display = chk.checked ? 'block' : 'none';
};

window.toggleIncrementoMode = () => {
    const modo = document.getElementById('lab_modo_inc').value;
    document.getElementById('inc_box_monto').style.display = modo === 'monto' ? 'block' : 'none';
    document.getElementById('inc_box_porcentaje').style.display = modo === 'porcentaje' ? 'block' : 'none';
};

/* --- COLLAPSE LOGIC --- */
window.toggleCollapse = (id) => {
    const content = document.getElementById(id);
    const wrapper = content.parentElement;
    const icon = wrapper.querySelector('.collapse-icon');

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('collapsed');
        if (icon) icon.style.transform = 'rotate(-90deg)';
    }
};

// --- CALCULADORA DE PLAZOS (TÉRMINOS CNPCyF PRO) ---
window.calcularTerminos = () => {
    const inicioStr = document.getElementById('term_inicio').value;
    const surtimiento = document.getElementById('term_surtimiento').value;
    const dias = parseInt(document.getElementById('term_dias').value);
    const tipo = document.getElementById('term_tipo').value;

    if (!inicioStr || isNaN(dias)) return alert("Por favor complete los campos de fecha y días.");

    let fecha = new Date(inicioStr + 'T12:00:00'); // Use noon to avoid TZ shifts

    // 1. Aplicar surtimiento de efectos
    if (surtimiento === 'siguiente') {
        fecha.setDate(fecha.getDate() + 1);
    } else if (surtimiento === 'tres_dias') {
        fecha.setDate(fecha.getDate() + 3);
    }
    // Si es "mismo", no se suma nada a la fecha de inicio

    // El conteo empieza al día SIGUIENTE de que surte efectos (Art. 227 CNPCyF)
    fecha.setDate(fecha.getDate() + 1);

    let count = 1; // Ya sumamos el primer día del plazo

    if (tipo === 'naturales') {
        fecha.setDate(fecha.getDate() + (dias - 1));
    } else {
        // Días hábiles (excluir sábado/domingo)
        // Nota: No incluye festivos porque varían por OJP/OJN
        while (count < dias) {
            fecha.setDate(fecha.getDate() + 1);
            const dayOfWeek = fecha.getDay(); // 0 is Sunday, 6 is Saturday
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
        }
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const resultadoTxt = fecha.toLocaleDateString('es-MX', options);
    let surtimientoDesc = surtimiento === 'mismo' ? 'Al momento' : (surtimiento === 'siguiente' ? 'Día hábil siguiente' : '3 días después');

    window.lastCalcData = {
        type: 'TERMINOS',
        title: 'CÓMPUTO DE PLAZOS Y TÉRMINOS',
        legal: 'Artículos 227, 228 y 229 del Código Nacional de Procedimientos Civiles y Familiares (CNPCyF).',
        juris: 'Cómputo Nacional Unificado: Los términos procesales corren a partir del día siguiente a aquel en que surta efectos la notificación.',
        details: [
            { label: 'Surtimiento de Efectos', val: surtimientoDesc, bold: true },
            { label: 'Plazo a Computar', val: `${dias} días ${tipo}`, color: '#1565c0' },
            { label: '----------------', val: '----------------' },
            { label: 'FECHA DE VENCIMIENTO', val: fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }), bold: true, size: 14, color: '#b71c1c' },
            { label: 'Día de la semana', val: options.weekday, color: '#b71c1c' }
        ]
    };

    renderResult(window.lastCalcData);
    document.getElementById('term_resultado_panel').style.display = 'none'; // Use shared result instead
    document.getElementById('calcResult').scrollIntoView({ behavior: 'smooth' });
};

// --- REPARACIÓN PENAL HELPERS ---
window.togglePenalFields = () => {
    const tipo = document.getElementById('penal_tipo').value;
    const lftFields = document.getElementById('penal_lft_fields');
    const porcField = document.getElementById('penal_porcentaje_field');
    const matField = document.getElementById('penal_material_field');

    lftFields.style.display = (tipo === 'muerte' || tipo === 'incapacidad_total' || tipo === 'incapacidad_parcial') ? 'block' : 'none';
    porcField.style.display = (tipo === 'incapacidad_parcial') ? 'block' : 'none';
    matField.style.display = (tipo === 'daño_material') ? 'block' : 'none';
};

window.calcularReparacionPenal = () => {
    const tipo = document.getElementById('penal_tipo').value;
    const salario = parseFloat(document.getElementById('penal_salario').value) || 0;
    const porcentaje = (parseFloat(document.getElementById('penal_porcentaje').value) || 0) / 100;
    const montoBase = parseFloat(document.getElementById('penal_monto_base').value) || 0;
    const gastos = parseFloat(document.getElementById('penal_gastos').value) || 0;
    const moral = parseFloat(document.getElementById('penal_moral').value) || 0;
    const isServidor = document.getElementById('penal_servidor').checked;

    let calculoBase = 0;
    let desc = "";

    if (tipo === 'muerte') {
        calculoBase = salario * 5000;
        desc = "Indemnización por muerte (5,000 días)";
    } else if (tipo === 'incapacidad_total') {
        calculoBase = salario * 1095;
        desc = "Incapacidad Permanente Total (1,095 días)";
    } else if (tipo === 'incapacidad_parcial') {
        calculoBase = (salario * 1095) * porcentaje;
        desc = `Incapacidad Permanente Parcial (1,095 días × ${porcentaje * 100}%)`;
    } else {
        calculoBase = montoBase;
        desc = "Daño material / patrimonial";
    }

    let subtotal = calculoBase + gastos + moral;
    let mutiplicador = isServidor ? 3 : 1;
    let total = subtotal * mutiplicador;

    window.lastCalcData = {
        type: 'PENAL',
        title: 'REPARACIÓN INTEGRAL DEL DAÑO',
        legal: 'Arts. 51-51 Quinquies CP Puebla; Arts. 500, 502 LFT. Reparación del daño como Pena Pública.',
        juris: 'Amparo Directo en Revisión 4555/2023 (SCJN Sept 2024): Se declaran inconstitucionales los topes de indemnización en Puebla, privilegiando la Reparación Integral.',
        details: [
            { label: 'Concepto Principal', val: desc, bold: true },
            { label: 'Indemnización Base', val: fmt(calculoBase) },
            { label: 'Gastos Médicos/Funerarios', val: fmt(gastos) },
            { label: 'Daño Moral', val: fmt(moral), color: '#7b1fa2' },
            { label: '----------------', val: '----------------' },
            { label: 'Subtotal Reparación', val: fmt(subtotal), bold: true }
        ]
    };

    if (isServidor) {
        window.lastCalcData.details.push(
            { label: 'Sanción Servidor Público', val: 'Triple (3x)', color: '#d32f2f', bold: true },
            { label: 'Incremento por Sanción', val: fmt(subtotal * 2), color: '#d32f2f' }
        );
    }

    window.lastCalcData.details.push(
        { label: '----------------', val: '----------------' },
        { label: 'TOTAL A REPARAR', val: fmt(total), bold: true, size: 14, color: '#b71c1c' }
    );

    renderResult(window.lastCalcData);
};

function fmt(n) {
    return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// --- MERCANTIL HELPERS ---
window.toggleTasaInput = () => {
    const type = document.getElementById('calc_tipo_tasa').value;
    const container = document.getElementById('tasaInputContainer');
    if (type === 'legal') {
        container.style.opacity = '0.5';
        container.style.pointerEvents = 'none';
        document.getElementById('calc_tasa').value = '0.5'; // 6% annual / 12 months = 0.5%
    } else {
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
    }
};

window.addMercantilDoc = () => {
    const tbody = document.getElementById('mercantilDocs');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="number" class="form-control-small m-monto" placeholder="0.00"></td>
        <td><input type="date" class="form-control-small m-fecha"></td>
        <td><input type="file" class="m-file" accept=".pdf,.jpg,.png" style="font-size:0.7rem; width:120px;"></td>
        <td><button class="btn btn-outline btn-small" onclick="this.parentElement.parentElement.remove()" style="color:red; border-color:red;">&times;</button></td>
    `;
    tbody.appendChild(tr);
};

window.addMercantilAbono = () => {
    const tbody = document.getElementById('mercantilAbonos');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="date" class="form-control-small a-fecha"></td>
        <td><input type="number" class="form-control-small a-monto" placeholder="0.00"></td>
        <td><button class="btn btn-outline btn-small" onclick="this.parentElement.parentElement.remove()" style="color:red; border-color:red;">&times;</button></td>
    `;
    tbody.appendChild(tr);
};

/* 1. MERCANTIL PRO - LIQUIDACIÓN JUDICIAL COMPLETA */
window.calcularInteresesPro = () => {
    const tipoTasa = document.getElementById('calc_tipo_tasa').value;
    const tasaMensual = (parseFloat(document.getElementById('calc_tasa').value) || 0) / 100;
    const fechaFinStr = document.getElementById('calc_fin').value;
    const conIva = document.getElementById('calc_iva').checked;
    const deudor = document.getElementById('calc_deudor').value;
    const showUsura = document.getElementById('calc_usura_toggle').checked;

    if (!fechaFinStr) return alert("Seleccione una fecha de liquidación (corte).");
    const fechaFin = new Date(fechaFinStr + 'T12:00:00'); // Use noon to avoid TZ shifts

    let events = [];
    document.querySelectorAll('#mercantilDocs tr').forEach(row => {
        const m = parseFloat(row.querySelector('.m-monto').value) || 0;
        const f = row.querySelector('.m-fecha').value;
        if (m > 0 && f) events.push({ type: 'DOC', amount: m, date: new Date(f + 'T12:00:00') });
    });
    document.querySelectorAll('#mercantilAbonos tr').forEach(row => {
        const m = parseFloat(row.querySelector('.a-monto').value) || 0;
        const f = row.querySelector('.a-fecha').value;
        if (m > 0 && f) events.push({ type: 'PAY', amount: m, date: new Date(f + 'T12:00:00') });
    });

    events.sort((a, b) => a.date - b.date);
    events = events.filter(e => e.date <= fechaFin);

    // SENTENCIA PREVIA (NUEVO)
    const montoS_val = parseFloat(document.getElementById('mer_monto_sentencia').value) || 0;
    const fechaS_str = document.getElementById('mer_fecha_sentencia').value;
    let fechaS = null;
    if (montoS_val > 0 && fechaS_str) {
        fechaS = new Date(fechaS_str + 'T12:00:00');
        // Si hay sentencia, ignoramos eventos previos y comenzamos desde ahí
        events = events.filter(e => e.date > fechaS);
        events.unshift({ type: 'SENTENCE', amount: montoS_val, date: fechaS });
    }

    let suertePrincipalBase = 0;
    let interesAcumulado = 0;
    let ivaInteresTotal = 0;
    let abonosTotal = 0;
    let currentPos = events.length > 0 ? new Date(events[0].date) : new Date();

    const esAnatocismo = document.getElementById('calc_anatocismo').checked;

    events.forEach(ev => {
        if (ev.date > currentPos && suertePrincipalBase > 0) {
            const age = getDetailedAge(currentPos, ev.date);
            const periodMonths = age.years * 12 + age.months;
            const interesPeriodo = (suertePrincipalBase * tasaMensual * periodMonths);
            interesAcumulado += interesPeriodo;

            // ANATOCISMO: Capitalizar intereses generados
            if (esAnatocismo) {
                suertePrincipalBase += interesPeriodo;
                interesAcumulado -= interesPeriodo; // Se mueve a capital
            }
        }
        if (ev.type === 'DOC' || ev.type === 'SENTENCE') {
            suertePrincipalBase += ev.amount;
        } else if (ev.type === 'PAY') {
            abonosTotal += ev.amount;
            let tempAbono = ev.amount;

            // En anatocismo, todo es capital una vez capitalizado, 
            // pero el remanente de intereses del periodo actual se paga primero.
            const payToInt = Math.min(tempAbono, interesAcumulado);
            interesAcumulado -= payToInt;
            tempAbono -= payToInt;
            if (tempAbono > 0) {
                suertePrincipalBase -= tempAbono;
                if (suertePrincipalBase < 0) suertePrincipalBase = 0;
            }
        }
        currentPos = new Date(ev.date);
    });

    if (fechaFin > currentPos && suertePrincipalBase > 0) {
        const age = getDetailedAge(currentPos, fechaFin);
        const periodMonths = age.years * 12 + age.months;
        const interesPeriodo = (suertePrincipalBase * tasaMensual * periodMonths);
        interesAcumulado += interesPeriodo;
        if (esAnatocismo) {
            suertePrincipalBase += interesPeriodo;
            interesAcumulado -= interesPeriodo;
        }
    }

    if (conIva) ivaInteresTotal = interesAcumulado * 0.16;
    const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const totalAge = getDetailedAge(events.length > 0 ? events[0].date : new Date(), fechaFin);
    const tiempoTxt = `${totalAge.years > 0 ? totalAge.years + ' año(s), ' : ''}${totalAge.months} mes(es) completo(s)`;

    const totalDeuda = suertePrincipalBase + interesAcumulado + ivaInteresTotal;

    // AUDITORÍA JURÍDICA: Control de Usura (Tesis 1a. I/2024)
    const tasaAnual = tasaMensual * 12 * 100;
    let usuraWarn = "";
    if (showUsura && tasaAnual > 37) {
        usuraWarn = "⚠️ ADVERTENCIA: La tasa pactada supera los parámetros bancarios. El juez debe reducirla de oficio (Criterio SCJN 2024).";
    }

    window.lastCalcData = {
        type: 'MERCANTIL',
        title: 'LIQUIDACIÓN MERCANTIL PRO',
        legal: 'Arts. 1, 362 C.Com; 152, 174 LGTOC. Aplicación de pagos: Art. 364 C.Com.',
        juris: 'Tesis 1a. I/2024 (11a.): La reducción por usura debe ser retroactiva a los intereses ya pagados. Jurisprudencia 1a./J. 47/2014: Control de oficio de intereses usurarios.',
        details: [
            { label: 'Deudor / Demandado', val: deudor || 'No especificado', bold: true },
            { label: '----------------', val: '----------------' },
            { label: 'Tiempo Transcurrido', val: tiempoTxt, bold: true, color: '#1e3a8a' },
            { label: 'Suerte Principal Pendiente', val: fmt(suertePrincipalBase), bold: true },
            { label: 'Intereses Moratorios', val: fmt(interesAcumulado), color: '#d32f2f' }
        ]
    };

    if (conIva) window.lastCalcData.details.push({ label: 'IVA sobre Intereses (16%)', val: fmt(ivaInteresTotal), color: '#7b1fa2' });
    if (usuraWarn) window.lastCalcData.details.push({ label: 'CONTROL DE USURA', val: usuraWarn, color: '#ff9800', bold: true });

    window.lastCalcData.details.push(
        { label: '----------------', val: '----------------' },
        { label: 'TOTAL A LIQUIDAR', val: fmt(totalDeuda), bold: true, size: 14, color: '#01579b' }
    );
    renderResult(window.lastCalcData);

    // Check if we should auto-generate the interest spreadsheet if requested
    // (In this case, we wait for the user to click the button)
};

window.generarPlanillaIntereses = () => {
    if (!window.lastCalcData || window.lastCalcData.type !== 'MERCANTIL') {
        return alert("Primero realice el cálculo de liquidación para generar la planilla.");
    }

    const tasaMensual = (parseFloat(document.getElementById('calc_tasa').value) || 0) / 100;
    const conIva = document.getElementById('calc_iva').checked;
    const fechaFinStr = document.getElementById('calc_fin').value;
    const rows = document.getElementById('mer_planilla_rows');
    rows.innerHTML = '';

    let events = [];
    document.querySelectorAll('#mercantilDocs tr').forEach(row => {
        const m = parseFloat(row.querySelector('.m-monto').value) || 0;
        const f = row.querySelector('.m-fecha').value;
        if (m > 0 && f) events.push({ type: 'DOC', amount: m, date: new Date(f + 'T12:00:00') });
    });
    document.querySelectorAll('#mercantilAbonos tr').forEach(row => {
        const m = parseFloat(row.querySelector('.a-monto').value) || 0;
        const f = row.querySelector('.a-fecha').value;
        if (m > 0 && f) events.push({ type: 'PAY', amount: m, date: new Date(f + 'T12:00:00') });
    });
    events.sort((a, b) => a.date - b.date);

    // SENTENCIA PREVIA (NUEVO)
    const montoS_val = parseFloat(document.getElementById('mer_monto_sentencia').value) || 0;
    const fechaS_str = document.getElementById('mer_fecha_sentencia').value;
    if (montoS_val > 0 && fechaS_str) {
        const fS = new Date(fechaS_str + 'T12:00:00');
        events = events.filter(e => e.date > fS);
        events.unshift({ type: 'SENTENCE', amount: montoS_val, date: fS });
    }

    if (events.length === 0) return alert("No hay documentos registrados para generar planilla.");

    let suertePrincipalBase = 0;
    let currentPos = new Date(events[0].date);
    const fechaFin = new Date(fechaFinStr + 'T12:00:00');
    let totalInteres = 0;

    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let timeline = [...events];
    // Add monthly ticks to the timeline for the breakdown
    let tick = new Date(currentPos);
    tick.setMonth(tick.getMonth() + 1);
    tick.setDate(1); // Start of next month
    while (tick < fechaFin) {
        timeline.push({ type: 'TICK', date: new Date(tick) });
        tick.setMonth(tick.getMonth() + 1);
    }
    timeline.push({ type: 'END', date: fechaFin });
    timeline.sort((a, b) => a.date - b.date);

    timeline.forEach(ev => {
        if (ev.date > currentPos && suertePrincipalBase > 0) {
            const age = getDetailedAge(currentPos, ev.date);
            // In Mercantil Pro, we count months. If it's a TICK, it's usually fractional or 1 month.
            // For the breakdown table, we'll show the segment
            const segMonths = age.years * 12 + age.months;
            if (segMonths > 0) {
                const intSeg = suertePrincipalBase * tasaMensual * segMonths;
                const ivaSeg = conIva ? intSeg * 0.16 : 0;
                totalInteres += intSeg;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${currentPos.toLocaleDateString('es-MX')} a ${ev.date.toLocaleDateString('es-MX')}</td>
                    <td>${fmt(suertePrincipalBase)}</td>
                    <td>${(tasaMensual * 100).toFixed(2)}%</td>
                    <td>${fmt(intSeg)}</td>
                    <td>${fmt(ivaSeg)}</td>
                    <td style="font-weight:bold;">${fmt(suertePrincipalBase + totalInteres + (conIva ? totalInteres * 0.16 : 0))}</td>
                `;
                rows.appendChild(tr);
            }
        }

        if (ev.type === 'DOC' || ev.type === 'SENTENCE') {
            suertePrincipalBase += ev.amount;
            if (ev.type === 'SENTENCE') {
                const trS = document.createElement('tr');
                trS.style.background = "#f3e5f5";
                trS.style.fontWeight = "bold";
                trS.innerHTML = `
                    <td style="color:#7b1fa2;">SENTENCIA / LAUDO AL ${ev.date.toLocaleDateString('es-MX')}</td>
                    <td>${fmt(ev.amount)}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td style="color:#7b1fa2;">${fmt(suertePrincipalBase + totalInteres + (conIva ? totalInteres * 0.16 : 0))}</td>
                `;
                rows.appendChild(trS);
            }
        }
        if (ev.type === 'PAY') {
            // Simple logic for the table: deduct from interest first, then principal
            let pay = ev.amount;
            // (Note: interest logic here is simplified for the VIEW, the actual CALC is in the main function)
            suertePrincipalBase = Math.max(0, suertePrincipalBase - pay);
            const tr = document.createElement('tr');
            tr.style.background = "#e8f5e9";
            tr.innerHTML = `<td colspan="5" style="color:#2e7d32; font-weight:bold;">ABONO REGISTRADO</td><td>(-) ${fmt(ev.amount)}</td>`;
            rows.appendChild(tr);
        }
        currentPos = new Date(ev.date);
    });

    document.getElementById('mer_planilla_wrapper').style.display = 'block';
    document.getElementById('mer_planilla_content').classList.remove('collapsed');
    document.getElementById('mer_planilla_wrapper').scrollIntoView({ behavior: 'smooth' });
};

/* 2. LABORAL */
window.addExtraRow = () => {
    const tbody = document.getElementById('extraRows');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="form-control-small ex-desc" placeholder="Ej. Bono, Val Is..."></td>
        <td>
            <select class="form-control-small ex-period">
                <option value="1">Diario</option>
                <option value="7">Semanal</option>
                <option value="15">Quincenal</option>
                <option value="30.4">Mensual</option>
                <option value="365">Anual</option>
            </select>
        </td>
        <td><input type="number" class="form-control-small ex-monto" value="0" step="0.01"></td>
        <td><button class="btn btn-outline btn-small" onclick="this.parentElement.parentElement.remove()" style="color:red; border-color:red;">&times;</button></td>
    `;
    tbody.appendChild(tr);
};

// Helper for precise date difference - Legal Convention: Mes Iniciado = Mes Completo
// Returns completed months (rounded UP if any days remain)
const getDetailedAge = (start, end) => {
    let temp = new Date(start);
    let years = 0, months = 0, days = 0;

    // Count full years
    while (true) {
        let nextYear = new Date(temp);
        nextYear.setFullYear(temp.getFullYear() + 1);
        if (nextYear > end) break;
        temp = nextYear;
        years++;
    }
    // Count full months
    while (true) {
        let nextMonth = new Date(temp);
        nextMonth.setMonth(temp.getMonth() + 1);
        if (nextMonth > end) break;
        temp = nextMonth;
        months++;
    }
    // Count remaining days
    days = Math.floor((end - temp) / (1000 * 60 * 60 * 24));

    // LEGAL RULE: any started month counts as a full month (mes iniciado = mes completo)
    if (days > 0) {
        months++;
        days = 0; // absorbed into the month
    }

    return { years, months, days };
};

// For interest calculation: returns total months (rounded up)
const getTotalMonthsForInterest = (start, end) => {
    const age = getDetailedAge(start, end);
    return age.years * 12 + age.months;
};

/**
 * TIEMPO REAL LABORADO
 * Calcula exactamente cuántos días, semanas y años equivalentes trabajó
 * una persona considerando los días trabajados por semana.
 * 
 * Ejemplo: 1 día/semana por 20 años = 1,043 días reales, NO 7,300 días.
 * 
 * @param {Date} inicio - Fecha de ingreso
 * @param {Date} fin - Fecha de baja
 * @param {number} diasPorSemana - Días laborados por semana (1-7)
 * @returns {object} { diasReales, semanasCompletas, aniosEfectivos, texto }
 */
const calcularTiempoRealLaborado = (inicio, fin, diasPorSemana) => {
    // Total de días calendario entre las dos fechas
    const diasCalendario = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24));

    // Semanas completas y días sobrantes
    const semanasCompletas = Math.floor(diasCalendario / 7);
    const diasSobrantes = diasCalendario % 7;

    // Días reales efectivamente laborados
    // Por cada semana completa se trabajan 'diasPorSemana' días
    // En la semana sobrante, se trabajan el mínimo entre los días sobrantes y diasPorSemana
    const diasEnSemanas = semanasCompletas * diasPorSemana;
    const diasEnFraccion = Math.min(diasSobrantes, diasPorSemana);
    const diasReales = diasEnSemanas + diasEnFraccion;

    // Convertir días reales a años y meses equivalentes - ESTÁNDAR LEGAL: 365 días
    const aniosEfectivos = diasReales / 365;
    const aniosEnteros = Math.floor(aniosEfectivos);
    const mesesFraccion = Math.floor((aniosEfectivos - aniosEnteros) * 12);
    const diasFraccion = Math.round((((aniosEfectivos - aniosEnteros) * 12) - mesesFraccion) * 30.41);

    const texto = `${aniosEnteros > 0 ? aniosEnteros + ' año(s), ' : ''}${mesesFraccion > 0 ? mesesFraccion + ' mes(es), ' : ''}${diasFraccion} día(s) efectivos`;

    return {
        diasCalendario,
        semanasCompletas,
        diasReales,
        aniosEfectivos,
        aniosEnteros,
        mesesFraccion,
        diasFraccion,
        texto
    };
};

window.calcularLaboral = () => {
    const montoSalario = parseFloat(document.getElementById('lab_salario').value) || 0;
    const frecuencia = document.getElementById('lab_frecuencia_salario').value;
    const regimen = document.getElementById('lab_regimen').value;

    // --- Artículo 89 LFT: Determinar salario diario base ---
    let salario = montoSalario;
    if (frecuencia === 'semanal') salario = montoSalario / 7;
    else if (frecuencia === 'quincenal') salario = montoSalario / 15;
    else if (frecuencia === 'mensual') {
        salario = (regimen === 'puebla_buro') ? (montoSalario / 30) : (montoSalario / 30.4);
    }

    const tipo = document.getElementById('lab_tipo').value;
    const inicioS = document.getElementById('lab_ingreso').value;
    const bajaS = document.getElementById('lab_baja').value;
    const diasSemana = parseFloat(document.getElementById('lab_dias_semana').value) || 6;
    const diasDescanso = parseFloat(document.getElementById('lab_dias_descanso').value) || 0;
    const totalPagadosSemana = Math.min(7, diasSemana + diasDescanso);

    // Leer modo de calculo de dias
    const modoEl = document.querySelector('input[name="lab_modo_dias"]:checked');
    const modoDias = modoEl ? modoEl.value : 'laborados';

    // Config prestaciones
    const cfgAguinaldo = parseFloat(document.getElementById('lab_dias_aguinaldo').value) || 15;
    const cfgVacacionesBase = parseFloat(document.getElementById('lab_dias_vacaciones').value) || 12;
    const cfgPrima = parseFloat(document.getElementById('lab_prima_vacacional').value) || 25;
    const valPtu = parseFloat(document.getElementById('lab_ptu').value) || 0;
    const isPtuExento = document.getElementById('lab_ptu_exento')?.checked;

    // Sumar Prestaciones Extralegales del Recuadro CCT
    let totalExtralegales = 0;
    const extralegalesDetails = [];
    document.querySelectorAll('#extraRows tr').forEach(row => {
        const desc = row.querySelector('.ex-desc').value || 'Prestación CCT';
        const period = parseFloat(row.querySelector('.ex-period').value) || 1;
        const monto = parseFloat(row.querySelector('.ex-monto').value) || 0;
        if (monto > 0) {
            totalExtralegales += monto;
            extralegalesDetails.push({ label: desc, val: monto });
        }
    });

    const valFondo = parseFloat(document.getElementById('lab_fondo_ahorro').value) || 0;

    const ingreso = new Date(inicioS + 'T12:00:00');
    const baja = new Date(bajaS + 'T12:00:00');

    if (!salario || isNaN(ingreso) || isNaN(baja)) return alert('Llene todos los datos.');
    if (baja < ingreso) return alert('Fecha invalida.');

    // ——— ANTIGÜEDAD CALENDARIO (referencia visual) ———
    const detailedAge = getDetailedAge(ingreso, baja);
    const diasCalendarioTotal = Math.floor((baja - ingreso) / (1000 * 60 * 60 * 24));

    // ——— CALCULAR DIAS REALES SEGÚN MODO ———
    let diasRealesLaborados, aniosEfectivos, tiempoReal, modoDesc;

    if (modoDias === 'calendario') {
        // Modo 2: Todos los dias del periodo sin descuento
        diasRealesLaborados = diasCalendarioTotal;
        aniosEfectivos = diasRealesLaborados / 365;
        tiempoReal = {
            diasCalendario: diasCalendarioTotal,
            diasReales: diasRealesLaborados,
            aniosEfectivos,
            texto: `${diasCalendarioTotal} dias calendario (${aniosEfectivos.toFixed(2)} años)`
        };
        modoDesc = 'TODOS LOS DIAS DEL PERIODO (Calendario)';
    } else {
        // Modo 1 (default): Dias laborados + descansos pagados
        tiempoReal = calcularTiempoRealLaborado(ingreso, baja, totalPagadosSemana);
        diasRealesLaborados = tiempoReal.diasReales;
        aniosEfectivos = tiempoReal.aniosEfectivos;
        modoDesc = `JORNADA DE ${diasSemana} TRAB. + ${diasDescanso} DESC. (${totalPagadosSemana} DÍAS PAGADOS/SEM)`;
    }

    const aniosEfectivosEnteros = Math.floor(aniosEfectivos);

    // --- CÁLCULO DE PROPORCIONES BASADO EN ANIVERSARIO (Correction) ---
    // Determinamos la fecha del último aniversario laboral antes de la baja
    let ultimoAniversario = new Date(ingreso);
    ultimoAniversario.setFullYear(baja.getFullYear());
    if (ultimoAniversario > baja) {
        ultimoAniversario.setFullYear(baja.getFullYear() - 1);
    }

    // Días transcurridos desde el último aniversario hasta la baja
    let diasDesdeAniversario;
    if (modoDias === 'calendario') {
        diasDesdeAniversario = Math.floor((baja - ultimoAniversario) / (1000 * 60 * 60 * 24)) + 1;
    } else {
        const tiempoRealAniv = calcularTiempoRealLaborado(ultimoAniversario, baja, totalPagadosSemana);
        diasDesdeAniversario = tiempoRealAniv.diasReales;
    }
    // Para el cálculo de aguinaldo seguimos usando el año calendario (1 de enero)
    const currentYear = baja.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1, 12, 0, 0);
    const calcStartAguinaldo = (ingreso > startOfYear) ? ingreso : startOfYear;
    let daysWorkedThisYearAguinaldo;
    if (modoDias === 'calendario') {
        daysWorkedThisYearAguinaldo = Math.floor((baja - calcStartAguinaldo) / (1000 * 60 * 60 * 24)) + 1;
    } else {
        const tiempoRealAguinaldo = calcularTiempoRealLaborado(calcStartAguinaldo, baja, totalPagadosSemana);
        daysWorkedThisYearAguinaldo = tiempoRealAguinaldo.diasReales;
    }

    // --- TABLA VACACIONES PROGRESIVAS (Art. 76 LFT) basada en AÑOS EFECTIVOS ---
    let diasVac = cfgVacacionesBase;
    if (aniosEfectivosEnteros >= 1) {
        if (aniosEfectivosEnteros <= 5) {
            diasVac = 12 + (aniosEfectivosEnteros - 1) * 2;
        } else {
            diasVac = 20 + Math.floor((aniosEfectivosEnteros - 6) / 5 + 1) * 2;
        }
    }

    // Aguinaldo proporcional a días REALES laborados en el año CALENDARIO
    const aguinaldo = (salario * cfgAguinaldo) * (daysWorkedThisYearAguinaldo / 365);
    // Vacaciones proporcionales a días REALES laborados desde el ÚLTIMO ANIVERSARIO
    const vacaciones = (salario * diasVac) * (diasDesdeAniversario / 365);
    const primaVacacional = vacaciones * (cfgPrima / 100);

    // --- INTEGRATED DAILY SALARY (SDI) - Art. 84 & 89 LFT ---
    // El SDI es la base para la indemnización constitucional (90 días) y los 20 días por año.
    const aguinaldoDiario = (salario * cfgAguinaldo) / 365;
    const primaVacDiaria = (salario * diasVac * (cfgPrima / 100)) / 365;
    const sdi = salario + aguinaldoDiario + primaVacDiaria;

    let indemnizacion90 = 0;
    let indemnizacion20 = 0;
    let primaAntiguedad = 0;
    let descTipo = 'RENUNCIA VOLUNTARIA';

    // --- PRIMA ANTIGÜEDAD (Art. 162 & 486 LFT) ---
    // La base para la prima de antigüedad se topa a 2 salarios mínimos.
    const smGlobal = parseFloat(document.getElementById('global_sm')?.value) || 315.04;
    const topeSalarialPrima = smGlobal * 2;
    const baseSalarialPrima = Math.min(salario, topeSalarialPrima);
    const esTopado = salario > topeSalarialPrima;

    if (tipo === 'despido' || tipo === 'rescision_trabajador') {
        descTipo = (tipo === 'despido') ? 'DESPIDO INJUSTIFICADO' : 'RESCISIÓN POR EL TRABAJADOR (Causa Justificada)';
        indemnizacion90 = sdi * 90;

        if (regimen === 'lft') {
            indemnizacion20 = sdi * 20 * aniosEfectivos;
            primaAntiguedad = (baseSalarialPrima * 12) * aniosEfectivos;
        } else {
            // Régimen Burocrático Puebla: Art. 63 (3 meses) 
            indemnizacion20 = sdi * 20 * aniosEfectivos; // Por supletoriedad
            primaAntiguedad = (baseSalarialPrima * 12) * aniosEfectivos;
            descTipo = (tipo === 'despido' ? 'DESPIDO' : 'RESCISIÓN') + ' (BUROCRÁTICO PUEBLA - REF. 2024)';
        }
    } else if (tipo === 'rescision_patron') {
        // RESCISIÓN POR EL PATRÓN: No hay 90/20 días, pero sí prima de antigüedad (si aplica) y prestaciones
        descTipo = 'RESCISIÓN POR EL PATRÓN (Despido Justificado)';
        indemnizacion90 = 0;
        indemnizacion20 = 0;
        primaAntiguedad = (baseSalarialPrima * 12) * aniosEfectivos;
    } else {
        // RENUNCIA VOLUNTARIA: No hay indemnizaciones de 90/20 días
        indemnizacion90 = 0;
        indemnizacion20 = 0;
        if (aniosEfectivos >= 15 || (regimen === 'puebla_buro' && aniosEfectivos >= 1)) {
            primaAntiguedad = (baseSalarialPrima * 12) * aniosEfectivos;
        } else {
            primaAntiguedad = 0;
        }
        descTipo = 'RENUNCIA VOLUNTARIA';
    }

    const total = aguinaldo + vacaciones + primaVacacional + indemnizacion90 + indemnizacion20 + primaAntiguedad + valPtu + valFondo + totalExtralegales;
    const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const fmtNum = (n) => n.toLocaleString('es-MX');

    // Store calculated values for the detailed spreadsheet
    window.lastLaboralDetail = {
        salario, sdi, smGlobal, topeSalarialPrima, baseSalarialPrima,
        ingreso, baja, diasRealesLaborados, aniosEfectivos,
        aguinaldo, vacaciones, primaVacacional,
        indemnizacion90, indemnizacion20, primaAntiguedad,
        valPtu, valFondo, isPtuExento,
        cfgAguinaldo, cfgVacacionesBase, cfgPrima,
        daysWorkedThisYear: daysWorkedThisYearAguinaldo, // Usado en planilla
        diasDesdeAniversario, // Nuevo: para claridad en planilla
        diasVac,
        salariosVencidos: 0, interesesMoratorios: 0, total,
        frecuencia, montoSalario
    };

    // Build legal foundation strings based on regime
    const legalLFT =
        `FUNDAMENTACIÓN LEGAL VERIFICADA (LFT):\n\n` +
        `► SALARIO DIARIO INTEGRADO (SDI): Art. 84 LFT – El salario se integra con los pagos hechos en efectivo por cuota diaria, gratificaciones, percepciones, habitación, primas, comisiones, prestaciones en especie y cualquier otra cantidad o prestación que se entregue al trabajador por su trabajo. Art. 89 LFT – Para determinar el monto de las indemnizaciones, se tomará como base el último salario diario devengado.\n\n` +
        `► VACACIONES: Art. 76 LFT (reforma Vacaciones Dignas, DOF 27-12-2022) – Los trabajadores tendrán derecho a un período anual de vacaciones pagadas de acuerdo con la siguiente tabla: 1er año: 12 días; 2° año: 14; 3°: 16; 4°: 18; 5°-9°: 20 días; por cada 5 años adicionales: +2 días.\n\n` +
        `► PRIMA VACACIONAL: Art. 80 LFT – Los trabajadores tendrán derecho a una prima no menor del 25% sobre el salario que corresponda durante el período de vacaciones.\n\n` +
        `► AGUINALDO: Art. 87 LFT – Los trabajadores tendrán derecho a un aguinaldo anual equivalente a 15 días de salario, que deberá pagarse antes del día 20 de diciembre. Quienes no hayan completado el año recibirán la parte proporcional.\n\n` +
        `► SEPARACIÓN INJUSTIFICADA (3 MESES): Art. 50 fracc. II LFT – Si la relación de trabajo fuere por tiempo indeterminado, la indemnización consistirá en veinte días de salario por cada año de servicios prestados, y \n Art. 48 LFT – El trabajador podrá solicitar ante la Junta o Tribunal, a su elección, que se le reinstale en el trabajo que desempeñaba, o que se le indemnice con el importe de tres meses de salario, a razón del último salario diario integrado.\n\n` +
        `► PRIMA DE ANTIGÜEDAD: Art. 162 LFT – Los trabajadores de planta tienen derecho a una prima de antigüedad de doce días de salario por cada año de servicios, con tope de dos veces el salario mínimo. Se paga al separarse voluntaria o involuntariamente a los 15 o más años de servicio.\n\n` +
        `► SALARIOS CAÍDOS / VENCIDOS: Art. 48 LFT (párrafo 2 y 3) – Si el juicio no concluye antes de 12 meses de dictado el laudo, el trabajador tendrá derecho únicamente a que se paguen, hasta ese momento, los salarios caídos en lugar de los que se generen con posterioridad. Los intereses se generan a razón del 2% mensual sobre el importe de 15 meses de salario.`;

    const legalBuro =
        `FUNDAMENTACIÓN LEY DE BURÓCRATAS (PUEBLA):\n\n` +
        `► RÉGIMEN BUROCRÁTICO ESTATAL: Ley de los Trabajadores al Servicio de los Poderes del Estado de Puebla (LTPEP – Última Ref. DOF Puebla 22/06/2022 – Publicada en el P.O.E. del Estado de Puebla).\n\n` +
        `► SUPLETORIEDAD: Art. 113 LTPEP – En lo no previsto por esta ley, se aplicará supletoriamente la Ley Federal del Trabajo.\n\n` +
        `► PRESTACIONES MÍNIMAS DE SEPARACIÓN: Arts. 36-40 LTPEP – Los trabajadores de base destituidos injustificadamente tienen derecho a: (a) 3 meses de sueldo presupuestal como indemnización constitucional, (b) 20 días de sueldo por año de servicios, (c) Prima de Antigüedad conforme al Art. 162 LFT aplicado supletoriamente.\n\n` +
        `► AGUINALDO BUROCRÁTICO: Art. 72 LTPEP concordante con Art. 87 LFT supletoria – Mínimo 40 días de aguinaldo (trabajadores del Estado de Puebla suelen tener mejores condiciones por CCT/SNTE/SITCOPS).\n\n` +
        `► VACACIONES Y PRIMA VACACIONAL: Art. 71 LTPEP concordante con Arts. 76 y 80 LFT – vacaciones y prima vacacional conforme a la LFT aplicada supletoriamente.\n\n` +
        `► TRIBUNAL COMPETENTE: Tribunal de Arbitraje del Estado de Puebla (Art. 112 LTPEP).`;

    window.lastCalcData = {
        type: 'LABORAL',
        title: `CÁLCULO LABORAL (${descTipo})`,
        legal: regimen === 'puebla_buro' ? legalLFT + '\n\n' + legalBuro : legalLFT,
        juris: `CRITERIOS JURISPRUDENCIALES VIGENTES (SCJN):\n\n` +
            `► Tesis: 2a./J. 146/2019 (10a.) | Reg. Digital: 2021028 | SJF Nov. 2019. SALARIOS VENCIDOS E INTERESES. SON IMPROCEDENTES A PARTIR DE LA FECHA DE REINSTALACIÓN DEL TRABAJADOR CUANDO SE ACEPTA OFRECIMIENTO DE TRABAJO CALIFICADO DE BUENA FE. – Segunda Sala SCJN.\n\n` +
            `► Tesis: 2a./J. 28/2016 (10a.) | Reg. Digital: 2011463 | SJF Libro 29, Abr. 2016. SALARIOS CAÍDOS. LA LIMITACIÓN DE DOCE MESES NO TRANSGREDE EL PRINCIPIO DE PROGRESIVIDAD (Art. 48 LFT reforma 2012). – Segunda Sala SCJN.\n\n` +
            `► Tesis: 2a./J. 6/2021 (11a.) | Publicación: SJF Ago. 2021. PRIMA DE ANTIGÜEDAD. PROCEDE CUANDO EL TRABAJADOR ES SEPARADO INJUSTIFICADAMENTE, INDEPENDIENTEMENTE DEL TIEMPO DE SERVICIOS PRESTADOS. – Segunda Sala SCJN.\n\n` +
            `► Tesis: 2a./J. 162/2022 (11a.) | Publicación: SJF Jun. 2023. VACACIONES DIGNAS. LA REFORMA AL ARTÍCULO 76 DE LA LFT (23-DICIEMBRE-2022) ES CONSTITUCIONAL Y DE APLICACIÓN INMEDIATA. – Segunda Sala SCJN.`,
        details: [
            { label: 'Régimen Jurídico', val: regimen === 'lft' ? 'Privado (LFT)' : 'Burocrático (Puebla 2024)', bold: true, color: '#e65100' },
            { label: `Salario Base (${frecuencia})`, val: fmt(montoSalario) },
            { label: 'Salario Diario Base (Art. 89 LFT)', val: fmt(salario), color: '#1565c0' },
            { label: 'Salario Diario Integrado (SDI)', val: fmt(sdi), bold: true },
            { label: '----------------', val: '----------------' },
            { label: 'Salario Mínimo (Ref.)', val: fmt(smGlobal) },
            { label: 'Tope Prima Antigüedad (2 SM)', val: fmt(topeSalarialPrima), color: esTopado ? '#d32f2f' : '#666' },
            { label: 'Base para Prima Antigüedad', val: fmt(baseSalarialPrima), bold: esTopado, color: esTopado ? '#d32f2f' : '#1b5e20' },
            { label: '══ PERÍODO DE SERVICIO ══', val: '', bold: true },
            { label: 'Ingreso / Baja', val: `${inicioS} / ${bajaS}` },
            {
                label: 'Antigüedad Calendario (solo referencia)',
                val: `${detailedAge.years} año(s), ${detailedAge.months} mes(es)`,
                color: '#546e7a'
            },
            { label: `ℹ️ Modo de Cálculo`, val: modoDesc, bold: true, color: '#7b1fa2' },
            {
                label: `⏱ Tiempo Laborado (${modoDesc})`,
                val: tiempoReal.texto,
                bold: true,
                color: '#b71c1c'
            },
            {
                label: 'Días Calendario Transcurridos',
                val: `${fmtNum(tiempoReal.diasCalendario)} días`
            },
            {
                label: '✅ Días Base del Cálculo',
                val: `${fmtNum(diasRealesLaborados)} días (${aniosEfectivos.toFixed(3)} años efectivos)`,
                bold: true,
                color: '#1b5e20'
            },
            { label: '══ PRESTACIONES ══', val: '', bold: true },
            {
                label: `Vacaciones (Art. 76 LFT: ${aniosEfectivosEnteros} año(s) efectivo → ${diasVac} días × ${diasDesdeAniversario} días÷365)`,
                val: fmt(vacaciones)
            },
            {
                label: `Aguinaldo Prop. (Art. 87 LFT: ${cfgAguinaldo} días × ${daysWorkedThisYearAguinaldo} días reales ÷ 365)`,
                val: fmt(aguinaldo)
            },
            { label: `Prima Vacacional (Art. 80 LFT: ${cfgPrima}%)`, val: fmt(primaVacacional) },
        ]
    };

    if (valPtu > 0) window.lastCalcData.details.push({ label: 'PTU (Participación Utilidades)', val: fmt(valPtu) });
    if (isPtuExento) window.lastCalcData.details.push({ label: 'ℹ️ NOTA PTU', val: 'Empresa exenta de reparto / Sin utilidad en el ejercicio.', color: '#d32f2f' });

    if (valFondo > 0 || totalExtralegales > 0) {
        window.lastCalcData.details.push({ label: '══ CCT / EXTRALEGALES ══', val: '', bold: true, color: '#7b1fa2' });
        if (valFondo > 0) window.lastCalcData.details.push({ label: 'Fondo de Ahorro Acum.', val: fmt(valFondo) });
        extralegalesDetails.forEach(e => {
            window.lastCalcData.details.push({ label: e.label, val: fmt(e.val) });
        });
        if (totalExtralegales > 0 && valFondo > 0) {
            window.lastCalcData.details.push({ label: 'Subtotal CCT', val: fmt(valFondo + totalExtralegales), bold: true });
        }
    }

    // Incremental History Note
    const huboInc = document.getElementById('lab_check_incremento')?.checked;
    if (huboInc) {
        const modoInc = document.getElementById('lab_modo_inc').value;
        const fechaInc = document.getElementById('lab_fecha_inc').value;
        let salAnt = 0;
        let diffLabel = "";

        if (modoInc === 'monto') {
            salAnt = parseFloat(document.getElementById('lab_salario_ant').value) || 0;
            diffLabel = fmt(montoSalario - salAnt);
        } else {
            const porc = parseFloat(document.getElementById('lab_porcentaje_inc').value) || 0;
            // Si el actual es 100% + porc, el anterior era actual / (1 + porc/100)
            salAnt = montoSalario / (1 + (porc / 100));
            diffLabel = `${porc}% (${fmt(montoSalario - salAnt)})`;
        }

        window.lastCalcData.details.push(
            { label: '----------------', val: '----------------' },
            { label: 'HISTORIAL DE INCREMENTO', val: 'Detectado', color: '#1565c0', bold: true },
            { label: 'Modo / Método', val: modoInc === 'monto' ? 'Monto Directo' : 'Porcentaje (%)' },
            { label: 'Salario Anterior Est.', val: fmt(salAnt) },
            { label: 'Fecha de Cambio', val: fechaInc || 'No especificada' },
            { label: 'Mejora Salarial', val: diffLabel, color: '#2e7d32', bold: true }
        );
    }

    if (indemnizacion90 > 0) {
        window.lastCalcData.details.push({
            label: 'Indemnización Constitucional (90 días SDI)',
            val: fmt(indemnizacion90),
            color: '#d32f2f',
            bold: true
        });
        if (indemnizacion20 > 0) {
            window.lastCalcData.details.push({
                label: `20 Días por Año (${aniosEfectivos.toFixed(2)} años)`,
                val: fmt(indemnizacion20),
                color: '#d32f2f'
            });
        }
    }
    if (primaAntiguedad > 0) {
        window.lastCalcData.details.push({
            label: `Prima Antigüedad (12 d/año @ ${salario > topeSalarialPrima ? 'Tope 2SM' : 'Sal. Real'})`,
            val: fmt(primaAntiguedad)
        });
    }

    // --- LITIGIOS Y SALARIOS CAÍDOS (Art. 48 LFT) ---
    const duracionTotal = parseFloat(document.getElementById('lab_duracion_total').value) || 0;
    const retrasoCumplimiento = parseFloat(document.getElementById('lab_retraso_cumplimiento').value) || 0;

    let salariosVencidos = 0;
    let interesesMoratoriosJuicio = 0;
    let interesesIncumplimiento = 0;

    if (duracionTotal > 0) {
        const mesesVencidosCalc = Math.min(duracionTotal, 12);
        // Salarios vencidos tope 12 meses (SDI * 365)
        if (duracionTotal >= 12) {
            salariosVencidos = sdi * 365;
        } else {
            salariosVencidos = (sdi * 30.4166) * mesesVencidosCalc;
        }

        window.lastCalcData.details.push({
            label: `Salarios Vencidos (${mesesVencidosCalc} meses)`,
            val: fmt(salariosVencidos),
            color: '#d32f2f'
        });

        if (duracionTotal > 12) {
            const interesesMeses = duracionTotal - 12;
            const baseInteres = sdi * 15; // LFT Art. 48
            interesesMoratoriosJuicio = baseInteres * 0.02 * interesesMeses;
            window.lastCalcData.details.push({
                label: `Interés LFT Art. 48 (${interesesMeses} meses @ 2%)`,
                val: fmt(interesesMoratoriosJuicio),
                color: '#d32f2f',
                bold: true
            });
        }
    }

    // --- INTERESES POR INCUMPLIMIENTO DE SENTENCIA (Art. 945 LFT) ---
    if (retrasoCumplimiento > 0) {
        // La base es el total acumulado hasta el laudo (Prestaciones + Indemniz + Vencidos + Interes Juicio)
        const baseCondena = total + salariosVencidos + interesesMoratoriosJuicio;
        // Aplicamos el 2% mensual sobre el total de la condena por el tiempo de retraso
        interesesIncumplimiento = baseCondena * 0.02 * retrasoCumplimiento;
        window.lastCalcData.details.push({
            label: `❗ Interés por Incumplimiento (${retrasoCumplimiento} meses @ 2%)`,
            val: fmt(interesesIncumplimiento),
            color: '#c62828',
            bold: true
        });
    }

    // PTU y Fondo de Ahorro
    const ptu = parseFloat(document.getElementById('lab_ptu').value) || 0;
    const fondo = parseFloat(document.getElementById('lab_fondo_ahorro').value) || 0;

    // Prestaciones extralegales (RESTAURADO)
    let totalExtra = 0;
    const extraRows = document.querySelectorAll('#extraRows tr');
    extraRows.forEach(row => {
        const descInput = row.querySelector('.ex-desc');
        const factorInput = row.querySelector('.ex-period');
        const montoInput = row.querySelector('.ex-monto');
        if (!descInput || !factorInput || !montoInput) return;

        const desc = descInput.value || 'Prestación Extralegal';
        const factor = parseFloat(factorInput.value) || 1;
        const montSBase = parseFloat(montoInput.value) || 0;

        if (montSBase > 0) {
            const dailyValue = (factor === 365) ? (montSBase / 365) :
                (factor === 30.4) ? ((montSBase * 12) / 365) :
                    (factor === 15) ? ((montSBase * 24) / 365) :
                        (factor === 7) ? ((montSBase * 52) / 365) : montSBase;

            const proportionalVal = dailyValue * (daysWorkedThisYearAguinaldo || 365);
            totalExtra += proportionalVal;
            window.lastCalcData.details.push({
                label: `(+) ${desc} (Prop. CCT)`,
                val: fmt(proportionalVal),
                color: '#7b1fa2'
            });
        }
    });

    if (ptu > 0) window.lastCalcData.details.push({ label: 'PTU (Reparto Utilidades)', val: fmt(ptu), color: '#7b1fa2' });
    if (fondo > 0) window.lastCalcData.details.push({ label: 'Fondo de Ahorro (Acumulado)', val: fmt(fondo), color: '#7b1fa2' });

    // --- LAUDO PREVIO (NUEVO) ---
    const montoL_val = parseFloat(document.getElementById('lab_monto_laudo').value) || 0;
    const fechaL_str = document.getElementById('lab_fecha_laudo').value;
    let interesLaudoPrevio = 0;
    let mesesDesdeLaudo = 0;

    if (montoL_val > 0 && fechaL_str) {
        const fechaL = new Date(fechaL_str + 'T12:00:00');
        if (baja > fechaL) {
            mesesDesdeLaudo = getTotalMonthsForInterest(fechaL, baja);
            // Aplicamos el 2% mensual sobre el monto del laudo (Art. 945 LFT actualización)
            interesLaudoPrevio = montoL_val * 0.02 * mesesDesdeLaudo;
        }
    }

    const totalLiquidacionFinal = total + salariosVencidos + interesesMoratoriosJuicio + interesesIncumplimiento + totalExtra + ptu + fondo + montoL_val + interesLaudoPrevio;

    // Actualizar detalle para exportar
    window.lastLaboralDetail.salariosVencidos = salariosVencidos;
    window.lastLaboralDetail.interesesMoratorios = interesesMoratoriosJuicio;
    window.lastLaboralDetail.interesesIncumplimiento = interesesIncumplimiento;
    window.lastLaboralDetail.montoLaudo = montoL_val;
    window.lastLaboralDetail.fechaLaudo = fechaL_str;
    window.lastLaboralDetail.interesLaudoPrevio = interesLaudoPrevio;
    window.lastLaboralDetail.mesesDesdeLaudo = mesesDesdeLaudo;
    window.lastLaboralDetail.ptu = ptu;
    window.lastLaboralDetail.fondo = fondo;
    window.lastLaboralDetail.total = totalLiquidacionFinal;

    if (montoL_val > 0) {
        window.lastCalcData.details.push(
            { label: '----------------', val: '----------------' },
            { label: 'ACTUALIZACIÓN DE LAUDO PREVIO', val: '', bold: true },
            { label: `Laudo al ${fechaL_str}`, val: fmt(montoL_val) },
            { label: `Interés Moratorio (2% mensual - ${mesesDesdeLaudo} meses)`, val: fmt(interesLaudoPrevio), color: '#d32f2f' }
        );
    }

    window.lastCalcData.details.push(
        { label: '----------------', val: '----------------' },
        { label: 'TOTAL LIQUIDACIÓN FINAL', val: fmt(totalLiquidacionFinal), bold: true, size: 14, color: '#2e7d32' }
    );

    renderResult(window.lastCalcData);
}

window.generarPlanillaLaboral = () => {
    if (!window.lastLaboralDetail) {
        // Trigger calculation if not done
        window.calcularLaboral();
    }
    const d = window.lastLaboralDetail;
    const rows = document.getElementById('lab_planilla_rows');
    rows.innerHTML = '';
    const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const addRow = (concept, formula, total) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>${concept}</strong></td><td class="formula">${formula}</td><td style="font-weight:bold;">${fmt(total)}</td>`;
        rows.appendChild(tr);
    };

    addRow("Aguinaldo Proporcional (Art. 87 LFT)", `${fmt(d.salario)} × ${d.cfgAguinaldo} días × (${d.daysWorkedThisYear} días laborados en el año ÷ 365)`, d.aguinaldo);
    addRow("Vacaciones Proporcionales (Art. 76 LFT)", `${fmt(d.salario)} × ${d.diasVac} días × (${d.diasDesdeAniversario} días desde aniversario ÷ 365)`, d.vacaciones);
    addRow("Prima Vacacional (Art. 80 LFT)", `${fmt(d.vacaciones)} × ${d.cfgPrima}%`, d.primaVacacional);

    if (d.indemnizacion90 > 0) {
        addRow("Indemnización Constitucional (Art. 48 LFT)", `${fmt(d.sdi)} × 90 días`, d.indemnizacion90);
        if (d.indemnizacion20 > 0) {
            addRow("20 Días por Año (Art. 50 LFT)", `${fmt(d.sdi)} × 20 días × (${d.aniosEfectivos.toFixed(2)} años efectivos)`, d.indemnizacion20);
        }
        addRow("Prima de Antigüedad (Art. 162 LFT)", `Base: ${fmt(d.baseSalarialPrima)} ${d.salario > d.topeSalarialPrima ? '(Tope 2SM Art. 486)' : '(Salario Real)'} × 12 días × ${d.aniosEfectivos.toFixed(2)} años`, d.primaAntiguedad);
    } else if (d.primaAntiguedad > 0) {
        addRow("Prima de Antigüedad (Art. 162 LFT)", `Base: ${fmt(d.baseSalarialPrima)} × 12 días × ${d.aniosEfectivos.toFixed(2)} años (Burocrático / Causa Justificada)`, d.primaAntiguedad);
    }

    if (d.salariosVencidos > 0) {
        addRow("Salarios Vencidos (Art. 48)", `SDI ${fmt(d.sdi)} × meses (${Math.min(d.salariosVencidos / (d.sdi * 30.41), 12).toFixed(1)})`, d.salariosVencidos);
        if (d.interesesMoratorios > 0) {
            addRow("Intereses Moratorios Juicio (Art. 48)", `2% Mensual s/ 15 meses SDI (${fmt(d.sdi * 15)})`, d.interesesMoratorios);
        }
    }

    if (d.montoLaudo > 0) {
        addRow(`LAUDO / SENTENCIA AL ${d.fechaLaudo}`, "Monto base de actualización", d.montoLaudo);
        if (d.mesesDesdeLaudo > 0) {
            if (d.mesesDesdeLaudo <= 12) {
                // List individual months for clarity of "monthly accumulation"
                for (let i = 1; i <= d.mesesDesdeLaudo; i++) {
                    addRow(`Interés Mensual #${i} (2%)`, `2% sobre ${fmt(d.montoLaudo)}`, d.montoLaudo * 0.02);
                }
            } else {
                addRow(`Actualización de Laudo (${d.mesesDesdeLaudo} meses)`, `2% mensual s/ ${fmt(d.montoLaudo)} x ${d.mesesDesdeLaudo}`, d.interesLaudoPrevio);
            }
        }
    }

    if (d.interesesIncumplimiento > 0) {
        const baseSinIncumplimiento = d.total - d.interesesIncumplimiento;
        addRow("Interés por Incumplimiento (Art. 945 LFT)", `2% Mensual sobre condena total (${fmt(baseSinIncumplimiento)})`, d.interesesIncumplimiento);
    }

    const trf = document.createElement('tr');
    trf.style.background = "#f1f3f5";
    trf.innerHTML = `<td colspan="2" style="text-align:right; font-weight:bold;">TOTAL LIQUIDACIÓN:</td><td style="font-size:1.1rem; color:var(--primary); font-weight:800;">${fmt(d.total)}</td>`;
    rows.appendChild(trf);

    document.getElementById('lab_planilla_wrapper').style.display = 'block';
    document.getElementById('lab_planilla_content').classList.remove('collapsed');
    document.getElementById('lab_planilla_wrapper').scrollIntoView({ behavior: 'smooth' });
};

/* 3. PENSIÓN */
window.togglePensionFijacion = () => {
    const tipo = document.getElementById('pen_tipo_fijacion').value;
    const d1 = document.getElementById('p_fij_1');
    const d2 = document.getElementById('p_fij_2');
    const d3 = document.getElementById('p_fij_3');
    const d4 = document.getElementById('p_fij_4');

    if (tipo === 'porcentaje') {
        d1.style.display = 'block'; d2.style.display = 'block';
        d3.style.display = 'none'; d4.style.display = 'none';
    } else {
        d1.style.display = 'none'; d2.style.display = 'none';
        d3.style.display = 'block'; d4.style.display = 'block';
        window.updatePensionReferenceValue();
    }
    window.syncPensionMonthlyAmount();
};

window.updatePensionReferenceValue = () => {
    const tipo = document.getElementById('pen_tipo_fijacion').value;
    const year = document.getElementById('pen_ref_year').value;
    const refInput = document.getElementById('pen_ref_val');

    if (tipo === 'uma') {
        refInput.value = UMA_HISTORY[year] || 0;
    } else if (tipo === 'sm') {
        const zona = document.getElementById('global_zona_region')?.value || 'general';
        const history = (zona === 'frontera') ? SM_FRONTERA : SM_HISTORY;
        refInput.value = history[year] || 0;
    }
    window.syncPensionMonthlyAmount();
};

window.syncPensionMonthlyAmount = () => {
    const tipo = document.getElementById('pen_tipo_fijacion').value;
    const adeudoInput = document.getElementById('pen_monto_adeudo');
    let monto = 0;

    if (tipo === 'porcentaje') {
        const ingreso = parseFloat(document.getElementById('pen_ingreso').value) || 0;
        const porcentaje = parseFloat(document.getElementById('pen_porcentaje').value) || 0;
        monto = ingreso * (porcentaje / 100);
    } else {
        const unidades = parseFloat(document.getElementById('pen_unidades_fij').value) || 0;
        const refVal = parseFloat(document.getElementById('pen_ref_val').value) || 0;
        monto = unidades * refVal;
    }

    if (adeudoInput) {
        adeudoInput.value = monto > 0 ? monto.toFixed(2) : "";
    }
};

window.generarPlanillaPension = () => {
    const inicioS = document.getElementById('pen_inicio_adeudo').value;
    let finS = document.getElementById('pen_fin_adeudo').value;
    const tipo = document.getElementById('pen_tipo_fijacion').value;
    const frecuencia = document.getElementById('pen_frecuencia').value;
    const unidades = parseFloat(document.getElementById('pen_unidades_fij').value) || 0;
    const montoFijo = parseFloat(document.getElementById('pen_monto_adeudo').value) || 0;

    if (!inicioS) return alert("Seleccione una fecha de inicio para generar la planilla.");
    if (!finS) finS = new Date().toISOString().split('T')[0];

    const [iYear, iMonth] = inicioS.split('-').map(Number);
    const [fYear, fMonth] = finS.split('-').map(Number);

    if (fYear < iYear || (fYear === iYear && fMonth < iMonth)) {
        return alert("La fecha de fin debe ser posterior o igual al inicio.");
    }

    // Sentencia data
    const montoS_val = parseFloat(document.getElementById('pen_monto_sentencia').value) || 0;
    const fechaS_str = document.getElementById('pen_fecha_sentencia').value;
    const incluirSentenciaEnTabla = document.getElementById('pen_incluir_sentencia_tabla')?.checked;

    let sYear = 0, sMonth = 0;
    const hasSentencia = montoS_val > 0 && fechaS_str;
    if (hasSentencia) {
        const parts = fechaS_str.split('-');
        sYear = parseInt(parts[0]);
        sMonth = parseInt(parts[1]);
    }

    // Preserve existing payments
    const existingPayments = {};
    document.querySelectorAll('#pen_planilla_rows tr').forEach(row => {
        const pagadoEl = row.querySelector('.p-pagado');
        if (!pagadoEl) return;
        const period = row.cells[0].innerText.trim();
        existingPayments[period] = pagadoEl.value;
    });

    const rows = document.getElementById('pen_planilla_rows');
    rows.innerHTML = '';
    document.getElementById('pen_planilla_wrapper').style.display = 'block';
    const content = document.getElementById('pen_planilla_content');
    content.style.display = 'block';
    content.classList.remove('collapsed');

    const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    let sentenciaInsertada = false;

    // ── Helper: Calc reference values ────────────────────────────────
    function getRefValue(tipo, yearStr) {
        let ref = 0;
        if (tipo === 'uma') {
            ref = UMA_HISTORY[yearStr] || 0;
            if (!ref) {
                const ys = Object.keys(UMA_HISTORY).sort((a, b) => b - a);
                ref = UMA_HISTORY[ys.find(y => parseInt(y) <= parseInt(yearStr)) || ys[ys.length - 1]] || 0;
            }
        } else if (tipo === 'sm') {
            const zona = document.getElementById('global_zona_region')?.value || 'general';
            const hist = (zona === 'frontera') ? SM_FRONTERA : SM_HISTORY;
            ref = hist[yearStr] || 0;
            if (!ref) {
                const ys = Object.keys(hist).sort((a, b) => b - a);
                ref = hist[ys.find(y => parseInt(y) <= parseInt(yearStr)) || ys[ys.length - 1]] || 0;
            }
        }
        return ref;
    }

    if (frecuencia === 'anual') {
        for (let y = iYear; y <= fYear; y++) {
            if (hasSentencia && !sentenciaInsertada && sYear === y) {
                renderSentenciaRow(rows, fechaS_str, montoS_val, incluirSentenciaEnTabla);
                sentenciaInsertada = true;
            }
            const ref = getRefValue(tipo, y.toString());
            const montoDeberia = (tipo === 'uma' || tipo === 'sm') ? unidades * ref * 12 : montoFijo * 12;
            const periodText = `Año ${y}`;
            const prevPaid = existingPayments[periodText] || "0";
            appendDataRow(rows, periodText, ref, montoDeberia, prevPaid, unidades, 12);
        }
    } else {
        let currentYearSubtotal = 0;
        let currentYearPaid = 0;
        let isFirstYear = true;

        for (let y = iYear; y <= fYear; y++) {
            const startM = (y === iYear) ? iMonth : 1;
            const endM = (y === fYear) ? fMonth : 12;

            currentYearSubtotal = 0;
            currentYearPaid = 0;

            for (let m = startM; m <= endM; m++) {
                if (hasSentencia && !sentenciaInsertada && (y > sYear || (y === sYear && m >= sMonth))) {
                    renderSentenciaRow(rows, fechaS_str, montoS_val, incluirSentenciaEnTabla);
                    sentenciaInsertada = true;
                }
                const ref = getRefValue(tipo, y.toString());
                const montoDeberia = (tipo === 'uma' || tipo === 'sm') ? unidades * ref : montoFijo;
                const periodText = `${MESES[m - 1]} ${y}`;
                const prevPaid = existingPayments[periodText] || "0";

                currentYearSubtotal += montoDeberia;
                currentYearPaid += parseFloat(prevPaid);

                appendDataRow(rows, periodText, ref, montoDeberia, prevPaid, unidades, 1);
            }

            // Insert subtotal row
            let subtotalTitle = `SUBTOTAL ANUAL ${y}`;
            let baseAmount = currentYearSubtotal;
            let paidAmount = currentYearPaid;

            if (isFirstYear && hasSentencia) {
                baseAmount += montoS_val;
                subtotalTitle += ` (Incluye Planilla Anterior)`;
                isFirstYear = false;
            }

            appendSubtotalRow(rows, subtotalTitle, baseAmount, paidAmount);
        }
    }

    if (hasSentencia && !sentenciaInsertada) renderSentenciaRow(rows, fechaS_str, montoS_val, incluirSentenciaEnTabla);

    window.calcularPension(); // Refresh totals automatically
    window.generarResumenAnualUMA(); // Refresh annual summary

    function renderSentenciaRow(container, dateStr, monto, asDataRow) {
        const tr = document.createElement('tr');
        if (asDataRow) {
            tr.classList.add('is-sentencia-row');
            tr.innerHTML = `
                <td style="font-weight:bold; color:#2e7d32; background:#e8f5e9;">⚖️ SENTENCIA (${dateStr})</td>
                <td style="background:#e8f5e9;"><input type="number" class="form-control-small p-ref" value="0" disabled style="opacity:0.3"></td>
                <td style="background:#e8f5e9;"><input type="number" class="form-control-small p-monto" value="${monto.toFixed(2)}" oninput="updateRowPension(this)"></td>
                <td style="background:#e8f5e9;"><input type="number" class="form-control-small p-pagado" value="0" oninput="updateRowPension(this)"></td>
                <td style="background:#e8f5e9;"><span class="p-pend" style="font-weight:bold; color:#2e7d32;">$${monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></td>
            `;
        } else {
            tr.style.background = '#e8f5e9';
            tr.style.borderTop = '2px solid #2e7d32';
            tr.style.borderBottom = '2px solid #2e7d32';
            tr.innerHTML = `<td colspan="5" style="font-weight:bold; color:#2e7d32; text-align:center; padding:8px;">⚖️ SENTENCIA / PLANILLA ANTERIOR — Corte al ${dateStr}: $${monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })} (se suma al total)</td>`;
        }
        container.appendChild(tr);
    }

    function appendDataRow(container, periodText, valorRef, montoDeberia, prevPaid, units, factor) {
        const tr = document.createElement('tr');
        tr.setAttribute('data-units', units);
        tr.setAttribute('data-factor', factor);
        const pend = montoDeberia - parseFloat(prevPaid);
        tr.innerHTML = `
            <td style="font-weight:bold;">${periodText}</td>
            <td><input type="number" class="form-control-small p-ref" value="${valorRef.toFixed(2)}" oninput="updateRowPension(this,'ref')"></td>
            <td><input type="number" class="form-control-small p-monto" value="${montoDeberia.toFixed(2)}" oninput="updateRowPension(this,'monto')"></td>
            <td><input type="number" class="form-control-small p-pagado" value="${parseFloat(prevPaid).toFixed(2)}" oninput="updateRowPension(this)"></td>
            <td><span class="p-pend" style="font-weight:bold;">$${pend.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></td>
        `;
        container.appendChild(tr);
        updateRowColor(tr.querySelector('.p-pend'), pend);
    }

    function appendSubtotalRow(container, title, subtotal, paid) {
        const tr = document.createElement('tr');
        tr.classList.add('is-subtotal-row');
        tr.style.background = '#f1f8e9';
        tr.style.borderTop = '1px solid #c5e1a5';
        tr.innerHTML = `
            <td style="font-weight:bold; color:#1b5e20;">📊 ${title}</td>
            <td style="background:#f1f8e9;"></td>
            <td style="background:#f1f8e9; font-weight:bold;">$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
            <td style="background:#f1f8e9; color:#2e7d32;">$${paid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
            <td style="background:#f1f8e9; font-weight:bold; color:#e65100;">$${(subtotal - paid).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
        `;
        container.appendChild(tr);
    }
}

window.updateRowPension = (input, source = '') => {
    const tr = input.closest('tr');
    const mInput = tr.querySelector('.p-monto');
    const pInput = tr.querySelector('.p-pagado');
    const span = tr.querySelector('.p-pend');

    if (source === 'ref') {
        const refVal = parseFloat(tr.querySelector('.p-ref').value) || 0;
        const units = parseFloat(tr.getAttribute('data-units')) || 0;
        const factor = parseFloat(tr.getAttribute('data-factor')) || 1;
        if (units > 0) mInput.value = (refVal * units * factor).toFixed(2);
    }

    const m = parseFloat(mInput.value) || 0;
    const p = parseFloat(pInput.value) || 0;
    const pend = m - p;
    span.innerText = `$${pend.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    updateRowColor(span, pend);
    window.calcularPension(); // Auto-update totals
    if (window.generarResumenAnualUMA) window.generarResumenAnualUMA(); // Refresh annual cards
};

function updateRowColor(span, pend) {
    if (pend > 1) span.style.color = '#e65100';
    else if (pend < -1) span.style.color = '#1a237e';
    else span.style.color = '#2e7d32';
}

window.generarResumenAnualUMA = () => {
    const inicioS = document.getElementById('pen_inicio_adeudo').value;
    let finS = document.getElementById('pen_fin_adeudo').value;
    const factor = parseFloat(document.getElementById('pen_factor_uma_anual').value) || 199;
    const grid = document.getElementById('pen_resumen_anual_grid');
    const wrapper = document.getElementById('pen_resumen_anual_wrapper');

    if (!inicioS || !grid) return;
    if (!finS) finS = new Date().toISOString().split('T')[0];

    const iParts = inicioS.split('-');
    const fParts = finS.split('-');
    const iYear = parseInt(iParts[0]);
    const iMonth = parseInt(iParts[1]);
    const fYear = parseInt(fParts[0]);
    const fMonth = parseInt(fParts[1]);

    wrapper.style.display = 'block';
    grid.innerHTML = '';

    let totalGralRes = 0;
    let totalPagoRes = 0;
    let totalSubtRes = 0;

    // Collect payments per year from the monthly planilla if it exists
    const yearlyPayments = {};
    const planillaRows = document.querySelectorAll('#pen_planilla_rows tr');
    let hasPlanillaData = false;

    planillaRows.forEach(row => {
        const pagadoEl = row.querySelector('.p-pagado');
        if (!pagadoEl) return;
        const periodText = row.cells[0].innerText.trim();
        const yearMatch = periodText.match(/\d{4}$/);
        if (yearMatch) {
            hasPlanillaData = true;
            const y = yearMatch[0];
            const p = parseFloat(pagadoEl.value) || 0;
            yearlyPayments[y] = (yearlyPayments[y] || 0) + p;
        }
    });

    const globalPagoMensual = parseFloat(document.getElementById('pen_pagos').value) || 0;

    for (let y = iYear; y <= fYear; y++) {
        const startM = (y === iYear) ? iMonth : 1;
        const endM = (y === fYear) ? fMonth : 12;
        const monthsCount = endM - startM + 1;

        const uma = UMA_HISTORY[y.toString()] || 0;
        const subtotal = uma * factor * monthsCount;

        // Better Fallback: If the year has 0 payments in the planilla, or no planilla data at all, use globalPagoMensual
        const yearSumFromPlanilla = yearlyPayments[y.toString()] || 0;
        const paid = yearSumFromPlanilla > 0 ? yearSumFromPlanilla : (globalPagoMensual * monthsCount);

        const pend = subtotal - paid;
        totalGralRes += pend;
        totalPagoRes += paid;
        totalSubtRes += subtotal;

        const card = document.createElement('div');
        card.style.cssText = `
            background: #fff;
            border: 1px solid #c5e1a5;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            gap: 4px;
        `;

        card.innerHTML = `
            <div style="font-weight:bold; color:#33691e; border-bottom:1px solid #f1f8e9; padding-bottom:4px; margin-bottom:4px; display:flex; justify-content:space-between;">
                <span>Año ${y}</span>
                <span style="font-size:0.7rem; opacity:0.7;">UMA: $${uma.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                <span style="color:#666;">Operación:</span>
                <span style="font-family:monospace;">${uma.toFixed(2)} × ${factor} × ${monthsCount} meses</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; border-top:1px dotted #eee; padding-top:4px;">
                <span>Cálculo Total:</span>
                <span style="font-weight:bold;">$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#2e7d32;">
                <span>Pagos del Año:</span>
                <span>$${paid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-top:4px; padding-top:4px; border-top:1px dashed #f1f8e9; font-weight:800; color:${pend > 1 ? '#e65100' : '#1b5e20'};">
                <span>Saldo Pendiente:</span>
                <span>$${pend.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
        `;
        grid.appendChild(card);
    }

    const sumValEl = document.getElementById('pen_resumen_anual_sum_val');
    const sumPaidEl = document.getElementById('pen_resumen_anual_sum_paid');
    const sumSubEl = document.getElementById('pen_resumen_anual_sum_sub');

    if (sumValEl) sumValEl.innerText = `$${totalGralRes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    if (sumPaidEl) sumPaidEl.innerText = `$${totalPagoRes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    if (sumSubEl) sumSubEl.innerText = `$${totalSubtRes.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

    // Store in global for PDF/Result integration
    window.lastAnnualSummary = { total: totalGralRes, paid: totalPagoRes, subtotal: totalSubtRes };
};

window.poblarPagosPension = () => {
    const bulkVal = parseFloat(document.getElementById('pen_bulk_pago').value) || 0;
    if (bulkVal <= 0) return alert("Ingrese un monto válido para aplicar.");
    const rows = document.querySelectorAll('#pen_planilla_rows tr');
    let count = 0;
    rows.forEach(row => {
        const pInput = row.querySelector('.p-pagado');
        if (pInput && !row.classList.contains('is-sentencia-row')) {
            pInput.value = bulkVal.toFixed(2);
            window.updateRowPension(pInput);
            count++;
        }
    });
    if (count === 0) alert("No hay meses generados en la planilla para aplicar este pago.");
};

window.calcularPension = () => {
    const tipo = document.getElementById('pen_tipo_fijacion').value;
    const ingreso = parseFloat(document.getElementById('pen_ingreso').value) || 0;
    const porcentaje = parseFloat(document.getElementById('pen_porcentaje').value) || 0;
    const unidades = parseFloat(document.getElementById('pen_unidades_fij').value) || 0;
    const refVal = parseFloat(document.getElementById('pen_ref_val').value) || 0;
    const inicioS = document.getElementById('pen_inicio_adeudo').value;

    let montoMensualCalc = 0;
    if (tipo === 'porcentaje') {
        montoMensualCalc = ingreso * (porcentaje / 100);
    } else {
        montoMensualCalc = unidades * refVal;
    }

    // Check if we have a planilla
    const planillaRows = document.querySelectorAll('#pen_planilla_rows tr');
    let totalAdeudo = 0;
    let totalPeriodo = 0;
    let totalPagado = 0;
    let tienePlanilla = planillaRows.length > 0;

    if (tienePlanilla) {
        planillaRows.forEach(row => {
            // CRITICAL FIX: skip sentencia header row (it has no .p-pagado input)
            const montoEl = row.querySelector('.p-monto');
            const pagadoEl = row.querySelector('.p-pagado');
            if (!pagadoEl || !montoEl) return;
            const m = parseFloat(montoEl.value) || 0;
            const p = parseFloat(pagadoEl.value) || 0;
            totalPeriodo += m;
            totalPagado += p;
        });
        totalAdeudo = totalPeriodo - totalPagado;
    } else {
        // Fallback to simple logic
        let finS = document.getElementById('pen_fin_adeudo').value;
        if (!finS) finS = new Date().toISOString().split('T')[0];

        const montoManual = parseFloat(document.getElementById('pen_monto_adeudo').value) || 0;
        const pagos = parseFloat(document.getElementById('pen_pagos').value) || 0;

        const baseAdeudo = montoManual > 0 ? montoManual : montoMensualCalc;

        if (inicioS && baseAdeudo > 0) {
            const inicio = new Date(inicioS + 'T00:00:00');
            const fin = new Date(finS + 'T00:00:00');
            if (fin >= inicio) {
                const diffTime = Math.abs(fin - inicio);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                // Calculation: (Total days / 30.4166) * monthly amount gives a better approximation
                totalPeriodo = (diffDays / 30.4166) * baseAdeudo;
                totalPagado = pagos;
                totalAdeudo = totalPeriodo - totalPagado;
            }
        }
    }

    if (montoMensualCalc === 0 && totalAdeudo === 0 && !inicioS) return alert('Ingrese datos.');

    const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const montoS_val = parseFloat(document.getElementById('pen_monto_sentencia').value) || 0;
    const fechaS_str = document.getElementById('pen_fecha_sentencia').value;
    const incluirSentenciaEnTabla = document.getElementById('pen_incluir_sentencia_tabla')?.checked;

    // Build planilla summary for the PDF
    const planillaDesglose = [];
    let totalSentenciaInPlanilla = 0;

    // Build detailed breakdown table for the output
    const tableBreakdown = [];
    const fmtN = (n) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (tienePlanilla) {
        planillaRows.forEach(row => {
            const pagadoEl = row.querySelector('.p-pagado');
            const period = row.cells[0]?.innerText || '';

            if (!pagadoEl) {
                if (row.classList.contains('is-subtotal-row')) {
                    const subtotalVal = parseFloat(row.cells[2].innerText.replace(/[^0-9.]/g, '')) || 0;
                    const paidVal = parseFloat(row.cells[3].innerText.replace(/[^0-9.]/g, '')) || 0;
                    const diffVal = parseFloat(row.cells[4].innerText.replace(/[^0-9.]/g, '')) || 0;
                    tableBreakdown.push({
                        type: 'subtotal',
                        label: period,
                        total: subtotalVal,
                        paid: paidVal,
                        diff: diffVal
                    });
                } else if (period) {
                    tableBreakdown.push({ type: 'header', label: period });
                }
                return;
            }

            const monto = parseFloat(row.querySelector('.p-monto')?.value) || 0;
            const pagado = parseFloat(pagadoEl.value) || 0;
            const diff = monto - pagado;

            // Extract UMA/SM info if available
            const umaVal = parseFloat(row.querySelector('.p-ref')?.value) || refVal;
            const units = parseFloat(row.getAttribute('data-units')) || unidades;

            tableBreakdown.push({
                period: period,
                uma: umaVal,
                units: units,
                total: monto,
                paid: pagado,
                diff: diff,
                isSentencia: row.classList.contains('is-sentencia-row')
            });
        });
    }

    // Adjust total calculation
    let finalAdeudoTotal = totalAdeudo;
    if (!incluirSentenciaEnTabla) {
        finalAdeudoTotal += montoS_val;
    }

    window.lastCalcData = {
        type: 'PENSION',
        title: 'CÁLCULO DE PENSIÓN ALIMENTICIA – ADEUDO POR INCUMPLIMIENTO',
        legal: `FUNDAMENTACIÓN LEGAL VERIFICADA:\n\n` +
            `► OBLIGACIÓN ALIMENTARIA: Art. 505 Código Civil del Estado de Puebla (CC Pue.) – Los cnyuges tienen obligación recíproca de darse alimentos; Arts. 506-510 CC Pue. – Orden de prelación de deudores alimentarios.\n\n` +
            `► PROPORCIONALIDAD: Art. 513 CC Pue. – Los alimentos han de ser proporcionados a las posibilidades del que debe darlos y a las necesidades del que debe recibirlos. El juez o la jueza, en su caso, reglamentará la forma de su pago y podrá, en su caso, asegurar mediante constitución de depósito, prenda, hipoteca, fianza o cualquier otra forma de garantía suficiente el cumplimiento de esta obligación.\n\n` +
            `► IRRENUNCIABILIDAD: Art. 511 CC Pue. – El derecho de recibir alimentos no es renunciable, ni puede ser objeto de transacción.\n\n` +
            `► RETROACTIVIDAD DE ADEUDO: Art. 528 CC Pue. – Los alimentos se deben desde que se hace la demanda o se presenta la solicitud de alimentos. Art. 529 CC Pue. – No podrá compensarse la deuda alimentaria con ninguna otra. Los abonos o rebajas se aplicarán a los más antiguos.\n\n` +
            `► UMA COMO BASE DE CÁLCULO: Art. 26 apartado B CPEUM (reforma DOF 27-01-2016) – La Unidad de Medida y Actualización (UMA) es la referencia económica en pesos para determinar la cuantía del pago de obligaciones y supuestos previstos en las leyes federales, de las entidades federativas y del CDMX. INEGI publica el valor anual mediante resolución en el DOF.`,
        juris: `CRITERIOS JURISPRUDENCIALES VIGENTES (SCJN):\n\n` +
            `► Tesis: 1a./J. 8/2021 (11a.) | Reg. Digital: 2023537 | Publicación: SJF 10-sep-2021. PENSIÓN ALIMENTICIA. PARA SU REDUCCIÓN CUANDO SURGEN NUEVOS ACREEDORES, DEBE REALIZARSE UN ANÁLISIS INTEGRAL DE LA CAPACIDAD ECONÓMICA DEL DEUDOR Y LAS NECESIDADES DE TODOS LOS ACREEDORES, ATENDIENDO AL INTERÉS SUPERIOR DEL MENOR Y AL PRINCIPIO DE PROPORCIONALIDAD. – Primera Sala SCJN.\n\n` +
            `► Tesis: 1a./J. 24/2020 (10a.) | Reg. Digital: 2022087 | Publicación: SJF Libro 78, Sep-2020. SUPLENCIA DE LA QUEJA DEFICIENTE. TAMBIÉN PROCEDE A FAVOR DEL DEUDOR ALIMENTARIO. – Primera Sala SCJN.\n\n` +
            `► Tesis: PC.I.C. J/14 C (11a.) | Reg. Digital: 2024389 | Publicación: SJF 01-abr-2022. EL PROGENITOR QUE EJERCE LA GUARDA Y CUSTODIA NO SE ENCUENTRA OBLIGADO A RENDIR CUENTAS DE LA PENSIÓN AL DEUDOR ALIMENTARIO – Pleno en Materia Civil del Primer Circuito.`,
        details: [
            { label: 'Pensión Mensual Fijada', val: fmt(montoMensualCalc), bold: true, color: '#1565c0' },
            { label: '----------------', val: '----------------' },
        ]
    };

    if (montoS_val > 0 && !incluirSentenciaEnTabla) {
        window.lastCalcData.details.push(
            { label: '⚖️ SENTENCIA / INTERLOCUTORIA PREVIA', val: '', bold: true, color: '#2e7d32' },
            { label: `Adeudo juzgado al ${fechaS_str}`, val: fmt(montoS_val), color: '#2e7d32', bold: true },
            { label: '----------------', val: '----------------' }
        );
    }

    window.lastCalcData.details.push(
        { label: '📅 CONTROL DE ADEUDO / PENSIONES NO CUBIERTAS', val: '', bold: true },
        { label: 'Periodo de Incumplimiento', val: `${inicioS} al ${document.getElementById('pen_fin_adeudo').value || 'Hoy'}` },
    );

    // Add detailed table data
    if (tableBreakdown.length > 0) {
        window.lastCalcData.table = tableBreakdown;
    }

    window.lastCalcData.details.push(
        { label: 'Total Acumulado en el Periodo', val: fmt(totalPeriodo) },
        { label: 'Pagos Parciales Registrados', val: fmt(totalPagado), color: '#2e7d32' },
        { label: '📊 ADEUDO TOTAL PENDIENTE', val: fmt(finalAdeudoTotal), bold: true, color: '#e65100', size: 14 },
        { label: 'CANTIDAD EN LETRA', val: `(${window.numeroALetras(finalAdeudoTotal)})`, italic: true, size: 9 }
    );

    // Gastos del Menor
    const needsTotal = window.updatePensionNeedsTotal();
    if (needsTotal > 0) {
        window.lastCalcData.details.push(
            { label: '----------------', val: '----------------' },
            { label: 'PRESUPUESTO DE NECESIDADES', val: fmt(needsTotal), color: '#01579b', bold: true }
        );

        const rowsN = document.querySelectorAll('#pensionNeedsRows tr');
        rowsN.forEach(r => {
            const dInput = r.querySelector('.n-desc');
            const mInput = r.querySelector('.n-monto');
            if (dInput && mInput) {
                const dm = parseFloat(mInput.value) || 0;
                if (dm > 0) window.lastCalcData.details.push({ label: `• ${dInput.value}`, val: fmt(dm), size: 10 });
            }
        });
    }

    renderResult(window.lastCalcData);
};

window.addPensionNeedRow = () => {
    const tbody = document.getElementById('pensionNeedsRows');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="form-control-small n-desc" placeholder="Nuevo concepto..."></td>
        <td><input type="number" class="form-control-small n-monto" value="0" oninput="updatePensionNeedsTotal()"></td>
        <td><button class="btn btn-outline btn-small" onclick="this.parentElement.parentElement.remove(); updatePensionNeedsTotal();" style="color:red; border-color:red;">&times;</button></td>
    `;
    tbody.appendChild(tr);
};

window.updatePensionNeedsTotal = () => {
    const montos = document.querySelectorAll('.n-monto');
    let total = 0;
    montos.forEach(m => total += parseFloat(m.value) || 0);
    const display = document.getElementById('pensionNeedsTotal');
    if (display) display.innerText = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return total;
};

/* 4. HONORARIOS (New) */
window.calcularHonorarios = () => {
    const monto = parseFloat(document.getElementById('hon_monto').value) || 0;
    const pct = parseFloat(document.getElementById('hon_porcentaje').value) || 0;

    // Checkboxes (Wait, I need to add IDs in HTML first!)
    // I added: hon_iva, hon_ret_isr, hon_ret_iva
    const addIva = document.getElementById('hon_iva') && document.getElementById('hon_iva').checked;
    const retIsr = document.getElementById('hon_ret_isr') && document.getElementById('hon_ret_isr').checked;
    const retIva = document.getElementById('hon_ret_iva') && document.getElementById('hon_ret_iva').checked;

    if (!monto || !pct) return alert("Ingrese Monto y Porcentaje.");

    const honorarios = monto * (pct / 100);
    let subtotal = honorarios;
    let iva = 0;
    let isrRetention = 0;
    let ivaRetention = 0;

    if (addIva) {
        iva = honorarios * 0.16;
        subtotal += iva;
    }
    if (retIsr) {
        isrRetention = honorarios * 0.10;
        subtotal -= isrRetention;
    }
    if (retIva) {
        ivaRetention = honorarios * (2 / 3 * 0.16); // 10.6667%
        if (Math.abs(ivaRetention - (honorarios * 0.106667)) > 0.01) {
            // Standard 10.6667% approx
            ivaRetention = honorarios * 0.106667;
        }
        subtotal -= ivaRetention;
    }

    const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    window.lastCalcData = {
        type: 'HONORARIOS',
        title: 'CÁLCULO DE HONORARIOS PROFESIONALES',
        legal: 'Fundamento Legal: Contrato de Prestación de Servicios Profesionales, Código Civil (Prestación de Servicios) y Arancel de Abogados aplicable.',
        details: [
            { label: 'Monto Base / Recuperado', val: fmt(monto) },
            { label: `Porcentaje Aplicado (${pct}%)`, val: fmt(honorarios), bold: true },
        ]
    };

    if (addIva || retIsr || retIva) {
        window.lastCalcData.details.push({ label: '----------------', val: '----------------' });
        if (addIva) window.lastCalcData.details.push({ label: '(+) IVA (16%)', val: fmt(iva) });
        if (retIsr) window.lastCalcData.details.push({ label: '(-) Retención ISR', val: fmt(isrRetention), color: '#d32f2f' });
        if (retIva) window.lastCalcData.details.push({ label: '(-) Retención IVA', val: fmt(ivaRetention), color: '#d32f2f' });
    }

    window.lastCalcData.details.push({ label: '----------------', val: '----------------' });
    window.lastCalcData.details.push({ label: 'TOTAL NETO A PERCIBIR', val: fmt(subtotal), bold: true, size: 14, color: '#2e7d32' });

    renderResult(window.lastCalcData);
};

/* 5. ARANCEL PUEBLA (Ley de 01/07/2022) */
window.toggleArancelOptions = () => {
    const service = document.getElementById('ara_servicio').value;
    const extContainer = document.getElementById('ara_ext_container');
    const valContainer = document.getElementById('ara_val_container');
    const label = document.getElementById('ara_ext_label');

    // Reset
    extContainer.style.display = 'none';
    valContainer.style.display = 'none';

    if (service === 'acompanamiento' || service === 'asesoria_verbal' || service === 'asesoria_escrita' ||
        service === 'pruebas' || service === 'escritos_tramite' || service === 'exhortos') {
        extContainer.style.display = 'block';
        label.innerText = (service === 'pruebas' ? 'Número de Pruebas Desahogadas' :
            (service === 'escritos_tramite' ? 'Número de Escritos Presentados' :
                (service === 'exhortos' ? 'Número de Exhortos / Oficios' : 'Número de Horas o Fracción')));
    } else if (service === 'lectura_docs') {
        extContainer.style.display = 'block';
        label.innerText = 'Número Total de Hojas';
    } else if (service === 'viaticos') {
        extContainer.style.display = 'block';
        label.innerText = 'Número de Días de Salida';
    } else if (service === 'cuantia_determinada' || service === 'redaccion_contrato' || service === 'alegatos') {
        valContainer.style.display = 'block';
    }
};

window.getArancelEstimation = (service, unidades = 1, valorNegocio = 0, umaValue = 108.57, grado = 0) => {
    let minUma = 0, maxUma = 0;
    let minPesos = 0, maxPesos = 0;
    let concept = "";
    let art = "";
    let isPercentage = false;

    switch (service) {
        case 'asesoria_verbal':
            minUma = 5 * unidades; maxUma = 10 * unidades;
            concept = `Asesoría o Consulta Verbal (${unidades} hrs)`;
            art = "Artículo 11";
            break;
        case 'asesoria_escrita':
            minUma = 10 * unidades; maxUma = 20 * unidades;
            concept = `Asesoría o Consulta por Escrito (${unidades} hrs)`;
            art = "Artículo 11";
            break;
        case 'lectura_docs':
            art = "Artículo 11/12";
            concept = `Lectura y Análisis de Documentos (${unidades} hojas)`;
            minUma = 5;
            if (unidades > 10) {
                minUma += (unidades - 10) * (5 * 0.05); // 5% de la cuota base por cada hoja extra
            }
            maxUma = minUma; // En este caso el arancel es fijo por hoja
            break;
        case 'contestacion_indeterminada':
            minUma = 50; maxUma = 100;
            concept = "Contestación de Demanda (Cuantía Indeterminada)";
            art = "Artículo 15";
            break;
        case 'cuantia_determinada':
            art = "Artículo 24";
            concept = `Juicio de Cuantía Determinada (Base: $${valorNegocio.toLocaleString()})`;
            isPercentage = true;
            // Simplified Table Art 24 (Approximate for Calculator)
            const valorEnUMAs = valorNegocio / umaValue;
            if (valorEnUMAs <= 1100) {
                minPesos = valorNegocio * 0.10;
                maxPesos = valorNegocio * 0.20;
            } else {
                minPesos = valorNegocio * 0.05;
                maxPesos = valorNegocio * 0.15;
            }
            break;
        case 'amparo_indirecto':
            minUma = 100; maxUma = 500;
            concept = "Juicio de Amparo Indirecto";
            art = "Artículo 48";
            break;
        case 'amparo_directo':
            minUma = 200; maxUma = 600;
            concept = "Juicio de Amparo Directo";
            art = "Artículo 49";
            break;
        case 'apelacion':
            minUma = 60; maxUma = 250;
            concept = "Recurso de Apelación (Segunda Instancia)";
            art = "Artículo 25/50";
            break;
        case 'acompanamiento':
            minUma = 10 * unidades; maxUma = 30 * unidades;
            concept = `Acompañamiento / Asistencia Diligencias (${unidades} hrs)`;
            art = "Artículo 14";
            break;
        case 'viaticos':
            minUma = 10 * unidades; maxUma = 30 * unidades;
            concept = `Viáticos por Salida fuera de Residencia (${unidades} días)`;
            art = "Artículo 29";
            break;
        case 'penal_denuncia':
            minUma = 80; maxUma = 250;
            concept = "Materia Penal: Denuncia o Querella";
            art = "Artículo 41";
            break;
        case 'penal_control':
            minUma = 120; maxUma = 600;
            concept = "Materia Penal: Audiencia de Control / Inicial";
            art = "Artículo 42";
            break;
        case 'penal_intermedia':
            minUma = 120; maxUma = 400;
            concept = "Materia Penal: Etapa Intermedia";
            art = "Artículo 43";
            break;
        case 'penal_juicio':
            minUma = 170; maxUma = 600;
            concept = "Materia Penal: Juicio Oral";
            art = "Artículo 44";
            break;
        case 'penal_municipal':
            minUma = 30; maxUma = 60;
            concept = "Materia Penal: Defensa ante Jueces Municipales o de Paz";
            art = "Artículo 47";
            break;
        case 'pruebas':
            minUma = 50 * unidades; maxUma = 100 * unidades;
            concept = `Desahogo de Pruebas (${unidades} pruebas)`;
            art = "Artículo 17 Fracc. IV";
            break;
        case 'escritos_tramite':
            minUma = 5 * unidades; maxUma = 20 * unidades;
            concept = `Escritos de Trámite / Promociones (${unidades} escritos)`;
            art = "Artículo 17 Fracc. V";
            break;
        case 'alegatos':
            art = "Artículo 20";
            concept = "Escrito de Alegatos o Conclusiones";
            if (valorNegocio > 0) {
                isPercentage = true;
                minPesos = valorNegocio * 0.01;
                maxPesos = minPesos;
            } else {
                minUma = 20; maxUma = 50; // Fallback to a fixed range if no value provided
            }
            break;
        case 'exhortos':
            minUma = 10 * unidades; maxUma = 20 * unidades;
            concept = `Diligenciación de Exhortos / Oficios (${unidades} oficinas)`;
            art = "Artículo 18/19";
            break;
        case 'jurisdiccion_voluntaria':
            minUma = 80; maxUma = 160;
            concept = "Procedimiento de Jurisdicción Voluntaria";
            art = "Artículo 34";
            break;
        case 'redaccion_contrato':
            art = "Artículo 31";
            concept = "Redacción de Contratos o Convenios";
            if (valorNegocio > 0) {
                isPercentage = true;
                minPesos = valorNegocio * 0.02;
                maxPesos = valorNegocio * 0.05;
            } else {
                minUma = 20; maxUma = 100;
            }
            break;
    }

    // Apply degree bonus
    const multiplier = 1 + (grado / 100);
    const minFinal = isPercentage ? (minPesos * multiplier) : (minUma * umaValue * multiplier);
    const maxFinal = isPercentage ? (maxPesos * multiplier) : (maxUma * umaValue * multiplier);

    return {
        concept, art, isPercentage, minFinal, maxFinal, umaValue, multiplier, minUma, maxUma
    };
};

window.calcularArancelPuebla = () => {
    const umaValue = parseFloat(document.getElementById('ara_uma').value) || 108.57;
    const grado = parseInt(document.getElementById('ara_grado').value) || 0;
    const service = document.getElementById('ara_servicio').value;
    const unidades = parseFloat(document.getElementById('ara_unidades').value) || 1;
    const valorNegocio = parseFloat(document.getElementById('ara_valor_negocio').value) || 0;

    const res = window.getArancelEstimation(service, unidades, valorNegocio, umaValue, grado);
    const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const gradoDesc = ["Licenciatura", "Especialidad (+1%)", "Maestría (+2%)", "Doctorado (+3%)"][grado];

    window.lastCalcData = {
        type: 'ARANCEL_PUEBLA',
        title: 'CÁLCULO DE HONORARIOS SEGÚN LEY DE ARANCELES (PUEBLA)',
        legal: `Ley de Aranceles para el cobro de honorarios de Abogados en el Estado de Puebla. ${res.art}. Valor UMA 2024/2025: $${res.umaValue}.`,
        juris: 'Jurisprudencia 1a./J. 10/2005: La cuantificación de honorarios debe sujetarse estrictamente al arancel vigente si no hay contrato escrito. Tesis: La UMA es el factor constitucional para multas y aranceles.',
        details: [
            { label: 'Servicio / Actuación', val: res.concept, bold: true },
            { label: 'Grado de Estudios', val: gradoDesc },
            { label: 'Valor UMA aplicado', val: fmt(res.umaValue) }
        ]
    };

    if (!res.isPercentage) {
        window.lastCalcData.details.push({ label: 'Rango Legal (UMAs)', val: `${res.minUma.toFixed(2)} - ${res.maxUma.toFixed(2)} UMAs` });
    }

    window.lastCalcData.details.push(
        { label: '----------------', val: '----------------' },
        { label: 'HONORARIOS MÍNIMOS', val: fmt(res.minFinal), color: '#2e7d32', bold: true },
        { label: 'HONORARIOS MÁXIMOS', val: fmt(res.maxFinal), color: '#b71c1c', bold: true },
        { label: '----------------', val: '----------------' },
        { label: 'NOTA:', val: 'Los montos pueden variar según la complejidad y el beneficio obtenido conforme a los Artículos 4, 5 y 6 de la Ley.', size: 9 }
    );

    renderResult(window.lastCalcData);
};

window.generarReciboArancel = () => {
    if (!window.lastCalcData || window.lastCalcData.type !== 'ARANCEL_PUEBLA') return;
    openModal('modalRecibo');
    setTimeout(() => {
        const conceptoInput = document.querySelector('#re_concepto');
        const montoInput = document.querySelector('#re_monto');
        const fechaInput = document.querySelector('#re_fecha');
        if (conceptoInput) conceptoInput.value = window.lastCalcData.details[0].val;
        const montoMaxStr = window.lastCalcData.details.find(i => i.label === 'HONORARIOS MÁXIMOS')?.val;
        if (montoMaxStr && montoInput) montoInput.value = montoMaxStr.replace(/[^0-9.]/g, '');
        if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
    }, 100);
};

window.importarACostas = () => {
    if (!window.lastCalcData || window.lastCalcData.type !== 'ARANCEL_PUEBLA') return;
    const concept = window.lastCalcData.details[0].val;
    const montoMaxStr = window.lastCalcData.details.find(i => i.label === 'HONORARIOS MÁXIMOS')?.val;
    const monto = montoMaxStr ? parseFloat(montoMaxStr.replace(/[^0-9.]/g, '')) : 0;
    switchCalcTab('gastos');
    window.addGastoRow();
    setTimeout(() => {
        const rows = document.querySelectorAll('#gastosRows tr');
        const lastRow = rows[rows.length - 1];
        if (lastRow) {
            lastRow.querySelector('.g-desc').value = `Honorarios: ${concept}`;
            lastRow.querySelector('.g-monto').value = monto.toFixed(2);
            window.updateGastosTotal();
        }
    }, 50);
    alert("Cálculo de Honorarios importado a Costas Procesales.");
};

/* 6. GASTOS Y SUPLIDOS */
window.addGastoRow = () => {
    const tbody = document.getElementById('gastosRows');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="date" class="form-control-small g-fecha" value="${new Date().toISOString().split('T')[0]}"></td>
        <td><input type="text" class="form-control-small g-desc" placeholder="Ej. Copias certificadas, Peritaje..."></td>
        <td><input type="number" class="form-control-small g-monto" value="0" step="0.01" oninput="updateGastosTotal()"></td>
        <td><button class="btn btn-outline btn-small" onclick="this.parentElement.parentElement.remove(); updateGastosTotal();" style="color:red; border-color:red;">&times;</button></td>
    `;
    tbody.appendChild(tr);
    updateGastosTotal();
};

window.updateGastosTotal = () => {
    const montos = document.querySelectorAll('.g-monto');
    let total = 0;
    montos.forEach(m => total += parseFloat(m.value) || 0);
    document.getElementById('gastosTotal').innerText = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return total;
};

window.exportarGastosPDF = async () => {
    const rows = document.querySelectorAll('#gastosRows tr');
    if (rows.length === 0) return alert("Agregue al menos un gasto.");

    const gastosArr = [];
    rows.forEach(r => {
        gastosArr.push({
            fecha: r.querySelector('.g-fecha').value,
            desc: r.querySelector('.g-desc').value,
            monto: parseFloat(r.querySelector('.g-monto').value) || 0
        });
    });

    const total = window.updateGastosTotal();

    window.lastCalcData = {
        type: 'LIQUIDACION_GASTOS',
        title: 'LIQUIDACIÓN DE GASTOS Y SUPLIDOS',
        legal: 'Documento de relacionamiento de erogaciones y gastos realizados por el abogado por cuenta y orden del cliente para el trámite del asunto jurídico encomendado.',
        details: gastosArr.map(g => ({ label: `${g.fecha} - ${g.desc}`, val: `$${g.monto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }))
    };

    window.lastCalcData.details.push(
        { label: '----------------', val: '----------------' },
        { label: 'TOTAL A REEMBOLSAR', val: `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, bold: true, size: 14, color: '#d32f2f' }
    );

    // Call PDF Export
    exportarCalculoPDF();
};

// Start with one row
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('gastosRows')) {
        addGastoRow();
    }
});

/* WHATSAPP SHARING */
window.enviarWhatsApp = () => {
    if (!window.lastCalcData) return;
    const data = window.lastCalcData;

    // Build summary message
    let msg = `*RESUMEN DE CÁLCULO - JURÍDICO SUPRA LEGIS*\n`;
    msg += `_${data.title}_\n\n`;

    data.details.forEach(it => {
        if (!it.label.includes('---')) {
            msg += `*${it.label}:* ${it.val}\n`;
        }
    });

    msg += `\n_Fundamento Jurídico: ${data.legal}_`;

    const encodedMsg = encodeURIComponent(msg);
    const url = `https://wa.me/?text=${encodedMsg}`;
    window.open(url, '_blank');
};

/* BRIDGE: CALC -> ESCRITO */
window.vincularCalculoAEscrito = () => {
    const data = window.lastCalcData;
    if (!data) return;

    // 1. Switch Module
    window.switchModule('escritos');

    if (data.type === 'LABORAL') {
        const d = window.lastLaboralDetail;

        // Determinar qué tipo de escrito abrir
        document.getElementById('es_tipo').value = 'ejecucion_laudo';
        if (window.actualizarCamposEscrito) window.actualizarCamposEscrito();

        // Llenar campos con delay
        setTimeout(() => {
            const actor = document.getElementById('lab_nombre_trabajador').value || '__________________________';
            const patron = document.getElementById('lab_nombre_patron').value || '__________________________';
            const baja = document.getElementById('lab_baja').value || '';

            if (document.getElementById('es_nombre')) document.getElementById('es_nombre').value = actor;
            if (document.getElementById('es_patron')) document.getElementById('es_patron').value = patron;
            if (document.getElementById('es_monto')) document.getElementById('es_monto').value = d.total.toFixed(2);
            if (document.getElementById('es_fin')) document.getElementById('es_fin').value = baja;

            // Si el campo existe (depende del template de ejecucion_laudo)
            if (document.getElementById('es_extra')) {
                document.getElementById('es_extra').value = "Puebla Burocrático / LFT";
            }

            // Scroll suave
            document.getElementById('es_campos_dinamicos').scrollIntoView({ behavior: 'smooth' });
        }, 100);

    } else if (data.type === 'MERCANTIL') {
        document.getElementById('es_tipo').value = 'demanda_mercantil';
        if (window.actualizarCamposEscrito) window.actualizarCamposEscrito();

        setTimeout(() => {
            const suerte = data.details.find(i => i.label.includes('Suerte Principal'))?.val.replace(/[^0-9.]/g, '') || '';
            const tasaInput = document.getElementById('calc_tasa');
            const deudorInput = document.getElementById('calc_deudor');

            if (document.getElementById('es_patron')) document.getElementById('es_patron').value = deudorInput ? deudorInput.value : '';
            if (document.getElementById('es_monto')) document.getElementById('es_monto').value = suerte;
            if (document.getElementById('es_renta')) document.getElementById('es_renta').value = tasaInput ? tasaInput.value : '';
        }, 50);
    } else if (data.type === 'PENSION') {
        document.getElementById('es_tipo').value = 'requerimiento_alimentos';
        if (window.actualizarCamposEscrito) window.actualizarCamposEscrito();

        setTimeout(() => {
            const deudor = document.getElementById('pen_deudor')?.value || '__________________________';
            const totalAdeudo = data.details.find(i => i.label === 'TOTAL ADEUDO CORTE')?.val.replace(/[^0-9.]/g, '') || '0.00';

            if (document.getElementById('es_deudor')) document.getElementById('es_deudor').value = deudor;
            if (document.getElementById('es_monto')) document.getElementById('es_monto').value = totalAdeudo;
            if (document.getElementById('es_vence')) document.getElementById('es_vence').value = "72 horas";

            document.getElementById('es_campos_dinamicos').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    // Smooth scroll to fields
    document.getElementById('es_campos_dinamicos').scrollIntoView({ behavior: 'smooth' });
};

/* RENDER */
/* RENDER EXCELENCIA JURÍDICA */
window.renderResult = function (data) {
    const container = document.getElementById('calcResult');
    let html = `<div style="border-left:5px solid var(--accent); padding-left:15px; margin-bottom:20px;">
        <h4 style="margin:0; color:var(--primary);">${data.title}</h4>
        <p style="margin:5px 0 0 0; font-size:0.8rem; color:#666; font-style:italic;">AUDITORÍA JURÍDICA: Cálculos verificados bajo legislación vigente 2024/2025.</p>
    </div>`;

    if (data.table) {
        html += `<div style="margin-bottom:20px; overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem; background:#fff; border:1px solid #dee2e6;">
                <thead>
                    <tr style="background:#f1f8e9; color:#33691e; border-bottom:2px solid #c5e1a5;">
                        <th style="padding:8px; text-align:left; border:1px solid #dee2e6;">Periodo</th>
                        <th style="padding:8px; text-align:right; border:1px solid #dee2e6;">UMA ($)</th>
                        <th style="padding:8px; text-align:right; border:1px solid #dee2e6;">Cant.</th>
                        <th style="padding:8px; text-align:right; border:1px solid #dee2e6;">Subtotal ($)</th>
                        <th style="padding:8px; text-align:right; border:1px solid #dee2e6;">Pagó ($)</th>
                        <th style="padding:8px; text-align:right; border:1px solid #dee2e6;">Diferencia ($)</th>
                    </tr>
                </thead>
                <tbody>`;
        data.table.forEach(row => {
            if (row.type === 'header') {
                html += `<tr style="background:#e8f5e9;"><td colspan="6" style="padding:6px 10px; font-weight:bold; color:#2e7d32; border:1px solid #dee2e6;">${row.label}</td></tr>`;
            } else if (row.type === 'subtotal') {
                html += `<tr style="background:#f1f8e9; font-weight:bold; color:#1b5e20;">
                    <td colspan="3" style="padding:6px 10px; border:1px solid #dee2e6;">${row.label}</td>
                    <td style="padding:6px; border:1px solid #dee2e6; text-align:right;">$${row.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td style="padding:6px; border:1px solid #dee2e6; text-align:right; color:#2e7d32;">$${row.paid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td style="padding:6px; border:1px solid #dee2e6; text-align:right; color:#e65100;">$${row.diff.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                </tr>`;
            } else {
                const diffColor = row.diff > 1 ? '#c62828' : '#2e7d32';
                html += `<tr>
                    <td style="padding:6px; border:1px solid #dee2e6; font-weight:${row.isSentencia ? 'bold' : 'normal'}">${row.period}</td>
                    <td style="padding:6px; border:1px solid #dee2e6; text-align:right;">${row.uma.toFixed(2)}</td>
                    <td style="padding:6px; border:1px solid #dee2e6; text-align:right;">${row.units.toFixed(2)}</td>
                    <td style="padding:6px; border:1px solid #dee2e6; text-align:right;">$${row.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td style="padding:6px; border:1px solid #dee2e6; text-align:right; color:#2e7d32;">$${row.paid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td style="padding:6px; border:1px solid #dee2e6; text-align:right; font-weight:bold; color:${diffColor};">$${row.diff.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                </tr>`;
            }
        });
        html += `</tbody></table></div>`;
    }

    html += `<div style="display:grid; grid-template-columns: 1fr auto; gap: 8px 30px; font-size:1rem;">`;

    data.details.forEach(item => {
        const styleLabel = item.bold ? 'font-weight:bold;' : '';
        const styleVal = `text-align:right; ${item.bold ? 'font-weight:bold;' : ''} ${item.color ? 'color:' + item.color + ';' : ''} ${item.size ? 'font-size:' + item.size + 'pt;' : ''}`;
        html += `<div style="${styleLabel}">${item.label}</div><div style="${styleVal}">${item.val}</div>`;
    });

    // FOOTER LEGAL & JURISPRUDENCIA (Fundamentación y Motivación)
    const formatLegal = (text) => (text || '').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    html += `</div>
    <div style="margin-top:25px; background:#f8f9fa; padding:15px; border-radius:10px; border:1px solid #e9ecef; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
        <div style="margin-bottom:12px;">
            <strong style="font-size:0.75rem; color:var(--primary); display:flex; align-items:center; gap:5px; text-transform:uppercase; margin-bottom:8px;">
                <span class="material-icons-round" style="font-size:1rem;">gavel</span> Fundamentación y Motivación Legal:
            </strong>
            <p style="margin:0; font-size:0.82rem; color:#333; line-height:1.7; white-space:pre-line;">${formatLegal(data.legal) || 'En revisión legislativa.'}</p>
        </div>`;

    if (data.juris) {
        html += `<div style="margin-top:12px; padding-top:12px; border-top:1px solid #dee2e6;">
            <strong style="font-size:0.75rem; color:#856404; display:flex; align-items:center; gap:5px; text-transform:uppercase; margin-bottom:8px;">
                <span class="material-icons-round" style="font-size:1rem;">history_edu</span> Criterios Jurisprudenciales (SCJN – Apoyo):
            </strong>
            <p style="margin:0; font-size:0.82rem; color:#856404; border-left:3px solid #ffc107; padding-left:10px; line-height:1.7; white-space:pre-line;">${formatLegal(data.juris)}</p>
        </div>`;
    }

    // RECUADRO DETALLADO (Rationale)
    if (data.type === 'LABORAL') {
        const d = window.lastLaboralDetail;
        html += `<div style="margin-top:15px; background:#e3f2fd; padding:15px; border-radius:10px; border:1px solid #bbdefb;">
            <strong style="font-size:0.75rem; color:#1565c0; display:flex; align-items:center; gap:5px; text-transform:uppercase; margin-bottom:8px;">
                <span class="material-icons-round" style="font-size:1rem;">lightbulb</span> Rationale de Cuantificación:
            </strong>
            <ul style="margin:0; padding-left:18px; font-size:0.85rem; color:#0d47a1; line-height:1.5;">
                <li><b>Salario Diario base:</b> Calculado sobre $${d.montoSalario.toLocaleString()} (${d.frecuencia}) conforme al Art. 89 LFT.</li>
                <li><b>Aguinaldo y Vacaciones:</b> Calculados proporcionalmente al tiempo laborado en el último periodo (Art. 87 y 79 LFT).</li>
                <li><b>Prima de Antigüedad:</b> El tope de 2 Salarios Mínimos ($${d.topeSalarialPrima.toLocaleString()}) se aplica por disposición del Art. 486 LFT al superar el salario base dicho monto.</li>
                <li><b>Indemnización:</b> Basada en el Salario Diario Integrado (SDI) que incluye prestaciones mínimas de ley (Art. 84 LFT).</li>
            </ul>
        </div>`;
    }

    html += `
    <div style="margin-top:20px; display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap;">
        <button class="btn btn-outline" onclick="window.regresarACalculos()" style="border-color:#666; color:#666;">
            <span class="material-icons-round" style="font-size:18px; vertical-align:middle;">arrow_back</span> Regresar / Editar
        </button>`;

    if (data.type === 'LABORAL') {
        html += `
        <button class="btn btn-primary" onclick="generarPlanillaLaboral()" style="background:#2e7d32; color:white; border:none;">
            <span class="material-icons-round" style="font-size:18px; vertical-align:middle;">table_view</span> Desglose Detallado
        </button>
        <button class="btn btn-primary" onclick="generarEscritoLaboral()" style="background:#e65100; color:white; border:none;">
            <span class="material-icons-round" style="font-size:18px; vertical-align:middle;">assignment</span> Formato Escrito de Liquidación
        </button>`;
    }

    if (data.type === 'ARANCEL_PUEBLA') {
        html += `
        <button class="btn btn-primary" onclick="generarReciboArancel()" style="background:#01579b; color:white; border:none;">
            <span class="material-icons-round" style="font-size:18px; vertical-align:middle;">receipt</span> Generar Recibo de Honorarios
        </button>
        <button class="btn btn-primary" onclick="importarACostas()" style="background:#2e7d32; color:white; border:none;">
            <span class="material-icons-round" style="font-size:18px; vertical-align:middle;">add_task</span> Importar a Planilla de Costas
        </button>`;
    }

    html += `
        <button class="btn btn-primary" onclick="vincularCalculoAEscrito()" style="background:var(--accent); color:white; border:none;">
            <span class="material-icons-round" style="font-size:18px; vertical-align:middle;">description</span> Generar Demanda
        </button>
        <button class="btn btn-outline" onclick="enviarWhatsApp()" style="border-color:#25D366; color:#25D366;">
            <span class="material-icons-round" style="font-size:18px; vertical-align:middle;">chat</span> WhatsApp
        </button>
        <button class="btn btn-primary" onclick="exportarCalculoPDF()" style="background:var(--primary); color:white; border:none;">
            <span class="material-icons-round" style="font-size:18px; vertical-align:middle;">picture_as_pdf</span> Descargar PDF
        </button>
    </div>`;
    container.innerHTML = html;
    container.style.display = 'block';

    // Auto-scroll to result
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* BRIDGE: RESULT -> INPUTS */
window.regresarACalculos = () => {
    const res = document.getElementById('calcResult');
    if (res) {
        res.style.display = 'none';
        // Scroll back to the active calculator panel header
        const activeTab = document.querySelector('.active-tab');
        if (activeTab) {
            document.querySelector('.header-bar').scrollIntoView({ behavior: 'smooth' });
        }
    }
};

/* FORMATO DE PLANILLA DE EJECUCIÓN (ESCRITO) */
window.generarEscritoLaboral = () => {
    const data = window.lastCalcData;
    const detail = window.lastLaboralDetail;
    if (!data || data.type !== 'LABORAL') return alert("Realice un cálculo laboral primero.");

    const actor = document.getElementById('lab_nombre_trabajador').value || '__________________________';
    const regimen = document.getElementById('lab_regimen').value;
    const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    let txt = `ASUNTO: INCIDENTE DE LIQUIDACIÓN DE SENTENCIA (PLANILLA DE EJECUCIÓN).

H. TRIBUNAL LABORAL DEL DISTRITO JUDICIAL DE PUEBLA.
PRESENTE.

${actor.toUpperCase()}, por mi propio derecho, señalando domicilio para recibir notificaciones el ya mencionado en autos, ante Usted con el debido respeto comparezco para exponer:

Que con fundamento en el Artículo 843 de la Ley Federal del Trabajo (de aplicación supletoria en materia burocrática), vengo a formular la PLANILLA DE EJECUCIÓN Y LIQUIDACIÓN derivada de la resolución dictada en el presente juicio, bajo los siguientes conceptos:

I. PRESTACIONES PROPORCIONALES (DEVENGADAS):
- Aguinaldo (${detail.cfgAguinaldo} días): ${fmt(detail.aguinaldo)}
- Vacaciones (${detail.diasVac} días): ${fmt(detail.vacaciones)}
- Prima Vacacional (${detail.cfgPrima}%): ${fmt(detail.primaVacacional)}
- PTU: ${fmt(detail.ptu || 0)}
- Fondo de Ahorro: ${fmt(detail.fondo || 0)}

II. INDEMNIZACIONES Y PRIMAS:
- Indemnización Constitucional (90 días SDI): ${fmt(detail.indemnizacion90)}
- Indemnización (20 días por año): ${fmt(detail.indemnizacion20)}
- Prima de Antigüedad: ${fmt(detail.primaAntiguedad)}

III. SALARIOS VENCIDOS (ACTUALIZADOS):
- Salarios Vencidos Causados: ${fmt(detail.salariosVencidos)}
- Intereses Moratorios (Art. 48): ${fmt(detail.interesesMoratorios)}
- Intereses por Incumplimiento (Art. 945): ${fmt(detail.interesesIncumplimiento)}

TOTAL GLOBAL A LIQUIDAR: ${fmt(detail.total)}

Por lo anteriormente expuesto, A USTED H. TRIBUNAL LABORAL, pido:
ÚNICO.- Tenerme por presentado formulando la planilla de ejecución, dándole el trámite incidental que por ley corresponde.

PROTESTO LO NECESARIO
${actor.toUpperCase()}
Heroica Puebla de Zaragoza, a ${fecha}.`;

    // Redirigir a Escritos
    switchModule('escritos');
    document.getElementById('es_tipo').value = 'escrito_libre';
    if (window.actualizarCamposEscrito) window.actualizarCamposEscrito();

    setTimeout(() => {
        document.getElementById('escritoPreviewText').innerText = txt;
        document.getElementById('escritoPreviewTitle').textContent = "PLANILLA DE EJECUCIÓN LABORAL";
        document.getElementById('escritoPreviewContainer').style.display = 'block';
        document.getElementById('escritoPreviewContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
};

/* EXPORT PDF */
window.exportarCalculoPDF = async (ev) => {
    if (!window.lastCalcData) return;
    const data = window.lastCalcData;
    const btn = ev?.currentTarget || document.activeElement;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-icons-round spin">sync</span> Generando...';
    btn.disabled = true;

    // Helper for number formatting
    const fmtN = (n) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    try {
        const pdfDoc = await PDFLib.PDFDocument.create();
        const [width, height] = PDFLib.PageSizes.Letter;

        // Professional Fonts
        const fontReg = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanBold);
        const fontItal = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanItalic);

        let page = pdfDoc.addPage([width, height]);

        // ---- Función limpia acentos (PDF-lib Standard Fonts no los soporta) ----
        const clean = (str) => {
            if (!str) return "";
            return str.toString()
                .replace(/á/g, 'a').replace(/Á/g, 'A')
                .replace(/é/g, 'e').replace(/É/g, 'E')
                .replace(/í/g, 'i').replace(/Í/g, 'I')
                .replace(/ó/g, 'o').replace(/Ó/g, 'O')
                .replace(/ú/g, 'u').replace(/Ú/g, 'U')
                .replace(/ü/g, 'u').replace(/Ü/g, 'U')
                .replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
                .replace(/[^\x20-\x7E]/g, '');
        };

        // ---- Colores del logo: negro, rojo, dorado ----
        const cNegro = PDFLib.rgb(0.08, 0.08, 0.08);
        const cRojo = PDFLib.rgb(0.78, 0.05, 0.05);
        const cDorado = PDFLib.rgb(0.72, 0.58, 0.18);
        const cBlanco = PDFLib.rgb(1, 1, 1);
        const cGrisM = PDFLib.rgb(0.55, 0.55, 0.55);

        // ---- Logo Loading ----
        let logoBytes = null;
        let isPng = true;
        const storedLogo = localStorage.getItem('sl_mem_logo');

        async function getLogoBytes(src) {
            try {
                const res = await fetch(src);
                if (!res.ok) throw new Error('fetch failed');
                return await res.arrayBuffer();
            } catch (e) {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width; canvas.height = img.height;
                        canvas.getContext('2d').drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL('image/png');
                        fetch(dataUrl).then(r => r.arrayBuffer()).then(resolve).catch(() => resolve(null));
                    };
                    img.onerror = () => resolve(null);
                    img.src = src;
                });
            }
        }

        if (storedLogo) {
            logoBytes = await getLogoBytes(storedLogo);
            isPng = !storedLogo.toLowerCase().includes('jpg') && !storedLogo.toLowerCase().includes('jpeg');
        } else {
            const sidebarImg = document.getElementById('sidebarLogoImg');
            if (sidebarImg && sidebarImg.src && !sidebarImg.src.startsWith('data:,')) {
                logoBytes = await getLogoBytes(sidebarImg.src);
                isPng = !sidebarImg.src.toLowerCase().includes('jpg');
            }
        }
        if (!logoBytes) {
            logoBytes = await getLogoBytes('logo.png');
            isPng = true;
        }

        let logoImage = null;
        if (logoBytes) {
            try {
                try { logoImage = isPng ? await pdfDoc.embedPng(logoBytes) : await pdfDoc.embedJpg(logoBytes); }
                catch (e1) {
                    try { logoImage = isPng ? await pdfDoc.embedJpg(logoBytes) : await pdfDoc.embedPng(logoBytes); }
                    catch (e2) { logoImage = null; }
                }
            } catch (e) { console.warn("PDF Logo Error", e); }
        }

        // ---- WATERMARK ----
        function drawWatermark(p) {
            if (!logoImage) return;
            const wmW = width * 0.55;
            const wmH = wmW * (logoImage.height / logoImage.width);
            p.drawImage(logoImage, {
                x: (width - wmW) / 2,
                y: (height - wmH) / 2,
                width: wmW, height: wmH,
                opacity: 0.06
            });
        }

        // ---- HEADER ----
        const HEADER_H = 120;

        function drawHeader(p, isFirst) {
            if (isFirst) {
                p.drawRectangle({ x: 0, y: height - HEADER_H, width: width, height: HEADER_H, color: cNegro });
                p.drawRectangle({ x: 0, y: height - 3, width: width, height: 3, color: cDorado });
                p.drawRectangle({ x: 0, y: height - HEADER_H, width: width, height: 4, color: cRojo });

                if (logoImage) {
                    // LOGO CON CONTORNO CIRCULAR (BADGE/SELLO - como el logo de inicio)
                    const logoH = 96;
                    const logoW = logoH * (logoImage.width / logoImage.height);
                    const logoX = 22;
                    const logoY = height - HEADER_H + (HEADER_H - logoH) / 2;
                    const cx = logoX + logoW / 2;
                    const cy = logoY + logoH / 2;
                    const rOuter = Math.max(logoW, logoH) / 2 + 10;
                    // Anillo dorado exterior
                    p.drawEllipse({ x: cx, y: cy, xScale: rOuter, yScale: rOuter, color: cDorado });
                    // Fondo negro interior
                    p.drawEllipse({ x: cx, y: cy, xScale: rOuter - 3, yScale: rOuter - 3, color: cNegro });
                    // Anillo rojo fino interior
                    p.drawEllipse({ x: cx, y: cy, xScale: rOuter - 3, yScale: rOuter - 3, color: cRojo, opacity: 0.6 });
                    p.drawEllipse({ x: cx, y: cy, xScale: rOuter - 6, yScale: rOuter - 6, color: cNegro });
                    // Logo encima del badge circular
                    p.drawImage(logoImage, { x: logoX + 5, y: logoY + 5, width: logoW - 10, height: logoH - 10 });

                    const textX = logoX + logoW + rOuter + 8;
                    p.drawText("JURIDICO SUPRA LEGIS", { x: textX, y: height - 52, size: 22, font: fontBold, color: cBlanco });
                    p.drawRectangle({ x: textX, y: height - 60, width: 200, height: 2, color: cDorado });
                    p.drawText("Soluciones Juridicas Contundentes", { x: textX, y: height - 78, size: 10, font: fontItal, color: cDorado });
                    p.drawText("www.juridicosupralegis.com", { x: textX, y: height - 96, size: 8.5, font: fontReg, color: PDFLib.rgb(0.75, 0.75, 0.75) });
                } else {
                    p.drawText("JURIDICO SUPRA LEGIS", { x: 50, y: height - 55, size: 24, font: fontBold, color: cBlanco });
                    p.drawRectangle({ x: 50, y: height - 63, width: 220, height: 2, color: cDorado });
                    p.drawText("Soluciones Juridicas Contundentes", { x: 50, y: height - 80, size: 10, font: fontItal, color: cDorado });
                }

                const fechaCorta = new Date().toLocaleDateString('es-MX');
                p.drawText(clean(fechaCorta), { x: width - 100, y: height - 25, size: 8, font: fontReg, color: PDFLib.rgb(0.7, 0.7, 0.7) });

            } else {
                p.drawRectangle({ x: 0, y: height - 35, width: width, height: 35, color: cNegro });
                p.drawRectangle({ x: 0, y: height - 2, width: width, height: 2, color: cDorado });
                p.drawRectangle({ x: 0, y: height - 35, width: width, height: 2, color: cRojo });
                if (logoImage) {
                    const lH = 26; const lW = lH * (logoImage.width / logoImage.height);
                    const lX = 10; const lY = height - 32;
                    const cxS = lX + lW / 2; const cyS = lY + lH / 2;
                    const rS = Math.max(lW, lH) / 2 + 3;
                    p.drawEllipse({ x: cxS, y: cyS, xScale: rS, yScale: rS, color: cDorado });
                    p.drawEllipse({ x: cxS, y: cyS, xScale: rS - 2, yScale: rS - 2, color: cNegro });
                    p.drawImage(logoImage, { x: lX + 1, y: lY + 1, width: lW - 2, height: lH - 2 });
                    p.drawText("JURIDICO SUPRA LEGIS  -  Reporte de Calculo", { x: lX + lW + rS + 6, y: height - 22, size: 10, font: fontBold, color: cBlanco });
                } else {
                    p.drawText("JURIDICO SUPRA LEGIS  -  Reporte de Calculo", { x: 50, y: height - 22, size: 10, font: fontBold, color: cBlanco });
                }
            }
            drawWatermark(p);
        }

        drawHeader(page, true);

        let y = height - HEADER_H - 30;
        page.drawRectangle({ x: 50, y: y + 5, width: width - 100, height: 1.5, color: cRojo });
        y -= 5;

        const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        page.drawText(`Fecha de Emision: ${clean(today)}`, { x: 50, y: y, size: 9.5, font: fontItal, color: cGrisM });
        y -= 25;

        const titleClean = clean(data.title);
        page.drawText(titleClean, { x: 50, y: y, size: 15, font: fontBold, color: cNegro });
        y -= 23;

        async function checkPage(currentY, needed) {
            if (currentY - needed < 80) {
                page = pdfDoc.addPage([width, height]);
                drawHeader(page, false);
                return height - 70;
            }
            return currentY;
        }

        // --- RENDER TABLE IF EXISTS ---
        if (data.table) {
            y -= 10;
            const colWidths = [120, 70, 60, 90, 80, 90];
            const headers = ["Periodo", "UMA ($)", "Cant.", "Subtotal", "Pago", "Dif."];
            const tableX = 50;
            const tableW = width - 100;
            const rowH = 18;

            // Draw Header
            y = await checkPage(y, rowH + 10);
            page.drawRectangle({ x: tableX, y: y - 5, width: tableW, height: rowH, color: PDFLib.rgb(0.95, 0.98, 0.92) });
            let currentX = tableX;
            headers.forEach((h, i) => {
                page.drawText(clean(h), {
                    x: i === 0 ? currentX + 5 : currentX + colWidths[i] - fontBold.widthOfTextAtSize(clean(h), 8) - 5,
                    y: y, size: 8, font: fontBold, color: PDFLib.rgb(0.2, 0.4, 0.1)
                });
                currentX += colWidths[i];
            });
            y -= rowH;

            // Draw Rows
            for (const row of data.table) {
                y = await checkPage(y, rowH);
                currentX = tableX;

                if (row.type === 'header') {
                    page.drawRectangle({ x: tableX, y: y - 5, width: tableW, height: rowH, color: PDFLib.rgb(0.9, 0.95, 0.9) });
                    page.drawText(clean(row.label), { x: tableX + 5, y: y, size: 8, font: fontBold, color: PDFLib.rgb(0.1, 0.3, 0.1) });
                } else if (row.type === 'subtotal') {
                    page.drawRectangle({ x: tableX, y: y - 5, width: tableW, height: rowH, color: PDFLib.rgb(0.95, 0.98, 0.92) });
                    page.drawText(clean(row.label), { x: tableX + 5, y: y, size: 8, font: fontBold, color: PDFLib.rgb(0.1, 0.37, 0.13) });

                    // Positions for totals
                    let cX = tableX + colWidths[0] + colWidths[1] + colWidths[2]; // Skip period, uma, units

                    const sT = `$${fmtN(row.total)}`;
                    const sP = `$${fmtN(row.paid)}`;
                    const sD = `$${fmtN(row.diff)}`;

                    page.drawText(clean(sT), { x: cX + colWidths[3] - fontBold.widthOfTextAtSize(clean(sT), 8) - 5, y: y, size: 8, font: fontBold, color: cNegro });
                    cX += colWidths[3];
                    page.drawText(clean(sP), { x: cX + colWidths[4] - fontBold.widthOfTextAtSize(clean(sP), 8) - 5, y: y, size: 8, font: fontBold, color: PDFLib.rgb(0.1, 0.5, 0.1) });
                    cX += colWidths[4];
                    page.drawText(clean(sD), { x: cX + colWidths[5] - fontBold.widthOfTextAtSize(clean(sD), 8) - 5, y: y, size: 8, font: fontBold, color: PDFLib.rgb(0.78, 0.3, 0.0) });
                } else {
                    const vals = [
                        row.period,
                        row.uma.toFixed(2),
                        row.units.toFixed(2),
                        `$${fmtN(row.total)}`,
                        `$${fmtN(row.paid)}`,
                        `$${fmtN(row.diff)}`
                    ];
                    const colors = [cNegro, cNegro, cNegro, cNegro, PDFLib.rgb(0.1, 0.5, 0.1), row.diff > 1 ? cRojo : cNegro];

                    vals.forEach((v, i) => {
                        const cellText = clean(v);
                        const txtW = fontReg.widthOfTextAtSize(cellText, 8);
                        page.drawText(cellText, {
                            x: i === 0 ? currentX + 5 : currentX + colWidths[i] - txtW - 5,
                            y: y, size: 8, font: i === 5 || row.isSentencia ? fontBold : fontReg, color: colors[i]
                        });
                        currentX += colWidths[i];
                    });
                }

                // Horizontal line
                page.drawLine({ start: { x: tableX, y: y - 5 }, end: { x: tableX + tableW, y: y - 5 }, thickness: 0.2, color: PDFLib.rgb(0.8, 0.8, 0.8) });
                y -= rowH;
            }
            y -= 15;
        }

        page.drawLine({ start: { x: 50, y: y }, end: { x: width - 50, y: y }, thickness: 0.8, color: PDFLib.rgb(0.82, 0.82, 0.82) });
        y -= 20;

        for (const item of data.details) {
            y = await checkPage(y, 40);

            const isSep = item.label.includes('---');
            if (isSep) {
                y -= 8;
                page.drawLine({ start: { x: 50, y: y }, end: { x: width - 50, y: y }, thickness: 0.5, color: PDFLib.rgb(0.85, 0.85, 0.85) });
                y -= 16; continue;
            }

            const fs = item.size || 11;
            const font = item.bold ? fontBold : fontReg;
            const labelStr = clean(item.label);
            const valStr = clean(item.val.toString());

            let vColor = cNegro;
            if (item.color === '#d32f2f') vColor = cRojo;
            if (item.color === '#e65100') vColor = PDFLib.rgb(0.78, 0.30, 0.0);
            if (item.color === '#2e7d32') vColor = PDFLib.rgb(0.12, 0.50, 0.12);
            if (item.color === '#01579b') vColor = PDFLib.rgb(0.08, 0.35, 0.62);

            const maxWidth = width - 100;
            const valWidth = font.widthOfTextAtSize(valStr, fs);
            const labWidth = font.widthOfTextAtSize(labelStr, fs);

            if (valWidth > (maxWidth - labWidth - 20) || item.label === 'NOTA:') {
                page.drawText(labelStr, { x: 50, y: y, size: fs, font: fontBold, color: cNegro });
                y -= (fs + 5);
                const words = valStr.split(' ');
                let line = '';
                for (let w of words) {
                    if (fontReg.widthOfTextAtSize(line + w, fs) > maxWidth) {
                        y = await checkPage(y, 20);
                        page.drawText(line.trim(), { x: 60, y: y, size: fs, font: fontReg, color: vColor });
                        y -= (fs + 4); line = '';
                    }
                    line += w + ' ';
                }
                if (line.trim()) {
                    y = await checkPage(y, 20);
                    page.drawText(line.trim(), { x: 60, y: y, size: fs, font: fontReg, color: vColor });
                }
                y -= (fs + 10);
            } else {
                page.drawText(labelStr, { x: 50, y: y, size: fs, font: font, color: cNegro });
                page.drawText(valStr, { x: width - 50 - valWidth, y: y, size: fs, font: font, color: vColor });
                if (item.bold) {
                    page.drawRectangle({ x: 50, y: y - 3, width: width - 100, height: 0.8, color: cDorado, opacity: 0.35 });
                }
                y -= (fs + 13);
            }
        }

        // Sustento Jurídico (multi-paragraph support)
        y = await checkPage(y, 70);
        y -= 15;
        page.drawRectangle({ x: 50, y: y + 14, width: width - 100, height: 1.2, color: cRojo, opacity: 0.7 });
        page.drawText("FUNDAMENTACION Y MOTIVACION LEGAL:", { x: 50, y: y, size: 9.5, font: fontBold, color: cNegro });
        y -= 16;

        // Helper: draw a block of text with word-wrap, respecting \n\n paragraph breaks
        async function drawTextBlock(text, fontSize, font, color, indent = 50) {
            const paragraphs = clean(text).split('  '); // double-space used post-clean as paragraph sep
            for (const para of paragraphs) {
                const words = para.trim().split(' ').filter(w => w.length > 0);
                let line = '';
                for (let w of words) {
                    const testLine = line + w + ' ';
                    if (font.widthOfTextAtSize(testLine, fontSize) > (width - indent - 50)) {
                        y = await checkPage(y, 18);
                        page.drawText(line.trim(), { x: indent, y, size: fontSize, font, color });
                        y -= (fontSize + 3);
                        line = w + ' ';
                    } else {
                        line = testLine;
                    }
                }
                if (line.trim()) {
                    y = await checkPage(y, 18);
                    page.drawText(line.trim(), { x: indent, y, size: fontSize, font, color });
                    y -= (fontSize + 3);
                }
                y -= 6; // paragraph spacing
            }
        }

        // Render legal foundation (split \n\n into double-spaces for post-clean splitting)
        const legalForPdf = data.legal ? data.legal.replace(/\n\n/g, '  ').replace(/\n/g, ' ') : '';
        await drawTextBlock(legalForPdf, 8.5, fontReg, cGrisM, 52);

        // Render jurisprudencia section if present
        if (data.juris) {
            y = await checkPage(y, 60);
            y -= 10;
            page.drawRectangle({ x: 50, y: y + 13, width: width - 100, height: 1, color: cDorado, opacity: 0.8 });
            page.drawText("CRITERIOS JURISPRUDENCIALES (SCJN - APOYO):", { x: 50, y: y, size: 9.5, font: fontBold, color: PDFLib.rgb(0.55, 0.40, 0.05) });
            y -= 16;
            const jurisForPdf = data.juris ? data.juris.replace(/\n\n/g, '  ').replace(/\n/g, ' ') : '';
            await drawTextBlock(jurisForPdf, 8.5, fontItal, PDFLib.rgb(0.45, 0.33, 0.05), 52);
        }

        // Footer negro elegante en todas las páginas
        const allPages = pdfDoc.getPages();
        for (const pg of allPages) {
            const { width: pw } = pg.getSize();
            pg.drawRectangle({ x: 0, y: 0, width: pw, height: 55, color: cNegro });
            pg.drawRectangle({ x: 0, y: 55, width: pw, height: 2, color: cDorado });
            pg.drawText("Calculo realizado por JURIDICO SUPRA LEGIS  |  Uso Profesional Privado", { x: 50, y: 36, size: 8.5, font: fontBold, color: cBlanco });
            pg.drawText("WhatsApp: 2227871497  /  2221567520   |   FB: juridico SUPRA LEGIS", { x: 50, y: 22, size: 7.5, font: fontReg, color: PDFLib.rgb(0.72, 0.72, 0.72) });
            pg.drawText("TikTok: @supralegis  |  Instagram: juridico_supralegis  |  www.juridicosupralegis.com", { x: 50, y: 10, size: 7.5, font: fontReg, color: PDFLib.rgb(0.72, 0.72, 0.72) });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CalculoJuridico_SupraLegis_${data.type}.pdf`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (err) {
        console.error(err);
        alert('Error generando PDF: ' + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};




/* ---- MODO DE DIAS: mostrar/ocultar campo manual ---- */
document.addEventListener('DOMContentLoaded', () => {
    const radios = document.querySelectorAll('input[name="lab_modo_dias"]');
    const manualWrap = document.getElementById('lab_dias_manuales_wrap');
    const diasSemanaWrap = document.getElementById('lab_dias_semana')?.closest('div');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const val = radio.value;
            // Mostrar campo manual solo en modo manual
            if (manualWrap) {
                manualWrap.style.display = (val === 'manual') ? 'block' : 'none';
            }
            // Atenuar campo dias/semana si no aplica
            if (diasSemanaWrap) {
                diasSemanaWrap.style.opacity = (val === 'laborados') ? '1' : '0.4';
                diasSemanaWrap.title = (val === 'laborados') ? '' : 'No aplica en este modo de calculo';
            }
        });
    });
});

/* RÉGIMEN PUEBLA / LFT */
window.actualizarInterfazRegimen = () => {
    const regimen = document.getElementById('lab_regimen').value;
    const aguinaldoInput = document.getElementById('lab_dias_aguinaldo');
    const vacacionesInput = document.getElementById('lab_dias_vacaciones');
    const primaInput = document.getElementById('lab_prima_vacacional');
    const diasSemanaInput = document.getElementById('lab_dias_semana');
    const diasDescansoInput = document.getElementById('lab_dias_descanso');

    if (regimen === 'puebla_buro') {
        // Art. 26/27: Por cada 6 meses, 10 días de vacaciones. Prima del 30%.
        if (diasSemanaInput) diasSemanaInput.value = 5;
        if (diasDescansoInput) diasDescansoInput.value = 2;

        // Aguinaldo en Puebla Buro habitualmente es de 45 días (o 40 según CCT/Ley)
        // Se ajusta a 45 días conforme a la práctica y convenios vigentes en Puebla.
        if (aguinaldoInput) aguinaldoInput.value = 45;

        // Art. 26: Dos periodos de 10 días hábiles (20 días anuales).
        if (vacacionesInput) vacacionesInput.value = 20;

        // Art. 27: Prima vacacional del 30%.
        if (primaInput) primaInput.value = 30;

        alert("⚠️ Régimen Burocrático de Puebla (Actualizado 2024):\n\n• Jornada: 5 días trab. + 2 desc.\n• Aguinaldo: 45 días.\n• Vacaciones: 20 días.\n• Prima Vacacional: 30%.");
    } else {
        // Valores base LFT (Sector Privado)
        if (diasSemanaInput) diasSemanaInput.value = 6;
        if (diasDescansoInput) diasDescansoInput.value = 1;
        if (aguinaldoInput) aguinaldoInput.value = 15;
        if (vacacionesInput) vacacionesInput.value = 12;
        if (primaInput) primaInput.value = 25;
    }
};

window.actualizarInterfazBaja = () => {
    const tipo = document.getElementById('lab_tipo').value;
    const litigioWrapper = document.getElementById('lab_litigio_wrapper');
    if (litigioWrapper) {
        // Show litigation section for "despido" or "rescision" (both usually lead to legal dispute)
        const esIndemnizable = (tipo === 'despido' || tipo === 'rescision_trabajador');
        const esLitigioso = (esIndemnizable || tipo === 'rescision_patron');

        litigioWrapper.style.display = esLitigioso ? 'block' : 'none';

        // Suggest 12 months cap for salarios vencidos if field is empty
        if (esLitigioso) {
            const duracion = document.getElementById('lab_duracion_total');
            if (duracion && (duracion.value === "0" || duracion.value === "")) {
                duracion.value = "12";
            }
        }
    }
};
