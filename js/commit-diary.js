// ==================== COMMIT DIARY MODULE ====================

(function() {
  'use strict';

  class CommitDiary {
    constructor() {
      this.diaryData = [];
      this.isOpen = false;
      this.panel = null;
      this.icon = null;
      this.closeBtn = null;
      this.entriesContainer = null;
      this.overlay = null;
    }

    async init() {
      // Get DOM elements
      this.panel = document.getElementById('diary-panel');
      this.icon = document.querySelector('.vertical-sidebar-text'); // Use existing vertical text
      this.closeBtn = document.getElementById('diary-close');
      this.entriesContainer = document.getElementById('diary-entries');
      this.overlay = document.getElementById('diary-overlay');

      if (!this.panel || !this.icon || !this.closeBtn || !this.entriesContainer) {
        console.error('Commit diary: Required DOM elements not found');
        return;
      }

      // Make the vertical text clickable
      this.icon.classList.add('diary-trigger');

      // Fetch diary data
      await this.loadData();

      // Set up event listeners
      this.icon.addEventListener('click', () => this.toggle());
      this.closeBtn.addEventListener('click', () => this.close());

      // Close on overlay click (mobile)
      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      console.log('Commit diary initialized with', this.diaryData.length, 'entries');
    }

    async loadData() {
      try {
        // Try loading the test file first, then fall back to regular file
        let response = await fetch('/commit-diary-test.json');
        if (!response.ok) {
          response = await fetch('/commit-diary.json');
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.diaryData = await response.json();
      } catch (error) {
        console.error('Failed to load commit diary:', error);
        this.diaryData = [];
      }
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.render();
      this.panel.classList.add('open');
      this.isOpen = true;

      // Show overlay on mobile
      if (this.overlay) {
        this.overlay.classList.add('visible');
      }

      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.panel.classList.remove('open');
      this.isOpen = false;

      // Hide overlay
      if (this.overlay) {
        this.overlay.classList.remove('visible');
      }

      // Restore body scroll
      document.body.style.overflow = '';
    }

    render() {
      if (this.diaryData.length === 0) {
        this.entriesContainer.innerHTML = '<p class="diary-empty">No diary entries yet. Check back soon!</p>';
        return;
      }

      const entriesHTML = this.diaryData.map(entry => `
        <div class="diary-entry">
          <div class="diary-date">${this.formatDate(entry.date)}</div>
          <div class="diary-summary">${this.escapeHtml(entry.summary)}</div>
          <div class="diary-meta">${entry.commitCount} commit${entry.commitCount !== 1 ? 's' : ''}</div>
        </div>
      `).join('');

      this.entriesContainer.innerHTML = entriesHTML;
    }

    formatDate(dateString) {
      const date = new Date(dateString);
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Initialize when DOM is ready
  // DISABLED: Uncomment to re-enable diary functionality
  // if (document.readyState === 'loading') {
  //   document.addEventListener('DOMContentLoaded', () => {
  //     const diary = new CommitDiary();
  //     diary.init();
  //   });
  // } else {
  //   // DOM already loaded
  //   const diary = new CommitDiary();
  //   diary.init();
  // }

})();
