import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import globalStyles from './global.css?inline';

const APIURL = "/api/v0";

@customElement('main-element')
export class MainElement extends LitElement {

  
  @property({ type: Object })
  userData = null;

  async logout() {
    console.log("logout...");
    return fetch(APIURL + "/logout", {
      method: 'POST',
    })
    .then(response => {
      console.log("logout response:", response);
      if (!response.ok) {
        response.json()
        .then(error => {
          throw new Error(error.message || 'logout failed');
        })
        .catch(_ => { 
          throw new Error("Logout failed: " + response.text); 
        });
      }
      this.userData = null;
    });
  }

  private _onClick(e: MouseEvent) {
    console.log("logout click");
    e.preventDefault();
    e.stopPropagation();
    this.logout();
    
    return false;
  }

  
  render() {
    return html`
      <slot></slot>
      ${this.userData ? html`

        <div class="">
          <div class="">
            <h2>Logged in as:</h2>
            <pre>${this.userData.session.user.full_name}</pre>
            <button @click=${this._onClick} part="button" class="hover:border-red-500">Logout</button>
          </div>
          <br/>
          <h2>Fetch Data:</h2>
          <data-fetcher></data-fetcher>
        </div>
      ` : 
      html`
      <login-element .reportUserState=${(data:any) => {
        console.log("reportUserState", data);
        this.userData = data}}></login-element>
        `
      }

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
    'main-element': MainElement
  }
}
