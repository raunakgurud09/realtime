import React, { Component } from 'react';

interface Props {
  audioData: Uint8Array;
}

class AudioVisualizer extends Component<Props> {
  private canvas: React.RefObject<HTMLCanvasElement>;

  constructor(props: Props) {
    super(props);
    this.canvas = React.createRef();
  }

  draw() {
    const { audioData } = this.props;
    const canvas = this.canvas.current;
    if (!canvas) return;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext('2d');
    if (!context) return;

    let x = 0;
    const sliceWidth = (width * 1.0) / audioData.length;
    context.lineWidth = 0.5;
    context.strokeStyle = '#fff';
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.moveTo(0, height / 2);
    for (const item of audioData) {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.lineTo(x, height / 2);
    context.stroke();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    return <canvas width={50} height={50} ref={this.canvas} className='bg-blue-600 rounded-full'/>;
  }
}

export default AudioVisualizer;
