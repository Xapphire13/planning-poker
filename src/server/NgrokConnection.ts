import ngrok from 'ngrok';

export default class NgrokConnection {
  private _url: string | undefined;

  get url() {
    return this._url;
  }

  constructor(private port: number) {}

  public async connect() {
    if (this._url) {
      return;
    }

    try {
      const url = await ngrok.connect(this.port);

      this._url = url.replace('https://', 'http://');
    } catch (err) {
      console.error("Couldn't connect to ngrok", err);

      throw err;
    }

    console.log(`Remote URL: ${this.url}`);
  }

  public async disconnect() {
    await ngrok.disconnect();
    this._url = undefined;
  }
}