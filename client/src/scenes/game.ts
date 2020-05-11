import { Farmer, Hero, HourTracker, Monster, HeroKind, BrokenWell, Well, Tile, Narrator, EventCard } from '../objects';
import { game } from '../api';
import { Prince } from '../objects/Prince';
import { Merchant } from '../objects/merchant';
import { RietburgCastle } from './rietburgcastle';
import BoardOverlay from './boardoverlay';
import {
  CollabWindow, MerchantWindow, DeathWindow, Fight, EventWindow,
  BattleInvWindow, TradeWindow, ShieldWindow, ContinueFightWindow
} from "../windows/windows";
import {
  TileWindow, WitchWindow, CoastalMerchantWindow, StoryWindow
} from '../basicwindows/basicwindows';
import {
  expandedWidth, expandedHeight, borderWidth, fullWidth, fullHeight, scaleFactor,
  reducedWidth, reducedHeight, htX, htY, htShift, mOffset, 
  collabColWidth, collabRowHeight, collabFooterHeight, collabHeaderHeight,
  storyCardWidths, storyCardHeights, merchantWindowWidth, merchantWindowHeight
} from '../constants'
import { WindowManager } from '../utils/WindowManager';
import { BasicWindowManager } from '../utils/BasicWindowManager';

export default class GameScene extends Phaser.Scene {
  private heroes: Hero[];
  private hero: Hero;
  // private startingHeroRank: number;
  private ownHeroType: HeroKind;

  private tiles: Tile[];
  // Note acui: was having trouble using wells map with number typed keys, so converting to strings
  private wells: Map<string, Well>;

  private farmers: Farmer[];
  private hourTracker: HourTracker;
  private gameinstance: game;
  private monsters: Monster[];
  private monsterNameMap: Map<string, Monster>;
  private castle: RietburgCastle;
  private prince: Prince;
  private herb: Phaser.GameObjects.Image;

  private narrator: Narrator;
  private gameStartHeroPosition: number;
  private event: EventCard
  private activeEvents: Array<EventCard>
  private mockText;
  private eventBeingDisplayed
  private cameraKeys;
  private cameraScrollSpeed = 15;
  private minZoom = 0.4;
  private maxZoom = 1;
  private zoomAmount = 0.01;

  private sceneplugin;
  private turntext;

  private overlay: BoardOverlay;
  private tempMerchant
  private shiftKey;
  private ctrlKey;

  constructor() {
    super({ key: 'Game' });
    this.heroes = Array<Hero>();
    this.tiles = Array<Tile>();
    this.wells = new Map();
    this.farmers = new Array<Farmer>();
    this.ownHeroType = HeroKind.Dwarf;
    this.monsters = new Array<Monster>();
    this.monsterNameMap = new Map();
    this.castle = new RietburgCastle();
    this.eventBeingDisplayed = false
  }

  public init(data) {
    this.gameinstance = data.controller;
    let type = data.heroType;
    console.log("GameScene created, client hero type: ", type);
    this.ownHeroType = type;
  }

  public preload() {
    this.load.image("gor", "../assets/all-creatures/gor.PNG")
    this.load.image("skral", "../assets/all-creatures/skral.PNG")
    this.load.image("wardrak", "../assets/all-creatures/wardrak.PNG")
    this.load.image("fortress", "../assets/all-creatures/fortress.png")

    this.load.image("functional_well", "../assets/board-minor/functional_well.png");
    this.load.image("broken_well", "../assets/board-minor/broken_well.png");
    this.load.image("merchant-trade", "../assets/board-minor/merchant-trade.png");
    this.load.image("farmer", "../assets/board-minor/farmer.png");
    this.load.image("witch", "../assets/board-minor/witch.png");
    this.load.image("pawn", "../assets/board-minor/pawn.png");
    this.load.image('dshield', './assets/board-minor/disabled_cracked_shield.png')
    this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets');

    this.load.image("WillPower2", "../assets/fog-tokens/will2.png");
    this.load.image("WillPower3", "../assets/fog-tokens/will3.png");
    this.load.image("Gold", "../assets/fog-tokens/gold.png");
    this.load.image("EventCard", "../assets/fog-tokens/event.png");
    this.load.image("Gor", "../assets/fog-tokens/gorfog.png");
    this.load.image("WitchFog", "../assets/fog-tokens/witchfog.png");
    this.load.image("WineskinFog", "../assets/fog-tokens/wineskinfog.png");
    this.load.image("eventcard", "../assets/fog-tokens/eventcard.png");
    this.load.image("Strength", "../assets/fog-tokens/strength.png");

    // Items
    this.load.image("menubackground", "../assets/menubackground.png");
    this.load.image("blue_runestone", "../assets/stones/runestone_b.PNG");
    this.load.image("green_runestone", "../assets/stones/runestone_g.PNG");
    this.load.image("yellow_runestone", "../assets/stones/runestone_y.PNG");
    this.load.image("blue_runestone_h", "../assets/stones/runestone_b_hidden.png");
    this.load.image("green_runestone_h", "../assets/stones/runestone_g_hidden.png");
    this.load.image("yellow_runestone_h", "../assets/stones/runestone_y_hidden.png");

    this.load.image("brew", "../assets/items/brew.png");
    this.load.image("wineskin", "../assets/items/wineskin.png");
    this.load.image("bow", "../assets/items/bow.PNG");
    this.load.image("falcon", "../assets/items/falcon.PNG");
    this.load.image("helm", "../assets/items/helm.PNG");
    this.load.image("telescope", "../assets/items/telescope.PNG");
    this.load.image("half_wineskin", "../assets/items/half_wineskin.jpg")
    this.load.image("half_brew", "../assets/items/half_brew.jpg")
    this.load.image("herb", "../assets/items/herb.png");
    this.load.image("shield", "../assets/items/shield.png")
    this.load.image("damaged_shield", "../assets/items/brokenshield.PNG")

    this.load.image("prince", "../assets/board-minor/prince.png");
    this.load.image("gold", "../assets/fog-tokens/gold.png")

    this.load.image('okay', './assets/ok.png')
    this.load.image("item_border", "../assets/border.png"); // uses hex 4b2504
    this.load.image("hero_border", "../assets/big_border.png");
  }

