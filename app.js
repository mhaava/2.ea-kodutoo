/* TYPER */


const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0
  this.playerName = document.getElementById("playerName").value;
  this.score = 0
  
  	counter = 0;
		setInterval(function(){
			if (counter == 600) {
				document.getElementsByTagName('canvas')[0].style.display = "none";
				document.getElementById("endscreen").style.display = "block";
				
				
				localStorage.setItem(typer.score, typer.playerName);
				document.getElementById("score").innerHTML = typer.playerName + ": " + typer.score;
				var top10 = [];
				for(var i=0, len=localStorage.length; i<len; i++) {
					var key = localStorage.key(i);
					var value = localStorage[key];
					top10.push(key);
					//console.log(key + " => " + value);
				}
				top10.sort();
				top10.reverse();
				top10.slice(0, 9);
				var tableContent = "<tr><th>#</th><th>Player</th><th>Score</th></tr>";
				for(var i=0; i<top10.length; i++) {
					//console.log(localStorage[top10[i]] + ": " + top10[i]);
					tableContent += "<tr><td>"+(i+1)+"</td><td>"+localStorage[top10[i]]+ "</td><td>"+top10[i]+"</td></tr>";
				}
				document.getElementById("top10").innerHTML = tableContent;
				
			}
			counter++
		}, 100)

  this.init()
}

window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 2
	

    this.loadWords()
	
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)

        typer.start()
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.generateWord()
    this.word.Draw()
	
    window.addEventListener('keypress', this.keyPressed.bind(this))
  },


  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]

    this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },

  keyPressed: function (event) {
    const letter = String.fromCharCode(event.which)

    if (letter === this.word.left.charAt(0)) {
      this.word.removeFirstLetter()
		this.score += 1;

      if (this.word.left.length === 0) {
        this.guessedWords += 1
		this.score += 10;

        this.generateWord()
      }

      this.word.Draw()
    }
  }
}

/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Courier'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
  },

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
  }
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
  }

  return tempArray
}

window.onload = function () {

}

function startGame() {
		if (document.getElementById("playerName").value=="") {
			console.log("empty")
			alert("Sisesta nimi!");
		} else {
			document.getElementById("playerName").style.display = "none";
			document.getElementById("play").style.display = "none";
			document.getElementById("readme").style.display = "none";
			const typer = new TYPER()
			window.typer = typer
			
		}
}

var nightmodeint=0;
function nightMode() {
	if (nightmodeint==0) {
		nightmodeint=1;
		document.getElementById("body").style.backgroundColor = "black";
		document.body.style.color ="white";
	} else {
		nightmodeint=0;
		document.getElementById("body").style.backgroundColor = "lightblue";
		document.body.style.color ="black";
	}
}
