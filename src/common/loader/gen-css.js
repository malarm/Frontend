//
// gen-css.js
//
// Generate css for the loader component 
//
// 
// The file is used like so ``node gen-css.js [fileName = 'loader.css']``
// 
// The file takes a single argument, 'fileName', which defines the output file
// 
// The config object of gen-css.js defines how the css is generated and in the
// end what the resulting loader looks like and how it behaves.
//


const { promises: fs } = require('fs')

const [, , fileName = 'loader.css'] = process.argv



const config = {

  /**
   * Size of outerbox (inner box, containing the balls, is sized in relation to this)
   */
  size: 84,

  /**
   * How far towards the center the balls travel
   * 
   * A negative value will make the balls cross the center of the box
   * on their path
   */
  distanceToCenter: '-9px',


  /**
   * How far "outwards" the balls travel
   */
  distanceFromCenter: '18px',


  /**
   * Bezier.. controls the flow of motion
   * 
   * An balanced ease-in-out seems preferable
   */

  // ballBezier: 'cubic-bezier(0.46,0.03,0.52,0.96)',
  // ballBezier: 'linear',
  ballBezier: 'cubic-bezier(0.45,0.05,0.55,0.95)',

  /**
   * Number of balls
   */
  ballCount: 8,

  /**
   * Animation duration (how long it takes for one ball to move from outer to inner position)
   */
  duration: 1200,

  /**
   * Change to create different motion patterns
   * 
   * A modulo of 2 effectively creates two different
   * movement patterns
   */
  modulo: 2,


  ballSize: 10,

  /**
   * Ball colors
   * 
   * Will be distributed evenly across the balls
   * 
   * Delta defines how much the hue can be adjusted (to create slight color variations between balls)
   */
  colors: [
    // {
    //   // pine
    //   hue: 158,
    //   sat: 100,
    //   lig: 16,
    //   delta: 40
    // },
    {
      // brick (hsl(26, 19%, 52%))
      hue: 26,
      sat: 19,
      lig: 52,
      delta: 40,
    },
    {
      // mortar (hsl(55, 42%, 88%))
      hue: 55,
      sat: 42,
      lig: 88,
      delta: 40
    },
    // {
    //   // purple (hsl(253, 100%, 80%))
    //   hue: 253,
    //   sat: 100,
    //   lig: 80,
    //   delta: 20
    // }

  ],

  /**
   * Mix blend mode. Defines how ball colors mix
   * when they overlap during the animation.
   * 
   */
  // mixBlendMode: 'screen'
  // mixBlendMode: 'hard-light'
  mixBlendMode: 'luminosity'
}

const getColor = (index) => {

  const colorN = config.colors.length

  const i = index % colorN

  const {
    delta,
    hue,
    lig,
    sat
  } = config.colors[i]

  // 158 -+ 20
  const deg = delta / config.ballCount * index + (hue - delta / 2)

  // return `hsl(${deg}deg 95% 33% / 50%)`

  return `hsl(${deg}, ${sat}%, ${lig}%)`
}


const ballsContent = new Array(config.ballCount).fill(0).map(
  (_, index) => {

    const delayPerBall = config.duration / config.modulo

    const delay = (index % config.modulo) * delayPerBall

    const deg = (360 / config.ballCount) * index

    return `

@keyframes ball-${index + 1} {
  0% {
    transform: translate(calc(cos(${deg}deg) * ${config.distanceFromCenter}),
        calc(sin(${deg}deg) * ${config.distanceFromCenter}));
  }

  50% {
    transform: translate(calc(cos(${deg}deg) * ${config.distanceToCenter}),
        calc(sin(${deg}deg) * ${config.distanceToCenter}));
  }

  100% {
    transform: translate(calc(cos(${deg}deg) * ${config.distanceFromCenter}),
        calc(sin(${deg}deg) * ${config.distanceFromCenter}));
  }
}

.thor-ball:nth-of-type(${index + 1}) {
  background-color: ${getColor(index)};
  animation: ${config.duration}ms infinite -${delay}ms ball-${index + 1} ${config.ballBezier};
}
    
    `
  }).join('\n\n')



const content = `
/* 
  Generated ${new Date().toLocaleString()} 

  By gen-css.js

  See end of file for configuration used
*/

@keyframes rotate-loader {
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(360deg)
  }
}

.thor-wrapper {
  width: ${config.size}px;
  height: ${config.size}px;
  display: grid;
  place-content: center;
  overflow: visible;
}

.thor-loader {
  animation: 4s infinite rotate-loader linear;
  transform-origin: center;
  position: relative;
  width: ${config.size * 0.7}px;
  height: ${config.size * 0.7}px;
}

.thor-ball {
  top: calc(50% - ${config.ballSize / 2}px);
  left: calc(50% - ${config.ballSize / 2}px);
  position: absolute;
  width: ${config.ballSize}px;
  height: ${config.ballSize}px;
  background: black;
  border-radius: 999px;
  mix-blend-mode: ${config.mixBlendMode};
}

${ballsContent}


/* 
  Configuration (as json)

${JSON.stringify(config, null, 2)}
*/
`

const main = async () => {

  // console.log(content)

  fs.writeFile(fileName, content)
}

main()