  public create() {
    var self = this;

    this.cameraSetup();
    this.shiftKey = this.input.keyboard.addKey('shift');
    this.ctrlKey = this.input.keyboard.addKey('CTRL');
    this.sceneplugin = this.scene

    // Centred gameboard with border
    this.add.image(fullWidth / 2, fullHeight / 2, 'gameboard')
      .setDisplaySize(expandedWidth, expandedHeight);

    this.gameinstance.getGameData((data) => {
      // console.log("GAME DATA IS:::::::::::::\n", data)

      this.setRegions(data.regions);
      // console.log("FOGS ARE::****", data.fogs)
      this.addFog(data.fogs);
      this.addShieldsToRietburg(data.castle.numDefenseShields - data.castle.numDefenseShieldsUsed);

      data.monsters.forEach(monster => {
        this.addMonster(monster[1].tileID, monster[1].type, monster[0]);
      })

      data.farmers.forEach(farmer => {
        this.addFarmer(farmer.id, farmer.tileID);
      })

      data.heroList.forEach(hero => {
        this.addHero(hero[1].hk, hero[1].region.id, hero[1].hk, hero[1].timeOfDay-1);
      })

      this.hourTrackerSetup();

      if (data.prince) {
        this.addPrince(data.prince.tile.id);
      } else {
        console.log('no prince saved')
      }

      if (data.witch) {
        this.addWitch(data.witch.tileID);
      } else {
        console.log('no witch saved')
      }

      this.setUpListeners();

      // Add overlay to game
      const overlayData = {
        gameinstance: this.gameinstance,
        tiles: this.tiles,
        monsterMap: this.monsterNameMap,
        // gameTweens: self.tweens, not sure if this needs to be passed
        hourTracker: this.hourTracker,
        wells: this.wells,
        hk: this.ownHeroType,
        clientheroobject: this.hero,
        herb: this.herb,
        initialCollabDone: data.initialCollabDone
      };
      this.overlay = new BoardOverlay(overlayData);
      this.scene.add('BoardOverlay', this.overlay, true);

      if (data.herb != -1) {
        this.addHerbToScene(data.herb);
      } else {
        console.log('no herb saved')
      }

      // prevent initial collab decision from happening again when we load game
      if (!data.initialCollabDone) {
        // Need to wait for heroes to be created before creating collab decision
        // DEBUG TODO: uncomment
        this.startingCollabDecisionSetup();
      } else {
        this.scene.resume();
      }

      // Add narrator: this happens here because we want initial game instructions to be
      // added on top of the collab decision
      this.gameStartHeroPosition = data.startGamePos;

      // DEBUG TODO: uncomment addNarrator
      this.addNarrator(data.runestoneCardPos);
      //

      // Listen for all updates triggered by narrator advancing
      this.receiveNarratorEvents();
    })

    // Auto-saving, disabled now so save your games manually
    // setInterval(() => {
    //   console.log("********* SAVING GAME");
    //   this.gameinstance.save();
    // }, 10000);
    // this.addMerchants();

    //Event Card adding at start of game
    //this.gameinstance.newEvent()
    //this.addEventCard("YOOOOOOOOOO")
    // this.gameinstance.addMonster((type, tile, id) => {
    //   this.addMonster(tile, type, id);
    // })
    // this.gameinstance.newEventListener((event: EventCard) => {
    //   this.applyEvent(event)
    // })


  }

  private cameraSetup() {
    // Set bounds of camera to the limits of the gameboard
    var camera = this.cameras.main;
    camera.setBounds(0, 0, fullWidth, fullHeight);
    // set initial camera positions for herKind
    switch (this.ownHeroType) {
      case "dwarf":
        camera.scrollX = 0;
        camera.scrollY = 0;
        break;
      case "archer":
        camera.scrollX = 0;
        camera.scrollY = 3632 * scaleFactor + borderWidth;
        break;
      case "warrior":
        camera.scrollX = 1176 * scaleFactor + borderWidth;
        camera.scrollY = 1840 * scaleFactor + borderWidth;
        break;
      case "mage":
        camera.scrollX = 528 * scaleFactor + borderWidth;
        camera.scrollY = 3296 * scaleFactor + borderWidth;
        break;
    }

    // Set keys for scrolling and zooming
    this.cameraKeys = this.input.keyboard.addKeys({
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
      zoomIn: 'q',
      zoomOut: 'e'
    });
  }

