import AudioPlayer from "../AudioPlayer"
import { Component } from "react"
import './index.css'
class Jukebox extends Component {

    state = {
        song: ''
    }

    chooseSong = (song) => {
        this.setState({ song: song })
    }

    render() {
        return <div className="jukebox-container">
            <h1 className="header">Jukebox 🎧</h1>
            <h3 className="sub-header">Play song! 🎶 </h3>
            <p><button className="disable-audio" onClick={() => this.chooseSong('')}>Disable Audio</button></p>
            <div className="song-container">
                <button onClick={() => this.chooseSong('/songs/fantasy-classical.mp3')}>Fantasy Classical</button>
                <button onClick={() => this.chooseSong('/songs/gates-of-heaven.mp3')}>Gates of Heaven</button>
                <button onClick={() => this.chooseSong('/songs/grand-orchestra.mp3')}>Grand Orchestra</button>
                <button onClick={() => this.chooseSong('/songs/piano-song.mp3')}>Piano Song</button>
            </div>
            {this.state.song === '' ? <p className="audio-disabled">Audio disabled</p> : <AudioPlayer audioURL={this.state.song} />}
        </div >
    }
}
export default Jukebox