customElements.define('rtx-slider', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: block;
          content: "";
          box-sizing: border-box;
          background-color: #ddd;
          border: 1px solid #888;
          border-radius: 6px;
          height: 6px;
          width: 173px;
          margin: 10px 0;
          user-select: none;
          cursor: pointer;
        }
        #thumb {
          position: absolute;
          display: block;
          content: "";
          box-sizing: border-box;
          background-color: #fff;
          border-radius: 18px 0 0 18px;
          margin: 0;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          /*transition: width 0.15s linear;*/
        }
        #thumb::after {
          position: absolute;
          display: block;
          box-sizing: border-box;
          content: "";
          width: 20px;
          height: 20px;
          border: 1px solid #888;
          border-radius: 10px;
          top: -8px;
          right: -8px;
          background-color: #fff;
        }
        :host(:focus) #thumb::after {
          background-color: #fafaff;
        }
        #track {
          position: absolute;
          display: block;
          content: "";
          box-sizing: border-box;
          /*background-color: rgba(255,0,0,0.2);*/
          left: 8px;
          right: 8px;
          top: -8px;
          bottom: -8px;
        }
        #track-start {
          position: absolute;
          display: block;
          content: "";
          box-sizing: border-box;
          /*background-color: rgba(0,255,0,0.2);*/
          left: -1px;
          width: 9px;
          top: -8px;
          bottom: -8px;
        }
        #track-end {
          position: absolute;
          display: block;
          content: "";
          box-sizing: border-box;
          /*background-color: rgba(0,255,0,0.2);*/
          right: -1px;
          width: 9px;
          top: -8px;
          bottom: -8px;
        }
      </style>

      <div id="thumb"></div>
      <div id="track"></div>
      <div id="track-start"></div>
      <div id="track-end"></div>
    `;

    this.thumb = this.shadowRoot.querySelector('#thumb');
    this.track = this.shadowRoot.querySelector('#track');
    this.trackStart  = this.shadowRoot.querySelector('#track-start');
    this.trackEnd    = this.shadowRoot.querySelector('#track-end');
    this.lastLeftPos = -1;
    this.listeners   = new Map();
  }

  get value() { return +this.getAttribute('value') || 0; }
  set value(value) { this.setAttribute('value', +Math.min(this.max, Math.max(this.min, +value))); }

  get min() { return +this.getAttribute('min') || 0; }
  set min(value) { this.setAttribute('min', +value); }

  get max() { return +this.getAttribute('max') || 100; }
  set max(value) { this.setAttribute('max', +value); }

  get step() { return +this.getAttribute('step') || 0.01; }
  set step(value) { this.setAttribute('step', +value); }

  static get observedAttributes() {
    return ['value', 'min', 'max', 'step'];
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);
  }

  off(eventName) {
    if (this.listeners.has(eventName)) {
      this.listeners.delete(eventName);
    }
  }

  trigger(eventName, data) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach((callback) => {
        callback(data);
      });
    }
  }

  setValue(x) {
    let w = this.track.clientWidth;
    let p = x / w;
    let val = this.min + (p * (this.max - this.min));
    let decimals = this.step.toString().includes('.') ? this.step.toString().split('.')[1].length : 0;
    let final = (Math.ceil(val / this.step) * this.step).toFixed(decimals);
    if (this.value != final)
      this.value = final;
  }

  updateThumb() {
    let w = this.track.clientWidth - 2;
    let l = 11 + ((this.value - this.min) / (this.max - this.min) * w);
    this.thumb.style.width = `${l}px`;
    if (l !== this.lastLeftPos) {
      this.trigger('changed', this.value);
    }
    this.lastLeftPos = l;
  }

  connectedCallback() {
    this.tabIndex = 0; // To be focusable

    this.track.addEventListener('mousemove', (e) => {
      if (e.buttons !== 1) return;
      this.setValue(e.layerX);
    });

    this.track.addEventListener('click', (e) => {
      this.setValue(e.layerX);
    });

    this.trackStart.addEventListener('click', (e) => {
      this.value = this.min;
    });

    this.trackEnd.addEventListener('click', (e) => {
      this.value = this.max;
    });

    // This will only fire if its focused
    this.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'NumpadSubtract')
        this.value -= this.step;
      if (e.code === 'ArrowRight' || e.code === 'NumpadAdd')
        this.value += this.step;
      if (e.code === 'Home')
        this.value = this.min;
      if (e.code === 'End')
        this.value = this.max;
    });
  }

  disconnectedCallback() {
    // maybe remove listeners? dunno..
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    this.updateThumb();
  }

  adoptedCallback(oldDocument, newDocument) {
    // Nothing else to do I think...
  }
});
