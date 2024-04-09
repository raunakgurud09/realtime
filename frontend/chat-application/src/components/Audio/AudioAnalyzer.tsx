import { Component } from 'react';
import AudioVisualizer from './AudioVisualizer.tsx';

interface Props {
    audio: MediaStream;
}

interface State {
    audioData: Uint8Array;
}

class AudioAnalyzer extends Component<Props, State> {
    private audioContext: AudioContext;
    private analyser: AnalyserNode;
    private dataArray: Uint8Array;
    private source: MediaStreamAudioSourceNode | null;
    private rafId: number;

    constructor(props: Props) {
        super(props);
        this.state = { 
            audioData: new Uint8Array(0)
        };
        this.tick = this.tick.bind(this);
        // eslint-disable-next-line no-unsafe-optional-chaining, @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-unsafe-optional-chaining
        this.audioContext = new (window.AudioContext || window?.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.source = null;
        this.rafId = 0;
    }

    componentDidMount() {
        if (this.props.audio) {
            this.source = this.audioContext.createMediaStreamSource(this.props.audio);
            this.source.connect(this.analyser);
            this.rafId = requestAnimationFrame(this.tick);
        }
    }

    tick() {
        if (this.analyser) {
            this.analyser.getByteTimeDomainData(this.dataArray);
            this.setState({ audioData: this.dataArray });
            this.rafId = requestAnimationFrame(this.tick);
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        if (this.analyser) {
            this.analyser.disconnect();
        }
        if (this.source) {
            this.source.disconnect();
        }
    }

    render() {
        return <AudioVisualizer audioData={this.state.audioData} />;
    }
}

export default AudioAnalyzer;
