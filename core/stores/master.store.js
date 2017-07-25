import { observable, action } from 'mobx'

import { gameStore } from './game.store';
import { menuStore } from './menu.store';

class MasterStore {

	constructor() {
		this.gameStore = gameStore;
		this.menuStore = menuStore;
	}

/** 
    index = 0;
    list2 = [1,2,3,4,5];
    list = observable([]);
    gameMode = observable('Normal');
    bigList = observable([1, 2, 4]);
*/
}


const masterStore = new MasterStore()
export default masterStore