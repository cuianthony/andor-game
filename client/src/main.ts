import * as Phaser from 'phaser';
import Scenes from './scenes/';
import {reducedWidth, reducedHeight} from './constants';
// import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
 
  type: Phaser.AUTO,
 
  width: reducedWidth,
  height: reducedHeight,
  dom:{
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },

  // can't get this to work
  // plugins: {
  //   scene: [{
  //       key: 'rexUI',
  //       plugin: RexUIPlugin,
  //       mapping: 'rexUI'
  //     },
  //   ]
  // },
 
  parent: 'game',
  backgroundColor: '#000000',
  scene: Scenes,

  scale : {
    mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
 
export const game = new Phaser.Game(gameConfig);