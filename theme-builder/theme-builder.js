/* ==================== THEME BUILDER DEV TOOL ==================== */
/* Lightweight theme customization panel for live editing of design tokens */

(function() {
  'use strict';

  // ==================== DEV MODE CHECK ====================
  // Only load in development environments
  const isDevMode =
    window.location.search.includes('theme=1') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    localStorage.getItem('theme-builder-enabled') === 'true';

  if (!isDevMode || window.innerWidth <= 768) {
    return; // Don't load in production or on mobile
  }

  // ==================== TOKEN DEFINITIONS ====================
  const PALETTE_TOKENS = [
    {
      name: 'palette-surface-1',
      label: 'Surface 1',
      description: 'Primary background - body, modals',
      default: '#f2f0e9',
      type: 'color',
      category: 'Surfaces'
    },
    {
      name: 'palette-surface-2',
      label: 'Surface 2',
      description: 'Elevated surfaces - footer, borders',
      default: '#e4e0d4',
      type: 'color',
      category: 'Surfaces'
    },
    {
      name: 'palette-surface-3',
      label: 'Surface 3',
      description: 'Muted elements - folder tabs',
      default: '#d9d3c7',
      type: 'color',
      category: 'Surfaces'
    },
    {
      name: 'palette-foreground-primary',
      label: 'Foreground Primary',
      description: 'Main text, strong borders',
      default: '#1b1c1d',
      type: 'color',
      category: 'Foregrounds'
    },
    {
      name: 'palette-foreground-secondary',
      label: 'Foreground Secondary',
      description: 'Secondary text',
      default: '#bab2a0',
      type: 'color',
      category: 'Foregrounds'
    },
    {
      name: 'palette-foreground-inverse',
      label: 'Foreground Inverse',
      description: 'Light text (synced with surface-1)',
      default: '#f2f0e9',
      type: 'color',
      category: 'Foregrounds',
      syncWith: 'palette-surface-1'
    },
    {
      name: 'palette-accent-1',
      label: 'Accent Color',
      description: 'Primary accent - highlights, CTAs',
      default: '#ff4551',
      type: 'color',
      category: 'Accents'
    },
    {
      name: 'palette-font-body',
      label: 'Body Font',
      description: 'Main text font family',
      default: "'NB International Pro', 'Chalet', sans-serif",
      type: 'font',
      category: 'Typography'
    },
    {
      name: 'palette-font-heading',
      label: 'Heading Font',
      description: 'Headings and titles',
      default: "'Buffon-Bold', serif",
      type: 'font',
      category: 'Typography'
    },
    {
      name: 'palette-font-mono',
      label: 'Monospace Font',
      description: 'Code and technical text',
      default: "'InputMono', 'Source Code Pro', monospace",
      type: 'font',
      category: 'Typography'
    }
  ];

  // Font options will be populated dynamically
  let FONT_OPTIONS = {
    'Current Fonts': [],
    'System Fonts': [
      { value: 'system-ui, -apple-system, sans-serif', label: 'System Default' },
      { value: 'Arial, sans-serif', label: 'Arial' },
      { value: 'Georgia, serif', label: 'Georgia' },
      { value: '"Courier New", monospace', label: 'Courier New' },
      { value: '"Times New Roman", serif', label: 'Times New Roman' }
    ],
    'Popular Google Fonts': [
      { value: "'Inter', sans-serif", label: 'Inter' },
      { value: "'Roboto', sans-serif", label: 'Roboto' },
      { value: "'Open Sans', sans-serif", label: 'Open Sans' },
      { value: "'Playfair Display', serif", label: 'Playfair Display' },
      { value: "'Fira Code', monospace", label: 'Fira Code' }
    ],
    'Custom': [
      { value: '__custom__', label: 'Enter custom font stack...' }
    ]
  };

  // ==================== AUTO-DETECT CUSTOM FONTS ====================
  async function loadCustomFonts() {
    try {
      const response = await fetch('styles.css');
      const cssText = await response.text();

      // Find all @font-face declarations and extract font-family names
      const fontFaceRegex = /@font-face\s*\{[^}]*font-family:\s*['"]([^'"]+)['"][^}]*\}/gi;
      const fonts = new Set();

      let match;
      while ((match = fontFaceRegex.exec(cssText)) !== null) {
        fonts.add(match[1]);
      }

      // Convert to font options
      const customFonts = Array.from(fonts).sort().map(font => {
        // Determine generic family based on font name
        let genericFamily = 'sans-serif';
        if (font.toLowerCase().includes('mono')) {
          genericFamily = 'monospace';
        } else if (font.toLowerCase().includes('serif') || font.toLowerCase().includes('buffon')) {
          genericFamily = 'serif';
        } else if (font.toLowerCase().includes('written') || font.toLowerCase().includes('script')) {
          genericFamily = 'cursive';
        }

        return {
          value: `'${font}', ${genericFamily}`,
          label: font
        };
      });

      FONT_OPTIONS['Current Fonts'] = customFonts;

      console.log(`🎨 Auto-detected ${customFonts.length} custom fonts from styles.css`);
      return customFonts;
    } catch (err) {
      console.error('Failed to load custom fonts:', err);
      // Fallback to manual list
      FONT_OPTIONS['Current Fonts'] = [
        { value: "'NB International Pro', sans-serif", label: 'NB International Pro' },
        { value: "'Chalet', sans-serif", label: 'Chalet' },
        { value: "'Buffon-Bold', serif", label: 'Buffon-Bold' },
        { value: "'InputMono', monospace", label: 'InputMono' },
        { value: "'ProtoMono', monospace", label: 'ProtoMono' },
        { value: "'Written', cursive", label: 'Written' },
        { value: "'Source Code Pro', monospace", label: 'Source Code Pro' }
      ];
      return FONT_OPTIONS['Current Fonts'];
    }
  }

  const STORAGE_KEY = 'portfolio-theme-builder';

  // ==================== STATE ====================
  let isPanelOpen = false;
  let panelElement = null;
  let buttonElement = null;

  // ==================== CORE FUNCTIONS ====================

  function getTokenValue(tokenName) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${tokenName}`)
      .trim();
  }

  function updateToken(tokenName, value) {
    // Update CSS variable immediately
    document.documentElement.style.setProperty(`--${tokenName}`, value);

    // Special handling: Auto-sync foreground-inverse with surface-1
    if (tokenName === 'palette-surface-1') {
      document.documentElement.style.setProperty('--palette-foreground-inverse', value);

      // Update the foreground-inverse UI if it exists
      const inverseColorPicker = document.querySelector('[data-token="palette-foreground-inverse"]');
      const inverseHexInput = document.querySelector('[data-token-hex="palette-foreground-inverse"]');
      if (inverseColorPicker) {
        inverseColorPicker.value = value;
      }
      if (inverseHexInput) {
        inverseHexInput.value = value;
      }
    }

    // Special handling: Update banner colors when accent changes
    if (tokenName === 'palette-accent-1' && typeof window.updateBannerColors === 'function') {
      window.updateBannerColors();
    }

    // Auto-save to localStorage
    saveToLocalStorage();
  }

  function saveToLocalStorage() {
    const theme = {};
    PALETTE_TOKENS.forEach(token => {
      const value = getTokenValue(token.name);
      if (value) {
        theme[token.name] = value;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const theme = JSON.parse(saved);
        Object.entries(theme).forEach(([name, value]) => {
          if (value) {
            document.documentElement.style.setProperty(`--${name}`, value);
          }
        });
        return true;
      } catch (e) {
        console.error('Failed to load theme from localStorage:', e);
        return false;
      }
    }
    return false;
  }

  function exportTheme() {
    const theme = {
      metadata: {
        name: 'Custom Portfolio Theme',
        version: '1.0',
        exported: new Date().toISOString()
      },
      tokens: {}
    };

    PALETTE_TOKENS.forEach(token => {
      const value = getTokenValue(token.name);
      if (value) {
        theme.tokens[token.name] = value;
      }
    });

    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyCSS() {
    // Generate CSS code for :root variables
    let css = '/* ==================== THEME PALETTE (Layer 1) ==================== */\n';
    css += '/* Raw color values - THESE CHANGE WHEN THEME CHANGES */\n\n';

    // Group by category
    const categories = {
      'Surfaces': [],
      'Foregrounds': [],
      'Accents': [],
      'Typography': []
    };

    PALETTE_TOKENS.forEach(token => {
      categories[token.category].push(token);
    });

    // Generate CSS for each category
    Object.entries(categories).forEach(([category, tokens]) => {
      if (category === 'Surfaces') {
        css += '/* Surfaces (backgrounds) */\n';
      } else if (category === 'Foregrounds') {
        css += '\n/* Foregrounds (text, borders, frames) */\n';
      } else if (category === 'Accents') {
        css += '\n/* Accents */\n';
      } else if (category === 'Typography') {
        css += '\n/* Typography families (theme-dependent) */\n';
      }

      tokens.forEach(token => {
        const value = getTokenValue(token.name);
        const comment = token.description;

        if (token.type === 'color') {
          // For foreground-inverse, use var() reference
          if (token.name === 'palette-foreground-inverse') {
            css += `--${token.name}: var(--palette-surface-1);   /* ${comment} */\n`;
          } else {
            css += `--${token.name}: ${value};      /* ${comment} */\n`;
          }
        } else if (token.type === 'font') {
          css += `--${token.name}: ${value};\n`;
        }
      });
    });

    // Copy to clipboard
    navigator.clipboard.writeText(css).then(() => {
      alert('✅ CSS copied to clipboard!\n\nPaste this into styles.css to replace the existing palette tokens (lines 234-253).');
    }).catch(err => {
      console.error('Failed to copy CSS:', err);
      // Fallback: show in a modal or textarea
      const textarea = document.createElement('textarea');
      textarea.value = css;
      textarea.style.position = 'fixed';
      textarea.style.top = '50%';
      textarea.style.left = '50%';
      textarea.style.transform = 'translate(-50%, -50%)';
      textarea.style.width = '80%';
      textarea.style.height = '400px';
      textarea.style.zIndex = '100000';
      textarea.style.padding = '20px';
      textarea.style.fontFamily = 'monospace';
      textarea.style.fontSize = '12px';
      document.body.appendChild(textarea);
      textarea.select();
      alert('Copy failed. Please manually copy the text from the textarea and press OK to close.');
      document.body.removeChild(textarea);
    });
  }

  function importTheme() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const theme = JSON.parse(event.target.result);
          if (theme.tokens) {
            Object.entries(theme.tokens).forEach(([name, value]) => {
              updateToken(name, value);
            });
            updateAllInputs();
            alert('Theme imported successfully!');
          } else {
            alert('Invalid theme file format');
          }
        } catch (err) {
          alert('Failed to import theme: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function resetToDefaults() {
    if (!confirm('Reset all tokens to default values?')) return;

    PALETTE_TOKENS.forEach(token => {
      updateToken(token.name, token.default);
    });

    updateAllInputs();
  }

  function updateAllInputs() {
    PALETTE_TOKENS.forEach(token => {
      const value = getTokenValue(token.name);

      if (token.type === 'color') {
        const colorPicker = document.querySelector(`[data-token="${token.name}"]`);
        const hexInput = document.querySelector(`[data-token-hex="${token.name}"]`);
        if (colorPicker) colorPicker.value = value;
        if (hexInput) hexInput.value = value;
      } else if (token.type === 'font') {
        const fontPicker = document.querySelector(`[data-token="${token.name}"]`);
        if (fontPicker) {
          fontPicker.value = value;
        }
      }
    });
  }

  // ==================== UI RENDERING ====================

  function renderTokenSections() {
    const categories = {};

    // Group tokens by category
    PALETTE_TOKENS.forEach(token => {
      if (!categories[token.category]) {
        categories[token.category] = [];
      }
      categories[token.category].push(token);
    });

    // Render each category
    let html = '';
    Object.entries(categories).forEach(([category, tokens]) => {
      html += `<div class="theme-section">`;
      html += `<h3>${category}</h3>`;

      tokens.forEach(token => {
        if (token.type === 'color') {
          html += renderColorToken(token);
        } else if (token.type === 'font') {
          html += renderFontToken(token);
        }
      });

      html += `</div>`;
    });

    return html;
  }

  function renderColorToken(token) {
    const currentValue = getTokenValue(token.name) || token.default;

    return `
      <div class="theme-token-row">
        <label>
          <span class="token-label">${token.label}</span>
          <span class="token-description">${token.description}${token.syncWith ? ' (auto-syncs)' : ''}</span>
        </label>
        <div class="token-input-group">
          <input type="color"
                 value="${currentValue}"
                 data-token="${token.name}">
          <input type="text"
                 class="hex-input"
                 value="${currentValue}"
                 data-token-hex="${token.name}"
                 pattern="^#[0-9A-Fa-f]{6}$"
                 maxlength="7">
        </div>
      </div>
    `;
  }

  function renderFontToken(token) {
    const currentValue = getTokenValue(token.name) || token.default;

    let optionsHtml = '';
    Object.entries(FONT_OPTIONS).forEach(([group, options]) => {
      optionsHtml += `<optgroup label="${group}">`;
      options.forEach(option => {
        const selected = currentValue === option.value ? 'selected' : '';
        optionsHtml += `<option value="${option.value}" ${selected}>${option.label}</option>`;
      });
      optionsHtml += `</optgroup>`;
    });

    return `
      <div class="theme-token-row">
        <label>
          <span class="token-label">${token.label}</span>
          <span class="token-description">${token.description}</span>
        </label>
        <select class="font-picker" data-token="${token.name}">
          ${optionsHtml}
        </select>
        <input type="text"
               class="custom-font-input"
               data-token-custom="${token.name}"
               placeholder="e.g., 'MyFont', sans-serif">
      </div>
    `;
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'theme-builder-panel';
    panel.innerHTML = `
      <div class="theme-builder-header">
        <span>🎨 Theme Builder</span>
        <button class="theme-close-btn" aria-label="Close theme builder">×</button>
      </div>
      <div class="theme-builder-content">
        ${renderTokenSections()}
      </div>
      <div class="theme-builder-actions">
        <button class="theme-btn-reset">Reset</button>
        <button class="theme-btn-copy-css">Copy CSS</button>
        <button class="theme-btn-export">Export</button>
        <button class="theme-btn-import">Import</button>
      </div>
    `;

    document.body.appendChild(panel);
    panelElement = panel;

    // Attach event listeners
    attachPanelListeners();
    makeDraggable(panel);

    return panel;
  }

  function createFloatingButton() {
    const button = document.createElement('button');
    button.className = 'theme-builder-button';
    button.innerHTML = '🎨';
    button.setAttribute('aria-label', 'Open theme builder');
    button.onclick = togglePanel;

    document.body.appendChild(button);
    buttonElement = button;

    return button;
  }

  function togglePanel() {
    isPanelOpen = !isPanelOpen;
    if (panelElement) {
      if (isPanelOpen) {
        panelElement.classList.add('open');
        updateAllInputs(); // Refresh values when opening
      } else {
        panelElement.classList.remove('open');
      }
    }
  }

  // ==================== EVENT LISTENERS ====================

  function attachPanelListeners() {
    if (!panelElement) return;

    // Close button
    const closeBtn = panelElement.querySelector('.theme-close-btn');
    if (closeBtn) {
      closeBtn.onclick = togglePanel;
    }

    // Action buttons
    const resetBtn = panelElement.querySelector('.theme-btn-reset');
    const copyCssBtn = panelElement.querySelector('.theme-btn-copy-css');
    const exportBtn = panelElement.querySelector('.theme-btn-export');
    const importBtn = panelElement.querySelector('.theme-btn-import');

    if (resetBtn) resetBtn.onclick = resetToDefaults;
    if (copyCssBtn) copyCssBtn.onclick = copyCSS;
    if (exportBtn) exportBtn.onclick = exportTheme;
    if (importBtn) importBtn.onclick = importTheme;

    // Color pickers
    const colorPickers = panelElement.querySelectorAll('input[type="color"]');
    colorPickers.forEach(picker => {
      picker.addEventListener('input', (e) => {
        const tokenName = e.target.dataset.token;
        const value = e.target.value;
        updateToken(tokenName, value);

        // Sync hex input
        const hexInput = panelElement.querySelector(`[data-token-hex="${tokenName}"]`);
        if (hexInput) {
          hexInput.value = value;
        }
      });
    });

    // Hex text inputs
    const hexInputs = panelElement.querySelectorAll('.hex-input');
    hexInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const tokenName = e.target.dataset.tokenHex;
        let value = e.target.value.trim();

        // Validate hex format
        if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
          // Invalid - revert to current value
          value = getTokenValue(tokenName);
          e.target.value = value;
          return;
        }

        updateToken(tokenName, value);

        // Sync color picker
        const colorPicker = panelElement.querySelector(`[data-token="${tokenName}"]`);
        if (colorPicker) {
          colorPicker.value = value;
        }
      });
    });

    // Font pickers
    const fontPickers = panelElement.querySelectorAll('.font-picker');
    fontPickers.forEach(picker => {
      picker.addEventListener('change', (e) => {
        const tokenName = e.target.dataset.token;
        const value = e.target.value;

        if (value === '__custom__') {
          // Show custom input
          const customInput = e.target.nextElementSibling;
          if (customInput && customInput.classList.contains('custom-font-input')) {
            customInput.classList.add('show');
            customInput.focus();
          }
        } else {
          // Apply font immediately
          updateToken(tokenName, value);

          // Hide custom input if shown
          const customInput = e.target.nextElementSibling;
          if (customInput && customInput.classList.contains('custom-font-input')) {
            customInput.classList.remove('show');
          }
        }
      });
    });

    // Custom font inputs
    const customFontInputs = panelElement.querySelectorAll('.custom-font-input');
    customFontInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const tokenName = e.target.dataset.tokenCustom;
        const value = e.target.value.trim();

        if (value) {
          updateToken(tokenName, value);

          // Update select to show custom was entered
          const fontPicker = e.target.previousElementSibling;
          if (fontPicker && fontPicker.classList.contains('font-picker')) {
            // Keep custom selected but user has entered value
            fontPicker.value = '__custom__';
          }
        }
      });

      input.addEventListener('blur', (e) => {
        // Hide custom input on blur if empty
        if (!e.target.value.trim()) {
          e.target.classList.remove('show');

          // Reset select to previous value
          const tokenName = e.target.dataset.tokenCustom;
          const currentValue = getTokenValue(tokenName);
          const fontPicker = e.target.previousElementSibling;
          if (fontPicker && fontPicker.classList.contains('font-picker')) {
            fontPicker.value = currentValue;
          }
        }
      });
    });
  }

  // ==================== DRAGGABLE FUNCTIONALITY ====================

  function makeDraggable(element) {
    const header = element.querySelector('.theme-builder-header');
    if (!header) return;

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // Calculate new position
      const newTop = element.offsetTop - pos2;
      const newLeft = element.offsetLeft - pos1;

      // Apply new position
      element.style.top = newTop + 'px';
      element.style.left = newLeft + 'px';
      element.style.transform = 'none'; // Remove centering transform when dragging
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  // ==================== INITIALIZATION ====================

  async function init() {
    // Load custom fonts from stylesheet first
    await loadCustomFonts();

    // Load saved theme (before UI exists)
    loadFromLocalStorage();

    // Create UI
    createFloatingButton();
    createPanel();

    console.log('🎨 Theme Builder loaded (dev mode)');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
