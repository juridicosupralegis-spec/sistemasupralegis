document.addEventListener('DOMContentLoaded', () => {
    console.log("APP VERSION: V2 - LEFT ALIGN FIXED");

    /* --- NAVIGATION --- */
    window.switchModule = (moduleId) => {
        // Toggle Active Classes
        document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
        const targetModule = document.getElementById(moduleId);
        if (targetModule) targetModule.classList.add('active');

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        // Si viene de un click directo, activamos el boton. Si es por codigo, buscamos el boton que corresponde.
        if (window.event && window.event.currentTarget && window.event.currentTarget.classList.contains('nav-item')) {
            window.event.currentTarget.classList.add('active');
        } else {
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const onclickAttr = item.getAttribute('onclick') || '';
                if (onclickAttr.includes(`switchModule('${moduleId}')`)) {
                    item.classList.add('active');
                }
            });
        }

        // Render on entry
        if (moduleId === 'agenda') renderCalendar();
        if (moduleId === 'escritos') renderEscritosCarpeta();
        if (moduleId === 'fichas') renderFichas();
        if (moduleId === 'generales') renderGenerales();
    };

    /* --- MODAL HANDLING --- */
    window.openModal = (id) => {
        document.getElementById(id).classList.add('open');
    };
    window.closeModal = (id) => {
        document.getElementById(id).classList.remove('open');
        // Reset flip if closing doc view
        if (id === 'modalViewDocument') {
            document.getElementById('docFlipper').classList.remove('flipped');
        }
    };

    /* --- SEGURIDAD: PIN LOCK SYSTEM --- */
    let currentInputPin = "";
    const savedPin = localStorage.getItem('sl_app_pin');

    window.checkStartupPin = () => {
        if (savedPin) {
            document.getElementById('pinLockScreen').style.display = 'flex';
        }
    };

    window.pressPin = (num) => {
        if (currentInputPin.length < 4) {
            currentInputPin += num;
            updatePinDots();
        }
        if (currentInputPin.length === 4) {
            // Auto check maybe? No, let's wait for OK or just auto-check
            setTimeout(checkPin, 300);
        }
    };

    window.clearPin = () => {
        currentInputPin = "";
        updatePinDots();
        document.getElementById('pinMsg').innerText = "";
    };

    function updatePinDots() {
        const display = document.getElementById('pinDisplay');
        display.innerText = "●".repeat(currentInputPin.length) + "○".repeat(4 - currentInputPin.length);
    }

    window.checkPin = () => {
        if (currentInputPin === savedPin) {
            document.getElementById('pinLockScreen').classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('pinLockScreen').style.display = 'none';
            }, 500);
        } else {
            document.getElementById('pinMsg').innerText = "PIN INCORRECTO";
            currentInputPin = "";
            setTimeout(updatePinDots, 500);
        }
    };

    window.removePin = () => {
        if (confirm("¿Seguro que desea eliminar la protección por PIN?")) {
            localStorage.removeItem('sl_app_pin');
            alert("Seguridad desactivada.");
            location.reload();
        }
    };

    // Run startup check
    checkStartupPin();
    updatePinDots();

    window.flipCard = () => {
        document.getElementById('docFlipper').classList.toggle('flipped');
    }

    /* --- STORAGE HELPERS --- */
    const getStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // Helper: Save PDF - blob download (compatible con file:// y http://)
    async function savePdfToDisk(bytes, filename) {
        // Try showSaveFilePicker first (only works on https:// or localhost)
        if (window.showSaveFilePicker && window.location.protocol !== 'file:') {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: [{ description: 'Documento PDF', accept: { 'application/pdf': ['.pdf'] } }],
                });
                const writable = await handle.createWritable();
                await writable.write(bytes);
                await writable.close();
                return;
            } catch (err) {
                if (err.name === 'AbortError') return; // User cancelled dialog
                // Fall through to blob download on any other error
            }
        }
        // Fallback: blob download (works on file://, http://, everywhere)
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    /* --- PDF BRANDING HELPER --- */
    async function drawPDFBranding(pdfDoc, page, title, isFirst) {
        if (!title) title = localStorage.getItem('sl_mem_title') || 'JURIDICO SUPRA LEGIS';
        if (isFirst === undefined) isFirst = true;
        const { width, height } = page.getSize();
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanBold);
        const fontReg = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
        const fontItal = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanItalic);

        // Paleta colores del logo: negro, rojo, dorado
        const cNegro = PDFLib.rgb(0.08, 0.08, 0.08);
        const cRojo = PDFLib.rgb(0.78, 0.05, 0.05);
        const cDorado = PDFLib.rgb(0.72, 0.58, 0.18);
        const cBlanco = PDFLib.rgb(1, 1, 1);

        // --- ROBUST LOGO LOADING ---
        let logoBytes = null;
        let isPng = true;

        // Read any img element directly using canvas (no CORS issues)
        function imgToArrayBuffer(imgEl) {
            return new Promise((resolve) => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = imgEl.naturalWidth || imgEl.width || 200;
                    canvas.height = imgEl.naturalHeight || imgEl.height || 200;
                    canvas.getContext('2d').drawImage(imgEl, 0, 0);
                    const dataUrl = canvas.toDataURL('image/png');
                    // Convert dataUrl to ArrayBuffer
                    const base64 = dataUrl.split(',')[1];
                    const binary = atob(base64);
                    const buffer = new ArrayBuffer(binary.length);
                    const view = new Uint8Array(buffer);
                    for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
                    resolve(buffer);
                } catch (e) { resolve(null); }
            });
        }

        async function getLogoBytes(src) {
            // First try: load as URL via fetch
            try {
                const res = await fetch(src, { cache: 'force-cache' });
                if (res.ok) return await res.arrayBuffer();
            } catch (e) { /* continue */ }
            // Second try: use an Image + canvas
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => imgToArrayBuffer(img).then(resolve);
                img.onerror = () => resolve(null);
                img.src = src;
            });
        }

        // Try loading logo: stored URL > sidebar img element > logo.png file
        const storedLogo = localStorage.getItem('sl_mem_logo');
        const sidebarImg = document.getElementById('sidebarLogoImg');

        if (storedLogo) {
            logoBytes = await getLogoBytes(storedLogo);
            isPng = !storedLogo.toLowerCase().includes('.jpg') && !storedLogo.toLowerCase().includes('.jpeg');
        }
        if (!logoBytes && sidebarImg && sidebarImg.complete && sidebarImg.naturalWidth > 0) {
            // Use the already-loaded sidebar img directly (fastest, no CORS)
            logoBytes = await imgToArrayBuffer(sidebarImg);
            isPng = true;
        }
        if (!logoBytes && sidebarImg && sidebarImg.src) {
            logoBytes = await getLogoBytes(sidebarImg.src);
            isPng = !sidebarImg.src.toLowerCase().includes('.jpg');
        }
        if (!logoBytes) {
            logoBytes = await getLogoBytes('logo.png');
            isPng = true;
        }


        let logoImage = null;
        if (logoBytes) {
            try {
                try { logoImage = isPng ? await pdfDoc.embedPng(logoBytes) : await pdfDoc.embedJpg(logoBytes); }
                catch (e) { try { logoImage = isPng ? await pdfDoc.embedJpg(logoBytes) : await pdfDoc.embedPng(logoBytes); } catch (e2) { } }
            } catch (e) { }
        }

        // --- WATERMARK en TODAS las paginas ---
        if (logoImage) {
            const wmW = width * 0.55;
            const wmH = wmW * (logoImage.height / logoImage.width);
            page.drawImage(logoImage, {
                x: (width - wmW) / 2, y: (height - wmH) / 2,
                width: wmW, height: wmH, opacity: 0.06
            });
        }

        // Helper limpiar acentos
        const cleanStr = (s) => (s || '').toString()
            .replace(/\u00e1/g, 'a').replace(/\u00c1/g, 'A').replace(/\u00e9/g, 'e').replace(/\u00c9/g, 'E')
            .replace(/\u00ed/g, 'i').replace(/\u00cd/g, 'I').replace(/\u00f3/g, 'o').replace(/\u00d3/g, 'O')
            .replace(/\u00fa/g, 'u').replace(/\u00da/g, 'U').replace(/\u00fc/g, 'u').replace(/\u00dc/g, 'U')
            .replace(/\u00f1/g, 'n').replace(/\u00d1/g, 'N').replace(/[^\x20-\x7E]/g, '');

        // --- HEADER ---
        if (isFirst) {
            const HEADER_H = 120;
            page.drawRectangle({ x: 0, y: height - HEADER_H, width: width, height: HEADER_H, color: cNegro });
            page.drawRectangle({ x: 0, y: height - 3, width: width, height: 3, color: cDorado });
            page.drawRectangle({ x: 0, y: height - HEADER_H, width: width, height: 4, color: cRojo });

            if (logoImage) {
                // LOGO CON CONTORNO CIRCULAR (BADGE/SELLO)
                const logoH = 96;
                const logoW = logoH * (logoImage.width / logoImage.height);
                const logoX = 22;
                const logoY = height - HEADER_H + (HEADER_H - logoH) / 2;
                const cx = logoX + logoW / 2;
                const cy = logoY + logoH / 2;
                const rOuter = Math.max(logoW, logoH) / 2 + 10;
                // Anillo dorado exterior
                page.drawEllipse({ x: cx, y: cy, xScale: rOuter, yScale: rOuter, color: cDorado });
                // Fondo negro interior
                page.drawEllipse({ x: cx, y: cy, xScale: rOuter - 3, yScale: rOuter - 3, color: cNegro });
                // Anillo rojo fino interior
                page.drawEllipse({ x: cx, y: cy, xScale: rOuter - 3, yScale: rOuter - 3, color: cRojo, opacity: 0.6 });
                page.drawEllipse({ x: cx, y: cy, xScale: rOuter - 6, yScale: rOuter - 6, color: cNegro });
                // Logo encima del badge circular
                page.drawImage(logoImage, { x: logoX + 5, y: logoY + 5, width: logoW - 10, height: logoH - 10 });

                // Texto al lado del badge
                const textX = logoX + logoW + rOuter + 8;
                const tClean = cleanStr(title || 'JURIDICO SUPRA LEGIS');
                page.drawText(tClean, { x: textX, y: height - 52, size: 20, font: fontBold, color: cBlanco });
                page.drawRectangle({ x: textX, y: height - 60, width: 195, height: 2, color: cDorado });
                page.drawText('Soluciones Juridicas Contundentes', { x: textX, y: height - 76, size: 9.5, font: fontItal, color: cDorado });
                page.drawText('www.juridicosupralegis.com', { x: textX, y: height - 94, size: 8, font: fontReg, color: PDFLib.rgb(0.72, 0.72, 0.72) });
            } else {
                page.drawText(cleanStr(title || 'JURIDICO SUPRA LEGIS'), { x: 50, y: height - 55, size: 22, font: fontBold, color: cBlanco });
                page.drawRectangle({ x: 50, y: height - 63, width: 200, height: 2, color: cDorado });
                page.drawText('Soluciones Juridicas Contundentes', { x: 50, y: height - 78, size: 10, font: fontItal, color: cDorado });
            }
            page.drawText(new Date().toLocaleDateString('es-MX'), {
                x: width - 90, y: height - 25, size: 7.5, font: fontReg, color: PDFLib.rgb(0.68, 0.68, 0.68)
            });

        } else {
            // Header compacto paginas siguientes
            page.drawRectangle({ x: 0, y: height - 35, width: width, height: 35, color: cNegro });
            page.drawRectangle({ x: 0, y: height - 2, width: width, height: 2, color: cDorado });
            page.drawRectangle({ x: 0, y: height - 35, width: width, height: 2, color: cRojo });
            if (logoImage) {
                const lH = 26; const lW = lH * (logoImage.width / logoImage.height);
                const lX = 10; const lY = height - 32;
                const cxS = lX + lW / 2; const cyS = lY + lH / 2;
                const rS = Math.max(lW, lH) / 2 + 3;
                page.drawEllipse({ x: cxS, y: cyS, xScale: rS, yScale: rS, color: cDorado });
                page.drawEllipse({ x: cxS, y: cyS, xScale: rS - 2, yScale: rS - 2, color: cNegro });
                page.drawImage(logoImage, { x: lX + 1, y: lY + 1, width: lW - 2, height: lH - 2 });
                page.drawText('JURIDICO SUPRA LEGIS  -  Documento Continuacion', {
                    x: lX + lW + rS + 6, y: height - 22, size: 9.5, font: fontBold, color: cBlanco
                });
            } else {
                page.drawText('JURIDICO SUPRA LEGIS  -  Documento Continuacion', { x: 50, y: height - 22, size: 9.5, font: fontBold, color: cBlanco });
            }
        }

        // --- FOOTER negro elegante en TODAS las paginas ---
        page.drawRectangle({ x: 0, y: 0, width: width, height: 52, color: cNegro });
        page.drawRectangle({ x: 0, y: 52, width: width, height: 2, color: cDorado });
        page.drawText('Preparado por JURIDICO SUPRA LEGIS  |  Uso Profesional Privado', {
            x: 50, y: 34, size: 8, font: fontBold, color: cBlanco
        });
        page.drawText('WhatsApp: 2227871497 / 2221567520  |  FB: juridico SUPRA LEGIS', {
            x: 50, y: 20, size: 7.5, font: fontReg, color: PDFLib.rgb(0.70, 0.70, 0.70)
        });
        page.drawText('TikTok: @supralegis  |  Instagram: juridico_supralegis  |  www.juridicosupralegis.com', {
            x: 50, y: 8, size: 7.5, font: fontReg, color: PDFLib.rgb(0.70, 0.70, 0.70)
        });
    }
    /* --- MODULE: GENERALES A DOCUMENTO --- */
    const formGenerales = document.getElementById('formGenerales');

    // File handler for Generales
    let tempFile = null;
    document.getElementById('gp_file').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2000000) return alert('Archivo muy grande (Max 2MB)');

        const reader = new FileReader();
        reader.onload = (ev) => {
            tempFile = { name: file.name, data: ev.target.result, type: file.type };
        };
        reader.readAsDataURL(file);
    });

    formGenerales.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRecord = {
            id: Date.now(),
            nombre: document.getElementById('gp_nombre').value,
            originario: document.getElementById('gp_originario').value,
            domicilio: document.getElementById('gp_domicilio').value,
            vecino: document.getElementById('gp_vecino').value,
            edad: document.getElementById('gp_edad').value,
            civil: document.getElementById('gp_civil').value,
            estudios: document.getElementById('gp_estudios').value,
            celular: document.getElementById('gp_celular').value,
            email: document.getElementById('gp_email').value,
            asunto: document.getElementById('gp_asunto').value,
            file: tempFile,
            created: new Date().toLocaleDateString()
        };

        const records = getStorage('sl_generales');
        records.unshift(newRecord);
        setStorage('sl_generales', records);

        alert('Registro guardado correctamente.');
        renderGenerales();
        if (typeof updateEscritosCombo === 'function') updateEscritosCombo();
        closeModal('modalGenerales');
        formGenerales.reset();
        document.getElementById('gp_asunto').value = ''; // Manual clear just in case
        tempFile = null;
    });

    function renderGenerales(filter = '') {
        const tbody = document.getElementById('generalesList');
        tbody.innerHTML = '';
        const records = getStorage('sl_generales').filter(r => r.nombre.toLowerCase().includes(filter.toLowerCase()));

        records.forEach(r => {
            const row = tbody.insertRow();
            const asuntoSpan = r.asunto ? `<br><small style="color:var(--accent); font-weight:600;">DOC: ${r.asunto}</small>` : '';
            row.innerHTML = `
                <td><strong>${r.nombre}</strong>${asuntoSpan}<br><small style="color:#999">${r.created}</small></td>
                <td>${r.domicilio || '-'}</td>
                <td>${r.celular || '-'}</td>
                <td>${r.email || '-'}</td>
                <td>
                    <button class="btn btn-outline btn-small" onclick="viewGenerales(${r.id})">
                        <span class="material-icons-round" style="font-size:14px">visibility</span> Ver
                    </button>
                    ${r.file ? `<button class="btn btn-outline btn-small" onclick="downloadUnifiedPDF(${r.id}, this)">
                        <span class="material-icons-round" style="font-size:14px">download</span> PDF
                    </button>` : ''}
                    <button class="btn btn-outline btn-small" onclick="deleteGenerales(${r.id})" style="border-color:#ff5252; color:#ff5252"><span class="material-icons-round" style="font-size:14px">delete</span></button>
                </td>
            `;
        });
    }

    // New Function: Download Unified PDF directly from List
    window.downloadUnifiedPDF = async (id, btn) => {
        const r = getStorage('sl_generales').find(i => i.id === id);
        if (!r || !r.file) return;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="material-icons-round spinning" style="font-size:14px">sync</span> ...';
        btn.disabled = true;

        try {
            let pdfDoc;

            if (r.file.type === 'application/pdf') {
                const pdfBytes = await fetch(r.file.data).then(res => res.arrayBuffer());
                pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            } else {
                pdfDoc = await PDFLib.PDFDocument.create();
                if (r.file.type.startsWith('image/')) {
                    const imgBytes = await fetch(r.file.data).then(res => res.arrayBuffer());
                    let image;
                    if (r.file.type.includes('png')) image = await pdfDoc.embedPng(imgBytes);
                    else image = await pdfDoc.embedJpg(imgBytes);
                    const page = pdfDoc.addPage([image.width, image.height]);
                    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
                }
            }

            // Add Generales Page
            // Add Generales Page
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
            const titleFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanBold);

            // Draw Title - LEFT ALIGNED
            const title = 'GENERALES';
            page.drawText(title, { x: 50, y: height - 80, size: 14, font: titleFont });

            // Draw Fields - LEFT ALIGNED
            let y = height - 100;
            const lineHeight = 20;

            const fields = [
                { label: 'NOMBRE', val: r.nombre }, { label: 'ORIGINARIO', val: r.originario },
                { label: 'DOMICILIO', val: r.domicilio }, { label: 'VECINO DE', val: r.vecino },
                { label: 'EDAD', val: r.edad ? r.edad + ' AÑOS' : '' }, { label: 'ESTADO CIVIL', val: r.civil },
                { label: 'ESTUDIOS', val: r.estudios }, { label: 'CELULAR', val: r.celular },
                { label: 'EMAIL', val: r.email },
            ];

            fields.forEach((field) => {
                const labelText = field.label + ': ';
                const valText = (field.val || '').toUpperCase();

                // Calculate width to append value directly after label
                const labelWidth = font.widthOfTextAtSize(labelText, 12);

                // Draw Label (Regular)
                page.drawText(labelText, { x: 50, y: y, size: 12, font: font });

                // Draw Value (Bold) - Starts right after label
                page.drawText(valText, { x: 50 + labelWidth, y: y, size: 12, font: titleFont });

                y -= lineHeight;
            });

            const pdfBytesFinal = await pdfDoc.save();
            const fileName = `Generales_${(r.nombre || 'Doc').replace(/[^a-z0-9]/gi, '_')}.pdf`;

            // Trigger save helper
            await savePdfToDisk(pdfBytesFinal, fileName);

        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    };

    window.viewGenerales = (id) => {
        const r = getStorage('sl_generales').find(i => i.id === id);
        if (!r) return;

        // Populate Front (Preview)
        const previewEl = document.getElementById('docPreviewPlaceholder');
        if (r.file && r.file.type.startsWith('image/')) {
            previewEl.innerHTML = `<img src="${r.file.data}" class="preview-img" alt="Documento">`;
        } else if (r.file && r.file.type === 'application/pdf') {
            previewEl.innerHTML = `<iframe src="${r.file.data}" width="100%" height="100%" style="border:none;"></iframe>`;
        } else {
            previewEl.innerHTML = `
                <div style="text-align:center; color:#777">
                    <span class="material-icons-round" style="font-size:48px;">description</span>
                    <p>Sin vista previa <br> (${r.file ? r.file.name : 'Sin archivo'})</p>
                </div>`;
        }

        // Populate Back (Typewriter Data)
        // Populate Back (Typewriter Data)
        const dataEl = document.getElementById('docDataPlaceholder');
        // Clear previous content
        dataEl.innerHTML = '';

        // We build the content dynamically
        dataEl.innerHTML = `
             <div class="tw-label">NOMBRE</div> <div class="tw-value">${r.nombre}</div>
             <div class="tw-label">ORIGINARIO</div> <div class="tw-value">${r.originario || ''}</div>
             <div class="tw-label">DOMICILIO</div> <div class="tw-value">${r.domicilio || ''}</div>
             <div class="tw-label">VECINO DE</div> <div class="tw-value">${r.vecino || ''}</div>
             <div class="tw-label">EDAD</div> <div class="tw-value">${r.edad ? r.edad + ' AÃ‘OS' : ''}</div>
             <div class="tw-label">ESTADO CIVIL</div> <div class="tw-value">${r.civil || ''}</div>
             <div class="tw-label">ESTUDIOS</div> <div class="tw-value">${r.estudios || ''}</div>
             
             <div class="tw-label">CELULAR</div> <div class="tw-value">${r.celular || ''}</div>
             <div class="tw-label">EMAIL</div> <div class="tw-value">${r.email || ''}</div>
        `;

        // Add Combined Download Button
        let dlBtn = document.getElementById('downloadBackBtn');
        if (!dlBtn) {
            const btnContainer = document.querySelector('.back .card-top-bar');
            dlBtn = document.createElement('button');
            dlBtn.id = 'downloadBackBtn';
            dlBtn.className = 'btn btn-primary btn-small';
            dlBtn.style.marginLeft = '10px';
            dlBtn.innerHTML = '<span class="material-icons-round">print</span> Imprimir Completo (Frente/Reverso)';
            btnContainer.appendChild(dlBtn);
        }

        // Remove old listener and add new one
        const newDlBtn = dlBtn.cloneNode(true);
        dlBtn.parentNode.replaceChild(newDlBtn, dlBtn);

        newDlBtn.addEventListener('click', async () => {
            const btnContent = newDlBtn.innerHTML;
            newDlBtn.innerHTML = '<span class="material-icons-round spinning">sync</span> Procesando...';
            newDlBtn.disabled = true;

            try {
                // 1. Create a new PDF document or Load existing one
                let pdfDoc;

                if (r.file && r.file.type === 'application/pdf') {
                    // Start with the user's PDF
                    // We need to fetch the base64 data and convert to bytes
                    const pdfBytes = await fetch(r.file.data).then(res => res.arrayBuffer());
                    pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
                } else {
                    // Creating new PDF for Image or Empty
                    pdfDoc = await PDFLib.PDFDocument.create();

                    if (r.file && r.file.type.startsWith('image/')) {
                        // Embed Image on First Page
                        const imgBytes = await fetch(r.file.data).then(res => res.arrayBuffer());
                        let image;
                        if (r.file.type.includes('png')) image = await pdfDoc.embedPng(imgBytes);
                        else image = await pdfDoc.embedJpg(imgBytes);

                        const page = pdfDoc.addPage([image.width, image.height]);
                        page.drawImage(image, {
                            x: 0,
                            y: 0,
                            width: image.width,
                            height: image.height,
                        });
                    }
                }

                // 2. Add "Generales" Page (The "Reverso")
                const page = pdfDoc.addPage();
                const { width, height } = page.getSize();

                // Load Fonts
                const font = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
                const titleFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanBold);

                // Draw Title - LEFT ALIGNED
                const title = 'GENERALES DEL DOCUMENTO';
                page.drawText(title, {
                    x: 50,
                    y: height - 80,
                    size: 14,
                    font: titleFont
                });

                // Draw Fields - LEFT ALIGNED
                let y = height - 100;
                const lineHeight = 20;

                const fields = [
                    { label: 'NOMBRE', val: r.nombre },
                    { label: 'ORIGINARIO', val: r.originario },
                    { label: 'DOMICILIO', val: r.domicilio },
                    { label: 'VECINO DE', val: r.vecino },
                    { label: 'EDAD', val: r.edad ? r.edad + ' AÑOS' : '' },
                    { label: 'ESTADO CIVIL', val: r.civil },
                    { label: 'ESTUDIOS', val: r.estudios },
                    { label: 'CELULAR', val: r.celular },
                    { label: 'EMAIL', val: r.email },
                ];

                fields.forEach((field) => {
                    const labelText = field.label + ': ';
                    const valText = (field.val || '').toUpperCase();

                    // Calculate width
                    const labelWidth = font.widthOfTextAtSize(labelText, 12);

                    // Draw Label (Regular)
                    page.drawText(labelText, { x: 50, y: y, size: 12, font: font });

                    // Draw Value (Bold)
                    page.drawText(valText, { x: 50 + labelWidth, y: y, size: 12, font: titleFont });

                    y -= lineHeight;
                });

                // 3. Save and Download
                const pdfBytesFinal = await pdfDoc.save();

                // Use save helper
                await savePdfToDisk(pdfBytesFinal, fileName);

            } catch (err) {
                console.error(err);
                alert('Error al generar PDF: ' + err.message);
            } finally {
                newDlBtn.innerHTML = btnContent;
                newDlBtn.disabled = false;
            }
        });

        // 2. Populate Print Area Page 2 (Data)


        openModal('modalViewDocument');
    }

    window.deleteGenerales = (id) => {
        if (confirm('¿Eliminar registro permanentemente?')) {
            setStorage('sl_generales', getStorage('sl_generales').filter(r => r.id !== id));
            renderGenerales();
        }
    };

    /* --- MODULE: FICHAS DE DESAHOGO (CENTRO DE AUDIENCIAS) --- */
    window.switchFichaTab = (tabId) => {
        document.querySelectorAll('.ficha-tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    };

    const formFichas = document.getElementById('formFichas');
    let tempFichaFiles = []; // Temporary storage for files being added

    window.handleFichaFiles = (input) => {
        const files = Array.from(input.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                tempFichaFiles.push({
                    name: file.name,
                    type: file.type,
                    data: e.target.result,
                    id: Date.now() + Math.random()
                });
                renderFichaArchives();
            };
            reader.readAsDataURL(file);
        });
        input.value = ""; // Clear input
    };

    window.renderFichaArchives = () => {
        const container = document.getElementById('fi_archivos_lista');
        container.innerHTML = "";
        tempFichaFiles.forEach(file => {
            const item = document.createElement('div');
            item.className = 'archivo-mini-card';

            let icon = "insert_drive_file";
            if (file.type.startsWith('image/')) icon = "image";
            if (file.type === 'application/pdf') icon = "picture_as_pdf";

            item.innerHTML = `
                <span class="material-icons-round">${icon}</span>
                <div class="info">
                    <div class="name">${file.name}</div>
                    <div class="actions">
                        <button type="button" onclick="viewFichaFile('${file.id}')">Ver</button>
                        <button type="button" class="del" onclick="deleteFichaFile('${file.id}')">Eliminar</button>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });
    };

    window.deleteFichaFile = (id) => {
        tempFichaFiles = tempFichaFiles.filter(f => String(f.id) !== String(id));
        renderFichaArchives();
    };

    window.viewFichaFile = (id) => {
        const fFound = tempFichaFiles.find(f => String(f.id) === String(id));
        if (!fFound) return;

        if (fFound.type === 'application/pdf') {
            const win = window.open();
            win.document.write(`<iframe src="${fFound.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
            const win = window.open();
            win.document.write(`<img src="${fFound.data}" style="max-width:100%;">`);
        }
    };

    formFichas.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect Data
        const fichaData = {
            id: Date.now(),
            expediente: document.getElementById('fi_expediente').value,
            juzgado: document.getElementById('fi_juzgado').value,
            cuaderno: document.getElementById('fi_cuaderno').value,
            actor: document.getElementById('fi_actor').value,
            demandado: document.getElementById('fi_demandado').value,
            objeto: document.getElementById('fi_objeto').value,
            hechos: document.getElementById('fi_hechos').value,
            pruebas: document.getElementById('fi_pruebas').value,
            leyes: document.getElementById('fi_leyes').value,
            interrogatorio: document.getElementById('fi_interrogatorio').value,
            apertura: document.getElementById('fi_apertura').value,
            clausura: document.getElementById('fi_clausura').value,
            notas: document.getElementById('fi_notas').value,
            jurisprudencia: document.getElementById('fi_jurisprudencia') ? document.getElementById('fi_jurisprudencia').value : '',
            archivos: tempFichaFiles, // Save the files
            created: new Date().toLocaleDateString()
        };

        // Save
        const fichas = getStorage('sl_fichas');
        fichas.unshift(fichaData);
        setStorage('sl_fichas', fichas);

        alert('Ficha Estratégica guardada en sistema.');
        renderFichas();
        closeModal('modalFichas');
        formFichas.reset();
        tempFichaFiles = []; // Reset files
        renderFichaArchives();
        switchFichaTab('tab-ficha-identificacion');
    });

    function renderFichas(filter = '') {
        const grid = document.getElementById('fichasList');
        grid.innerHTML = '';
        const fichas = getStorage('sl_fichas').filter(f =>
            (f.expediente || '').toLowerCase().includes(filter.toLowerCase()) ||
            (f.actor || '').toLowerCase().includes(filter.toLowerCase()) ||
            (f.demandado || '').toLowerCase().includes(filter.toLowerCase())
        );

        if (fichas.length === 0) {
            grid.innerHTML = '<div class="empty-state">No se encontraron expedientes con fichas de desahogo.</div>';
            return;
        }

        fichas.forEach(f => {
            const card = document.createElement('div');
            card.className = 'panel ficha-card';
            card.style.padding = '22px';
            card.style.position = 'relative';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                    <div>
                        <strong style="color:var(--primary); font-size:1.15rem; display:block;">EXP: ${f.expediente}</strong>
                        <small style="color:var(--text-muted)">${f.juzgado || 'Juzgado no especificado'}</small>
                    </div>
                </div>
                <div style="font-size:0.88rem; margin-bottom:15px; line-height:1.5;">
                    <div style="margin-bottom:4px;"><strong>OBJETIVO:</strong> <span style="color:#d32f2f">${f.objeto || 'No definido'}</span></div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:8px;">
                        <div style="background:#f5f5f5; padding:6px; border-radius:4px;">
                            <small style="display:block; color:#666; font-size:0.7rem; text-transform:uppercase;">Parte Actora</small>
                            <strong>${f.actor || '-'}</strong>
                        </div>
                        <div style="background:#f5f5f5; padding:6px; border-radius:4px;">
                            <small style="display:block; color:#666; font-size:0.7rem; text-transform:uppercase;">Parte Demandada</small>
                            <strong>${f.demandado || '-'}</strong>
                        </div>
                    </div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="btn btn-primary btn-small" onclick='printFichaById(${f.id})'>
                        <span class="material-icons-round">print</span> Imprimir Guia
                    </button>
                    <button class="btn btn-outline btn-small" onclick='editFicha(${f.id})'>
                        <span class="material-icons-round">edit</span> Editar
                    </button>
                    <button class="btn btn-outline btn-small" style="border-color:#ff5252; color:#ff5252" onclick="deleteFicha(${f.id})">
                        <span class="material-icons-round">delete</span>
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Update stats on dashboard
        const statExp = document.getElementById('stat_expedientes');
        if (statExp) statExp.innerText = fichas.length;
    }

    window.editFicha = (id) => {
        const f = getStorage('sl_fichas').find(i => i.id === id);
        if (!f) return;

        document.getElementById('fi_expediente').value = f.expediente;
        document.getElementById('fi_juzgado').value = f.juzgado || '';
        document.getElementById('fi_cuaderno').value = f.cuaderno || 'Principal';
        document.getElementById('fi_actor').value = f.actor || '';
        document.getElementById('fi_demandado').value = f.demandado || '';
        document.getElementById('fi_objeto').value = f.objeto || '';
        document.getElementById('fi_hechos').value = f.hechos || '';
        document.getElementById('fi_pruebas').value = f.pruebas || '';
        document.getElementById('fi_leyes').value = f.leyes || '';
        document.getElementById('fi_interrogatorio').value = f.interrogatorio || '';
        document.getElementById('fi_apertura').value = f.apertura || '';
        document.getElementById('fi_clausura').value = f.clausura || '';
        document.getElementById('fi_notas').value = f.notas || '';
        if (document.getElementById('fi_jurisprudencia')) document.getElementById('fi_jurisprudencia').value = f.jurisprudencia || '';

        // Load files
        tempFichaFiles = f.archivos || [];
        renderFichaArchives();

        // Delete old one before saving "new" (edit)
        deleteFicha(id, false);
        openModal('modalFichas');
    };

    window.printFichaById = (id) => {
        const f = getStorage('sl_fichas').find(i => i.id === id);
        if (f) printFicha(f);
    };

    window.deleteFicha = (id, ask = true) => {
        if (!ask || confirm('¿Eliminar ficha de expediente?')) {
            setStorage('sl_fichas', getStorage('sl_fichas').filter(f => f.id !== id));
            renderFichas();
        }
    };

    function printFicha(data) {
        // Populate Hidden Print Area
        document.getElementById('pr_expediente').innerText = data.expediente;
        document.getElementById('pr_juzgado').innerText = data.juzgado;
        document.getElementById('pr_cuaderno').innerText = data.cuaderno;
        document.getElementById('pr_actor').innerText = data.actor;
        document.getElementById('pr_demandado').innerText = data.demandado;
        document.getElementById('pr_objeto').innerText = data.objeto;

        // Create summary of Case Theory for print
        document.getElementById('pr_hechos').innerText = (data.hechos || '') + "\n\n--- GUION/POSICIONES ---\n" + (data.interrogatorio || '');
        document.getElementById('pr_pruebas').innerText = data.pruebas;
        document.getElementById('pr_notas').innerText = data.notas;
        document.getElementById('pr_leyes').innerText = data.leyes;
        if (document.getElementById('pr_jurisprudencia')) document.getElementById('pr_jurisprudencia').innerText = data.jurisprudencia || '';

        // Trigger Print
        const printArea = document.getElementById('fichaPrintArea');
        printArea.style.display = 'block';
        window.print();
        setTimeout(() => { printArea.style.display = 'none'; }, 200);
    }

    /* --- MODULE: GENERADOR DE ESCRITOS --- */
    const updateEscritosCombo = () => {
        const typeSelect = document.getElementById('es_tipo');
        if (!typeSelect) return;

        typeSelect.innerHTML = `
            <option value="">-- Seleccionar Tipo --</option>
            <optgroup label="Mandatos y Honorarios">
                <option value="convenio_honorarios">Convenio de Honorarios (Evitar disputas)</option>
                <option value="carta_poder">Carta Poder Simple (Puebla)</option>
                <option value="mandato_judicial">Mandato Judicial (Poder Pleitos y Cobranzas)</option>
                <option value="autorizacion_juzgado">Abogado Patrono (Art. 19 CPCP)</option>
                <option value="aceptacion_cargo">Escrito Aceptación de Cargo (Abogado)</option>
                <option value="hoja_servicios">Contrato Servicios Profesionales (General)</option>
            </optgroup>
            <optgroup label="Trámites Procesales (Puebla)">
                <option value="solicitud_copias">Solicitud de Copias Certificadas (Art. 75 CPCP)</option>
                <option value="acusar_rebeldia">Acusar Rebeldía (Falta de contestación)</option>
                <option value="ofrecimiento_pruebas">Ofrecimiento de Pruebas (General)</option>
                <option value="desistimiento">Escrito de Desistimiento (Art. 128 CPCP)</option>
                <option value="devolucion_doctos">Solicitud Devolución de Documentos</option>
            </optgroup>
            <optgroup label="Contratos Civiles (Puebla)">
                <option value="arrendamiento">Arrendamiento Casa Habitación (Arts. 2261 CCP)</option>
                <option value="arrendamiento_comercial">Arrendamiento Local Comercial</option>
                <option value="subarrendamiento">Contrato de Subarrendamiento (Art. 2318 CCP)</option>
                <option value="arrendamiento_terreno">Arrendamiento de Terreno / Lote</option>
                <option value="compraventa">Compraventa Privada (Arts. 2121 CCP)</option>
                <option value="comodato">Contrato de Comodato (Arts. 2338 CCP)</option>
                <option value="mutuo">Mutuo con Interés (Arts. 2093 CCP)</option>
                <option value="deposito">Contrato de Depósito (Art. 2358 CCP)</option>
                <option value="donacion">Contrato de Donación (Arts. 2182 CCP)</option>
                <option value="convenio_transaccional">Convenio Transaccional (Desocupación)</option>
            </optgroup>
            <optgroup label="Derecho Familiar">
                <option value="demanda_alimentos">Formato Demanda de Alimentos (Puebla)</option>
            </optgroup>
            <optgroup label="Títulos de Crédito">
                <option value="pagare">Pagaré (LGTOC)</option>
                <option value="endoso_propiedad">Endoso en Propiedad</option>
                <option value="endoso_procuracion">Endoso en Procuración</option>
            </optgroup>
            <optgroup label="Gestión de Cobranza (EXTRAJUDICIAL)">
                <option value="invitacion_pago">Invitación de Pago Cordial</option>
                <option value="requerimiento_formal">Requerimiento Formal de Pago</option>
                <option value="aviso_prejudicial">Último Aviso Pre-Judicial (Ultimátum)</option>
                <option value="requerimiento_alimentos">Requerimiento de Adeudo Alimentario</option>
            </optgroup>
        `;
    };


    // ================================================================
    //  ESCRITOS JURIDICOS — Formulario Dinamico + Templates
    // ================================================================

    // Definicion de campos por tipo de documento
    const ESCRITOS_CAMPOS = {
        convenio_honorarios: [
            { id: 'es_abogado', label: 'Nombre del Abogado / Firma', ph: 'Nombre completo', span: 2 },
            { id: 'es_nombre', label: 'Nombre del Cliente', ph: 'Nombre completo', span: 2 },
            { id: 'es_extra', label: 'Asunto / Juicio Objeto', ph: 'Ej. Juicio Ejecutivo Mercantil 123/2025', span: 2 },
            { id: 'es_monto', label: 'Honorarios Totales PACTADOS ($)', ph: 'Ej. 15000.00', span: 1 },
            { id: 'es_renta', label: 'Anticipo Sugerido ($)', ph: 'Ej. 3000.00', span: 1 },
            { id: 'es_asunto', label: 'Forma de Pago / Etapas', ph: 'Ej. 50% inicio, 25% pruebas, 25% sentencia', span: 2 },
        ],
        carta_poder: [
            { id: 'es_nombre', label: 'Nombre del Poderdante (quien otorga)', ph: 'Nombre completo en MAYÚSCULAS', span: 2 },
            { id: 'es_abogado', label: 'Nombre(s) del(los) Apoderado(s)', ph: 'Lic. Nombre Apellido / y Lic. Otro Nombre', span: 2 },
            { id: 'es_extra', label: 'Autoridades ante las que se otorga', ph: 'Ej. Juzgados Civiles y Penales del Edo. de Puebla', span: 2 },
        ],
        mandato_judicial: [
            { id: 'es_nombre', label: 'Nombre del Mandante (quien otorga)', ph: 'Nombre completo', span: 2 },
            { id: 'es_abogado', label: 'Abogado(s) Mandatario(s)', ph: 'Lic. Nombre Apellido', span: 2 },
            { id: 'es_extra', label: 'Número de Expediente (si ya existe)', ph: 'Ej. 123/2025', span: 1 },
            { id: 'es_juzgado', label: 'Juzgado ante el que se actúa', ph: 'Ej. Octavo de lo Civil de Puebla', span: 1 },
        ],
        autorizacion_juzgado: [
            { id: 'es_nombre', label: 'Nombre de la Parte Promovente', ph: 'Nombre completo', span: 2 },
            { id: 'es_abogado', label: 'Nombre(s) del(los) Abogado(s) Patronos', ph: 'Lic. Nombre Apellido', span: 2 },
            { id: 'es_extra', label: 'Número de Expediente', ph: 'Ej. 123/2025', span: 1 },
            { id: 'es_juzgado', label: 'Juzgado', ph: 'Ej. Primero de lo Civil de Puebla', span: 1 },
        ],
        aceptacion_cargo: [
            { id: 'es_abogado', label: 'Nombre del Abogado que acepta', ph: 'Lic. Nombre Apellido', span: 2 },
            { id: 'es_nombre', label: 'Nombre de la Parte que lo nombró', ph: 'Nombre del cliente', span: 2 },
            { id: 'es_extra', label: 'Número de Expediente', ph: 'Ej. 456/2025', span: 1 },
            { id: 'es_juzgado', label: 'Juzgado', ph: 'Ej. Juzgado de lo Familiar', span: 1 },
        ],
        autorizacion_simple: [
            { id: 'es_nombre', label: 'Nombre de la Parte Promovente', ph: 'Nombre completo', span: 2 },
            { id: 'es_abogado', label: 'Persona(s) autorizadas', ph: 'Lic. o C. Nombre Apellido', span: 2 },
            { id: 'es_extra', label: 'Número de Expediente', ph: 'Ej. 456/2025', span: 1 },
            { id: 'es_juzgado', label: 'Juzgado', ph: 'Ej. Cuarto Familiar de Puebla', span: 1 },
        ],
        solicitud_copias: [
            { id: 'es_nombre', label: 'Nombre de la Parte Promovente', ph: 'Nombre completo', span: 2 },
            { id: 'es_extra', label: 'Número de Expediente', ph: 'Ej. 101/2025', span: 1 },
            { id: 'es_juzgado', label: 'Juzgado', ph: 'Ej. Juzgado Municipal de Puebla', span: 1 },
            { id: 'es_asunto', label: 'Tipo de Copias', ph: 'Ej. Todo lo actuado / Solo la sentencia', span: 2 },
        ],
        acusar_rebeldia: [
            { id: 'es_nombre', label: 'Nombre de la Parte Actora', ph: 'Nombre completo', span: 2 },
            { id: 'es_extra', label: 'Número de Expediente', ph: 'Ej. 99/2025', span: 1 },
            { id: 'es_juzgado', label: 'Juzgado', ph: 'Ej. Segundo Civil', span: 1 },
            { id: 'es_asunto', label: 'Fecha en que venció el término', ph: 'Ej. ayer / el dia 15 de febrero', span: 2 },
        ],
        ofrecimiento_pruebas: [
            { id: 'es_nombre', label: 'Nombre de la Parte Ofreciente', ph: 'Nombre completo', span: 2 },
            { id: 'es_extra', label: 'Número de Expediente', ph: 'Ej. 555/2025', span: 1 },
            { id: 'es_juzgado', label: 'Juzgado', ph: 'Ej. Sexto Familiar', span: 1 },
            { id: 'es_asunto', label: 'Enumeración de Pruebas (Resumen)', ph: 'Ej. Confesional, Testimonial, Documental Pública...', span: 2 },
        ],
        arrendamiento: [
            { id: 'es_arrendador', label: 'Nombre del Arrendador (Propietario)', ph: 'Nombre completo', span: 2 },
            { id: 'es_nombre', label: 'Nombre del Arrendatario (Inquilino)', ph: 'Nombre completo', span: 2 },
            { id: 'es_fiador', label: 'Nombre del Fiador (opcional)', ph: 'Dejar en blanco si no hay fiador', span: 2 },
            { id: 'es_domicilio', label: 'Domicilio del Inmueble', ph: 'Calle, Número, Colonia, CP', span: 2 },
            { id: 'es_renta', label: 'Renta Mensual ($)', ph: 'Ej. 5000.00', span: 1 },
            { id: 'es_deposito', label: 'Depósito en Garantía ($)', ph: 'Ej. 5000.00', span: 1 },
            { id: 'es_inicio', label: 'Fecha de Inicio del Contrato', ph: '', type: 'date', span: 1 },
            { id: 'es_fin', label: 'Fecha de Término del Contrato', ph: '', type: 'date', span: 1 },
        ],
        subarrendamiento: [
            { id: 'es_arrendador', label: 'Nombre del Arrendatario Principal', ph: 'Quien ya renta y va a subarrendar', span: 2 },
            { id: 'es_nombre', label: 'Nombre del Subarrendatario', ph: 'Nuevo inquilino', span: 2 },
            { id: 'es_domicilio', label: 'Domicilio del Inmueble / Cuarto', ph: 'Dirección específica', span: 2 },
            { id: 'es_renta', label: 'Renta del Subarriendo ($)', ph: 'Ej. 2500.00', span: 1 },
            { id: 'es_inicio', label: 'Fecha Inicio', ph: '', type: 'date', span: 1 },
            { id: 'es_asunto', label: 'Permiso del Dueño Original', ph: 'Ej. Contrato principal permite subarriendo / Autorización anexa', span: 2 },
        ],
        deposito: [
            { id: 'es_arrendador', label: 'Nombre del Depositante (quien entrega)', ph: 'Nombre completo', span: 2 },
            { id: 'es_nombre', label: 'Nombre del Depositario (quien guarda)', ph: 'Nombre completo', span: 2 },
            { id: 'es_extra', label: 'Descripción de los Bienes', ph: 'Ej. Laptop marca Dell Serie X, Documentación del juicio...', span: 2 },
            { id: 'es_domicilio', label: 'Lugar de Resguardo', ph: 'Dirección donde se guardan los bienes', span: 2 },
            { id: 'es_renta', label: 'Retribución por guardarlos ($)', ph: '0.00 si es gratuito', span: 1 },
            { id: 'es_vence', label: 'Fecha de Devolución estimada', ph: '', type: 'date', span: 1 },
        ],
        escrito_libre: [
            { id: 'es_nombre', label: 'Nombre o Referencia del Documento', ph: 'Ej. A quien corresponda / Juicio 123/2025', span: 2 },
        ],
        demanda_laboral: [
            { id: 'es_nombre', label: 'Nombre del Trabajador (Actor)', ph: 'Nombre completo', span: 2 },
            { id: 'es_patron', label: 'Nombre del Patrón / Empresa (Demandado)', ph: 'Persona física o moral', span: 2 },
            { id: 'es_domicilio', label: 'Domicilio del Centro de Trabajo', ph: 'Calle, Número, Colonia...', span: 2 },
            { id: 'es_renta', label: 'Salario Diario ($)', ph: 'Ej. 550.00', span: 1 },
            { id: 'es_extra', label: 'Puesto / Categoría', ph: 'Ej. Vendedor, Mecánico...', span: 1 },
            { id: 'es_inicio', label: 'Fecha de Ingreso', ph: '', type: 'date', span: 1 },
            { id: 'es_fin', label: 'Fecha del Despido', ph: '', type: 'date', span: 1 },
        ],
        denuncia_penal: [
            { id: 'es_nombre', label: 'Nombre del Denunciante / Querellante', ph: 'Nombre completo', span: 2 },
            { id: 'es_extra', label: 'Delito Relacionado (Presunto)', ph: 'Ej. Robo, Fraude, Abuso de Confianza...', span: 2 },
            { id: 'es_patron', label: 'Nombre del Denunciado (si se conoce)', ph: 'Poner Quien Resulte Responsable si se ignora', span: 2 },
            { id: 'es_asunto', label: 'Relación sucinta de Hechos', ph: 'Breve descripción de qué pasó, cuándo y dónde...', span: 2 },
        ],
        demanda_mercantil: [
            { id: 'es_abogado', label: 'Abogado Patrono (Titulado)', ph: 'Lic. Nombre Apellido', span: 2 },
            { id: 'es_nombre', label: 'Nombre del Acreedor (Actor)', ph: 'Quien debe cobrar', span: 2 },
            { id: 'es_patron', label: 'Nombre del Deudor (Demandado)', ph: 'Quien debe pagar', span: 2 },
            { id: 'es_monto', label: 'Suerte Principal (Monto Pagaré)', ph: 'Ej. 25000.00', span: 1 },
            { id: 'es_renta', label: 'Interés Moratorio Pactado (%)', ph: 'Ej. 6', span: 1 },
            { id: 'es_extra', label: 'Fecha de Suscripción Pagaré', type: 'date', span: 1 },
            { id: 'es_fin', label: 'Fecha de Vencimiento', type: 'date', span: 1 },
        ],
        demanda_alimentos: [
            { id: 'es_nombre', label: 'Nombre de la Madre/Padre (en representación)', ph: 'Nombre completo', span: 2 },
            { id: 'es_patron', label: 'Nombre del Deudor Alimentista', ph: 'Quien debe pagar la pensión', span: 2 },
            { id: 'es_extra', label: 'Hijos Beneficiarios', ph: 'Nombres y edades', span: 2 },
            { id: 'es_asunto', label: 'Lugar de trabajo del deudor', ph: 'Si se conoce, para el embargo de sueldo', span: 2 },
        ],
        aviso_rescision: [
            { id: 'es_patron', label: 'Nombre del Patrón / Representante', ph: 'Nombre completo', span: 2 },
            { id: 'es_nombre', label: 'Nombre del Trabajador', ph: 'Nombre completo', span: 2 },
            { id: 'es_extra', label: 'Causas de Rescisión (Art. 47 LFT)', ph: 'Ej. Faltas injustificadas, desobediencia...', span: 2 },
            { id: 'es_fin', label: 'Fecha de entrega del aviso', ph: '', type: 'date', span: 1 },
        ],
        ejecucion_laudo: [
            { id: 'es_nombre', label: 'Nombre de la Parte Actora (Beneficiario)', ph: 'Quien cobra', span: 2 },
            { id: 'es_patron', label: 'Nombre de la Parte Demandante (Condenado)', ph: 'Quien debe pagar', span: 2 },
            { id: 'es_extra', label: 'Número de Expediente', ph: 'Ej. D-123/2024', span: 1 },
            { id: 'es_fin', label: 'Fecha de la Sentencia / Laudo', type: 'date', span: 1 },
            { id: 'es_monto', label: 'Monto Total de la Condena ($)', ph: 'Suma de todas las prestaciones', span: 2 },
        ],
        invitacion_pago: [
            { id: 'es_acreedor', label: 'Nombre del Acreedor / Solicitante', ph: 'Persona a quien se le debe', span: 2 },
            { id: 'es_deudor', label: 'Nombre del Deudor / Invitado', ph: 'Persona que debe pagar', span: 2 },
            { id: 'es_monto', label: 'Monto del Adeudo ($)', ph: '0.00', span: 1 },
            { id: 'es_extra', label: 'Motivo del Pago (Concepto)', ph: 'Ej. Renta de enero, Préstamo personal...', span: 1 },
            { id: 'es_domicilio', label: 'Lugar para realizar el pago', ph: 'Ej. En mi domicilio / Vía transferencia', span: 2 },
        ],
        requerimiento_formal: [
            { id: 'es_abogado', label: 'Abogado que suscribe', ph: 'Lic. Nombre Apellido', span: 2 },
            { id: 'es_acreedor', label: 'Nombre del Acreedor', ph: 'Persona a quien se le debe', span: 2 },
            { id: 'es_deudor', label: 'Nombre del Deudor', ph: 'Persona que debe pagar', span: 2 },
            { id: 'es_monto', label: 'Suma Principal Adeudada ($)', ph: '0.00', span: 1 },
            { id: 'es_extra', label: 'Intereses o Accesorios ($)', ph: '0.00', span: 1 },
            { id: 'es_vence', label: 'Plazo para pago (días)', ph: 'Ej. 3 días / 72 horas', span: 2 },
        ],
        aviso_prejudicial: [
            { id: 'es_abogado', label: 'Firma / Despacho Jurídico', ph: 'Ej. Corporativo Jurídico Supra Legis', span: 2 },
            { id: 'es_deudor', label: 'Nombre del Deudor', ph: 'Nombre completo', span: 2 },
            { id: 'es_monto', label: 'Total a Liquidar ($)', ph: 'Incluyendo intereses', span: 1 },
            { id: 'es_asunto', label: 'Juzgado de Adscripción (Advertencia)', ph: 'Ej. Juzgados Civiles de Puebla', span: 1 },
            { id: 'es_extra', label: 'Última oportunidad o acción', ph: 'Ej. Embargo de bienes / Demanda Mercantil', span: 2 },
        ],
        requerimiento_alimentos: [
            { id: 'es_nombre', label: 'Nombre del Representante (Madre/Padre)', ph: 'Nombre completo', span: 2 },
            { id: 'es_deudor', label: 'Nombre del Deudor Alimentista', ph: 'Persona obligada al pago', span: 2 },
            { id: 'es_monto', label: 'Monto del Adeudo Retroactivo ($)', ph: 'Total de meses no pagados', span: 1 },
            { id: 'es_extra', label: 'Convenio o Sentencia de Referencia', ph: 'Ej. Sentencia definitiva del Juzgado Octavo Familiar', span: 1 },
            { id: 'es_vence', label: 'Plazo para ponerse al corriente (días)', ph: 'Ej. 48 horas', span: 2 },
        ],
        convenio_contrato: [
            { id: 'es_nombre', label: 'Nombre de la Primera Parte', ph: 'Ej. Juan Pérez (Vendedor/Arrendador)', span: 2 },
            { id: 'es_patron', label: 'Nombre de la Segunda Parte', ph: 'Ej. María López (Comprador/Arrendatario)', span: 2 },
            { id: 'es_monto', label: 'Cuantía o Valor del Acto ($)', ph: '0.00 si es indeterminado', span: 1 },
            { id: 'es_extra', label: 'Objeto del Contrato/Convenio', ph: 'Ej. Compraventa de terreno, Convenio de confidencialidad...', span: 1 },
            { id: 'es_asunto', label: 'Cláusulas Especiales o Notas', ph: 'Detalles adicionales que desee incluir...', span: 2 },
        ],
    };

    const ESCRITOS_ARANCEL_MAP = {
        demanda_laboral: { service: 'asesoria_escrita', units: 5 },
        demanda_mercantil: { service: 'cuantia_determinada', useMonto: true },
        demanda_alimentos: { service: 'contestacion_indeterminada' },
        denuncia_penal: { service: 'penal_denuncia' },
        convenio_contrato: { service: 'redaccion_contrato', useMonto: true },
        convenio_honorarios: { service: 'redaccion_contrato', useMonto: true },
        arrendamiento: { service: 'redaccion_contrato', useMonto: true },
        compraventa: { service: 'redaccion_contrato', useMonto: true },
        compraventa_vehiculo: { service: 'redaccion_contrato', useMonto: true },
        ejecucion_laudo: { service: 'cuantia_determinada', useMonto: true },
        jurisdiccion_voluntaria: { service: 'jurisdiccion_voluntaria' }
    };

    // Funcion que rellena los campos dinamicos al cambiar el tipo
    window.actualizarCamposEscrito = () => {
        const tipo = document.getElementById('es_tipo').value;
        const campos = ESCRITOS_CAMPOS[tipo] || [];
        const container = document.getElementById('es_campos_dinamicos');

        container.innerHTML = campos.map(c => {
            const span = c.span === 2 ? ' style="grid-column:span 2"' : '';
            const type = c.type || 'text';
            return `<div${span}>
                <label style="font-weight:600;">${c.label}</label>
                <input type="${type}" id="${c.id}" class="form-control" placeholder="${c.ph || ''}">
            </div>`;
        }).join('');

        // Ocultar preview al cambiar tipo
        document.getElementById('escritoPreviewContainer').style.display = 'none';

        // Actualizar Estimación Arancelaria
        window.actualizarEstimacionArancel();

        // Vincular eventos a campos de monto para actualización en tiempo real
        const montoInput = document.getElementById('es_monto');
        if (montoInput) {
            montoInput.addEventListener('input', window.actualizarEstimacionArancel);
        }
    };

    window.actualizarEstimacionArancel = () => {
        const tipo = document.getElementById('es_tipo').value;
        const map = ESCRITOS_ARANCEL_MAP[tipo];
        const container = document.getElementById('es_arancel_estimacion');
        if (!container) return;

        if (!map) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        const uma = parseFloat(document.getElementById('ara_uma')?.value) || 108.57;
        const monto = map.useMonto ? (parseFloat(document.getElementById('es_monto')?.value) || 0) : 0;
        const units = map.units || 1;

        if (window.getArancelEstimation) {
            const res = window.getArancelEstimation(map.service, units, monto, uma, 0);
            const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            document.getElementById('es_arancel_rango').innerText = `${fmt(res.minFinal)} - ${fmt(res.maxFinal)}`;
            document.getElementById('es_arancel_nota').innerText = `Basado en ${res.art}: ${res.concept}.`;
        }
    };

    window.referenciarArancel = () => {
        const tipo = document.getElementById('es_tipo').value;
        const map = ESCRITOS_ARANCEL_MAP[tipo];
        if (!map) return;

        window.switchModule('calculadora');
        // Asegurar que estamos en la pestaña de Arancel si hay submódulos
        const tabArancel = document.querySelector('[onclick*="arancel"]');
        if (tabArancel) tabArancel.click();

        document.getElementById('ara_servicio').value = map.service;
        if (map.useMonto) {
            document.getElementById('ara_valor_negocio').value = document.getElementById('es_monto')?.value || 0;
        }
        if (map.units) {
            document.getElementById('ara_unidades').value = map.units;
        }

        if (window.toggleArancelOptions) window.toggleArancelOptions();
        window.calcularArancelPuebla();
    };

    // Inicializar campos al cargar
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('es_tipo')) actualizarCamposEscrito();
    });

    // Helpers de lectura de campos
    const esVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    };
    const esUp = (id, fallback) => {
        const v = esVal(id);
        return v ? v.toUpperCase() : (fallback || '__________________________');
    };

    window.generarEscritoPreview = () => {
        const tipo = document.getElementById('es_tipo').value;
        const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
        let txt = '';

        if (tipo === 'convenio_honorarios') {
            const abogado = esUp('es_abogado');
            const cliente = esUp('es_nombre');
            const asunto = esVal('es_extra') || 'ASUNTO JURÍDICO';
            const total = esVal('es_monto') || '__________';
            const anticipo = esVal('es_renta') || '__________';
            const etapas = esVal('es_asunto') || 'Se liquidará conforme a las etapas procesales pactadas.';

            txt = `CONVENIO DE HONORARIOS PROFESIONALES (EQUITATIVO)

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

CELEBRAN: Por una parte el LIC. ${abogado}, en su carácter de PROFESIONISTA, y por la otra el(la) C. ${cliente}, en su carácter de CLIENTE, al tenor de las siguientes cláusulas que buscan garantizar un cobro justo y equilibrado:

CLÁUSULAS:

PRIMERA (OBJETO): EL PROFESIONISTA se obliga a prestar sus servicios de asesoría y representación legal en el asunto: "${asunto}".

SEGUNDA (HONORARIOS): Ambas partes acuerdan libremente que los honorarios por la prestación de servicios serán por la cantidad total de $${total} (__________________________ PESOS 00/100 M.N.). Este monto se considera JUSTO atendiendo a la complejidad del asunto y el beneficio obtenido para el cliente.

TERCERA (FORMA DE PAGO): El pago se realizará de la siguiente manera:
1. Anticipo inicial: $${anticipo}.
2. Diferido: ${etapas}.

CUARTA (GASTOS): No se incluyen en los honorarios los gastos de copias, edictos, peritajes, ni derechos gubernamentales, los cuales correrán a cargo del CLIENTE, previa exhibición de comprobantes justificables.

QUINTA (EQUIDAD): En caso de terminación anticipada, el CLIENTE pagará únicamente lo proporcional a las etapas procesales efectivamente trabajadas por el PROFESIONISTA, conforme al Arancel de Abogados del Estado de Puebla, para evitar enriquecimientos injustos.

SEXTA (FUNDAMENTO): El presente convenio se rige por los Artículos 2432 a 2445 del Código Civil para el Estado Libre y Soberano de Puebla.

FIRMAMOS DE CONFORMIDAD:

    EL PROFESIONISTA                                    EL CLIENTE
__________________________                          __________________________
    LIC. ${abogado}                                     ${cliente}`;

        } else if (tipo === 'mandato_judicial') {
            const mandante = esUp('es_nombre');
            const mandatario = esUp('es_abogado');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';

            txt = `MANDATO JUDICIAL PARA PLEITOS Y COBRANZAS

EXPEDIENTE: ${exp}
C. JUEZ ${juzgado.toUpperCase()}.

${mandante}, por mi propio derecho, ante Usted respetuosamente expongo:

Que por medio del presente y con fundamento en los Artículos 2437, 2465 y 2475 del Código Civil para el Estado Libre y Soberano de Puebla, vengo a otorgar MANDATO JUDICIAL amplio y cumplido en favor del LIC. ${mandatario}, para que en mi nombre y representación promueva el presente juicio con todas las facultades generales y las especiales que requieran cláusula específica, tales como: desistirse, transigir, comprometer en árbitros, absolver y articular posiciones, recibir pagos, y demás facultades inherentes a la defensa de mis intereses.

Acepto que mi Mandatario actúe bajo las reglas del mandato judicial debidamente registrado.

POR LO EXPUESTO, PIDO:
ÚNICO.- Tenerme por presentado otorgando el mandato judicial en términos de ley.

PROTESTO LO NECESARIO
${mandante}
Puebla, Pue., a ${fecha}.`;

        } else if (tipo === 'aceptacion_cargo') {
            const abogado = esUp('es_abogado');
            const cliente = esUp('es_nombre');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';

            txt = `ASUNTO: SE ACEPTA Y PROTESTA EL CARGO CONFERIDO.

EXPEDIENTE: ${exp}
C. JUEZ ${juzgado.toUpperCase()}.

LIC. ${abogado}, con la personalidad que tengo debidamente acreditada en autos como Abogado Patrono de la parte ${cliente}, ante Usted respetuosamente comparezco y expongo:

Que por medio del presente escrito, vengo a hacer MANIFIESTA MI ACEPTACIÓN Y PROTESTA del cargo de ABOGADO PATRONO que me fue conferido por mi representado, obligándome a cumplir con las obligaciones de lealtad, pericia y diligencia que la ley me impone.

Lo anterior para los efectos legales a que haya lugar en términos del Artículo 19 del Código de Procedimientos Civiles para el Estado de Puebla.

PROTESTO LO NECESARIO
LIC. ${abogado}
Puebla, Pue., a ${fecha}.`;

        } else if (tipo === 'acusar_rebeldia') {
            const nombre = esUp('es_nombre');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';
            const fechaVence = esVal('es_asunto') || 'el término legal correspondiente';

            txt = `ASUNTO: SE ACUSA LA REBELDÍA POR FALTA DE CONTESTACIÓN.

EXPEDIENTE: ${exp}
C. JUEZ ${juzgado.toUpperCase()}.

${nombre}, con la personalidad acreditada en el expediente citado al rubro, ante Usted respetuosamente comparezco y expongo:

Que toda vez que ha transcurrido el término concedido a la parte demandada para contestar la demanda instaurada en su contra, sin que lo haya hecho, con fundamento en el Artículo 226 del Código de Procedimientos Civiles para el Estado Libre y Soberano de Puebla, vengo a solicitar se le ACUSE LA CORRESPONDIENTE REBELDÍA, teniéndose por contestados los hechos en sentido negativo y perdiéndose el derecho para ofrecer pruebas.

Asimismo, solicito se ordene que las notificaciones subsecuentes, aun las de carácter personal, le surtan efectos por lista.

PROTESTO LO NECESARIO
${nombre}
Puebla, Pue., a ${fecha}.`;

        } else if (tipo === 'ofrecimiento_pruebas') {
            const nombre = esUp('es_nombre');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';
            const resumen = esVal('es_asunto') || 'LAS QUE OBREN EN AUTOS';

            txt = `ASUNTO: OFRECIMIENTO DE PRUEBAS.

EXPEDIENTE: ${exp}
C. JUEZ ${juzgado.toUpperCase()}.

${nombre}, promoviendo con el carácter que tengo reconocido en autos, ante Usted con el debido respeto comparezco y expongo:

Que estando en tiempo y forma, y con fundamento en los Artículos 229, 230, 231 y concordantes del Código de Procedimientos Civiles para el Estado de Puebla, vengo a OFRECER como pruebas de mi parte las siguientes:

1. CONFESIONAL...
2. TESTIMONIAL...
3. DOCUMENTAL PÚBLICA...
4. DOCUMENTAL PRIVADA...
5. INSTRUMENTAL DE ACTUACIONES...
6. PRESUNCIONAL LEGAL Y HUMANA...

(RESUMEN DE PRUEBAS INDICADO: ${resumen})

Pruebas que se encuentran relacionadas con todos y cada uno de los hechos de mi demanda/contestación y con las cuales pretendo acreditar mis pretensiones.

PUEBLA, PUE., A ${fecha}.
${nombre}`;

        } else if (tipo === 'subarrendamiento') {
            const principal = esUp('es_arrendador');
            const sub = esUp('es_nombre');
            const domicilio = esVal('es_domicilio') || '__________________________';
            const renta = esVal('es_renta') || '0.00';
            const inicio = esVal('es_inicio') ? new Date(esVal('es_inicio') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';
            const permiso = esVal('es_asunto') || '__________________________';

            txt = `CONTRATO DE SUBARRENDAMIENTO

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

PARTES: EL ARRENDATARIO PRINCIPAL: ${principal}. EL SUBARRENDATARIO: ${sub}.

CLÁUSULAS:

PRIMERA (OBJETO): EL ARRENDATARIO PRINCIPAL otorga el uso temporal de una parte o la totalidad del inmueble ubicado en: ${domicilio}.

SEGUNDA (RENTA): El SUBARRENDATARIO pagará la cantidad de $${renta} mensuales.

TERCERA (VIGENCIA): Iniciando el día ${inicio}, sin exceder la vigencia del contrato principal.

CUARTA (PERMISO): EL ARRENDATARIO PRINCIPAL declara contar con la facultad para subarrendar conforme a: ${permiso}, en términos de lo dispuesto por el Artículo 2318 del Código Civil para el Estado de Puebla.

QUINTA (RESPONSABILIDAD): El SUBARRENDATARIO responde solidariamente ante el dueño original por el uso del inmueble.

FIRMAMOS DE CONFORMIDAD:

    ARRENDATARIO PRINCIPAL                              SUBARRENDATARIO
__________________________                          __________________________
    ${principal}                                        ${sub}`;

        } else if (tipo === 'deposito') {
            const depositante = esUp('es_arrendador');
            const depositario = esUp('es_nombre');
            const bienes = esVal('es_extra') || '__________________________';
            const lugar = esVal('es_domicilio') || '__________________________';
            const retribucion = esVal('es_renta') || '0.00';
            const vence = esVal('es_vence') ? new Date(esVal('es_vence') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';

            txt = `CONTRATO DE DEPÓSITO DE BIENES MUEBLES

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

DEPOSITANTE: ${depositante}.
DEPOSITARIO: ${depositario}.

CLÁUSULAS:

PRIMERA (OBJETO): EL DEPOSITANTE entrega para su resguardo y custodia los siguientes bienes: ${bienes.toUpperCase()}. EL DEPOSITARIO declara recibirlos en este acto.

SEGUNDA (LUGAR DE RESGUARDO): Los bienes serán custodiados en el domicilio ubicado en: ${lugar}. El depositario no podrá trasladarlos sin autorización.

TERCERA (RETRIBUCIÓN): Se pacta una retribución de $${retribucion} por el tiempo que dure el depósito. En caso de ser $0.00, el depósito se entiende como gratuito.

CUARTA (DEVOLUCIÓN): EL DEPOSITARIO se obliga a devolver los bienes en el mismo estado en que los recibió el día ${vence} o cuando le sea solicitado por el DEPOSITANTE.

QUINTA (FUNDAMENTO): Arts. 2358 al 2392 del Código Civil para el Estado de Puebla.

FIRMAMOS DE CONFORMIDAD:

    DEPOSITANTE                                         DEPOSITARIO
__________________________                          __________________________
    ${depositante}                                      ${depositario}`;

        } else if (tipo === 'carta_poder') {
            const nombre = esUp('es_nombre'); if (!esVal('es_nombre')) return alert('Escriba el nombre del poderdante.');
            const abogado = esUp('es_abogado', 'LIC. __________________________ Y/O LIC. __________________________');
            const autoridad = esVal('es_extra') || 'cualesquiera Autoridades Federales, Estatales y Municipales, ya sean Judiciales, Administrativas o del Trabajo, en especial ante la Fiscalía General del Estado de Puebla y Juzgados del Poder Judicial del Estado';
            txt = `CARTA PODER

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

A QUIEN CORRESPONDA:

Por la presente, el(la) suscrito(a) ${nombre}, en pleno uso de mis facultades legales y por mi propio derecho;

OTORGO PODER AMPLIO, CUMPLIDO Y BASTANTE a favor de los Licenciados en Derecho ${abogado}, para que conjunta o indistintamente, en mi nombre y representación, comparezcan ante ${autoridad}.

FACULTADES:
Para que promuevan juicios, interpongan recursos (incluyendo el Juicio de Amparo), ofrezcan y desahoguen pruebas, aleguen, transijan, reciban pagos, y realicen cuantas gestiones sean necesarias para la defensa de mis intereses, en términos de lo dispuesto por el Artículo 2554 del Código Civil Federal y sus correlativos 2434, 2465 y 2475 del Código Civil para el Estado Libre y Soberano de Puebla.

OTORGANTE:
__________________________
${nombre}

ACEPTO EL PODER:
__________________________
${abogado.split(' Y ')[0] || abogado}

TESTIGO 1: __________________________
TESTIGO 2: __________________________`;

        } else if (tipo === 'autorizacion_juzgado') {
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del promovente.');
            const abogado = esUp('es_abogado', 'LIC. __________________________');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';
            txt = `ASUNTO: SE AUTORIZA ABOGADOS PATRONOS Y DOMICILIO PROCESAL.

EXPEDIENTE: ${exp}

C. JUEZ ${juzgado.toUpperCase()}.
PRESENTE.

${nombre}, promoviendo en los autos del expediente al rubro citado, ante Usted con el debido respeto comparezco y expongo:

Que por medio del presente escrito y con fundamento en los Artículos 1, 19, 22, 23, 24 y 25 del Código de Procedimientos Civiles para el Estado Libre y Soberano de Puebla, vengo a nombrar como mis ABOGADOS PATRONOS a los Licenciados en Derecho ${abogado}, quienes cuentan con título debidamente registrado ante el Tribunal Superior de Justicia, otorgándoles todas las facultades inherentes al mandato judicial.

Asimismo, señalo como domicilio para oír y recibir toda clase de notificaciones personales el ubicado en: __________________________________________________.

Por lo anteriormente expuesto, A USTED C. JUEZ, atentamente pido:

PRIMERO.- Tenerme por presentado nombrando Abogados Patronos y señalando domicilio procesal en términos de ley.
SEGUNDO.- Acordar de conformidad lo solicitado por ser de estricta justicia.

PROTESTO A USTED MI RESPETO
${nombre}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'autorizacion_simple') {
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del promovente.');
            const autor = esUp('es_abogado', 'CC. __________________________');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';
            txt = `ASUNTO: SE AUTORIZA PARA OÍR Y RECIBIR NOTIFICACIONES.

EXPEDIENTE: ${exp}

C. JUEZ ${juzgado.toUpperCase()}.
PRESENTE.

${nombre}, promoviendo en los autos del expediente al rubro citado, ante Usted respetuosamente comparezco y expongo:

Que por medio del presente escrito, vengo a AUTORIZAR para oír y recibir toda clase de notificaciones, documentos y valores, así como para imponerse de los autos, a los ${autor}, indistintamente.

Lo anterior con fundamento en los artículos autorizados por la ley de la materia y de forma enunciativa mas no limitativa.

Por lo expuesto, A USTED C. JUEZ, atentamente pido:
ÚNICO.- Tenerme por presentado autorizando a las personas mencionadas para los fines indicados.

PROTESTO LO NECESARIO
${nombre}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'convenio_contrato') {
            const parte1 = esUp('es_nombre');
            const parte2 = esUp('es_patron');
            const monto = esVal('es_monto') || '0.00';
            const objeto = esVal('es_extra') || '__________________________';
            const clausulas = esVal('es_asunto') || 'LAS PARTES ACUERDAN LOS TÉRMINOS Y CONDICIONES ADJUNTO AL PRESENTE.';

            txt = `CONTRATO / CONVENIO PRIVADO
    
LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

PARTES CONTRATANTES:
Por una parte ${parte1}, a quien en lo sucesivo se le denominará como "LA PRIMERA PARTE"; y por la otra ${parte2}, a quien en lo sucesivo se le denominará como "LA SEGUNDA PARTE". Ambos con capacidad legal para contratar y obligarse.

OBJETO:
El presente instrumento tiene por objeto: ${objeto.toUpperCase()}.

CLÁUSULAS:

PRIMERA (MONTO/VALOR): Las partes acuerdan que el valor total de la operación o acto jurídico es la cantidad de $${monto} (__________________________ PESOS 00/100 M.N.).

SEGUNDA (OBLIGACIONES): Ambas partes se obligan a cumplir con lo pactado en buena fe, brindándose el apoyo recíproco para el cumplimiento del objeto.

TERCERA (NOTAS ESPECIALES): ${clausulas}

CUARTA (JURISDICCIÓN): Para la interpretación y cumplimiento del presente, las partes se someten a la jurisdicción de los Tribunales Judiciales de la Ciudad de Puebla, Pue.

FIRMAMOS DE CONFORMIDAD:

    LA PRIMERA PARTE                                    LA SEGUNDA PARTE
__________________________                          __________________________
    ${parte1}                                           ${parte2}`;

        } else if (tipo === 'pagare') {
            const deudor = esUp('es_deudor'); if (!deudor || deudor === '__________________________') return alert('Escriba el nombre del deudor.');
            const acreedor = esUp('es_acreedor'); if (!acreedor || acreedor === '__________________________') return alert('Escriba el nombre del acreedor/beneficiario.');
            const aval = esVal('es_aval') ? esVal('es_aval').toUpperCase() : '';
            const monto = esVal('es_monto') || '__________';
            const tasa = esVal('es_tasa') || '_____';
            const vence = esVal('es_vence') ? new Date(esVal('es_vence') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________ de ____________________ del año ________';
            const serie = esVal('es_serie') || '1 / 1';
            const domicilio = esVal('es_domicilio') || '__________________________';
            const [numSerie, totalSerie] = serie.includes('/') ? serie.split('/').map(s => s.trim()) : [serie, '1'];

            txt = `PAGARÉ (TÍTULO DE CRÉDITO)

NÚMERO: ${numSerie} / ${totalSerie}             BUENO POR: $ ${monto}

LUGAR Y FECHA DE EXPEDICIÓN: Heroica Puebla de Zaragoza, a ${fecha}.

Debo y Pagaré incondicionalmente a la orden de:
${acreedor}

En la ciudad de Heroica Puebla de Zaragoza, el día: ${vence}.

La cantidad de: $ ${monto}
(__________________________________________________________________________  PESOS 00 / 100 M.N.)

Valor recibido a mi(nuestra) entera satisfacción. Por el presente PAGARÉ, me (nos) obligo(amos) a pagar incondicionalmente y sin pretexto ni demora alguna, la cantidad arriba indicada. Este título de crédito forma parte de una serie numerada del 1 al ${totalSerie} y todos están sujetos a la condición de que, al no pagarse cualquiera de ellos a su vencimiento, serán exigibles todos los que le sigan en número, además de los ya vencidos. Desde la fecha de vencimiento hasta el día de su liquidación, causará intereses moratorios al tipo de ${tasa}% mensual, pagadero en esta ciudad juntamente con el principal.

Los suscritos renuncian a los beneficios de orden, excusión y división, así como a la jurisdicción de cualesquiera tribunales, sometiéndose expresamente a los de la Heroica Puebla de Zaragoza.

NOMBRE Y DATOS DEL DEUDOR (SUSCRIPTOR):
Nombre: ${deudor}
Dirección: ${domicilio}.${aval ? `\n\nNOMBRE Y DATOS DEL AVAL:\nNombre: ${aval}\nDirección: __________________________` : ''}

ACEPTO(AMOS) Y FIRMA(MOS):

_______________________________________
FIRMA DEL DEUDOR / SUSCRIPTOR
(Artículos 1, 5, 23, 170, 171, 172, 173 y 174 de la Ley General de Títulos y Operaciones de Crédito)`;

        } else if (tipo === 'endoso_propiedad') {
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del endosante.');
            const nuevo = esUp('es_acreedor', '__________________________');
            txt = `ENDOSO EN PROPIEDAD (TÍTULO DE CRÉDITO)

PÁGUESE a la orden de: ${nuevo}

Valor en propiedad.

Lugar: Heroica Puebla de Zaragoza.
Fecha: ${fecha}.

NOMBRE DEL ENDOSANTE:
__________________________
${nombre}

FIRMA:
__________________________
(Artículos 26, 29, 33 y 34 de la Ley General de Títulos y Operaciones de Crédito)`;

        } else if (tipo === 'endoso_procuracion') {
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del endosante.');
            const abogados = esVal('es_abogado') || '__________________________';
            txt = `ENDOSO EN PROCURACIÓN (PARA COBRO)

PÁGUESE a la orden de los LICS. ${abogados.toUpperCase()}

Valor en procuración / al cobro.

Lugar: Heroica Puebla de Zaragoza.
Fecha: ${fecha}.

NOMBRE DEL ENDOSANTE:
__________________________
${nombre}

FIRMA:
__________________________
(Artículos 29 y 35 de la Ley General de Títulos y Operaciones de Crédito. El presente faculta a los endosatorios para presentar el documento para su aceptación, para cobrarlo judicial o extrajudicialmente, para endosarlo en procuración y para protestarlo en su caso.)`;

        } else if (tipo === 'hoja_servicios') {
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del cliente.');
            const abogado = esUp('es_abogado', '__________________________');
            const asunto = esVal('es_extra') || '__________________________';
            txt = `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES (MATERIA LEGAL)

Contrato que celebran por una parte el(la) C. ${nombre}, a quien en lo sucesivo se le denominará "EL CLIENTE", y por la otra el LIC. ${abogado}, a quien en lo sucesivo se le denominará "EL PROFESIONISTA", al tenor de las siguientes declaraciones y cláusulas:

DECLARACIONES:
I. Declara EL PROFESIONISTA ser Licenciado en Derecho, con Cédula Profesional debidamente registrada y con plena capacidad legal para ejercer la profesión y asesorar jurídicamente.
II. Declara EL CLIENTE requerir los servicios profesionales para la atención del asunto que se describe en el apartado de Cláusulas.

CLAUSULAS:

PRIMERA (OBJETO): EL PROFESIONISTA se obliga a prestar sus servicios de ASESORÍA y REPRESENTACIÓN LEGAL en favor de EL CLIENTE, respecto al siguiente asunto:
"${asunto}"

SEGUNDA (OBLIGACIONES): EL PROFESIONISTA se compromete a realizar todas las gestiones judiciales y extrajudiciales necesarias, actuando con pericia, honestidad y debida diligencia, manteniendo informado a EL CLIENTE sobre el estado procesal que guarda el asunto.

TERCERA (HONORARIOS): Las partes acuerdan que el monto total de los honorarios será de $__________ (__________________________ PESOS 00/100 M.N.), pagaderos de la siguiente forma:
1. Un anticipo de $__________ a la firma del presente.
2. $__________ al momento de la etapa de desahogo de pruebas o sentencia.
3. El saldo restante al concluir el asunto.

CUARTA (GASTOS): Los gastos que se generen por concepto de copias certificadas, exhortos, edictos, peritajes, viáticos foráneos y demás costas inherentes al juicio correrán a cargo exclusivamente de EL CLIENTE.

QUINTA (VIGENCIA Y TERMINACIÓN): El presente contrato tendrá vigencia hasta la total conclusión del asunto encomendado, salvo que exista revocación o renuncia por causa justificada.

SEXTA (JURISDICCIÓN): Para la interpretación y cumplimiento del presente, las partes se someten a las leyes civiles de la Heroica Puebla de Zaragoza.

LEÍDO QUE FUE POR AMBAS PARTES, LO FIRMAN EN LA CIUDAD DE PUEBLA AL DÍA ${fecha}.

EL CLIENTE                                          EL PROFESIONISTA
__________________________                          __________________________
${nombre}                                           LIC. ${abogado}`;

        } else if (tipo === 'arrendamiento_comercial') {
            const arrendador = esUp('es_arrendador');
            const nombre = esUp('es_nombre');
            const fiador = esVal('es_fiador') ? esVal('es_fiador').toUpperCase() : null;
            const domicilio = esVal('es_domicilio') || '__________________________';
            const giro = esVal('es_extra') || '__________________________';
            const renta = esVal('es_renta') || '__________';
            const deposito = esVal('es_deposito') || '__________';
            const inicio = esVal('es_inicio') ? new Date(esVal('es_inicio') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';
            const fin = esVal('es_fin') ? new Date(esVal('es_fin') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';

            txt = `CONTRATO DE ARRENDAMIENTO DE LOCAL COMERCIAL

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

PARTES: EL ARRENDADOR: ${arrendador}. EL ARRENDATARIO: ${nombre}.${fiador ? ` EL FIADOR: ${fiador}.` : ''}

CLÁUSULAS:

PRIMERA (OBJETO): EL ARRENDADOR otorga en arrendamiento a EL ARRENDATARIO el local comercial ubicado en: ${domicilio}, el cual se encuentra en condiciones óptimas para su uso.

SEGUNDA (GIRO): EL ARRENDATARIO se obliga a destinar el local única y exclusivamente para el giro de: ${giro.toUpperCase()}. Cualquier cambio de giro requerirá autorización por escrito.

TERCERA (RENTA E IVA): EL ARRENDATARIO pagará mensualmente la cantidad de $${renta} (__________________________ PESOS 00/100 M.N.), más el Impuesto al Valor Agregado (IVA) correspondiente, previa entrega del recibo fiscal que cumpla con los requisitos del SAT.

CUARTA (VIGENCIA): El contrato tendrá una duración de __________ años, iniciando el día ${inicio} y terminando el día ${fin}.

QUINTA (DEPÓSITO): EL ARRENDATARIO entrega $${deposito} como garantía de cumplimiento de sus obligaciones y servicios (luz, agua, teléfono).

SEXTA (MEJORAS): Queda prohibido realizar modificaciones estructurales al local sin permiso escrito del ARRENDADOR. Al término del contrato, las mejoras quedarán en beneficio del inmueble.

SÉPTIMA (FUNDAMENTO): Se rige por el Código Civil del Estado de Puebla y las leyes fiscales federales vigentes.

FIRMAMOS DE CONFORMIDAD:

    ARRENDADOR                                          ARRENDATARIO
__________________________                          __________________________
    ${arrendador}                                       ${nombre}

${fiador ? `\n    FIADOR / OBLIGADO SOLIDARIO\n__________________________\n    ${fiador}` : ''}

    TESTIGO 1                                           TESTIGO 2
__________________________                          __________________________`;

        } else if (tipo === 'arrendamiento_terreno') {
            const arrendador = esUp('es_arrendador');
            const nombre = esUp('es_nombre');
            const domicilio = esVal('es_domicilio') || '__________________________';
            const medidas = esVal('es_asunto') || '__________________________';
            const renta = esVal('es_renta') || '__________';
            const inicio = esVal('es_inicio') ? new Date(esVal('es_inicio') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';
            const fin = esVal('es_fin') ? new Date(esVal('es_fin') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';

            txt = `CONTRATO DE ARRENDAMIENTO DE TERRENO (LOTE)

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

ARRENDADOR: ${arrendador}.
ARRENDATARIO: ${nombre}.

CLÁUSULAS:

PRIMERA (OBJETO): EL ARRENDADOR otorga el uso temporal del terreno ubicado en: ${domicilio}.
SUPERFICIE Y LINDEROS: ${medidas}.

SEGUNDA (RENTA): Se pacta una renta mensual de $${renta} (__________________________ PESOS 00/100 M.N.).

TERCERA (VIGENCIA): El plazo será del día ${inicio} al día ${fin}.

CUARTA (CONSTRUCCIONES): EL ARRENDATARIO no podrá realizar construcciones permanentes de mampostería sin autorización. Al finalizar el contrato, deberá retirar cualquier instalación provisional, salvo acuerdo en contrario.

QUINTA (FUNDAMENTO): Artículos 2261 y relativos del Código Civil para el Estado de Puebla.

FIRMAMOS DE CONFORMIDAD:

    ARRENDADOR                                          ARRENDATARIO
__________________________                          __________________________
    ${arrendador}                                       ${nombre}`;

        } else if (tipo === 'arrendamiento') {
            const arrendador = esUp('es_arrendador'); if (!arrendador || arrendador === '__________________________') return alert('Escriba el nombre del arrendador.');
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del arrendatario.');
            const fiador = esVal('es_fiador') ? esVal('es_fiador').toUpperCase() : null;
            const domicilio = esVal('es_domicilio') || '__________________________________________';
            const renta = esVal('es_renta') || '__________';
            const deposito = esVal('es_deposito') || '__________';
            const inicio = esVal('es_inicio') ? new Date(esVal('es_inicio') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';
            const fin = esVal('es_fin') ? new Date(esVal('es_fin') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';

            txt = `CONTRATO ARRENDAMIENTO DE BIEN INMUEBLE PARA CASA HABITACIÓN

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

CELEBRAN: Por una parte el(la) C. ${arrendador}, a quien en lo sucesivo se le denominará como "EL ARRENDADOR"; por otra parte el(la) C. ${nombre}, a quien se le denominará como "EL ARRENDATARIO"${fiador ? `, y como una tercera parte el(la) C. ${fiador}, a quien se le denominará "EL FIADOR"` : ''}. Las partes se reconocen plena capacidad legal para obligarse al tenor de las siguientes:

CLAUSULAS:

PRIMERA (OBJETO): El Arrendador otorga en arrendamiento al Arrendatario el inmueble ubicado en: ${domicilio}, el cual se entrega en condiciones de habitabilidad y con los servicios funcionando.

SEGUNDA (RENTA): El Arrendatario se obliga a pagar puntualmente la cantidad de $${renta} (__________________________ PESOS 00/100 M.N.) por concepto de renta mensual, pagaderos dentro de los primeros 5 días naturales de cada mes.

TERCERA (VIGENCIA): El plazo del arrendamiento es de UN AÑO FORZOSO para ambas partes, iniciando el día ${inicio} y concluyendo el día ${fin}. Al término del contrato, el Arrendatario deberá desocupar el inmueble sin necesidad de requerimiento previo.

CUARTA (CLÁUSULA PENAL POR MORA): En caso de falta de pago oportuno de la renta, el Arrendatario pagará un interés moratorio del 5% (cinco por ciento) mensual sobre saldos insolutos por cada mes o fracción de mes que dure el retraso.

QUINTA (DEPÓSITO EN GARANTÍA): El Arrendatario entrega en este acto la suma de $${deposito} (__________________________ PESOS 00/100 M.N.) como depósito, el cual no podrá aplicarse a rentas y será devuelto 30 días después de la desocupación si no existen adeudos ni daños al inmueble.

SEXTA (USO Y PROHIBICIONES): El inmueble se destinará exclusivamente para CASA HABITACIÓN. Queda prohibido el subarrendamiento, el traspaso, o albergar sustancias peligrosas, inflamables o ilícitas conforme a la Ley de Extinción de Dominio.

SÉPTIMA (MANTENIMIENTO): Corren por cuenta del Arrendatario las reparaciones menores y el mantenimiento ordinario derivado del uso cotidiano. Cualquier reforma o modificación requerirá autorización por escrito del Arrendador.

OCTAVA (CLÁUSULA PENAL POR TERMINACIÓN ANTICIPADA): Si el Arrendatario decide terminar el contrato antes del plazo pactado, deberá pagar al Arrendador una pena convencional equivalente a dos meses de renta.

NOVENA (FIADOR): ${fiador ? `El Fiador se constituye como obligado solidario del Arrendatario por todas las obligaciones derivadas de este contrato, renunciando a los beneficios de orden y excusión.` : 'El Arrendatario manifiesta que responde con su patrimonio personal de las obligaciones aquí contraídas.'}

DÉCIMA (JURISDICCIÓN Y FUNDAMENTO): Para todo lo no previsto, las partes se someten a las disposiciones del Código Civil para el Estado Libre y Soberano de Puebla (Artículos 2261 al 2337 y demás relativos), renunciando expresamente a cualquier otro fuero.

LEÍDO QUE FUE, LO FIRMAN DE PLENA CONFORMIDAD:

    ARRENDADOR                                          ARRENDATARIO
__________________________                          __________________________
    ${arrendador}                                       ${nombre}

${fiador ? `\n    FIADOR / OBLIGADO SOLIDARIO\n__________________________\n    ${fiador}` : ''}`;

        } else if (tipo === 'compraventa') {
            const vendedor = esUp('es_vendedor'); if (!vendedor || vendedor === '__________________________') return alert('Escriba el nombre del vendedor.');
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del comprador.');
            const bien = esVal('es_extra') || '__________________________________________________________________________';
            const monto = esVal('es_monto') || '__________';
            txt = `CONTRATO PRIVADO DE COMPRAVENTA

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

VENDEDOR: ${vendedor}
COMPRADOR: ${nombre}

OBJETO DEL CONTRATO:
El Vendedor vende, cede y transfiere en favor del Comprador, quien adquiere para sí, el siguiente bien:
${bien}

PRECIO Y FORMA DE PAGO:
El precio pactado por las partes es de $${monto} (__________________________ PESOS 00/100 M.N.), cantidad que el Vendedor manifiesta recibir a su entera satisfacción al momento de la firma del presente contrato, sirviendo este documento como el recibo más eficaz que en derecho proceda.

FUNDAMENTO LEGAL:
El presente se rige por los Artículos 2121, 2122, 2150, 2153 y demás relativos del Código Civil para el Estado Libre y Soberano de Puebla. El Vendedor garantiza que el bien se encuentra libre de todo gravamen y se obliga al saneamiento para el caso de evicción en términos de ley.

FIRMAMOS DE PLENA CONFORMIDAD:

    VENDEDOR                                            COMPRADOR
__________________________                          __________________________
    ${vendedor}                                         ${nombre}

    TESTIGO 1                                           TESTIGO 2
__________________________                          __________________________`;

        } else if (tipo === 'compraventa_vehiculo') {
            const vendedor = esUp('es_vendedor'); if (!vendedor || vendedor === '__________________________') return alert('Escriba el nombre del vendedor.');
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del comprador.');
            const marca = esVal('es_marca') || '_________';
            const modelo = esVal('es_modelo') || '_________';
            const anio = esVal('es_anio') || '________';
            const color = esVal('es_color') || '_________';
            const placas = esVal('es_placas') || '_________';
            const serie = esVal('es_serie') || '_________________________';
            const monto = esVal('es_monto') || '__________';
            const celComp = esVal('es_cel_comp') || '___________';
            txt = `CONTRATO DE COMPRAVENTA DE VEHÍCULO Y CARTA RESPONSIVA

En la ciudad de Heroica Puebla de Zaragoza, siendo las ____:____ horas del día ${fecha}.

VENDEDOR: ${vendedor}
COMPRADOR: ${nombre}

UNIDAD OBJETO DE VENTA:
MARCA: ${marca}       MODELO: ${modelo}       AÑO: ${anio}
COLOR: ${color}       PLACAS: ${placas}        NÚMERO DE SERIE (VIN): ${serie}

PRECIO: $${monto} (__________________________ PESOS 00/100 M.N.).

CARTA RESPONSIVA (DESLINDE DE RESPONSABILIDAD):
1. El Comprador declara recibir el vehículo en el estado mecánico y de carrocería en que se encuentra ("Ad Corpus"), manifestando su total conformidad tras haberlo revisado.
2. A partir de la firma de este documento, el Comprador asume toda responsabilidad CIVIL, PENAL, ADMINISTRATIVA o de TRÁNSITO derivada del uso y posesión del vehículo.
3. El Vendedor se deslinda de cualquier mal uso, infracción o ilícito cometido con la unidad a partir de este momento.
4. El Comprador se obliga a realizar el trámite de cambio de propietario ante las autoridades fiscales correspondientes en un plazo de 15 días hábiles.

DOCUMENTACIÓN ENTREGADA:
Factura Original (endosada), Comprobantes de Pago de Tenencia, Verificación Vehicular y Tarjeta de Circulación.

FIRMAMOS DE PLENA CONFORMIDAD:

    VENDEDOR                                            COMPRADOR
__________________________                          __________________________
    ${vendedor}                                         ${nombre}
    Tel: __________________                             Tel: ${celComp}

    TESTIGO
__________________________`;

        } else if (tipo === 'autorizacion_pasante') {
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del promovente.');
            const autor = esUp('es_abogado', 'C. __________________________');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';
            txt = `ASUNTO: SE AUTORIZA PASANTE EN DERECHO.

EXPEDIENTE: ${exp}

C. JUEZ ${juzgado.toUpperCase()}.
PRESENTE.

${nombre}, promoviendo en los autos del expediente al rubro citado, ante Usted con el debido respeto comparezco y expongo:

Que por medio del presente escrito y con fundamento en lo dispuesto por el Artículo 25 del Código de Procedimientos Civiles para el Estado Libre y Soberano de Puebla, vengo a AUTORIZAR para oír y recibir notificaciones, imponerse de los autos y recoger toda clase de documentos y valores, al C. ${autor}, quien cuenta con los conocimientos necesarios para tal fin.

Por lo anteriormente expuesto, A USTED C. JUEZ, atentamente pido:
ÚNICO.- Tenerme por presentado autorizando a la persona mencionada para los fines indicados en términos de ley.

PROTESTO LO NECESARIO
${nombre}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'solicitud_copias') {
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del promovente.');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';
            const copias = esVal('es_asunto') || 'TODO LO ACTUADO';
            txt = `ASUNTO: SE SOLICITAN COPIAS CERTIFICADAS.

EXPEDIENTE: ${exp}

C. JUEZ ${juzgado.toUpperCase()}.
PRESENTE.

${nombre}, de generales conocidos en el expediente al rubro citado, ante Usted con el debido respeto comparezco y expongo:

Que por medio del presente escrito y con fundamento en el Artículo 75 del Código de Procedimientos Civiles para el Estado Libre y Soberano de Puebla, vengo a solicitar se me expidan a mi costa COPIAS CERTIFICADAS de: ${copias.toUpperCase()}.

Asimismo, autorizo para que en mi nombre y representación las reciban a los Licenciados en Derecho y/o pasantes nombrados con anterioridad en autos.

Por lo expuesto, A USTED C. JUEZ, atentamente pido:
ÚNICO.- Tenerme por presentado solicitando las copias referidas, acordando de conformidad lo solicitado.

PROTESTO LO NECESARIO
${nombre}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'desistimiento') {
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del promovente.');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';
            const motivo = esVal('es_asunto') ? ` lo anterior debido a: ${esVal('es_asunto')}` : '';
            txt = `ASUNTO: ESCRITO DE DESISTIMIENTO.

EXPEDIENTE: ${exp}

C. JUEZ ${juzgado.toUpperCase()}.
PRESENTE.

${nombre}, por mi propio derecho y con la personalidad que tengo debidamente acreditada en los autos del expediente citado al rubro, ante Usted respetuosamente comparezco y expongo:

Que por medio del presente y con fundamento en el Artículo 128 del Código de Procedimientos Civiles para el Estado Libre y Soberano de Puebla, vengo a DESISTIRME de la instancia y de la acción intentada en el presente juicio, sin reserva de derecho alguno, para que las cosas vuelvan al estado que tenían antes de la presentación de la demanda;${motivo}.

Por lo expuesto, A USTED C. JUEZ, atentamente pido:
PRIMERO.- Tenerme por presentado desistidome de la instancia y de la acción en los términos señalados.
SEGUNDO.- En su oportunidad, ordenar el archivo del presente expediente como asunto total y definitivamente concluido.

PROTESTO LO NECESARIO
${nombre}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'devolucion_doctos') {
            const nombre = esUp('es_nombre'); if (!nombre || nombre === '__________________________') return alert('Escriba el nombre del promovente.');
            const exp = esVal('es_extra') || '__________';
            const juzgado = esVal('es_juzgado') || '__________________________';
            const doctos = esVal('es_asunto') || 'DOCUMENTOS ORIGINALES EXHIBIDOS';
            txt = `ASUNTO: SE SOLICITA DEVOLUCIÓN DE DOCUMENTOS.

EXPEDIENTE: ${exp}

C. JUEZ ${juzgado.toUpperCase()}.
PRESENTE.

${nombre}, promoviendo en los autos del expediente al rubro citado, ante Usted con el debido respeto comparezco y expongo:

Que por medio del presente escrito, vengo a solicitar la DEVOLUCIÓN de los siguientes documentos que obran en autos: ${doctos.toUpperCase()}, dejando en su lugar copia simple de los mismos para que conste en el expediente.

Para tal efecto, autorizo para que los reciba en mi nombre a los profesionistas nombrados en autos, previa toma de razón que conste en el expediente.

Por lo expuesto, A USTED C. JUEZ, atentamente pido:
ÚNICO.- Tener por presentado solicitando la devolución de los documentos referidos.

PROTESTO LO NECESARIO
${nombre}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'comodato') {
            const comodante = esUp('es_arrendador');
            const comodatario = esUp('es_nombre');
            const domicilio = esVal('es_domicilio') || '__________________________';
            const inicio = esVal('es_inicio') ? new Date(esVal('es_inicio') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';
            const fin = esVal('es_fin') ? new Date(esVal('es_fin') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';
            const estado = esVal('es_extra') || 'en buen estado y funcionamiento';

            txt = `CONTRATO DE COMODATO SOBRE BIEN INMUEBLE

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

CELEBRAN: Por una parte el(la) C. ${comodante}, a quien se le denominará "EL COMODANTE"; y por la otra el(la) C. ${comodatario}, a quien se le denominará "EL COMODATARIO". Ambas partes se reconocen capacidad legal para obligarse al tenor de las siguientes:

CLÁUSULAS:

PRIMERA (OBJETO): EL COMODANTE entrega gratuitamente el uso y goce temporal del inmueble ubicado en: ${domicilio}, el cual EL COMODATARIO recibe en este acto ${estado}.

SEGUNDA (VIGENCIA): El plazo del presente contrato será del día ${inicio} al día ${fin}. Al término del plazo, EL COMODATARIO se obliga a restituir el inmueble sin necesidad de requerimiento.

TERCERA (USO): El inmueble será destinado única y exclusivamente para CASA HABITACIÓN, quedando prohibido al COMODATARIO variar el destino del mismo o permitir el uso a terceros, salvo autorización por escrito.

CUARTA (CONSERVACIÓN): EL COMODATARIO se obliga a cuidar el inmueble con toda diligencia, siendo responsable de los deterioros que el bien sufra por su culpa o la de sus familiares o dependientes.

QUINTA (DEVOLUCIÓN): EL COMODATARIO entregará el inmueble en las mismas condiciones en que lo recibió, salvo el desgaste natural por el uso ordinario.

SEXTA (FUNDAMENTO): El presente se rige por lo dispuesto en los Artículos 2338 al 2357 del Código Civil para el Estado Libre y Soberano de Puebla.

LEÍDO QUE FUE, LO FIRMAN DE CONFORMIDAD:

    EL COMODANTE                                        EL COMODATARIO
__________________________                          __________________________
    ${comodante}                                        ${comodatario}

    TESTIGO 1                                           TESTIGO 2
__________________________                          __________________________`;

        } else if (tipo === 'mutuo') {
            const mutuante = esUp('es_arrendador');
            const mutuario = esUp('es_nombre');
            const monto = esVal('es_monto') || '__________';
            const tasa = esVal('es_tasa') || '0';
            const vence = esVal('es_vence') ? new Date(esVal('es_vence') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '________________';
            const lugar = esVal('es_domicilio') || 'Ciudad de Puebla';

            txt = `CONTRATO DE MUTUO CON INTERÉS

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

CELEBRAN: Por una parte el(la) C. ${mutuante}, a quien se le denominará "EL MUTUANTE"; y por la otra el(la) C. ${mutuario}, a quien se le denominará "EL MUTUARIO". Ambas partes declaran su voluntad al tenor de las siguientes:

CLÁUSULAS:

PRIMERA (OBJETO): EL MUTUANTE entrega en este acto la cantidad de $${monto} (__________________________ PESOS 00/100 M.N.) a EL MUTUARIO, quien la recibe a su entera satisfacción con la obligación de devolverla.

SEGUNDA (INTERÉS): Se pacta un interés mensual de ${tasa}% (________________ por ciento) sobre la cantidad prestada, el cual deberá ser pagado mensualmente por EL MUTUARIO.

TERCERA (PLAZO): EL MUTUARIO se obliga a devolver la cantidad total más los intereses pactados el día ${vence} en el domicilio ubicado en: ${lugar}.

CUARTA (INCUMPLIMIENTO): En caso de mora, se generará un interés moratorio adicional del ___% mensual sobre saldos insolutos.

QUINTA (FUNDAMENTO): El presente contrato se rige por lo dispuesto en los Artículos 2093 al 2120 del Código Civil para el Estado Libre y Soberano de Puebla.

LEÍDO QUE FUE, LO FIRMAN DE CONFORMIDAD:

    EL MUTUANTE                                         EL MUTUARIO
__________________________                          __________________________
    ${mutuante}                                         ${mutuario}

    TESTIGO 1                                           TESTIGO 2
__________________________                          __________________________`;

        } else if (tipo === 'donacion') {
            const donante = esUp('es_vendedor');
            const donatario = esUp('es_nombre');
            const bien = esVal('es_extra') || '__________________________';
            const valor = esVal('es_monto') || '__________';

            txt = `CONTRATO PRIVADO DE DONACIÓN

LUGAR Y FECHA: Heroica Puebla de Zaragoza, a ${fecha}.

CELEBRAN: Por una parte el(la) C. ${donante}, a quien se le denominará "EL DONANTE"; y por la otra el(la) C. ${donatario}, a quien se le denominará "EL DONATARIO". Ambas partes declaran su voluntad al tenor de las siguientes:

CLÁUSULAS:

PRIMERA (OBJETO): EL DONANTE transfiere de forma gratuita e irrevocable a favor de EL DONATARIO la propiedad del siguiente bien: ${bien}.

SEGUNDA (VALOR): Para efectos legales, las partes manifiestan que el valor estimado del bien donado asciende a la suma de $${valor} (__________________________ PESOS 00/100 M.N.).

TERCERA (ACEPTACIÓN): EL DONATARIO manifiesta que acepta la donación en los términos descritos y agradece a EL DONANTE por la liberalidad.

CUARTA (POSESIÓN): EL DONANTE hace entrega de la posesión material y jurídica del bien a EL DONATARIO en este acto, manifestando que el mismo se encuentra libre de todo gravamen.

QUINTA (FUNDAMENTO): El presente contrato se rige por los Artículos 2182 al 2223 del Código Civil para el Estado Libre y Soberano de Puebla.

LEÍDO QUE FUE, LO FIRMAN DE CONFORMIDAD:

    EL DONANTE                                          EL DONATARIO
__________________________                          __________________________
    ${donante}                                          ${donatario}

    TESTIGO 1                                           TESTIGO 2
__________________________                          __________________________`;

        } else if (tipo === 'demanda_alimentos') {
            const actora = esUp('es_nombre');
            const deudor = esUp('es_deudor');
            const hijos = esVal('es_extra') || 'sus menores hijos';
            const domicilio = esVal('es_domicilio') || '__________________________';
            const monto = esVal('es_monto') || '___';
            const juzgado = esVal('es_juzgado') || 'FAMILIAR DEL DISTRITO JUDICIAL DE PUEBLA';

            txt = `ASUNTO: DEMANDA INICIAL DE JUICIO ORAL FAMILIAR DE ALIMENTOS.

C. JUEZ DE LO ${juzgado.toUpperCase()}.
PRESENTE.

${actora}, por mi propio derecho y en representación de ${hijos}, señalando como domicilio para oír y recibir notificaciones el ubicado en: __________________________________________________, y autorizando a los Licenciados en Derecho __________________________________________________, ante Usted respetuosamente comparezco y expongo:

Que por medio del presente vengo a demandar en la VÍA ORAL FAMILIAR del C. ${deudor}, quien tiene su domicilio para ser emplazado en: ${domicilio}, las siguientes:

PRESTACIONES:
A) El pago de una de pensión alimenticia provisional y en su momento definitiva a favor de los suscritos, suficiente para cubrir nuestras necesidades de comida, vestido, habitación, salud y educación.
B) El aseguramiento de dicha pensión mediante embargo o garantía de ley.
C) El pago de gastos y costas que el presente juicio origine.

FUNDO MI DEMANDA EN LOS SIGUIENTES HECHOS Y PRECEPTOS LEGALES:

HECHOS:
1. La suscrita y el hoy demandado contrajimos matrimonio el día... (o vivimos en unión libre).
2. De dicha unión procreamos a los menores ${hijos}.
3. Desde hace ___ meses el demandado ha dejado de cubrir los gastos necesarios para nuestra subsistencia, a pesar de tener capacidad económica.

DERECHO:
Es Usted competente conforme a los Artículos 91, 107 y 108 del Código de Procedimientos Civiles para el Estado de Puebla. En cuanto al fondo, rigen los Artículos 486 al 521 del Código Civil para el Estado de Puebla.

SOLICITUD DE MEDIDA PROVISIONAL:
Solicito de manera urgente se decrete una pensión alimenticia provisional del ${monto}% de los ingresos ordinarios y extraordinarios que perciba el demandado.

Por lo anteriormente expuesto, A USTED C. JUEZ, atentamente pido:
PRIMERO.- Tenerme por presentada demandando alimentos al C. ${deudor}.
SEGUNDO.- Decretar la pensión alimenticia provisional solicitada y girar oficio al centro de trabajo del deudor.
TERCERO.- Ordenar el emplazamiento de ley.

PROTESTO LO NECESARIO
${actora}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'demanda_laboral') {
            const actor = esUp('es_nombre');
            const patron = esUp('es_patron');
            const dom = esVal('es_domicilio') || '__________________________________________';
            const salario = esVal('es_renta') || '0.00';
            const puesto = esVal('es_extra') || '____________________';
            const ingreso = esVal('es_inicio') || '__________';
            const despido = esVal('es_fin') || '__________';

            txt = `ASUNTO: DEMANDA INICIAL POR DESPIDO INJUSTIFICADO Y PAGO DE PRESTACIONES.

H. TRIBUNAL LABORAL DEL DISTRITO JUDICIAL DE PUEBLA. (O CENTRO DE CONCILIACIÓN EN TURNO)
PRESENTE.

${actor}, por mi propio derecho, señalando como domicilio para oír y recibir toda clase de notificaciones el ubicado en: ____________________________________________________________________, y autorizando en términos del Artículo 692 de la Ley Federal del Trabajo a los Lics. en Derecho ________________________________________, ante Usted con el debido respeto comparezco y expongo:

Que por medio del presente escrito, vengo a demandar en la VÍA ORDINARIA LABORAL al C. ${patron} (y/o a la Persona Moral denominada ____________________), quien tiene su domicilio para ser emplazado en: ${dom}, de quien reclamo las siguientes:

PRESTACIONES:
A) EL PAGO DE LA INDEMNIZACIÓN CONSTITUCIONAL de tres meses de salario a razón del salario diario integrado, por haber sido objeto de un DESPIDO INJUSTIFICADO (Art. 48 LFT).
B) EL PAGO DE SALARIOS VENCIDOS desde la fecha del despido hasta por un periodo máximo de doce meses.
C) EL PAGO DE LOS INTERESES que se generen a razón del 2% mensual capitalizable sobre la base de 15 meses de salario (Art. 48 LFT).
D) EL PAGO DE VACACIONES, PRIMA VACACIONAL Y AGUINALDO proporcionales al tiempo laborado (Arts. 76, 80 y 87 LFT).
E) EL PAGO DE LA PRIMA DE ANTIGÜEDAD a razón de 12 días por cada año de servicios (Art. 162 LFT).
F) EL PAGO DE 20 DÍAS DE SALARIO POR CADA AÑO DE SERVICIOS PRESTADOS, en términos de los Arts. 49 y 50 de la LFT (en caso de negativa de reinstalación o ser trabajador de confianza).
G) EL PAGO Y CUMPLIMIENTO de aportaciones al IMSS, INFONAVIT y SAR omitidas durante la relación laboral.

HECHOS:
1. RELACIÓN LABORAL.- Comencé a prestar mis servicios para la demandada el día ${ingreso}, desempeñando el puesto de ${puesto}.
2. CONDICIONES DE TRABAJO.- El lugar de desempeño de mis labores fue el ubicado en: ${dom}. Percibía un salario diario de $${salario}. Mi jornada laboral consistía en ____________________.
3. EL DESPIDO.- Con fecha ${despido}, siendo aproximadamente las ____:____ horas, me encontraba en mi centro de trabajo cuando el(la) C. ____________________, quien se ostenta como ____________________, se acercó a mi y sin mediar acta administrativa ni causa justificada alguna, me manifestó textualmente: "ESTÁS DESPEDIDO(A), YA NO TE QUEREMOS AQUÍ", dándome de baja de forma unilateral, impidiéndome el acceso al centro de trabajo.

CAPÍTULO DE PRUEBAS:
1. CONFESIONAL.- A cargo del demandado, para que absuelva posiciones en términos de ley.
2. DOCUMENTAL.- Consistente en recibos de nómina, alta ante el IMSS (o falta de ella) y contratos celebrados.
3. TESTIMONIAL.- A cargo de los CC. ____________________, quienes se percatan de las condiciones de trabajo y del despido.
4. INSTRUMENTAL DE ACTUACIONES Y PRESUNCIONAL LEGAL Y HUMANA.

DERECHO:
Norman el fondo del presente asunto los Artículos 1, 2, 3, 5, 20, 21, 26, 48, 50, 76, 80, 81, 84, 87, 89 y 162 de la Ley Federal del Trabajo. El procedimiento se rige por los Artículos 685, 870 y relativos de la citada Ley.

PUNTOS PETITORIOS:
PRIMERO.- Tenerme por presentado en tiempo y forma demandando al C. ${patron}.
SEGUNDO.- Dar entrada a la demanda y ordenar el emplazamiento de ley a la parte demandada. 
TERCERO.- En su oportunidad, dictar Sentencia condenando a la demandada al pago de todas y cada una de las prestaciones reclamadas.

PROTESTO LO NECESARIO
${actor}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'denuncia_penal') {
            const denunciante = esUp('es_nombre');
            const delito = esVal('es_extra') || 'LO REGULADO POR LA LEY';
            const denunciado = esUp('es_patron');
            const hechos = esVal('es_asunto') || '__________________________________________________________________________';

            txt = `ASUNTO: DENUNCIA DE HECHOS POSIBLEMENTE CONSTITUTIVOS DE DELITO.

C. AGENTE DEL MINISTERIO PÚBLICO EN TURNO.
FISCALÍA GENERAL DEL ESTADO DE PUEBLA.
PRESENTE.

${denunciante}, mexicano, mayor de edad, señalando domicilio para recibir notificaciones en: ____________________________________________________________________, ante Usted con el debido respeto comparezco para exponer:

Que con fundamento en el Artículo 21 de la Constitución Política de los Estados Unidos Mexicanos, así como los Artículos 221, 222 y 223 del Código Nacional de Procedimientos Penales, vengo a denunciar HECHOS que pueden ser constitutivos del delito de ${delito.toUpperCase()}, presuntamente cometidos en mi agravio por el(la) C. ${denunciado} (y/o quien resulte responsable), bajo los siguientes:

HECHOS:
I. Con fecha ____________________, aproximadamente a las ____:____ horas, sucedió lo siguiente:
${hechos}
II. (Relatar en forma cronológica las circunstancias de tiempo, modo y lugar de la ejecución del hecho).

PRUEBAS:
Para acreditar lo anterior, ofrezco desde este momento:
1. TESTIMONIAL a cargo de los CC. ________________________________________.
2. DOCUMENTAL consistente en ____________________________________________.
3. Las que esa Representación Social considere necesarias para la integración de la Carpeta de Investigación.

PETICIÓN:
ÚNICO.- Tenerme por presentado y se proceda a investigar los hechos narrados para que en su momento se ejercite la Acción Penal correspondiente en términos del CNPP.

PROTESTO LO NECESARIO
${denunciante}
Puebla, Pue., a ${fecha}.`;

        } else if (tipo === 'demanda_mercantil') {
            const abogado = esUp('es_abogado');
            const actor = esUp('es_nombre');
            const deudor = esUp('es_patron');
            const monto = esVal('es_monto') || '0.00';
            const tasa = esVal('es_renta') || '6';
            const fechaS = esVal('es_extra') || '__________';
            const fechaV = esVal('es_fin') || '__________';

            txt = `ASUNTO: DEMANDA INICIAL DE JUICIO EJECUTIVO MERCANTIL.

C. JUEZ DE LO CIVIL Y/O MERCANTIL EN TURNO.
DISTRITO JUDICIAL DE PUEBLA.
PRESENTE.

${actor}, por mi propio derecho, nombrando como mi Abogado Patrono al LIC. ${abogado} (Cédula Profesional ________), y señalando domicilio para recibir notificaciones el ubicado en: ____________________________________________________________________, ante Usted comparezco y expongo:

Que en la VÍA EJECUTIVA MERCANTIL, vengo a demandar al C. ${deudor}, quien tiene su domicilio para ser emplazado en: ____________________________________________________________________, las siguientes:

PRESTACIONES:
A) EL PAGO DE LA CANTIDAD DE $${monto} por concepto de SUERTE PRINCIPAL, derivada del pagaré insoluto que se anexa a la presente.
B) EL PAGO DE LOS INTERESES MORATORIOS a razón del ${tasa}% mensual, generados desde la fecha de vencimiento hasta la total liquidación del adeudo.
C) EL PAGO DE GASTOS Y COSTAS que el presente juicio origine.

HECHOS:
1. Con fecha ${fechaS}, el hoy demandado suscribió a mi favor un Título de Crédito denominado PAGARÉ por la cantidad original mencionada en las prestaciones.
2. En dicho documento se pactó como fecha de vencimiento el día ${fechaV}.
3. Es el caso que llegado el plazo, el deudor no ha cubierto el monto, a pesar de los múltiples requerimientos extrajudiciales realizados.

DERECHO:
Competencia: Artículos 1090 y 1092 del Código de Comercio.
Fondo: Artículos 1°, 5, 150, 151, 152 y 170 de la LGTOC.
Procedimiento: Artículos 1391 al 1414 del Código de Comercio.

PRUEBAS:
La DOCUMENTAL PRIVADA consistente en el PAGARÉ original que se acompaña como documento base de la acción.

PUNTOS PETITORIOS:
PRIMERO.- Tenerme por presentado con el carácter con el que me ostento.
SEGUNDO.- Dictar AUTO CON EFECTOS DE MANDAMIENTO EN FORMA (Auto de Exequendo) para que el deudor sea requerido de pago y en caso de negativa, se proceda al embargo de bienes suficientes para garantizar lo reclamado.

PROTESTO LO NECESARIO
${actor}
Puebla, Pue., a ${fecha}.`;

        } else if (tipo === 'aviso_rescision') {
            const patron = esUp('es_patron');
            const trabajador = esUp('es_nombre');
            const causas = esVal('es_extra') || '__________________________________________________________________________';
            const entrega = esVal('es_fin') || '__________';

            txt = `AVISO RECISIONAL DE LA RELACIÓN DE TRABAJO. (Art. 47 LFT)

DIRIGIDO AL C. ${trabajador}.
PRESENTE.

Por medio de la presente, y en cumplimiento a lo dispuesto por el Artículo 47, en su último párrafo, de la Ley Federal del Trabajo, la empresa/persona física denominada ${patron}, hace de su conocimiento la RESCISIÓN de su contrato individual de trabajo, sin responsabilidad para el patrón, surtiendo efectos a partir de esta fecha.

Lo anterior se fundamenta en que usted ha incurrido en las siguientes causales de rescisión:
"${causas}"

En virtud de lo anterior, se le comunica que su relación laboral queda terminada a partir del día ${entrega}. Se le invita a pasar al área correspondiente para recibir el pago de su finiquito conforme a derecho.

ENTREGO:                                            RECIBÍ:
__________________________                          __________________________
${patron}                                           ${trabajador}
Patrón / Representante                              Trabajador

TESTIGO 1                                           TESTIGO 2
__________________________                          __________________________
Puebla, Puebla, a ${fecha}.`;

        } else if (tipo === 'ejecucion_laudo') {
            const actor = esUp('es_nombre');
            const deudor = esUp('es_patron');
            const exp = esVal('es_extra') || '__________';
            const laudoDate = esVal('es_fin') ? new Date(esVal('es_fin') + 'T12:00').toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : '__________';
            const monto = esVal('es_monto') || '0.00';

            txt = `ASUNTO: SE SOLICITA INICIO DE TRÁMITE DE EJECUCIÓN DE SENTENCIA / LAUDO.

EXPEDIENTE: ${exp}
H. TRIBUNAL LABORAL DEL DISTRITO JUDICIAL DE PUEBLA.
PRESENTE.

${actor}, con la personalidad que tengo debidamente acreditada en los autos del expediente al rubro citado, ante Usted con el debido respeto comparezco y expongo:

Que ha transcurrido en exceso el término legal para que la parte demandada, el(la) C. ${deudor}, diera cumplimiento voluntario a la SENTENCIA (o LAUDO) dictada por este Tribunal de fecha ${laudoDate}, en la cual se le condenó al pago de diversas prestaciones en favor del suscrito que ascienden a la cantidad total de $${monto}.

Es el caso que, a la fecha, la parte demandada ha hecho caso omiso a dicho mandato judicial, por lo que, con fundamento en los Artículos 939, 940, 945, 950 y demás relativos de la Ley Federal del Trabajo, vengo a solicitar se inicie el PROCEDIMIENTO DE EJECUCIÓN FORZOSA.

Por lo anteriormente expuesto, A USTED H. TRIBUNAL, atentamente pido:

PRIMERO.- Tenerme por presentado solicitando el despacho de la ejecución en contra de la parte demandada.
SEGUNDO.- Se dicte el auto con efectos de mandamiento en forma, para que un Actuario de la adscripción se constituya en el domicilio de la demandada y la requiera por el pago inmediato de las cantidades a que fue condenada.
TERCERO.- En caso de negativa de pago en el momento de la diligencia, se proceda al EMBARGO de bienes propiedad de la demandada suficientes para garantizar el monto de la condena, observando lo dispuesto por el Artículo 951 de la Ley Federal del Trabajo.

PROTESTO LO NECESARIO
${actor}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'invitacion_pago') {
            const acreedor = esUp('es_acreedor');
            const deudor = esUp('es_deudor');
            const monto = esVal('es_monto') || '0.00';
            const concepto = esVal('es_extra') || 'adeudo pendiente';
            const lugar = esVal('es_domicilio') || 'nuestro despacho / vía transferencia';

            txt = `ASUNTO: INVITACIÓN CORDIAL PARA CONCILIACIÓN DE PAGO.
            
Heroica Puebla de Zaragoza, a ${fecha}.

ESTIMADO(A) C. ${deudor}:

Por medio de la presente, el suscrito ${acreedor}, de la manera más atenta y cordial, le hago una invitación para que nos acerquemos a regularizar la situación pendiente respecto a: "${concepto.toUpperCase()}".

A la fecha, se tiene registrado un saldo pendiente por la cantidad de $${monto}. Entendemos que pueden existir diversas circunstancias que hayan retrasado este cumplimiento, por lo cual, antes que cualquier otra acción, deseamos brindarle la oportunidad de liquidar dicho monto o llegar a un acuerdo de pago flexible.

Le agradeceré que se comunique a la brevedad o se presente en ${lugar} para dar por concluido este asunto de forma amistosa y evitar mayores inconvenientes o acumulación de accesorios.

Sin más por el momento, quedo a su disposición para cualquier duda.

ATENTAMENTE,
__________________________
${acreedor}`;

        } else if (tipo === 'requerimiento_formal') {
            const abogado = esUp('es_abogado');
            const acreedor = esUp('es_acreedor');
            const deudor = esUp('es_deudor');
            const monto = esVal('es_monto') || '0.00';
            const extra = esVal('es_extra') || '0.00';
            const vence = esVal('es_vence') || '3 días';

            txt = `ASUNTO: REQUERIMIENTO FORMAL DE PAGO (EXTRAJUDICIAL).

Heroica Puebla de Zaragoza, a ${fecha}.

DIRIGIDO AL C. ${deudor}.
PRESENTE.

En mi carácter de representante legal y/o Abogado de ${acreedor}, le informo por este medio que se le REQUIERE DE PAGO formalmente por la cantidad de $${monto}, derivada de la obligación contraída con mi representado, más la cantidad de $${extra} por concepto de accesorios e intereses devengados a la fecha.

A pesar de las gestiones previas, no se ha verificado el cumplimiento de su obligación, por lo que se le concede un plazo improrrogable de ${vence} para liquidar el total de $${(parseFloat(monto) + parseFloat(extra)).toFixed(2)}.

Le exhortamos a dar cumplimiento inmediato a este requerimiento para evitar que se inicien las acciones legales correspondientes en la vía Civil o Mercantil, lo que incrementaría sustancialmente la deuda por concepto de gastos, costas judiciales y honorarios.

Para mayores informes sobre dónde realizar su pago, favor de comunicarse al despacho del suscrito.

ATENTAMENTE,
LIC. ${abogado}`;

        } else if (tipo === 'aviso_prejudicial') {
            const abogado = esUp('es_abogado');
            const deudor = esUp('es_deudor');
            const monto = esVal('es_monto') || '0.00';
            const juzgado = esVal('es_asunto') || 'Juzgados de lo Civil / Mercantil';
            const accion = esVal('es_extra') || 'PROCEDIMIENTO DE EMBARGO Y REMATE';

            txt = `*** ÚLTIMO AVISO PRE-JUDICIAL INTERLOCUTORIO ***

DIRIGIDO AL C. ${deudor}.
ASUNTO: NOTIFICACIÓN DE INICIO DE ACCIÓN LEGAL E INCUMPLIMIENTO.

Puebla, Puebla, a ${fecha}.

Hacemos de su conocimiento que la etapa de conciliación ha concluido. El expediente relativo a su adeudo por la cantidad de $${monto} ha sido turnado al área de litigio para la presentación de la DEMANDA correspondiente ante los ${juzgado.toUpperCase()}.

Le notificamos que la acción legal incluirá la ejecución de:
- ${accion.toUpperCase()}
- Aseguramiento de bienes propiedad del deudor.
- Reporte ante buró de crédito.
- Cobro de costas y gastos judiciales.

ESTA ES SU ÚLTIMA OPORTUNIDAD PARA EVITAR EL LITIGIO. Si usted liquida su adeudo íntegro en las próximas 24 horas, se detendrá la radicación de la demanda. De lo contrario, nos veremos en la necesidad de continuar el proceso hasta sus últimas consecuencias legales.

COMUNÍQUESE DE INMEDIATO:
${abogado}
CORPORATIVO JURÍDICO SUPRA LEGIS`;

        } else if (tipo === 'requerimiento_alimentos') {
            const nombre = esUp('es_nombre');
            const deudor = esUp('es_deudor');
            const monto = esVal('es_monto') || '0.00';
            const base = esVal('es_extra') || 'convenio o resolución legal';
            const vence = esVal('es_vence') || '48 horas';

            txt = `ASUNTO: REQUERIMIENTO URGENTE DE PAGO DE PENSIÓN ALIMENTICIA.

DIRIGIDO AL C. ${deudor}.
PRESENTE.

En mi carácter de padre/madre y representante legal de nuestros hijos, y con fundamento en lo establecido en el ${base.toUpperCase()}, le REQUIERO EL PAGO inmediato de la cantidad de $${monto}, correspondiente a los conceptos de pensión alimenticia que a la fecha se encuentran vencidos y no pagados.

Le recuerdo que los alimentos son de orden público e interés social, y su falta de pago vulnera los derechos fundamentales a la salud, alimentación y educación de sus hijos.

Se le otorga un plazo de ${vence} para ponerse al corriente con los adeudos acumulados. En caso de persistir el incumplimiento, procederé a solicitar ante el Juez de lo Familiar las medidas de apremio necesarias, tales como:
1. Inscripción en el Registro de Deudores Alimentarios Morosos.
2. Embargo de sueldo y bienes.
3. Denuncia ante la Fiscalía General del Estado por el delito de Incumplimiento de las Obligaciones de Asistencia Familiar.

Apelo a su responsabilidad y conciencia para evitar estas medidas legales extremas que solo perjudican el entorno familiar.

ATENTAMENTE,
${nombre}
Heroica Puebla de Zaragoza, a ${fecha}.`;

        } else if (tipo === 'escrito_libre') {
            const ref = esVal('es_nombre') || '';
            txt = `${ref ? ref.toUpperCase() + '\n\n' : ''}Puebla, Puebla, a ${fecha}.


A QUIEN CORRESPONDA:



___________________________________________
[Firmas]`;

        } else {
            return alert('Tipo de documento no reconocido.');
        }

        // Mostrar resultado
        document.getElementById('escritoPreviewText').innerText = txt;
        document.getElementById('escritoPreviewContainer').style.display = 'block';
        document.getElementById('escritoPreviewTitle').textContent =
            document.getElementById('es_tipo').options[document.getElementById('es_tipo').selectedIndex].text;
        document.getElementById('escritoPreviewContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };




    window.copiarEscrito = () => {
        const text = document.getElementById('escritoPreviewText').innerText;
        navigator.clipboard.writeText(text).then(() => alert('Texto copiado al portapapeles.'));
    };

    window.descargarEscritoPDF = async () => {
        const text = document.getElementById('escritoPreviewText').innerText;
        const pdfDoc = await PDFLib.PDFDocument.create();

        const clean = (str) => {
            if (!str) return "";
            return str.toString().replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
        };

        const [width, height] = PDFLib.PageSizes.Letter;
        let page = pdfDoc.addPage([width, height]);
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRomanBold);
        const fontSize = 12;
        const margin = 50;

        // Obtener el nombre legible del tipo de documento seleccionado
        const tipoSelect = document.getElementById('es_tipo');
        const tipoLabel = tipoSelect && tipoSelect.selectedIndex >= 0
            ? tipoSelect.options[tipoSelect.selectedIndex].text.toUpperCase()
            : 'ESCRITO JURIDICO';
        const docTitle = tipoLabel || 'ESCRITO JURIDICO';

        await drawPDFBranding(pdfDoc, page, docTitle);
        let y = height - 145;  // Below 120px header + 25px margin

        const lines = text.split('\n');

        for (const line of lines) {
            const words = line.split(' ');
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine + word + ' ';
                const widthOfLine = font.widthOfTextAtSize(clean(testLine), fontSize);

                if (widthOfLine > (width - 2 * margin)) {
                    if (y < 65) {
                        page = pdfDoc.addPage([width, height]);
                        await drawPDFBranding(pdfDoc, page, docTitle, false);
                        y = height - 58;
                    }
                    page.drawText(clean(currentLine), { x: margin, y: y, size: fontSize, font: font });
                    y -= 16;
                    currentLine = word + ' ';
                } else {
                    currentLine = testLine;
                }
            }
            if (y < 65) {
                page = pdfDoc.addPage([width, height]);
                await drawPDFBranding(pdfDoc, page, docTitle, false);
                y = height - 58;
            }
            page.drawText(clean(currentLine), { x: margin, y: y, size: fontSize, font: font });
            y -= 16;
        }

        const pdfBytes = await pdfDoc.save();
        // Blob download (showSaveFilePicker fails on file:// protocol)
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Escrito_SupraLegis.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    };


    /* --- MODULE: DASHBOARD --- */
    function loadDashboard() {
        // Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('es-MX', options);

        // Stats
        const clients = getStorage('sl_generales').length;
        const expedientes = getStorage('sl_fichas').length;

        // Count future terms
        const agenda = getStorage('sl_agenda');
        const today = new Date().toISOString().split('T')[0];
        const terms = agenda.filter(e => e.tipo === 'termino' && e.fecha >= today).length;

        document.getElementById('stat_clients').textContent = clients;
        document.getElementById('stat_expedientes').textContent = expedientes;
        document.getElementById('stat_terminos').textContent = terms;
    }

    /* --- MODULE: AGENDA JUDICIAL --- */
    let currentDate = new Date();

    window.changeMonth = (delta) => {
        currentDate.setMonth(currentDate.getMonth() + delta);
        renderCalendar();
    };

    function renderCalendar() {
        const grid = document.getElementById('calendarBody');
        grid.innerHTML = '';

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        document.getElementById('calendarTitle').textContent = `${monthNames[month]} ${year} `;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            cell.style.background = '#f9f9f9';
            grid.appendChild(cell);
        }

        const events = getStorage('sl_agenda');

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const cell = document.createElement('div');
            cell.className = 'calendar-day';

            const todayStr = new Date().toISOString().split('T')[0];
            if (dateStr === todayStr) cell.classList.add('today');

            const num = document.createElement('span');
            num.className = 'calendar-day-num';
            num.textContent = day;
            cell.appendChild(num);

            const dayEvents = events.filter(e => e.fecha === dateStr).sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
            dayEvents.forEach(evt => {
                const dot = document.createElement('span');
                dot.className = `event-dot ${evt.tipo}`;
                dot.dataset.evtid = String(evt.id);

                let linkHtml = "";
                if (evt.fichaId) {
                    linkHtml = `<span class="material-icons-round" style="font-size:10px; color:var(--accent); margin-left:4px;" title="Vinculado a Expediente">link</span>`;
                }

                const timeStr = evt.hora ? `<span style="font-family:monospace; margin-right:4px;">${evt.hora}</span>` : '';
                dot.innerHTML = `${timeStr}${evt.desc}${linkHtml}`;
                dot.title = `${evt.hora || ''} - ${evt.desc}`;

                // Event click menu
                dot.onclick = (e) => {
                    e.stopPropagation();
                    showEventMenu(evt, e);
                };

                cell.appendChild(dot);
            });

            cell.onclick = (e) => {
                document.getElementById('ag_fecha').value = dateStr;
                addEventModal();
            };

            grid.appendChild(cell);
        }
    }

    window.showEventMenu = (evt, e) => {
        const menu = document.createElement('div');
        menu.className = 'event-context-menu';
        menu.style.top = `${e.pageY}px`;
        menu.style.left = `${e.pageX}px`;

        let linkBtn = "";
        if (evt.fichaId) {
            linkBtn = `<button onclick="goToFichaFromAgenda(${evt.fichaId})"><span class="material-icons-round">gavel</span> Ver Estrategia</button>`;
        }

        menu.innerHTML = `
            ${linkBtn}
            <button onclick="deleteEventById(${evt.id}); this.parentElement.remove();" style="color:#f44336"><span class="material-icons-round">delete</span> Eliminar</button>
            <button onclick="this.parentElement.remove()"><span class="material-icons-round">close</span> Cerrar</button>
        `;
        document.body.appendChild(menu);

        // Remove menu on clock outside
        setTimeout(() => {
            window.onclick = () => {
                menu.remove();
                window.onclick = null;
            };
        }, 100);
    };

    window.goToFichaFromAgenda = (fichaId) => {
        switchModule('fichas');
        setTimeout(() => {
            const card = document.querySelector(`.ficha-card[data-id="${fichaId}"]`);
            if (card) {
                card.classList.add('highlight-card');
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => card.classList.remove('highlight-card'), 3000);
                editFicha(fichaId);
            } else {
                alert("El expediente vinculado ya no existe.");
            }
        }, 300);
    };

    window.addEventModal = () => {
        document.getElementById('formAgenda').reset();
        if (!document.getElementById('ag_fecha').value) {
            document.getElementById('ag_fecha').valueAsDate = new Date();
        }

        // Populate Ficha Select
        const select = document.getElementById('ag_ficha_link');
        const fichas = getStorage('sl_fichas');
        select.innerHTML = '<option value="">-- No vincular --</option>';
        fichas.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = `${f.expediente} - ${f.actor && f.actor.slice(0, 15)}...`;
            select.appendChild(opt);
        });

        openModal('modalAgenda');
    };

    document.getElementById('formAgenda').addEventListener('submit', (e) => {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            tipo: document.getElementById('ag_tipo').value,
            desc: document.getElementById('ag_desc').value,
            fecha: document.getElementById('ag_fecha').value,
            hora: document.getElementById('ag_hora').value,
            fichaId: document.getElementById('ag_ficha_link').value ? Number(document.getElementById('ag_ficha_link').value) : null
        };
        const list = getStorage('sl_agenda');
        list.push(newItem);
        setStorage('sl_agenda', list);
        closeModal('modalAgenda');
        renderCalendar();
        loadDashboard();
    });

    function deleteEvent(date, text) {
        let list = getStorage('sl_agenda');
        list = list.filter(e => !(e.fecha === date && e.desc === text));
        setStorage('sl_agenda', list);
        renderCalendar();
        loadDashboard();
    }

    function deleteEventById(id) {
        let list = getStorage('sl_agenda');
        list = list.filter(e => e.id !== id);
        setStorage('sl_agenda', list);
        renderCalendar();
        loadDashboard();
    }


    /* ================================================================
       CARPETA DE ESCRITOS GUARDADOS
       ================================================================ */

    /** Guarda el escrito actualmente en preview */
    window.guardarEscritoEnCarpeta = () => {
        const txt = document.getElementById('escritoPreviewText').innerText.trim();
        const sel = document.getElementById('es_tipo');
        const titulo = sel && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex].text : 'Escrito';
        if (!txt) return alert('Primero genera una vista previa para poder guardar.');
        const carpeta = getStorage('sl_escritos_carpeta');
        carpeta.push({
            id: Date.now(),
            titulo: titulo,
            tipo: sel ? sel.value : '',
            texto: txt,
            fecha: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
            fechaISO: new Date().toISOString().split('T')[0]
        });
        setStorage('sl_escritos_carpeta', carpeta);
        renderEscritosCarpeta();
        document.getElementById('escritosCarpetaSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Toast
        let t = document.getElementById('_toastE');
        if (!t) {
            t = document.createElement('div'); t.id = '_toastE';
            t.style.cssText = 'position:fixed;bottom:28px;right:28px;background:#27ae60;color:#fff;padding:12px 22px;border-radius:10px;font-weight:700;z-index:9999;box-shadow:0 4px 15px rgba(0,0,0,.3);transition:opacity .4s;pointer-events:none;';
            document.body.appendChild(t);
        }
        t.textContent = '\u2713 Guardado en tu Carpeta';
        t.style.opacity = '1';
        clearTimeout(t._to);
        t._to = setTimeout(() => { t.style.opacity = '0'; }, 2500);
    };

    /** Renderiza la lista de escritos guardados */
    window.renderEscritosCarpeta = (filtro) => {
        const container = document.getElementById('carpetaEscritos');
        if (!container) return;
        const q = (filtro !== undefined) ? filtro
            : (_normStr ? _normStr(document.getElementById('carpetaBusqueda')?.value || '') : (document.getElementById('carpetaBusqueda')?.value || '').toLowerCase().trim());
        const normQ = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let lista = getStorage('sl_escritos_carpeta');
        if (normQ) {
            lista = lista.filter(e =>
                e.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normQ) ||
                e.texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normQ) ||
                (e.fechaISO || '').includes(normQ)
            );
        }
        lista.sort((a, b) => b.id - a.id);

        if (lista.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:32px 0;color:#aaa;">
                    <span class="material-icons-round" style="font-size:3rem;display:block;margin-bottom:8px;">folder_open</span>
                    ${normQ ? '<p>No se encontraron escritos con esa búsqueda.</p>' : '<p>Tu carpeta está vacía.<br><small>Genera un escrito y presiona <strong>\u2713 Guardar en Carpeta</strong>.</small></p>'}
                </div>`;
            return;
        }
        const hl = (txt) => {
            if (!normQ) return txt;
            return txt.replace(new RegExp(normQ, 'gi'), m => `<mark style="background:#fff3cd;border-radius:2px">${m}</mark>`);
        };
        container.innerHTML = lista.map(e => `
            <div style="background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:14px 18px;
                margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:12px;
                box-shadow:0 1px 4px rgba(0,0,0,.06);transition:box-shadow .2s;"
                onmouseenter="this.style.boxShadow='0 3px 12px rgba(0,0,0,.13)'"
                onmouseleave="this.style.boxShadow='0 1px 4px rgba(0,0,0,.06)'">
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:1rem;color:#1a1a2e;">${hl(e.titulo)}</div>
                    <div style="font-size:0.8rem;color:#888;margin-top:3px;">${e.fecha}</div>
                </div>
                <div style="display:flex;gap:8px;flex-shrink:0;">
                    <button class="btn btn-outline btn-small" onclick="verEscritoGuardado(${e.id})" title="Ver contenido">
                        <span class="material-icons-round" style="font-size:1.1rem;">visibility</span>
                    </button>
                    <button class="btn btn-accent btn-small" onclick="reusarEscritoGuardado(${e.id})" title="Usar como base">
                        <span class="material-icons-round" style="font-size:1.1rem;">edit_document</span>
                    </button>
                    <button class="btn btn-small" onclick="eliminarEscritoGuardado(${e.id})" title="Eliminar"
                        style="background:#e74c3c;color:#fff;border:none;">
                        <span class="material-icons-round" style="font-size:1.1rem;">delete</span>
                    </button>
                </div>
            </div>`).join('');
    };

    window.verEscritoGuardado = (id) => {
        const e = getStorage('sl_escritos_carpeta').find(x => x.id === id);
        if (!e) return;
        document.getElementById('escritoPreviewText').innerText = e.texto;
        document.getElementById('escritoPreviewTitle').textContent = e.titulo;
        document.getElementById('escritoPreviewContainer').style.display = 'block';
        document.getElementById('escritoPreviewContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.reusarEscritoGuardado = (id) => {
        const e = getStorage('sl_escritos_carpeta').find(x => x.id === id);
        if (!e) return;
        const sel = document.getElementById('es_tipo');
        if (sel && e.tipo) { sel.value = e.tipo; actualizarCamposEscrito(); }
        document.getElementById('escritoPreviewText').innerText = e.texto;
        document.getElementById('escritoPreviewTitle').textContent = e.titulo;
        document.getElementById('escritoPreviewContainer').style.display = 'block';
        document.getElementById('escritoPreviewContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.eliminarEscritoGuardado = (id) => {
        if (!confirm('¿Eliminar este escrito de tu carpeta?')) return;
        setStorage('sl_escritos_carpeta', getStorage('sl_escritos_carpeta').filter(x => x.id !== id));
        renderEscritosCarpeta();
    };


    /* --- MODULE: RECIBOS --- */
    function renderRecibos() {
        const tbody = document.getElementById('recibosList');
        tbody.innerHTML = '';
        const list = getStorage('sl_recibos');

        list.forEach(r => {
            const row = tbody.insertRow();
            row.innerHTML = `
    < td > #${r.id.toString().slice(-4)}</td >
                <td>${r.fecha}</td>
                <td>${r.cliente}</td>
                <td>${r.concepto}</td>
                <td>$${parseFloat(r.monto).toFixed(2)}</td>
                <td><button class="btn btn-outline btn-small" onclick="generarPDFRecibo(${r.id})">PDF</button></td>
`;
        });
    }

    document.getElementById('formRecibo').addEventListener('submit', (e) => {
        e.preventDefault();
        const nuevo = {
            id: Date.now(),
            cliente: document.getElementById('re_cliente').value,
            fecha: document.getElementById('re_fecha').value,
            concepto: document.getElementById('re_concepto').value,
            monto: document.getElementById('re_monto').value
        };
        const list = getStorage('sl_recibos');
        list.push(nuevo);
        setStorage('sl_recibos', list);
        closeModal('modalRecibo');
        renderRecibos();
        generarPDFRecibo(nuevo.id); // Auto generate
    });

    window.generarPDFRecibo = async (id) => {
        const r = getStorage('sl_recibos').find(x => x.id === id);
        if (!r) return;

        const pdfDoc = await PDFLib.PDFDocument.create();
        const page = pdfDoc.addPage([600, 350]); // Half letter approx
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

        page.drawText('RECIBO DE HONORARIOS / GASTOS', { x: 20, y: height - 40, size: 16, font: fontBold });
        page.drawText(`FOLIO: ${r.id.toString().slice(-6)} `, { x: 450, y: height - 40, size: 10, font: font });

        page.drawText(`BUENO POR: $${parseFloat(r.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })} `, { x: 400, y: height - 70, size: 14, font: fontBold });

        // Content
        let y = height - 100;
        const lh = 20;

        page.drawText(`FECHA: ${r.fecha} `, { x: 20, y: y, size: 12, font: font }); y -= lh;
        page.drawText(`RECIBÃ DE: ${r.cliente.toUpperCase()} `, { x: 20, y: y, size: 12, font: font }); y -= lh;
        page.drawText(`LA CANTIDAD DE: $${parseFloat(r.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })} `, { x: 20, y: y, size: 12, font: font }); y -= lh;
        y -= 10;
        page.drawText(`POR CONCEPTO DE: `, { x: 20, y: y, size: 10, font: fontBold }); y -= 15;
        page.drawText(`${r.concepto} `, { x: 20, y: y, size: 12, font: font }); y -= 40;

        page.drawText(`_____________________________`, { x: 230, y: y, size: 12, font: font }); y -= 15;
        page.drawText(`FIRMA DE CONFORMIDAD`, { x: 260, y: y, size: 10, font: font });

        // Branding
        page.drawText(`SUPRA LEGIS - SISTEMA JURÃDICO INTEGRAL`, { x: 20, y: 20, size: 8, font: font, color: PDFLib.rgb(0.5, 0.5, 0.5) });

        const pdfBytes = await pdfDoc.save();
        await savePdfToDisk(pdfBytes, `Recibo_${r.id}.pdf`);
    }

    /* --- BACKUP SYSTEM --- */
    window.backupData = () => {
        const data = {
            generales: getStorage('sl_generales'),
            fichas: getStorage('sl_fichas'),
            agenda: getStorage('sl_agenda'),
            recibos: getStorage('sl_recibos')
        };
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `SUPRA_LEGIS_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    /* --- RESTORE SYSTEM --- */
    const backupInput = document.getElementById('backupInput');
    if (backupInput) {
        backupInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            if (!confirm('ADVERTENCIA: ¿Seguro que desea RESTAURAR la base de datos?\n\nEsto borrará y reemplazará toda su información actual con la del archivo seleccionado.')) {
                this.value = ''; // Reset input
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);

                    if (data.generales) setStorage('sl_generales', data.generales);
                    if (data.fichas) setStorage('sl_fichas', data.fichas);
                    if (data.agenda) setStorage('sl_agenda', data.agenda);
                    if (data.recibos) setStorage('sl_recibos', data.recibos);

                    alert('Restauración completada. La página se recargará.');
                    window.location.reload();
                } catch (err) {
                    alert('Error al leer el archivo de respaldo: ' + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    // INIT
    // createStorage calls removed as getStorage handles default
    // Initial Load
    renderGenerales();
    renderFichas();
    updateEscritosCombo();
    // New loads
    loadDashboard();
    renderCalendar();
    renderRecibos();

    // Default switch
    // switchModule('dashboard'); // Uncomment if you want dashboard first, currently HTML sets generales active.
    // Let's force dashboard as first view for new feel
    switchModule('dashboard');

    // Search Listeners
    document.getElementById('searchGenerales').addEventListener('input', (e) => renderGenerales(e.target.value));
    document.getElementById('searchFichas').addEventListener('input', (e) => renderFichas(e.target.value));

    /* --- MODULE: DICCIONARIO Y CORRECTOR JURÍDICO --- */
    /* Diccionario movido a diccionario_tools.js */

    /* --- CONFIGURACIÓN DE MEMBRETE --- */
    const configLogoInput = document.getElementById('configLogoInput');
    const configLogoPreview = document.getElementById('configLogoPreview');
    const formConfig = document.getElementById('formConfig');

    // Load initial config
    if (formConfig) {
        document.getElementById('config_title').value = localStorage.getItem('sl_mem_title') || "JURÍDICO SUPRA LEGIS";
        const savedLogo = localStorage.getItem('sl_mem_logo');
        if (savedLogo) {
            configLogoPreview.src = savedLogo;
            const sidebarLogo = document.getElementById('sidebarLogoImg');
            if (sidebarLogo) sidebarLogo.src = savedLogo;
        }
    }

    let tempConfigLogo = localStorage.getItem('sl_mem_logo') || null;

    if (configLogoInput) {
        configLogoInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                tempConfigLogo = ev.target.result;
                configLogoPreview.src = tempConfigLogo;
            };
            reader.readAsDataURL(file);
        });
    }

    if (formConfig) {
        formConfig.addEventListener('submit', (e) => {
            e.preventDefault();
            const newTitle = document.getElementById('config_title').value;
            const newPin = document.getElementById('config_pin').value;
            const confirmPin = document.getElementById('config_pin_confirm').value;

            // Handle PIN change
            if (newPin) {
                if (newPin.length !== 4) {
                    return alert("El PIN debe ser de exactamente 4 dígitos.");
                }
                if (newPin !== confirmPin) {
                    return alert("Los PIN ingresados no coinciden.");
                }
                localStorage.setItem('sl_app_pin', newPin);
            }

            localStorage.setItem('sl_mem_title', newTitle);
            if (tempConfigLogo) {
                localStorage.setItem('sl_mem_logo', tempConfigLogo);
                const sidebarLogo = document.getElementById('sidebarLogoImg');
                if (sidebarLogo) sidebarLogo.src = tempConfigLogo;
            }
            alert("Configuración guardada exitosamente.");
            closeModal('modalConfig');
            if (newPin) location.reload(); // Reload to activate security
        });
    }

    window.viewGenerales = (id) => {
        const r = getStorage('sl_generales').find(i => i.id === id);
        if (!r) return;

        // Front: File
        const viewArea = document.querySelector('#modalViewDocument .card-body');
        if (r.file) {
            if (r.file.type === 'application/pdf') {
                viewArea.innerHTML = `<embed src="${r.file.data}" type="application/pdf" width="100%" height="600px">`;
            } else if (r.file.type.startsWith('image/')) {
                viewArea.innerHTML = `<img src="${r.file.data}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
            } else {
                viewArea.innerHTML = `<p>Archivo: ${r.file.name} (No previsualizable)</p>`;
            }
        } else {
            viewArea.innerHTML = `<div style="padding:40px; text-align:center; color:#999;">
                <span class="material-icons-round" style="font-size:3rem;">info</span><br>No hay documento adjunto.
            </div>`;
        }

        // Back: Data
        document.getElementById('docDetNombre').innerText = r.nombre;
        document.getElementById('docDetDomicilio').innerText = r.domicilio;
        document.getElementById('docDetOriginario').innerText = r.originario;
        document.getElementById('docDetVecino').innerText = r.vecino;
        document.getElementById('docDetEdad').innerText = r.edad;
        document.getElementById('docDetCivil').innerText = r.civil;
        document.getElementById('docDetEstudios').innerText = r.estudios || '-';
        document.getElementById('docDetCelular').innerText = r.celular || '-';
        document.getElementById('docDetEmail').innerText = r.email || '-';

        openModal('modalViewDocument');
    };

});