  private setRegions(tilesData) {
    // Note that regions 73-79 and 83 are unused, but created anyways to preserve direct
    // indexing between regions array and region IDs
    // var tilesData = require("../utils/xycoords").map;
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    for (let t of tilesData) {
      let xPos = t.xcoord * scaleFactor + borderWidth;
      let yPos = t.ycoord * scaleFactor + borderWidth;
      var tile = new Tile(t.id, this, xPos, yPos, treeTile, t.adjRegionsIds);
      this.tiles[t.id] = tile;
      tile.setInteractive({useHandCursor: true});
      this.add.existing(tile);
      
      this.checkWell(t);
      this.checkMerchant(t);
    }

    var self = this
    this.tiles.map(function (tile) {
      // click: for movement callback, ties pointerdown to move request
      // shift+click: tile items pickup interface
      // ctrl+click: move the prince TODO: change this key binding, ctrl-click is kinda finicky
      tile.on('pointerdown', function (pointer) {
        console.log('tile id sanity check', tile.id)
        if (this.shiftKey.isDown) {
          const tileWindowID = `tileWindow${tile.getID()}`;
          // TODO: BASICWINDOW MANAGER FOR DESTROYING WINDOWS
          if (BasicWindowManager.hasWindow(tileWindowID)) {
            let window = BasicWindowManager.removeWindow(tileWindowID);
            window.disconnectListeners();
            window.destroyWindow();
          } else {
            // width of tile window depends on number of items on it
            this.gameinstance.getTileItems(tile.id, function (tileItems) {
              let items = tileItems;
              BasicWindowManager.createWindow(self, tileWindowID, TileWindow,
                {
                  controller: self.gameinstance,
                  x: tile.x + 20,
                  y: tile.y + 20,
                  w: 670, // default to total number of unique items that could populate
                  h: 60,
                  tileID: tile.getID(),
                  items: items
                }
              )
            })
          }
        } else if (this.ctrlKey.isDown) {  //to move prince, hold ctrl key
          self.gameinstance.movePrinceRequest(tile.id, updateMovePrinceRequest)
        } else {
          self.gameinstance.moveRequest(tile.id, updateMoveRequest)
        }
      }, this)
    }, this)

    this.gameinstance.updateMoveRequest(updateMoveRequest)
    this.gameinstance.updateMovePrinceRequest(updateMovePrinceRequest)

    function updateMoveRequest(heroKind, tileID) {
      self.heroes.forEach((hero: Hero) => {
        if (hero.getKind().toString() === heroKind) {
          let newCoords = hero.getPosOnTile(self.tiles[tileID]);
          self.tweens.add({
            targets: hero,
            x: newCoords.x,
            y: newCoords.y,
            duration: 300,
            ease: 'Power2',
            onComplete: function () { hero.moveTo(self.tiles[tileID]) }
          });
        }
      })
    }

    function updateMovePrinceRequest(heroKind, tileID, numPrinceMoves) {
      numPrinceMoves = +numPrinceMoves;
      self.heroes.forEach((hero: Hero) => {
        if (hero.getKind().toString() === heroKind) {
          self.prince.moveTo(self.tiles[tileID])
          if (numPrinceMoves % 4 === 1) {
            hero.incrementHour();
          }
        }
      })
    }
  }

  private checkWell(tile) {
    // coordinates taken from previous version, adding wells to allocated wells positions
    switch (tile.id) {
      case 5:
        this.addFunctionalWell(209, 2244, tile.id as number, tile.wellUsed);
        break;
      case 35:
        if(tile.hasWell){
          this.addFunctionalWell(1353, 4873, tile.id as number, tile.wellUsed);
        }
        else{
          this.addBrokenWell(1353, 4873, tile.id as number);
        }
        break;
      case 45:
        if(tile.hasWell){
          this.addFunctionalWell(7073, 3333, tile.id as number, tile.wellUsed);
        }
        else{
          this.addBrokenWell(7073, 3333, tile.id as number);
        }
        break;
      case 55:
        this.addFunctionalWell(5962, 770, tile.id as number, tile.wellUsed);
        break;
    }
  }

  private checkMerchant(tile) {
    if (tile.hasMerchant) {
      switch (tile.id) {
        case 9:
          this.addCoastalTraderToScene()
          break;
        case 18:
          this.addMerchant(3060, 3680, tile.id as number);
          break;
        case 57:
          this.addMerchant(7708, 1340, tile.id as number);
          break;
        case 71:
          this.addMerchant(7426, 4320, tile.id as number);
          break;
      }
    }
  }

  private addShieldsToRietburg(numShields) {
    var overlayoffsetsX = 10;
    var overlayoffsetsY = 20;
    let s1 = this.add.sprite(95+overlayoffsetsX, 188+overlayoffsetsY, 'dshield').setDisplaySize(65, 81)
    let s2 = this.add.sprite(163+overlayoffsetsX, 188+overlayoffsetsY, 'dshield').setDisplaySize(65, 81)
    let s3 = this.add.sprite(228+overlayoffsetsX, 188+overlayoffsetsY, 'dshield').setDisplaySize(65, 81)
    let s4 = this.add.sprite(95+overlayoffsetsX, 310+overlayoffsetsY, 'dshield').setDisplaySize(65, 81)
    let s5 = this.add.sprite(163+overlayoffsetsX, 310+overlayoffsetsY, 'dshield').setDisplaySize(65, 81)
    let s6 = this.add.sprite(95+overlayoffsetsX, 430+overlayoffsetsY, 'dshield').setDisplaySize(65, 81)

    this.castle.shields.push(s1)
    this.castle.shields.push(s2)
    this.castle.shields.push(s3)
    this.castle.shields.push(s4)
    this.castle.shields.push(s5)
    this.castle.shields.push(s6)

    var self = this;
    for (var i = 0; i < numShields; i++) {
      self.castle.shields[i].visible = false;
    }
  }

