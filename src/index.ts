const SIZE = 512;

interface LogoOptions {
  text: string;
  bgColor: string;
  textColor: string;
  fontPct: number;
}

function renderLogo(canvas: HTMLCanvasElement, { text, bgColor, textColor, fontPct }: LogoOptions): void {
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const t    = text || 'JS';
  const pad  = Math.floor(SIZE * 0.08);
  const maxW = SIZE - 2 * pad;
  let fontSize = Math.floor(SIZE * fontPct / 100 * 2 / Math.max(t.length, 2));

  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  while (ctx.measureText(t).width > maxW && fontSize > 10) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  }

  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(t, SIZE - pad, SIZE - pad);
}

function downloadLogo(canvas: HTMLCanvasElement, filename: string): void {
  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  a.click();
}

function init(): void {
  const canvas     = document.getElementById('preview') as HTMLCanvasElement;
  const textEl     = document.getElementById('text') as HTMLInputElement;
  const bgColor    = document.getElementById('bg-color') as HTMLInputElement;
  const fgColor    = document.getElementById('fg-color') as HTMLInputElement;
  const fontSizeEl = document.getElementById('font-size') as HTMLInputElement;
  const fontLabel  = document.getElementById('font-label') as HTMLSpanElement;
  const metaDim    = document.getElementById('meta-dim') as HTMLSpanElement;
  const bgSwatch   = document.getElementById('bg-swatch') as HTMLDivElement;
  const bgHex      = document.getElementById('bg-hex') as HTMLSpanElement;
  const fgSwatch   = document.getElementById('fg-swatch') as HTMLDivElement;
  const fgHex      = document.getElementById('fg-hex') as HTMLSpanElement;
  const dlBtn      = document.getElementById('download') as HTMLButtonElement;

  canvas.width  = SIZE;
  canvas.height = SIZE;
  metaDim.textContent = `${SIZE} × ${SIZE} px`;

  function update(): void {
    const opts: LogoOptions = {
      text: textEl.value || 'JS',
      bgColor: bgColor.value,
      textColor: fgColor.value,
      fontPct: parseInt(fontSizeEl.value, 10),
    };

    fontLabel.textContent = `${opts.fontPct}%`;
    bgSwatch.style.background = opts.bgColor;
    bgHex.textContent = opts.bgColor.toUpperCase();
    fgSwatch.style.background = opts.textColor;
    fgHex.textContent = opts.textColor.toUpperCase();

    renderLogo(canvas, opts);
  }

  [textEl, bgColor, fgColor, fontSizeEl].forEach(el => el.addEventListener('input', update));

  dlBtn.addEventListener('click', () => {
    const name = (textEl.value || 'js').toLowerCase().replace(/\s+/g, '-');
    downloadLogo(canvas, `${name}-logo.png`);
  });

  update();
}

document.addEventListener('DOMContentLoaded', init);
