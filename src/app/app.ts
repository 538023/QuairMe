class App {
  private timeout_id:number = -1;
  private update_milliseconds:number = -1;
  private lat:number = 0;
  private lon:number = 0;
  public constructor(
    private red:HTMLElement,
    private yellow:HTMLElement,
    private green:HTMLElement,
    private time:HTMLElement,
    private place:HTMLElement
  ) {
    
  }
  async run(update_milliseconds:number, lat:number, lon:number) {
    this.hideTrafficLights();
    this.time.innerText = 'loading';
    this.place.innerText = 'loading';
    this.update_milliseconds = update_milliseconds;
    this.lat = lat;
    this.lon = lon;

    if(this.timeout_id != -1) {
      window.clearTimeout(this.timeout_id);
    }

    this.updateData();
  }
  private async updateData() {
    const data = await fetch(`/api/lat/${this.lat}/lon/${this.lon}`).then((res) => res.json());

    if(data.time) {
      this.time.innerText = new Date(
        data.time * 1000
      ).toISOString();
    } else {
      this.time.innerText = 'error';
    }

    this.place.innerText = `${this.lat}/${this.lon}`;

    this.hideTrafficLights();

    if(data.aqiState) {
      this.showTrafficLight(data.aqiState);
    }

    this.timeout_id = window.setTimeout(this.updateData, this.update_milliseconds);
  }

  hideTrafficLights() {
    this.red.style.display = 'none';
    this.yellow.style.display = 'none';
    this.green.style.display = 'none';
  }

  showTrafficLight(aqiState:string) {
    switch(aqiState.toLowerCase().trim()) {
      case 'very_low':
        this.green.style.display = 'inline';
        break;
      case 'low':
        this.green.style.display = 'inline';
        this.yellow.style.display = 'inline';
        break;
      case 'medium':
        this.yellow.style.display = 'inline';
        break;
      case 'high':
        this.yellow.style.display = 'inline';
        this.red.style.display = 'inline';
        break;
      case 'very_high':
        this.red.style.display = 'inline';
        break;
      default:
        this.hideTrafficLights();
    }
  }
}
new App(
  document.getElementById('traffic_light_red')!,
  document.getElementById('traffic_light_yellow')!,
  document.getElementById('traffic_light_green')!,
  document.getElementById('time')!,
  document.getElementById('place')!,
).run(
  // every houre
  1000 * 60 * 60,
  // Essen
  //51.455643,
  //7.011555,
  // Dajiuhu, Zhangzhou
  24.520380,
  117.670020
);