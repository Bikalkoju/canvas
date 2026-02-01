const words = ['Naruto', 'Attack on Titan', 'My Hero Academia', 'One Piece'];
let selectedWord = null;


hangman();

function hangman() {
    const hangmanCanvas = document.getElementById( 'hangman' );

    if ( ! hangmanCanvas ) return;

    const [ctx, cw, ch] = canvasSetup( hangmanCanvas );

    drawPole( ctx, cw, ch );
    generateWord();
    // drawHead( ctx, cw, ch );
    // drawBody( ctx, cw, ch );
    // drawLeftHand( ctx, cw, ch );
    // drawRightHand( ctx, cw, ch );
    // drawLeftLeg( ctx, cw, ch );
    // drawRightLeg( ctx, cw, ch );
}

function canvasSetup( canvas ) {
    const canvasWrapperHeight = canvas.parentElement.offsetHeight - 80; //Excluding paddings
    const cw = canvas.width = canvasWrapperHeight / 1.5;
    const ch = canvas.height = canvasWrapperHeight;

    // canvas.style.border = '1px solid #000';

    const ctx = canvas.getContext( '2d' );

    return [ctx, cw, ch];
}

function drawPole( ctx, cw, ch ) { 
    ctx.beginPath();
    ctx.moveTo( cw / 2, ( ch / 100 ) * 20 );
    ctx.lineTo( cw / 2, ( ch / 100 ) * 10 );
    ctx.lineTo( ( cw / 100) * 95, ( ch / 100 ) * 10 );
    ctx.lineTo( ( cw / 100) * 95, ( ch / 100 ) * 90 );

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawHead( ctx, cw, ch ) {
    const headRadius = ( cw / 100 ) * 15; 
    ctx.beginPath();
    ctx.arc( cw / 2, ( ( ch / 100 ) * 20 ) + headRadius, headRadius, 0, 2 * Math.PI, false );
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawBody( ctx, cw, ch ) { 
    ctx.beginPath();
    ctx.moveTo( cw / 2, ( ch / 100 ) * 20 + ( 2 * ( ( cw / 100 ) * 15 ) ) );
    ctx.lineTo( cw / 2, ( ch / 100 ) * 70 );

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawLeftHand( ctx, cw, ch ) { 
    ctx.beginPath();
    ctx.moveTo( cw / 2, ( ch / 100 ) * 20 + ( 2 * ( ( cw / 100 ) * 15 ) ) );
    ctx.lineTo( ( cw / 100 ) * 30, ( ch / 100 ) * 50 );

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawRightHand( ctx, cw, ch ) { 
    ctx.beginPath();
    ctx.moveTo( cw / 2, ( ch / 100 ) * 20 + ( 2 * ( ( cw / 100 ) * 15 ) ) );
    ctx.lineTo( ( cw / 100 ) * 70, ( ch / 100 ) * 50 );

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawLeftLeg( ctx, cw, ch ) { 
    ctx.beginPath();
    ctx.moveTo( cw / 2, ( ch / 100 ) * 70 );
    ctx.lineTo( ( cw / 100 ) * 30, ( ch / 100 ) * 90 );

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function drawRightLeg( ctx, cw, ch ) { 
    ctx.beginPath();
    ctx.moveTo( cw / 2, ( ch / 100 ) * 70 );
    ctx.lineTo( ( cw / 100 ) * 70, ( ch / 100 ) * 90 );

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function generateWord() {
    const randomIndex = Math.floor( Math.random() * words.length );
    selectedWord = words[randomIndex];

    generateInputBoxes( selectedWord );
}

function generateInputBoxes( selectedWord ) {
    const letters = selectedWord.split( '' );
    const wordsInputWrapper = document.querySelector( '.words_input' );

    if ( ! wordsInputWrapper ) return;

    letters.forEach( ( letter, index ) => {
        if ( /^[a-z]$/i.test( letter ) ) {
            const input = document.createElement( 'input' );
            input.setAttribute( 'name', `letter_${index}` );
            wordsInputWrapper.appendChild( input );
        } else if ( letter === ' ' ) {
            const space = document.createElement( 'div' );
            space.className = 'space';
            wordsInputWrapper.appendChild( space );
        } 
        else {
            const letter = document.createElement( 'div' );
            wordsInputWrapper.appendChild( letter );
        }
    } )
    console.log(letters)
}   

