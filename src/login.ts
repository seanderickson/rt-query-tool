import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import globalStyles from './global.css?inline';

const APIURL = "/api/v0";

@customElement('login-element')
export class Login extends LitElement {

  static get properties() { return {
    reportUserState: { type: Function },
  };}

  reportUserState: Function;

  @property({ type: String })
  username = ''

  @property({ type: String })
  password = ''

  @property({ type: String })
  loginResult = "";

  @property({ type: Object })
  userData = {};


  async login(username: string, password: string) {
    console.log("login...");
    return fetch(APIURL + "/login", {
      method: 'POST',
      mode: 'cors',
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => {
        console.log("login response:", response);
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(error.message || 'Login failed');
          }).catch(_ => { throw new Error("Login failed: " + response.text); });
        }
        return response.json();
      })
  }


  private _doLogin(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    console.log("doLogin...", this.username);
    this.login(this.username, this.password)
      .then(data => {
        console.log("Login successful:", data);
        this.loginResult = "success";
        this.userData = data;
        this.reportUserState(data);
      })
      .catch(error => {
        console.error("Login failed:", error);
        this.loginResult = "failed with: " + error;
      }
      );
      return false;

  }


  render() {
    return html`
      <slot></slot>
      <div id="loginform" class=" border rounded" >
        <input 
          type="text" id="username" name="username" placeholder="username" 
          .value=${this.username} @change=${(e: any) => this.username=e.target.value}/>
        <input type="password" id="password" name="password" placeholder="Password"
          .value=${this.password} @change=${(e: any) => this.password = e.target.value }/>
        <button @click=${this._doLogin} part="button" class="hover:border-red-500">
          submit
        </button>
      </div>
      <div class="text-green-500">${this.loginResult}</div>
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
    'login-element': Login
  }
}
