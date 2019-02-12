var app = new Vue({

	el: '#app',

	data: {
		visitors: [],
		sequence: [],
		videoList: [
			'assets/videos/Attractor.mp4',
			'assets/videos/Welcome1.mp4',
			'assets/videos/Welcome2.mp4',
			'assets/videos/Tour1.mp4',
			'assets/videos/Tour2.mp4',
			'assets/videos/Tour3.mp4',
			'assets/videos/Questions1.mp4',
			'assets/videos/Questions2.mp4',
			'assets/videos/Questions3.mp4',
			'assets/videos/Questions4.mp4',
			'assets/videos/Meeting1.mp4',
			'assets/videos/Reflection1.mp4',
			'assets/videos/Reflection2.mp4',
			'assets/videos/End.mp4',
			'assets/videos/Detected.mp4',
			'assets/videos/Attractor_1.mp4'
		],
		isSequencePlaying: false,
		isSequenceAuto: false,
		sequenceIndex: 0,
		ding: null,
		video: null
	},

	computed: {},

	methods: {
		playVideo: function (src) {
			console.log('playVideo');

			// start playing the video
			this.video.src = src;
			var playPromise = this.video.play();
			var $video = this.playVideo;

			if (playPromise !== undefined) {
				playPromise.then(function () {
					// Automatic playback started!
					console.log('Playback started');
				}).catch(function (error) {
					console.error(error);
					
					// try again
					console.log('error: reloading...');
					setTimeout(() => { location.reload(); }, 2000);
				});
			}
		},

		stopAttractor: function () {
			this.video.pause();
		},

		startRandomSequence: function () {

			// empty the array
			this.sequence = [];

			// create a new sequence randomly
			this.sequence[0] = this.videoList[14]; // detected
			this.sequence[1] = this.videoList[this.getRandomInt(1, 2)]; // welcome
			this.sequence[2] = this.videoList[this.getRandomInt(3, 5)]; // tour
			this.sequence[3] = this.videoList[this.getRandomInt(6, 9)]; // question
			this.sequence[4] = this.videoList[10]; // meeting
			this.sequence[5] = this.videoList[this.getRandomInt(11, 12)]; // reflection
			this.sequence[6] = this.videoList[13]; // end

			// reset the index so the next video will be the first in the sequence
			this.sequenceIndex = 0;

			// set flag to true so we don't repeat this with every new visitor
			this.isSequencePlaying = true;

			// play the first video in the sequence
			this.playVideo(this.sequence[this.sequenceIndex]);

		},

		addVisitor: function () {
			// generate a random id
			var id = Math.random().toString(36).substr(2, 7).toUpperCase();
			this.visitors.push(id);

			// play the sound
			this.ding.play();

			// set isSequenceAuto flag to false
			// it could be true if the attractor finished and we play
			// automatically, but now we want to show people
			this.isSequenceAuto = false;

			if (!this.isSequencePlaying) {
				this.stopAttractor();
				this.startRandomSequence();
			}
		},

		removeVisitor: function () {},

		onVideoEnded: function () {
			if (this.isSequencePlaying) {
				// a video in the sequence has ended
				// are there any more videos to play?
				if (this.sequenceIndex == this.sequence.length - 1) {
					console.log('no more videos, play attractor');
					this.isSequencePlaying = false;
					this.playVideo(this.videoList[15]);
				} else {
					// play the next video
					this.sequenceIndex++;
					this.playVideo(this.sequence[this.sequenceIndex]);
				}
			} else {
				// the attractor video has ended
				console.log('attractor has finished, play a random sequence');
				this.isSequenceAuto = true;
				this.startRandomSequence();
			}
		},

		getRandomInt: function (min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
	},

	mounted() {
		window.addEventListener('load', () => {
			this.ding = new Audio('../assets/audio/91926__corsica-s__ding.wav');
			this.ding.volume = 0.4;

			// can't access the video until the page has loaded
			this.video = document.getElementById('video');
			
			this.video.addEventListener('ended', this.onVideoEnded);
			this.playVideo(this.videoList[15]);
		})
	}

});