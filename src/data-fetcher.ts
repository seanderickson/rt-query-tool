import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import globalStyles from './global.css?inline';

const APIURL = "/api/v0";

@customElement('data-fetcher')
export class DataFetcher extends LitElement {

  
  @property({ type: String })
  slideResult = "";
  doSlideRequest() {
    console.log("doSlideRequest...");
    fetch(APIURL + "/slide?q=LSP10352&show_patient_fields=true&show_surgery_fields=true", {
      method: 'GET',
      credentials: 'include',
      // mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      console.log("Slide response:", response);
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.message || 'Slide request failed');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Slide successful:", data);
      this.slideResult = data;
    })
    .catch(error => {
      console.error("Slide failed:", error);
    });
  }
  private _onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.doSlideRequest();
    return false;
  }

  render() {
    console.log("render", this.slideResult);
    return html`
      <slot></slot>
      <div id="fetch-form" class=" border rounded" >
        <button @click=${this._onClick} part="button" class="hover:border-red-500">
          submit
        </button>
      </div>
      <div class="flex">
        <div class="flex-1">
          <h2>Fetch Result:</h2>
          <pre>${JSON.stringify(this.slideResult, null, 2)}</pre>
        </div>
      </div>
    `
  }

  static styles = [
    unsafeCSS(globalStyles),
    css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'data-fetcher': DataFetcher
  }
}
