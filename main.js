"use strict";
{
	function main() {
		const reelWidth = 100;
		const symbols = [
			"at_at",
			"c3po",
			"darth_vader",
			"death_star",
			"falcon",
			"r2d2",
			"stormtrooper",
			"tie_ln",
			"yoda"
		];
		let called = 0;

		const gold = document.querySelector(".gold");
		let currentCredit = 3000;

		gold.textContent = currentCredit;

		const restartButton = document.querySelector(".restart");
		const starButton = document.querySelector(".start");
		const wonContainer = document.querySelector(".won");
		const result = document.querySelector(".result");

		starButton.addEventListener("click", function() {
			if (currentCredit > 0) {
				currentCredit -= 300;
				gold.textContent = currentCredit;
				starSpining();
				this.style.visibility = "hidden";
			}
		});
		restartButton.addEventListener("click", function() {
			currentCredit = 3000;
			gold.textContent = currentCredit;
			starSpining();
			starButton.style.visibility = "hidden";
			wonContainer.style.display = "none";
		});

		class Machine {
			constructor(width, height) {
				this.width = width;
				this.height = height;
				this.index = 0;
			}
		}

		class Reel extends Machine {
			constructor(width, height, slotNumber) {
				super(width, height);
				this.slotNumber = slotNumber;
				const canvas = document.getElementById(`slot${this.slotNumber}`);
				canvas.width = this.width;
				canvas.height = this.height;
				this.ctx = canvas.getContext("2d");
				this.symbols = [...symbols].sort(() => Math.random() - 0.5);
				this.fps = 60;
				this.animateFrameId = 0;
				this.getFps = true;
				this.called = 0;
			}

			render() {
				this.symbols.forEach((symbol, index) => {
					const image = new Image();
					image.src = `assets/${symbol}.svg`;
					image.onload = () => {
						this.ctx.drawImage(image, 0, 100 * index, 100, 100);
					};
				});
			}

			resetValues() {
				this.fps = 60;
				this.animateFrameId = 0;
				this.getFps = true;
				this.called = 0;
				called = 0;
			}
			spin(fps) {
				if (this.getFps) {
					this.fps = fps;
					this.getFps = false;
				}

				//cancel the animation
				if (this.fps < 2) {
					cancelAnimationFrame(this.animateFrameId);
				}

				for (let i = 0; i < 1; i++) {
					this.symbols.unshift(this.symbols.pop());
				}

				this.ctx.clearRect(0, 0, this.width, this.height);
				this.symbols.forEach((symbol, index) => {
					const image = new Image();
					image.src = `assets/${symbol}.svg`;

					this.ctx.drawImage(image, 0, 100 * index, 100, 100);
				});
				if (this.fps > 2) {
					setTimeout(
						() => (this.animationId = requestAnimationFrame(this.spin.bind(this))),
						1000 / --this.fps
					);
				} else {
					setTimeout(() => checkForWining(), 1000);
				}
			}

			getSymbols() {
				return this.symbols;
			}
		}

		const reel1 = new Reel(reelWidth, 100, 1);
		reel1.render();
		const reel2 = new Reel(reelWidth, 100, 2);
		reel2.render();
		const reel3 = new Reel(reelWidth, 100, 3);
		reel3.render();

		function starSpining() {
			reel1.resetValues();
			reel1.spin(Math.floor(Math.random() * 80 + 50));
			reel2.resetValues();
			reel2.spin(Math.floor(Math.random() * 80 + 50));
			reel3.resetValues();
			reel3.spin(Math.floor(Math.random() * 80 + 50));
		}

		function checkForWining() {
			called++;
			if (called >= 3) {
				if (
					reel1.getSymbols()[0] === reel2.getSymbols()[0] &&
					reel1.getSymbols()[0] === reel3.getSymbols()[0]
				) {
					result.textContent = "Congrats, You Won";
					wonContainer.style.display = "flex";
				} else if (currentCredit <= 0) {
					wonContainer.style.display = "flex";
					result.textContent = "May The Force Be With You";
				}
				starButton.style.visibility = "visible";
			}
		}
	}

	window.onload = main;
}