  private addMonster(monsterTile: number, type: string, id: string) {
    const tile: Tile = this.tiles[monsterTile];

    let monster: Monster = new Monster(this, tile, type, id).setInteractive({useHandCursor: true}).setScale(.5);
    this.monsters.push(monster);
    this.monsterNameMap[monster.name] = monster;
    tile.setMonster(monster);
    this.add.existing(monster);
    monster.on('pointerdown', function (pointer) {
      if (this.scene.isVisible(monster.name)) {
        var window = WindowManager.get(this, monster.name)
        window.destroy();
      }
      else {
        var princetile = -69
        try {
          princetile = this.prince.tile.id
        }
        catch {
          princetile = -69
        }
        WindowManager.createWindow(this, monster.name, Fight, {
          controller: this.gameinstance,
          hero: this.hero, monster: monster, heroes: this.heroes,
          overlayRef: this.overlay,
          princePos: princetile
        });
        this.scene.pause()
      }
    }, this)
  }

  private addFarmer(id: number, tileID: number) {
    const tile: Tile = this.tiles[tileID];
    const farmerObj = new Farmer(id, this, tile, 'farmer').setDisplaySize(40, 40).setInteractive({useHandCursor: true});
    this.farmers.push(farmerObj);
    tile.farmers.push(farmerObj);
    this.add.existing(farmerObj);

    var self = this;

    farmerObj.on('pointerdown', () => {
      self.gameinstance.pickupFarmer(farmerObj.tile.getID(), function (tileid) {
        farmerObj.destroy();
      });
    }, this);
  }


  private addHero(type: HeroKind, tileNumber: number, texture: string, hour: number) {
    const tile: Tile = this.tiles[tileNumber]
    let hero: Hero = new Hero(this, tile, texture, type, hour).setDisplaySize(40, 40);
    this.heroes.push(hero);
    // tile.hero = hero;
    this.add.existing(hero);
    if (this.ownHeroType === type) {
      this.hero = hero;
    }
  }

  private addFunctionalWell(x, y, tileNumber: number, used: boolean) {
    const tile: Tile = this.tiles[tileNumber];
    const newWell = new Well(this, x * scaleFactor + borderWidth,
      y * scaleFactor + borderWidth, "functional_well", tile, this.gameinstance, used).setDisplaySize(48, 54);
    this.add.existing(newWell);
    this.wells.set("" + newWell.getTileID(), newWell);
  }
  private addBrokenWell(x, y, tileNumber: number) {
    const tile: Tile = this.tiles[tileNumber];
    const newWell = new BrokenWell(this, x * scaleFactor + borderWidth,
      y * scaleFactor + borderWidth, "broken_well", tile, this.gameinstance).setDisplaySize(48, 54);
    this.add.existing(newWell);
    //this.wells.set("" + newWell.getTileID(), newWell);
  }

