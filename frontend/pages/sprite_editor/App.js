import React from "react";
import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";
import Checkbox from "../../components/Checkbox/Checkbox";
import Input from "../../components/Input/Input";
import sprite, { SpriteFromJSON } from "../../../js/utils/sprite";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      lastUpdate: Date.now(),
      crosshair: new Sprite("./img/crosshair.png", [0, 0], [16, 16], 0, [0], "vertical", false, 0, "no", 1),
      filenames: [],
      json: null,
      sprite: null,
      savedData: {
        name: "",
        url: "",
        pos: "",
        size: "",
        speed: "",
        frames: "",
        dir: "vertical",
        once: false,
        degrees: "",
        flip: "no",
        scale: "",
        shift: ""
    }
    };
  }


  fetchImageNames = async () => {
    try {
      const response = await fetch('/api/get_img_names');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      this.setState({ filenames: data });
    } catch (error) {
      console.error('Error fetching image names:', error);
    }
  };

  getElementValue = (id) => {
    let v = document.getElementById(id).value;
    return v != undefined ? v : "";
  }

  setIdVal = (id, val) => {
    document.getElementById(id).value = val;
  }

  parseJson = () => {
    let data = JSON.stringify({
      "name": this.getElementValue("name"),
      "url": "img/" + this.getElementValue("url"),
      "pos": this.getElementValue("pos").split(" ").map((val) => { return Number(val) }),
      "size": this.getElementValue("size").split(" ").map((val) => { return Number(val) }),
      "speed": Number(this.getElementValue("speed")),
      "frames": this.getElementValue("frames").split(" ").map((val) => { return Number(val) }),
      "dir": this.getElementValue("dir"),
      "once": Boolean(document.getElementById("once").checked),
      "degrees": Number(this.getElementValue("degrees")),
      "flip": this.getElementValue("flip"),
      "scale": Number(this.getElementValue("scale")),
      "shift": this.getElementValue("shift").split(" ").map((val) => { return Number(val) }),
    });
    this.setState({
      json: data,
      sprite: SpriteFromJSON(data)
    });
    console.log(this.state);
    return data;

  }

  save = () => {
    const url = '/api/add_animation';

    const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: this.parseJson()
    };

    fetch(url, options)
    .then(response => response.json())
    .then(data => {
      alert(data.message);
    })
    .catch(error => {
      alert('Error:', error);
    });

  }

  shift = () => {
    let pos = this.getElementValue("pos").split(" ").map((val) => { return Number(val) });
    let size = this.getElementValue("size").split(" ").map((val) => { return Number(val) });
    if (this.getElementValue("dir") == "vertical") {
      pos[0] += size[0];
    }
    else {
      pos[1] += size[1];
    }
    this.state.savedData.pos = pos.join(" ");
  }

  quickSave = () => {
    let data = JSON.stringify({
      "name": this.getElementValue("name"),
      "url": this.getElementValue("url"),
      "pos": this.getElementValue("pos"),
      "size": this.getElementValue("size"),
      "speed": this.getElementValue("speed"),
      "frames": this.getElementValue("frames"),
      "dir": this.getElementValue("dir"),
      "once": document.getElementById("once").checked,
      "degrees": this.getElementValue("degrees"),
      "flip": this.getElementValue("flip"),
      "scale": this.getElementValue("scale"),
      "shift": this.getElementValue("shift"),
    });
    localStorage.setItem("spriteData", data);
  }

  quickLoad = () => {
    if(!localStorage.getItem("spriteData")) {
      return;
    }
    let data = JSON.parse(localStorage.getItem("spriteData"));
    this.setState({
      savedData: data
    })

  }

  renderSprite = () => {
    let dt = Date.now() - this.state.lastUpdate;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    this.setState({
      lastUpdate: Date.now()
    });
    if (this.state.sprite) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.state.sprite.render(ctx, 1, [-canvas.width / 2, -canvas.height / 2]);
      this.state.sprite.update(dt);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.state.crosshair.render(ctx, 1, [-canvas.width / 2, -canvas.height / 2]);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.beginPath();
      ctx.lineWidth = "1";
      ctx.strokeStyle = "#400101";
      ctx.rect((canvas.width - this.state.sprite.size[0] * this.state.sprite.spriteScale) / 2 - 0.5, (canvas.height - this.state.sprite.size[1] * this.state.sprite.spriteScale) / 2 - 0.5,
               this.state.sprite.size[0] * this.state.sprite.spriteScale + 1, this.state.sprite.size[1] * this.state.sprite.spriteScale + 1);
      ctx.stroke();
    }

  }

  handleInputChange = event => {
    const { id, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    this.setState(prevState => ({
        savedData: {
            ...prevState.savedData,
            [id]: newValue
        }
    }));
};

  componentDidMount() {
    this.fetchImageNames();
    this.quickLoad();
    setInterval(this.renderSprite, 1000 / 24);
  }

  render() {
    return (
      <div className="main__wrap">
        <div className="container">
          <div className="usable-area">
            <canvas id="canvas"></canvas>

            <div className="row">
              <div className="feature-wrap">
                Filename:
                <Select id="url" value={this.state.savedData.url} onChange={this.handleInputChange}>
                  {
                    this.state.filenames.map((fn) => (
                      <option key={fn} value={fn}>{fn}</option>))
                  }
                </Select>
              </div>
              <div className="feature-wrap">
                Pos:
                <Input id="pos" s="s" value={this.state.savedData.pos} onChange={this.handleInputChange}/>
              </div>
              <div className="feature-wrap">
                Size:
                <Input id="size" s="s" value={this.state.savedData.size} onChange={this.handleInputChange}/>
              </div>
              <div className="feature-wrap">
                Speed:
                <Input id="speed" s="xs" value={this.state.savedData.speed} onChange={this.handleInputChange}/>
              </div>
            </div>

            <div className="row">
              <div className="feature-wrap">
                Frames:
                <Input id="frames" s="m" value={this.state.savedData.frames} onChange={this.handleInputChange}/>
              </div>
              <div className="feature-wrap">
                Direction:
                <Select id="dir" value={this.state.savedData.direction} onChange={this.handleInputChange}>
                  {
                    ["vertical", "horizontal"].map((fn) => (
                      <option key={fn} value={fn}>{fn}</option>))
                  }
                </Select>
              </div>
              <div className="feature-wrap">
                Once:
                <Checkbox id="once" checked={this.state.savedData.once} onChange={this.handleInputChange}/>
              </div>
            </div>

            <div className="row">
              <div className="feature-wrap">
                Angle:
                <Input id="degrees" s="xs" value={this.state.savedData.degrees} onChange={this.handleInputChange}/>
              </div>
              <div className="feature-wrap">
                Flip:
                <Select id="flip" value={this.state.savedData.flip} onChange={this.handleInputChange}>
                  {
                    ["no", "vertical", "horizontal"].map((fn) => (
                      <option key={fn} value={fn}>{fn}</option>))
                  }
                </Select>
              </div>
              <div className="feature-wrap">
                Scale:
                <Input id="scale" s="xs" value={this.state.savedData.scale} onChange={this.handleInputChange}/>
              </div>
              <div className="feature-wrap">
                Shift:
                <Input id="shift" s="xs" value={this.state.savedData.shift} onChange={this.handleInputChange}/>
              </div>
              <div className="feature-wrap">
                Name:
                <Input id="name" s="l" value={this.state.savedData.name} onChange={this.handleInputChange}/>
              </div>
            </div>

            <div className="row">
              <div className="button-wrap">
                <Button onClick={this.parseJson}>Run</Button>
              </div>
              <div className="button-wrap">
                <Button onClick={this.shift}>Shift by size</Button>
              </div>
              <div className="button-wrap">
                <Button onClick={this.quickSave}>Quick Save</Button>
              </div>
              <div className="button-wrap">
                <Button onClick={this.save}>Save</Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}