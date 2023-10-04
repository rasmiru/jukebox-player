import { Component } from "react";
import './index.css';

class AudioPlayer extends Component {
    state = {
        status: "playing",
        currentTime: 0,
        duration: 0,
        seekPosition: 0,
    };

    // Create an instance of the Audio object
    audioElement = new Audio();

    handleSeek = (event) => {
        // Update the seek position in the component state
        const seekPosition = parseInt(event.target.value);
        this.setState({ seekPosition });

        // Update the seek position of the audio element
        this.audioElement.currentTime = seekPosition;
    };

    onClickHandler = () => {
        if (this.state.status === "paused") {
            // Resume playing the audio
            this.setState({ status: "playing" });
            this.audioElement.play();
        } else if (this.state.status === "playing") {
            // Pause the audio
            this.setState({ status: "paused" });
            this.audioElement.pause();
        } else if (this.state.status === "finished") {
            // Restart the audio
            this.setState({ status: "playing", seekPosition: 0 });
            this.audioElement.play();
        }
    };

    loadAudio = (audioURL) => {
        this.audioElement.src = audioURL; // Set the source of the audio element
        this.audioElement.autoplay = true; // Autoplay the audio

        // Add event listeners for audio events
        this.audioElement.addEventListener("ended", this.handleAudioEnd);
        this.audioElement.addEventListener("loadedmetadata", () => {
            this.setState({ duration: this.audioElement.duration });

            // Add the "timeupdate" event listener here
            this.audioElement.addEventListener("timeupdate", this.handleTimeUpdate);
        });

        this.setState({ status: "playing", seekPosition: 0 });
    };



    handleAudioEnd = () => {
        // Set the status to "finished" when audio ends
        this.setState({ status: "finished" });
    };

    handleTimeUpdate = () => {
        const { seekPosition } = this.state;
        const currentTime = Math.floor(this.audioElement.currentTime);

        if (currentTime !== seekPosition) {
            this.setState({ currentTime, seekPosition: currentTime });
        } else {
            this.setState({ currentTime });
        }
    };



    handleLoadedMetadata = () => {
        // Set the duration in the component state when metadata is loaded
        this.setState({ duration: this.audioElement.duration });
    };

    componentDidMount() {
        const { audioURL } = this.props;
        // Load the audio when the component mounts
        this.loadAudio(audioURL);
    }

    // Handle song change while playing
    componentDidUpdate(prevProps) {
        const { audioURL } = this.props;
        if (audioURL !== prevProps.audioURL) {
            // Pause the previous audio and remove event listeners
            this.audioElement.pause();
            this.audioElement.removeEventListener("ended", this.handleAudioEnd);
            this.audioElement.removeEventListener("timeupdate", this.handleTimeUpdate);
            this.audioElement.removeEventListener("loadedmetadata", this.handleLoadedMetadata);

            // Load and play the new audio
            this.loadAudio(audioURL);
        }
    }

    // Stop song once component unmounts
    componentWillUnmount() {
        // Pause the audio and clean up event listeners when the component unmounts
        this.audioElement.pause();
        this.audioElement.src = "";
        this.audioElement.load();
        this.audioElement.removeEventListener("ended", this.handleAudioEnd);
        this.audioElement.removeEventListener("timeupdate", this.handleTimeUpdate);
        this.audioElement.removeEventListener("loadedmetadata", this.handleLoadedMetadata);
    }

    capitaliseFirstLetter = (string) => {
        // Capitalize the first letter of a string
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    render() {
        const { status, currentTime, duration, seekPosition } = this.state;
        const songName = this.props.audioURL.split("/").pop();

        const formatTime = (time) => {
            // Convert time in seconds to MM:SS format
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
        };

        return (
            <div className="audio-player-container">
                <p className="status">
                    {this.capitaliseFirstLetter(status)}
                    {status === "playing" && ": " + songName}
                </p>
                <p className="current-time">Current Time: {formatTime(currentTime)}</p>
                <p className="duration">Duration: {formatTime(duration)}</p>
                {duration > 0 && ( // Render the input element only when duration is available
                    <input
                        type="range"
                        min={0}
                        max={Math.floor(duration)}
                        value={Math.floor(seekPosition)}
                        onChange={this.handleSeek}
                    />

                )}
                <button className="play-pause-button" onClick={this.onClickHandler}>
                    {status === "playing" ? "⏸" : "▶️"}
                </button>
            </div>
        );
    }
}

export default AudioPlayer;