  private addMerchant(x, y, tileNumber: number) {
    const tile: Tile = this.tiles[tileNumber];
    const newMerchant = new Merchant(this, x * scaleFactor + borderWidth,
      y * scaleFactor + borderWidth, "merchant-trade", tile, this.gameinstance).setDisplaySize(35, 35);

    var self = this;
    newMerchant.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == newMerchant.getTileID()) { // TODO: fix this validation, all heroes should be able to see the merchant
        if (this.scene.isVisible('merchant')) {
          var window = WindowManager.get(this, "merchant")
          window.disconnectListeners() // TODO: check if this call is actually necessary
          window.destroy();
        } else {
          WindowManager.createWindow(self, 'merchant', MerchantWindow, 
            { 
              controller: self.gameinstance,
              x: reducedWidth / 2 - merchantWindowWidth / 2,
              y: reducedHeight / 2 - merchantWindowHeight / 2,
              w: merchantWindowWidth,
              h: merchantWindowHeight 
            }
          );
        }
      }
    }, this);
    this.add.existing(newMerchant);
  }

  // Add the narrator pawn to the game board
  private addNarrator(runestoneCardPos: number) {
    var self = this;

    this.gameinstance.getNarratorPosition(function (pos: number) {
      // Trigger start of game instructions/story
      if (pos == -1) {
        BasicWindowManager.createWindow(self, `story`, StoryWindow,
          { 
            x: self.getCameraX() + reducedWidth / 2 - 300,
            y: self.getCameraY() + reducedHeight / 2 - 175,
            w: 600,
            h: 350,
            id: -1,
            gameController: self.gameinstance,
            firstNarrAdvance: (self.gameStartHeroPosition == self.heroes.length)
          }
        );

        // First hero to enter the game triggers placement of the runestone legend
        // This is the only "narrator event" that gets directly triggered from the client
        // because it doesn't happen on a monster kill or end of day
        if (self.gameStartHeroPosition == 1) {
          // console.log('client emits placeRunestoneLegend')
          self.gameinstance.placeRuneStoneLegend();
        }
      }

      // Otherwise we just add the narrator at whatever position the backend has stored
      console.log("creating narrator at position", pos);
      self.narrator = new Narrator(self, pos, "pawn", self.gameinstance).setScale(0.5);
      self.add.existing(self.narrator);

      // Place runestone legend card
      if (runestoneCardPos != -1) {
        console.log("placing runestone card at position", runestoneCardPos);
        self.placeRunestoneCard(runestoneCardPos);
      }
    })
  }

  private receiveNarratorEvents() {
    var self = this;

    // runestonePos is an optional argument that is only passed back for the start of game
    this.gameinstance.updateNarrator(function (pos: number, runestonePos = -1, stoneLocs = [], win: boolean = false) {
      // Switch on the new narrator position
      self.narrator.advance();
      console.log("client received narrator advance", pos, runestonePos, stoneLocs, win)
      switch (pos) {
        case 0: // Initial storytelling is done, rune legend card placed, narrator at A
          // TODO NARRATOR: update rune card UI and position
          console.log('place runestone card on', runestonePos)
          self.placeRunestoneCard(runestonePos);
          break;
        case self.narrator.getRunestonePos():
          // place the runestones on the board
          self.narratorRunestones(stoneLocs);
          break;
        case 2: // Legend card C
          self.narratorC();
          break;
        case 6: // Legend card G
          self.narratorG();
          break;
        case 13: // Legend card N
          console.log("case 13");
          self.narratorN(win);
          break;
      }
    })
  }

  private placeRunestoneCard(runestonePos: number) {
    if (runestonePos == -1) return;

    let yPos = (6100 - (runestonePos * 455)) * scaleFactor + borderWidth
    // place the runestone card marker on the legend track
    this.add.image(2450, yPos, 'eventcard').setAlpha(0.7);
    this.narrator.setRunestonePos(runestonePos);
  }

  private createStoryWindow(storyID: number) {
    BasicWindowManager.createWindow(this, `story${storyID}`, StoryWindow,
      { 
        x: this.getCameraX() + reducedWidth / 2 - storyCardWidths[storyID] / 2,
        y: this.getCameraY() + reducedHeight / 2 - storyCardHeights[storyID] / 2,
        w: storyCardWidths[storyID],
        h: storyCardHeights[storyID],
        id: storyID
      }
    );
  }

  private narratorRunestones(stoneLocs: number[]) {
    console.log("client narratorRunestones", stoneLocs)
    // Display StoryWindows
    this.createStoryWindow(6)
  }

  // Note that adding monsters is handled in setupListeners
  private narratorC() {
    console.log("client narratorC")
    // Place farmer and prince, these are hardcoded for now
    this.addFarmer(2, 28);
    this.addPrince();
    
    this.createStoryWindow(3);
  }

  private addPrince(tileID: number = 72) {
    this.prince = new Prince(this, this.tiles[tileID], 'prince').setScale(.15);
    this.add.existing(this.prince);
  }

  private addWitch(tileID: number) {
    // Place the witch on tileID
    var self = this
    var witch = this.add.image(this.tiles[tileID].x + 50, this.tiles[tileID].y - 5, "witch");
    witch.setInteractive({useHandCursor: true}).setScale(0.75);
    witch.on('pointerdown', (pointer) => {
      if (BasicWindowManager.hasWindow(`witchwindow`)) {
        let window = BasicWindowManager.removeWindow(`witchwindow`);
        window.disconnectListeners();
        window.destroyWindow();
      } else {
        BasicWindowManager.createWindow(self, `witchwindow`, WitchWindow, 
        {
          controller: self.gameinstance,
          x: self.tiles[tileID].x + 50,
          y: self.tiles[tileID].y + 40,
          w: 105,
          h: 70,
        })
      }
    })
  }

  private narratorG() {
    // Remove prince
    this.prince.destroy();
    this.createStoryWindow(7);
  }

  private narratorN(win: boolean) {
    // console.log("At narrator NNNNN. client game narratorN: ", win)
    if (win) {
      this.createStoryWindow(9);
    }
    else {
      console.log('create story window 10')
      this.createStoryWindow(10);
    }
    // this.scene.pause(); // TODO: toggle interactivity instead of pausing whole scene
    this.overlay.toggleInteractive(false);
  }

  private addFog(fogs) {
    fogs.forEach((fog) => {
      const tile: Tile = this.tiles[fog[0]];
      const f = this.add.sprite(tile.x + 50, tile.y - 5, fog[1]).setDisplaySize(60, 60);
      f.name = fog[1];
      f.setTint(0x101010); // darken
      tile.setFog(f) // add to tile
      f.setInteractive({useHandCursor: true});
      this.add.existing(f);
      var self = this
      f.on("pointerdown", (pointer) => {
        self.gameinstance.getHeroItems(self.hero.getKind(), function (itemdict) {
          self.gameinstance.getAdjacentTiles(self.hero.tile.id, function (adjtileids) {
            var flag = false
            //why are we using a loop like this instead of .includes()?? good question, includes() was not working for some reason.
            // @Jacek Includes probably wasnt working bceause tile.id is a number but the contents of adjtileids are passed as strings by socket.
            for (let i = 0; i < adjtileids.length; i++) {
              console.log(adjtileids[i], tile.id)
              if (adjtileids[i] == tile.id) {
                flag = true
              }
            }
            if (itemdict['smallItems'].includes('telescope') && flag) {
              console.log('using telescope.')
              f.clearTint();
              // setTimeout(() => {
              //   f.setTint(0x101010);
              // }, 800);
              self.gameinstance.telescopeEndTurn();
            }
            else {
              self.gameinstance.useFog(f.name, tile.id, (tile) => {
                console.log(tile, typeof tile)
                // Reveals the fog for set timeout before removing
                let f = self.tiles[+tile].getFog();
                f.clearTint();
                setTimeout(() => {
                  f.destroy()
                }, 800);
              })
            }
          })
        })
      }, this)
    })

    // Reveals the fog for set timeout before removing
    this.gameinstance.destroyFog((tile) => {
      let f = this.tiles[+tile].getFog();
      f.clearTint();
      setTimeout(() => {
        f.destroy()
      }, 800);
    });
  }

  //for specific events which need to apply a unique ui effect, or something of that nature
  private applyEvent(event: EventCard) {
    var self = this
    console.log("Applying event")
    if (event.id == 2) {
      //wind accross screen or something like that
    }
    // TODO EVENTS: trigger any UI additions
    console.log(this.eventBeingDisplayed)
    if(this.eventBeingDisplayed){
      // while(this.eventBeingDisplayed){
      //   //do nothing
      //   setTimeout(function(){ }, 2000);
      // }
    }
    console.log("created eventWindow")
    BasicWindowManager.createWindow(this, `eventWindow${event.id}`, EventWindow, {
      x: self.getCameraX() + reducedWidth / 2 - 150,
      y: self.getCameraY() + reducedHeight / 2 - 125,
      w: 300,
      h: 250, 
      id: event.id,
      flavorText: event.flavorText,
      descText: event.desc,
    },)
    this.eventBeingDisplayed = true 
  }
  private setEventBeingDisplayed(b){
    this.eventBeingDisplayed = b
  }
  private getEventBeingDisplayed(){
    return this.eventBeingDisplayed
  }
  private addEventCard(event: EventCard) {
    var newEvent = new EventCard(this, event.id, event.flavorText, event.desc)

    //remove current event from scene
    if (this.event != null) {
      this.event.destroy(true)
    }

    //add new event to scene
    this.event = newEvent
    this.add.existing(newEvent)
  }

  private startingCollabDecisionSetup() {
    var self = this;

    var res = new Map([
      ["gold", 5],
      ["wineskin", 2]
    ])

    // Determine width of the window based on how many resources are being distributed
    // Width is always at least 3*collabColWidth
    var width = res.size > 1 ? (res.size + 1) * collabColWidth : 3 * collabColWidth; // Not sure if there's a better way of getting size of ts obj
    // Determine height of the window based on number of players involved
    var height = collabHeaderHeight + self.heroes.length * collabRowHeight + collabFooterHeight;

    var collabWindowData =
    {
      controller: self.gameinstance,
      isOwner: true,
      involvedHeroes: self.heroes.map(h => h.getKind()),
      resources: res,
      textOptions: null,
      x: reducedWidth / 2 - width / 2,
      y: reducedHeight / 2 - height / 2,
      w: width,
      h: height,
      infight: false,
      overlayRef: self.overlay,
      ownHeroKind: this.ownHeroType,
      type: 'distribute',
      initialSleep: true,
      eventID: 0
    };

    WindowManager.createWindow(this, 'collab', CollabWindow, collabWindowData);
    // Freeze main game while collab window is active
    // this.scene.pause();
  }

  // Creating the hour tracker
  private hourTrackerSetup() {
    //x, y coordinates
    var htx = htX;
    var hty = htY;
    var self = this
    var heroSprites = new Map();
    for (var h of this.heroes) {
      var sprite = self.add.sprite(htx, hty, h.texture.key).setDisplaySize(40, 40)
      heroSprites.set(h.getKind(), sprite);
      switch (h.getKind()) {
        case HeroKind.Archer:
          sprite.x = htx - 20
          sprite.y = hty - 20
          break
        case HeroKind.Dwarf:
          sprite.x = htx + 20
          sprite.y = hty - 20
          break
        case HeroKind.Mage:
          sprite.x = htx - 20
          sprite.y = hty + 20
          break
        case HeroKind.Warrior:
          sprite.x = htx + 20
          sprite.y = hty + 20
          break
      }
      if (h.getHour() > 0) {
        sprite.x += h.getHour()*htShift
      } else {
        sprite.x -= htShift
      }
    }
    this.hourTracker = new HourTracker(this, htx, hty, heroSprites);

    // we're not actually adding the hourTracker, we're adding it's internal sprite
    // this.hourTracker.depth = 5;
    // this.hourTracker.depth = 0;
    for (var h of this.heroes) {
      h.hourTracker = this.hourTracker;
    }
  }

  private setUpListeners() {
    var self = this;

    // listener to add monsters for narrator, fogs, and events
    this.gameinstance.addMonster((type, tile, id) => {
      this.addMonster(tile, type, id);
    })

    // Listen for turn to be passed to yourself
    // Deprecated: removed turn logic from frontend
    // this.gameinstance.yourTurn()
    this.gameinstance.updatePassTurn(heroKind => {
      self.heroes.forEach((hero: Hero) => {
        if (hero.getKind().toString() === heroKind) {
          hero.hourTracker.incHour(heroKind);
        }
      })
    });

    // Reveal the witch
    this.gameinstance.revealWitch(tileID => {
      this.createStoryWindow(8);
      self.addWitch(tileID);
    })

    // Reveal the herb
    this.gameinstance.revealHerb(tileID => {
      let tile = this.tiles[tileID];
      this.herb = this.add.image(tile.x + mOffset + 20, tile.y, "herb").setDisplaySize(30, 30);
      this.overlay.setHerb(this.herb);
    })

    this.gameinstance.removeHerb(() => {
      this.herb.destroy();
    })

    /**
     * FIGHT LISTENERS
     */
    this.gameinstance.receiveBattleInvite(function (monstertileid) {
      if (self.scene.isVisible('battleinv')) {
        var window = WindowManager.get(this, "battleinv")
        window.disconnectListeners() // TODO: check if this call is actually necessary
        window.destroy();
      }
      WindowManager.createWindow(self, 'battleinv', BattleInvWindow,
        {
          controller: self.gameinstance,
          hero: self.hero,
          gamescene: self,
          monstertileid: monstertileid,
          overlayRef: self.overlay
        });

    })

    this.gameinstance.continueFightPrompt(function () {
      if (self.scene.isVisible('continuefightprompt')) {
        var window = WindowManager.get(this, "continuefightprompt")
        window.disconnectListeners() // TODO: check if this call is actually necessary
        window.destroy();
      }
      WindowManager.createWindow(self, 'continuefightprompt', ContinueFightWindow,
        {
          controller: self.gameinstance,
          hero: self.hero,
          gamescene: self,
          overlayRef: self.overlay
        });
    })

    // TODO: should be able to remove this listener
    this.gameinstance.forceTurn(function () {
      // Deprecated: removed turn logic from frontend
      // self.gameinstance.setMyTurn(true)
    })

    this.gameinstance.forceFight(function (monstername) {
      var monster = self.monsterNameMap[monstername]
      if (self.scene.isVisible(monster.name)) {
        var window = WindowManager.get(this, monster.name)
        window.disconnectListeners() // TODO: check if this call is actually necessary
        window.destroy();
      }
      else {
        var princetile = -69
        try {
          princetile = self.prince.tile.id
        }
        catch {
          princetile = -69
        }
        WindowManager.createWindow(self, monster.name, Fight, {
          controller: self.gameinstance,
          hero: self.hero, monster: monster, heroes: self.heroes,
          overlayRef: self.overlay,
          princePos: princetile
        });
        self.scene.pause()
      }
    })

    this.gameinstance.receiveDeathNotice(function () {
      if (self.scene.isVisible('deathnotice')) {``
        var window = WindowManager.get(this, "deathnotice")
        window.disconnectListeners() // TODO: check if this call is actually necessary
        window.destroy();
      }
      WindowManager.createWindow(self, 'deathnotice', DeathWindow, { controller: self.gameinstance });
    })
    // Listening for shields lost due to monster attack
    this.gameinstance.updateShields(function (shieldsRemaining: number) {
      for (let i = 0; i < 6; i++) {
        if (i >= shieldsRemaining) {
          self.castle.shields[i].visible = true;
        } else {
          self.castle.shields[i].visible = false;
        }
      }
    })

    this.gameinstance.receiveShieldPrompt(function (damaged_shield, potentialdamage) {
      WindowManager.createWindow(self, 'shieldprompt', ShieldWindow, { controller: self.gameinstance, hero: self.hero, potentialdamage: potentialdamage, damaged: damaged_shield });
    })

    // FARMERS
    this.gameinstance.destroyFarmer(function (tileid) {
      console.log("Entered destroyfarmer listener")
      let pickedFarmer: Farmer = self.tiles[tileid].farmers.pop();
      pickedFarmer.destroy()
    });

    this.gameinstance.addFarmer(function (tileid, farmerid) {
      if (tileid === 0) {
        for (var i = 0; i < 6; i++) {
          if (self.castle.shields[i].visible == true) {
            self.castle.shields[i].visible = false;
            break;
          }
        }
      } else {
        self.addFarmer(+farmerid, tileid)
      }
    });

    // TRADE
    this.gameinstance.receiveTradeInvite(function (host, invitee) {
      WindowManager.createWindow(self, 'tradewindow', TradeWindow, { gameinstance: self.gameinstance, hosthero: host, inviteehero: invitee, parentkey: 'None', clienthero: invitee })
    })

    // Listen for end of game state
    this.gameinstance.receiveEndOfGame(function () {
      self.createStoryWindow(10);
      // self.scene.pause(); // TODO: check if story window is added before update loop stops
      self.overlay.toggleInteractive(false);
    });

    this.gameinstance.receiveUpdateHeroTracker(function (hero) {
      for (let h of self.heroes) {
        if (h.getKind() == hero) {
          h.incrementHour()
        }
      }
    })

    this.gameinstance.receivePlayerDisconnected((hk) => {
      console.log("FREEZE GAME ", hk, " DISCONNECTED")
      self.scene.pause();
      self.overlay.toggleInteractive(false);
    })

    //Destroying Well
    this.gameinstance.removeWell(function (tileID){
      let well: Well = self.wells.get(tileID)
      well.destroy()
      self.wells.delete(tileID)
      if(tileID == '35'){
        self.addBrokenWell(1353, 4873, tileID as number);
      }
      else if(tileID == '45'){
        self.addBrokenWell(7073, 3333, tileID as number);
      }
    })

    var self = this
    this.gameinstance.addCoastalTrader(function() {
      //console.log("entered addCoastalTrader listener")
      self.tempMerchant = self.add.image(self.tiles[9].x + 50, self.tiles[9].y - 5, "merchant-trade");
      self.tempMerchant.setInteractive({useHandCursor: true}).setScale(0.75);
      self.tempMerchant.on('pointerdown', function (pointer) {
        if (self.hero.tile.id == 9) {
          if (BasicWindowManager.hasWindow("temp_merchant")) {
            let window = BasicWindowManager.removeWindow("temp_merchant");
            window.disconnectListeners();
            window.destroyWindow();
          } else {
            BasicWindowManager.createWindow(self, 'temp_merchant', CoastalMerchantWindow, 
              { 
                controller: self.gameinstance,
                x: self.tiles[9].x + 50,
                y: self.tiles[9].y + 30,
                w: 150,
                h: 150, 
              }
            );
          }
        }
      });
    })
    this.gameinstance.removeCoastalTrader(function(){
      self.tempMerchant.destroy()
      self.tempMerchant = null
    })
    //EVENTS
    this.gameinstance.newEventListener((event: EventCard) => {
      this.applyEvent(event)
    })
    this.gameinstance.newCollabListener((eventID, heroes, heroMaxes, eventToBeBlockedID) => {
      console.log("Received newCollab")
      console.log(eventID, heroes, heroMaxes, eventToBeBlockedID)
      var involved = false
      var involvedHeroKinds = new Array<HeroKind>()
      for (let hero of heroes) {
        involvedHeroKinds.push(hero.hk)
        if (hero.hk == self.ownHeroType) {
          involved = true
        }
      }

      if (involved) {
        var allCollabRes = require("../utils/eventCollabResources").map;
        var res = new Map<String, Number>()
        var type
        var sumNeeded
        var desc
        for (let element of allCollabRes) {
          if (element.id == eventID && (involvedHeroKinds.length == element.partySize || element.partySize == 0)) {
            type = element.type
            sumNeeded = element.sumNeeded
            for (let [name, number] of element.list) {
              res.set(name, number)
            }
            desc = element.desc
          }
        }
        //console.log(res)

        var width = res.size > 1 ? (res.size + 1) * collabColWidth : 3 * collabColWidth; // Not sure if there's a better way of getting size of ts obj
        // Determine height of the window based on number of players involved
        var height = collabHeaderHeight + self.heroes.length * collabRowHeight + collabFooterHeight;

        var collabWindowData =
        {
          controller: self.gameinstance,
          isOwner: true,
          involvedHeroes: involvedHeroKinds,
          resources: res,
          textOptions: null,
          x: reducedWidth / 2 - width / 2,
          y: reducedHeight / 2 - height / 2,
          w: width,
          h: height,
          infight: false,
          overlayRef: self.overlay,
          ownHeroKind: this.ownHeroType,
          type: type,
          heroMaxes: heroMaxes,
          sumNeeded: sumNeeded,
          initialSleep: true,
          eventID: eventID,
          desc: desc,
          eventToBeBlockedID: eventToBeBlockedID
        };

        WindowManager.createWindow(this, 'collab', CollabWindow, collabWindowData);
        // Freeze main game while collab window is active
        // this.scene.pause();
      }
    })
  }

  private addHerbToScene(tileID) {
    let tile = this.tiles[tileID];
    this.herb = this.add.image(tile.x + mOffset + 20, tile.y, "herb").setDisplaySize(30, 30);
    this.overlay.setHerb(this.herb);
  }

  public addCoastalTraderToScene(){
    var self = this
    this.tempMerchant = self.add.image(self.tiles[9].x + 50, self.tiles[9].y - 5, "merchant-trade");
    this.tempMerchant.setInteractive({useHandCursor: true}).setScale(0.75);
    this.tempMerchant.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == 9) {
        if (BasicWindowManager.hasWindow("temp_merchant")) {
          let window = BasicWindowManager.removeWindow("temp_merchant");
          window.disconnectListeners();
          window.destroyWindow();
        } else {
          BasicWindowManager.createWindow(self, 'temp_merchant', CoastalMerchantWindow, 
            { 
              controller: self.gameinstance,
              x: self.tiles[9].x + 50,
              y: self.tiles[9].y + 15,
              w: 115,
              h: 90
            }
          );
        }
      }
    });
  }

  public update() {
    var camera = this.cameras.main;

    // Scroll updates
    if (this.cameraKeys["up"].isDown) {
      camera.scrollY -= this.cameraScrollSpeed;
    } else if (this.cameraKeys["down"].isDown) {
      camera.scrollY += this.cameraScrollSpeed;
    }

    if (this.cameraKeys["left"].isDown) {
      camera.scrollX -= this.cameraScrollSpeed;
    } else if (this.cameraKeys["right"].isDown) {
      camera.scrollX += this.cameraScrollSpeed;
    }

    // DEBUG TODO: REMOVE
    if (this.overlay)
      this.overlay.updateCameraPosInfo(camera.scrollX, camera.scrollY)

    // Zoom updates
    if (this.cameraKeys["zoomIn"].isDown && camera.zoom < this.maxZoom) {
      camera.zoom += this.zoomAmount;
    } else if (this.cameraKeys["zoomOut"].isDown && camera.zoom > this.minZoom) {
      camera.zoom -= this.zoomAmount;
    }
  }

  public getCameraX() : number {
    return this.cameras.main.scrollX;
  }

  public getCameraY() : number {
    return this.cameras.main.scrollY;
  }
}