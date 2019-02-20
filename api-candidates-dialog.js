import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {NeonAnimationRunnerBehavior} from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import {PaperDialogBehavior} from '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/shadow.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
/**
 * `api-candidates-dialog`
 *
 * A dialog to select API main file from API zip package.
 *
 * API components uses this component to render a dialog
 *
 * ## Styling
 *
 * `<api-candidates-dialog>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-candidates-dialog` | Mixin applied to this elment | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @mixinBehaviors Polymer.PaperDialogBehavior
 */
class ApiCandidatesDialog extends
  mixinBehaviors([PaperDialogBehavior, NeonAnimationRunnerBehavior],
  PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      margin: 24px 40px;
      min-width: 320px;

      background: var(--paper-dialog-background-color, var(--primary-background-color));
      color: var(--paper-dialog-color, var(--primary-text-color));

      @apply --arc-font-body1;
      @apply --shadow-elevation-16dp;
      @apply --paper-dialog;
      @apply --api-candidates-dialog;
    }

    :host > * {
      margin-top: 20px;
      padding: 0 24px;
    }

    :host > h2 {
      position: relative;
      margin: 0;
      margin-top: 24px;
      margin-bottom: 24px;
      @apply --arc-font-title;
      @apply --paper-dialog-title;
      @apply --api-candidates-dialog-title;
    }

    .paper-dialog-buttons {
      position: relative;
      padding: 8px 8px 8px 24px;
      margin: 0;

      color: var(--paper-dialog-button-color, var(--primary-color));

      @apply --layout-horizontal;
      @apply --layout-end-justified;
    }

    paper-item {
      cursor: pointer;
    }
    </style>
    <h2>Select API main file</h2>
    <div>
      <paper-listbox attr-for-selected="data-file" selected="{{selected}}">
        <template is="dom-repeat" items="[[candidates]]">
          <paper-item data-file\$="[[item]]" on-dblclick="_acceptSelection">[[item]]</paper-item>
        </template>
      </paper-listbox>
    </div>
    <div class="paper-dialog-buttons">
      <paper-button dialog-dismiss="">Cancel</paper-button>
      <paper-button dialog-confirm="" disabled\$="[[!hasSelection]]">Accept</paper-button>
    </div>
`;
  }

  static get is() {
    return 'api-candidates-dialog';
  }
  static get properties() {
    return {
      candidates: Array,
      selected: {type: String, notify: true},
      hasSelection: {type: Boolean, value: false, computed: '_computeHasSelection(selected)'}
    };
  }

  constructor() {
    super();

    this._selectHandler = this._selectHandler.bind(this);
    this._closeHandler = this._closeHandler.bind(this);
    this._onNeonAnimationFinish = this._onNeonAnimationFinish.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('api-select-entrypoint', this._selectHandler);
    this.addEventListener('iron-overlay-closed', this._closeHandler);
    this.addEventListener('neon-animation-finish', this._onNeonAnimationFinish);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('api-select-entrypoint', this._selectHandler);
    this.removeEventListener('iron-overlay-closed', this._closeHandler);
    this.removeEventListener('neon-animation-finish', this._onNeonAnimationFinish);
  }

  _renderOpened() {
    this.cancelAnimation();
    this.playAnimation('entry');
  }

  _renderClosed() {
    this.cancelAnimation();
    this.playAnimation('exit');
  }

  _onNeonAnimationFinish() {
    if (this.opened) {
      this._finishRenderOpened();
    } else {
      this._finishRenderClosed();
    }
  }

  _computeHasSelection(selection) {
    return !!selection;
  }

  _selectHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    this.selected = undefined;
    this.candidates = e.detail.candidates;
    this.opened = true;
    e.preventDefault();
    e.detail.result = new Promise((resolve, reject) => {
      this._lastResolve = resolve;
      this._lastReject = reject;
    });
  }

  _clearPromises() {
    this._lastResolve = undefined;
    this._lastReject = undefined;
  }

  _acceptSelection() {
    this.close();
  }

  _closeHandler(e) {
    if (!this._lastResolve) {
      return;
    }
    if (e.detail.canceled || !this.hasSelection) {
      this._lastReject();
      this._clearPromises();
      return;
    }
    this._lastResolve(this.selected);
    this._clearPromises();
  }
}
window.customElements.define(ApiCandidatesDialog.is, ApiCandidatesDialog);
